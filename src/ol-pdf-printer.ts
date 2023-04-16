import Map from 'ol/Map';
import View from 'ol/View';
import Control, { Options as ControlOptions } from 'ol/control/Control';
import TileWMS from 'ol/source/TileWMS';
import Tile from 'ol/layer/Tile';
import { getPointResolution } from 'ol/proj';
import { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';

import domtoimage from 'dom-to-image-improved';

import { Locale } from 'locale-enum';

import Pdf from './components/Pdf';
import SettingsModal from './components/SettingsModal';
import ProcessingModal from './components/ProcessingModal';
import * as i18n from './components/i18n/index.js';

import compassIcon from './assets/images/compass.svg';
import pdfIcon from './assets/images/pdf.svg';

import './assets/css/ol-pdf-printer.css';

/**
 * @protected
 */
const DEFAULT_LANGUAGE = 'en';

/**
 * @protected
 */
const CLASS_PRINT_MODE = 'printMode';

/**
 * @protected
 */
function deepObjectAssign(target, ...sources) {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            const s_val = source[key];
            const t_val = target[key];
            target[key] =
                t_val &&
                s_val &&
                typeof t_val === 'object' &&
                typeof s_val === 'object' &&
                !Array.isArray(t_val) // Don't merge arrays
                    ? deepObjectAssign(t_val, s_val)
                    : s_val;
        });
    });
    return target;
}

export default class PdfPrinter extends Control {
    protected _i18n: I18n;

    protected _map: Map;
    protected _view: View;
    protected _mapTarget: HTMLElement;

    protected _pdf: Pdf;

    protected _processingModal: ProcessingModal;
    protected _settingsModal: SettingsModal;

    protected _initialized: boolean;

    protected _timeoutProcessing: ReturnType<typeof setTimeout>;

    protected _initialViewResolution: number;

    protected _options: Options;

    protected _renderCompleteKey: EventsKey | EventsKey[];

    protected _isCanceled: boolean;

    constructor(opt_options?: Options) {
        const controlElement = document.createElement('button');

        super({
            target: opt_options.target,
            element: controlElement
        });

        // Check if the selected language exists
        this._i18n =
            opt_options.language && opt_options.language in i18n
                ? i18n[opt_options.language]
                : i18n[DEFAULT_LANGUAGE];

        if (opt_options.i18n) {
            // Merge custom translations
            this._i18n = {
                ...this._i18n,
                ...opt_options.i18n
            };
        }

        // Default options
        this._options = {
            language: DEFAULT_LANGUAGE,
            filename: 'Ol Pdf Printer',
            style: {
                paperMargin: 10,
                brcolor: '#000000',
                bkcolor: '#273f50',
                txcolor: '#ffffff'
            },
            extraInfo: {
                date: true,
                url: true,
                specs: true
            },
            mapElements: {
                description: true,
                attributions: true,
                scalebar: true,
                compass: compassIcon() as SVGElement
            },
            watermark: {
                title: 'Ol Pdf Printer',
                titleColor: '#d65959',
                subtitle: 'https://github.com/GastonZalba/ol-pdf-printer',
                subtitleColor: '#444444',
                logo: false
            },
            paperSizes: [
                // { size: [1189, 841], value: 'A0' },
                // { size: [841, 594], value: 'A1' },
                { size: [594, 420], value: 'A2' },
                { size: [420, 297], value: 'A3' },
                { size: [297, 210], value: 'A4', selected: true },
                { size: [210, 148], value: 'A5' }
            ],
            dpi: [
                { value: 72 },
                { value: 96 },
                { value: 150, selected: true },
                { value: 200 },
                { value: 300 }
            ],
            scales: [10000, 5000, 1000, 500, 250, 100, 50, 25, 10],
            mimeTypeExports: [
                { value: 'pdf', selected: true },
                { value: 'png' },
                { value: 'jpeg' },
                { value: 'webp' }
            ],
            units: 'metric',
            dateFormat: undefined,
            ctrlBtnClass: '',
            modal: {
                animateClass: 'fade',
                animateInClass: 'show',
                transition: 150,
                backdropTransition: 100,
                templates: {
                    dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
                    headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${this._i18n.close}"><span aria-hidden="true">×</span></button>`
                }
            }
        };

        // Merge options
        this._options = deepObjectAssign(this._options, opt_options);

        controlElement.className = `ol-print-btn-menu ${this._options.ctrlBtnClass}`;
        controlElement.title = this._i18n.printPdf;
        controlElement.onclick = () => this.showPrintSettingsModal();
        controlElement.append(pdfIcon());
    }

    /**
     * @protected
     */
    _init(): void {
        this._map = this.getMap();
        this._view = this._map.getView();
        this._mapTarget = this._map.getTargetElement();
        this._settingsModal = new SettingsModal(
            this._map,
            this._options,
            this._i18n,
            this._printMap.bind(this)
        );

        this._processingModal = new ProcessingModal(
            this._i18n,
            this._options,
            this._onEndPrint.bind(this)
        );

        this._initialized = true;
    }

    /**
     * @protected
     */
    _setMapSizForPrint(
        width: number,
        height: number,
        resolution: number
    ): number[] {
        const pixelsPerMapMillimeter = resolution / 25.4;
        return [
            Math.round(width * pixelsPerMapMillimeter),
            Math.round(height * pixelsPerMapMillimeter)
        ];
    }

    /**
     * Restore inital view, remove classes, disable loading
     * @protected
     */
    _onEndPrint(): void {
        this._mapTarget.style.width = '';
        this._mapTarget.style.height = '';
        this._map.updateSize();
        this._view.setResolution(this._initialViewResolution);
        this._mapTarget.classList.remove(CLASS_PRINT_MODE);

        this._view.setConstrainResolution(true);

        clearTimeout(this._timeoutProcessing);

        this._cancel();
    }

    /**
     * @protected
     */
    _prepareLoading(): void {
        this._processingModal.show(this._i18n.pleaseWait);

        this._timeoutProcessing = setTimeout(() => {
            this._processingModal.show(this._i18n.almostThere);
        }, 4000);
    }

    /**
     * @protected
     */
    _disableLoading(): void {
        this._processingModal.hide();
    }

    /**
     * This could be used to increment the DPI before printing
     * @protected
     */
    _setFormatOptions(string = ''): void {
        const layers = this._map.getLayers();
        layers.forEach((layer) => {
            if (layer instanceof Tile) {
                const source = layer.getSource();
                // Set WMS DPI
                if (source instanceof TileWMS) {
                    source.updateParams({
                        FORMAT_OPTIONS: string
                    });
                }
            }
        });
    }

    /**
     *
     * @param form
     * @param showLoading
     * @param delay Delay to prevent glitching with modals animation
     * @protected
     */
    _printMap(form: IPrintOptions, showLoading = true, delay = 0): void {
        if (showLoading) {
            this._mapTarget.classList.add(CLASS_PRINT_MODE);
        }

        setTimeout(() => {
            if (showLoading) {
                this._prepareLoading();
            }

            this._isCanceled = false;

            // To allow intermediate zoom levels
            this._view.setConstrainResolution(false);

            let dim = this._options.paperSizes.find(
                (e) => e.value === form.format
            ).size;

            dim =
                form.orientation === 'landscape'
                    ? dim
                    : ([...dim].reverse() as [number, number]);

            const widthPaper = dim[0];
            const heightPaper = dim[1];

            const mapSizeForPrint = this._setMapSizForPrint(
                widthPaper,
                heightPaper,
                form.resolution
            );
            const [width, height] = mapSizeForPrint;

            // Save current resolution to restore it later
            this._initialViewResolution = this._view.getResolution();

            const pixelsPerMapMillimeter = form.resolution / 25.4;

            const scaleResolution =
                form.scale /
                getPointResolution(
                    this._view.getProjection(),
                    pixelsPerMapMillimeter,
                    this._view.getCenter()
                );

            this._renderCompleteKey = this._map.once('rendercomplete', () => {
                domtoimage
                    .toJpeg(
                        this._mapTarget.querySelector(
                            '.ol-unselectable.ol-layers'
                        ),
                        {
                            width,
                            height
                        }
                    )
                    .then(async (dataUrl) => {
                        if (this._isCanceled) return;

                        this._pdf = new Pdf({
                            view: this._view,
                            i18n: this._i18n,
                            config: this._options,
                            form: form,
                            height: heightPaper,
                            width: widthPaper,
                            scaleResolution
                        });

                        this._pdf.addMapImage(dataUrl);
                        await this._pdf.addMapHelpers();

                        if (this._isCanceled) return;

                        await this._pdf.savePdf();

                        // Reset original map size
                        this._onEndPrint();

                        if (showLoading) this._disableLoading();
                    })
                    .catch((err: Error) => {
                        const message =
                            typeof err === 'string' ? err : this._i18n.error;
                        console.error(err);
                        this._onEndPrint();
                        this._processingModal.show(message);
                    });
            });

            // Set print size
            this._mapTarget.style.width = width + 'px';
            this._mapTarget.style.height = height + 'px';
            this._map.updateSize();
            this._map.getView().setResolution(scaleResolution);
        }, delay);
    }

    /**
     * @protected
     */
    _cancel(): void {
        if (this._renderCompleteKey) {
            unByKey(this._renderCompleteKey);
        }

        this._isCanceled = true;
    }

    /**
     * Show the Settings Modal
     * @public
     */
    showPrintSettingsModal(): void {
        if (!this._initialized) this._init();
        this._settingsModal.show();
    }

    /**
     * Hide the Settings Modal
     * @public
     */
    hidePrintSettingsModal(): void {
        this._settingsModal.hide();
    }

    /**
     * Create PDF programatically without displaying the Settings Modal
     * @param options
     * @public
     */
    createPdf(options: IPrintOptions, showLoading: boolean): void {
        options = {};
        this._printMap(
            {
                format: (
                    this._options.paperSizes.find((p) => p.selected) ||
                    this._options.paperSizes[0]
                ).value,
                resolution: (
                    this._options.dpi.find((p) => p.selected) ||
                    this._options.dpi[0]
                ).value,
                orientation: 'landscape',
                compass: true,
                attributions: true,
                scalebar: true,
                scale: 1000,
                typeExport: 'pdf',
                ...options
            },
            showLoading
        );
    }
}

/**
 * **_[interface]_**
 */
export interface IPrintOptions {
    /**
     *
     */
    format?: IPaperSize['value'];
    /**
     *
     */
    orientation?: 'landscape' | 'portrait';
    /**
     *
     */
    resolution?: IDpi['value'];
    /**
     *
     */
    scale?: IScale;
    /**
     *
     */
    description?: string;
    /**
     *
     */
    compass?: boolean;
    /**
     *
     */
    attributions?: boolean;
    /**
     *
     */
    scalebar?: boolean;
    /**
     *
     */
    typeExport?: IMimeTypeExport['value'];
}

/**
 * **_[interface]_** - Custom translations specified when creating an instance
 */
export interface IValues {
    format: FormDataEntryValue;
    orientation: FormDataEntryValue;
    resolution: FormDataEntryValue;
    scale: FormDataEntryValue;
    description: FormDataEntryValue;
    compass: FormDataEntryValue;
    attributions: FormDataEntryValue;
    scalebar: FormDataEntryValue;
    typeExport: FormDataEntryValue;
}

/**
 * **_[interface]_** - Custom translations specified when creating an instance
 */
export interface I18n {
    printPdf: string;
    pleaseWait: string;
    almostThere: string;
    error: string;
    errorImage: string;
    printing: string;
    cancel: string;
    close: string;
    print: string;
    mapElements: string;
    compass: string;
    scale: string;
    layersAttributions: string;
    addNote: string;
    resolution: string;
    orientation: string;
    paperSize: string;
    landscape: string;
    portrait: string;
    current: string;
    paper: string;
}

/**
 * **_[interface]_**
 */
interface IPaperSize {
    /**
     *
     */
    size: [number, number];
    /**
     *
     */
    value: string;
    /**
     *
     */
    selected?: boolean;
}

/**
 * **_[type]_**
 */
type IScale = number;

/**
 * **_[interface]_**
 */
interface IDpi {
    /**
     *
     */
    value: number;
    /**
     *
     */
    selected?: boolean;
}

/**
 * **_[interface]_**
 */
interface IStyle {
    /**
     *
     */
    paperMargin?: number;
    /**
     *
     */
    brcolor?: string;
    /**
     *
     */
    bkcolor?: string;
    /**
     *
     */
    txcolor?: string;
}

/**
 * **_[interface]_**
 */
interface IMimeTypeExport {
    value: 'pdf' | 'png' | 'jpeg' | 'webp';
    selected?: boolean;
}

/**
 * **_[interface]_**
 */
interface IModal {
    /**
     *
     */
    animateClass?: string;
    /**
     *
     */
    animateInClass?: string;
    /**
     *
     */
    transition?: number;
    /**
     *
     */
    backdropTransition?: number;
    /**
     *
     */
    templates?: {
        dialog?: string | HTMLElement;
        headerClose?: string | HTMLElement;
    };
}

/**
 * **_[interface]_**
 */
export interface IWatermark {
    /**
     *
     */
    title?: string;
    /**
     *
     */
    titleColor?: string;
    /**
     *
     */
    subtitle?: string;
    /**
     *
     */
    subtitleColor?: string;
    /**
     *
     */
    logo?: false | string | HTMLImageElement | SVGElement;
}

/**
 * **_[interface]_** - Print information at the bottom of the PDF
 */
interface IExtraInfo {
    /**
     * Print Date
     */
    date?: boolean;
    /**
     * Current site url
     */
    url?: boolean;
    /**
     * DPI, Format and Scale information
     */
    specs?: boolean;
}

/**
 * **_[interface]_** - MapElements
 * @public
 */
export interface IMapElements {
    /**
     * Print description
     */
    description?: boolean;
    /**
     * Layers attributions
     */
    attributions?: boolean;
    /**
     * Scalebar
     */
    scalebar?: boolean;
    /**
     * Compass image. North must be pointing to the top
     */
    compass?: false | string | HTMLImageElement | SVGElement;
}

/**
 * **_[interface]_** - Options specified when creating an instance
 */
export interface Options extends ControlOptions {
    /**
     * Export filename
     */
    filename?: string;

    /**
     * Map unit mode
     */
    units?: 'metric' | 'imperial';

    /**
     * Some basic PDF style configuration
     */
    style?: IStyle;

    /**
     * Information to be inserted at the bottom of the PDF
     * False to disable
     */
    extraInfo?: false | IExtraInfo;

    /**
     * Elements to be showed on the PDF and in the Settings Modal.
     * False to disable
     */
    mapElements?: false | IMapElements;

    /**
     * Watermark to be inserted in the PDF.
     * False to disable
     */
    watermark?: false | IWatermark;

    /**
     * Paper sizes options to be shown in the settings modal
     */
    paperSizes?: IPaperSize[];

    /**
     * DPI resolutions options to be shown in the settings modal
     */
    dpi?: IDpi[];

    /**
     * Map scales options to be shown in the settings modal
     */
    scales?: IScale[];

    /**
     * Export format
     */
    mimeTypeExports?: IMimeTypeExport[];

    /**
     * Locale time zone. Default varies according to browser locale
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString#using_locales
     */
    dateFormat?: Locale;

    /**
     * ClassName to add to the Btn Control
     */
    ctrlBtnClass?: string;

    /**
     * Modal configuration
     */
    modal?: IModal;

    /**
     * Language support
     */
    language?: 'es' | 'en';

    /**
     * Add custom translations
     */
    i18n?: I18n;
}
