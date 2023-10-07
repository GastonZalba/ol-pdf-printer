import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Control, { Options as ControlOptions } from 'ol/control/Control.js';
import { getPointResolution } from 'ol/proj.js';
import { EventsKey } from 'ol/events.js';
import { unByKey } from 'ol/Observable.js';
import Cluster from 'ol/source/Cluster.js';
import VectorLayer from 'ol/layer/Vector.js';
import TileWMS from 'ol/source/TileWMS.js';
import Layer from 'ol/layer/Layer.js';

import domtoimage from 'dom-to-image-more';

import { Locale } from 'locale-enum';

import Pdf from './components/Pdf';
import SettingsModal from './components/SettingsModal';
import ProcessingModal from './components/ProcessingModal';
import { LegendsOptions } from './components/MapElements/Legends';
import { isWmsLayer } from './components/Helpers';
import { defaultOptions, DEFAULT_LANGUAGE } from './defaults';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as i18n from './components/i18n';

import pdfIcon from './assets/images/pdf.svg';

// Style
import './assets/scss/-ol-pdf-printer.bootstrap5.scss';
import './assets/scss/ol-pdf-printer.scss';

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

/**
 * @constructor
 * @extends {ol/control/Control~Control}
 * @params options
 */
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
    protected _eventsKey: EventsKey[];
    protected _imageCount: number;

    constructor(opt_options?: Options) {
        const controlElement = document.createElement('button');

        super({
            target: opt_options.target,
            element:
                opt_options.showControlBtn === false
                    ? document.createElement('div')
                    : controlElement
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
        this._options = defaultOptions(this._i18n);

        // Merge options
        this._options = deepObjectAssign(this._options, opt_options);

        if (this._options.showControlBtn) {
            controlElement.className = `ol-print-btn-menu ${this._options.ctrlBtnClass}`;
            controlElement.title = this._i18n.printPdf;
            controlElement.onclick = () => this.showPrintSettingsModal();
            controlElement.append(pdfIcon());
        }
    }

    public setMap(map: Map) {
        super.setMap(map);
        if (!this._initialized && map) this._init();
    }

    /**
     * @protected
     */
    protected _init(): void {
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
    protected _getMapSizForPrint(
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
    protected _onEndPrint(): void {
        this._mapTarget.style.width = '';
        this._mapTarget.style.height = '';
        this._map.updateSize();
        this._view.setResolution(this._initialViewResolution);
        this._mapTarget.classList.remove(CLASS_PRINT_MODE);

        this._view.setConstrainResolution(true);
        this._updateDPI(90);
        this._removeListeners();

        clearTimeout(this._timeoutProcessing);
        this._processingModal.setLoading(false);

        this._cancel();
    }

    /**
     * @protected
     */
    protected _prepareLoading(): void {
        this._processingModal.show();
        this._processingModal.setLoading(true);
        this._processingModal.set(this._i18n.pleaseWait);
    }

    /**
     * @protected
     */
    protected _disableLoading(): void {
        this._processingModal.hide();
        this._processingModal.setLoading(false);
    }

    /**
     *
     * @param dpi
     * @protected
     */
    protected _updateDPI(dpi = 90): void {
        const pixelRatio = dpi / 90;

        // @ts-expect-error There is no public method to do this
        this._map.pixelRatio_ = pixelRatio;
        this._map.getLayers().forEach((layer) => {
            if (
                layer.getVisible() &&
                'getSource' in layer &&
                typeof layer.getSource === 'function'
            ) {
                const source = layer.getSource() as TileWMS;

                // @ts-expect-error There is no public method to do this
                if (source.tilePixelRatio_ !== undefined) {
                    // @ts-expect-error There is no public method to do this
                    source.tilePixelRatio_ = pixelRatio;
                    source.refresh();
                } else {
                    if (layer instanceof VectorLayer) {
                        if (source instanceof Cluster) {
                            source.getSource().changed();
                        } else {
                            source.changed();
                        }
                    }
                }
            }
        });
        this._map.updateSize();
    }

    /**
     *
     * @param form
     * @param showLoading
     * @param delay Delay to prevent glitching with modals animation
     * @protected
     */
    protected _printMap(
        form: IPrintOptions,
        showLoading = true,
        delay = 0
    ): void {
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

            this._addListeners();
            this._updateDPI(form.resolution);

            const mapSizeForPrint = this._getMapSizForPrint(
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
                this._processingModal.set(this._i18n.downloadFinished);

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
                            map: this._map,
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
                        this._processingModal.set(message);
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
     * Add tile listener to show downloaded images count
     */
    protected _addListeners() {
        this._eventsKey = [];
        this._imageCount = 0;

        this._map
            .getLayers()
            .getArray()
            .forEach((l) => {
                if (isWmsLayer(l)) {
                    this._eventsKey.push(
                        (l as Layer<TileWMS>)
                            .getSource()
                            .on('tileloadend', () => {
                                this._imageCount = this._imageCount + 1;
                                if (this._imageCount % 10 == 0) {
                                    this._processingModal.set(
                                        this._i18n.downloadingImages +
                                            ': <b>' +
                                            this._imageCount +
                                            '</b>'
                                    );
                                }
                            })
                    );
                }
            });
    }

    /**
     * Remove WMS listeners
     */
    protected _removeListeners() {
        unByKey(this._eventsKey);
    }

    /**
     * @protected
     */
    protected _cancel(): void {
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
                legends: true,
                scale: 1000,
                typeExport: 'pdf',
                ...options
            },
            showLoading
        );
    }
}

/**
 * **_[enum]_**
 */
export enum UnitsSystem {
    Metric = 'metric',
    Imperial = 'imperial'
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
    legends?: LegendsOptions | boolean;
    /**
     *
     */
    safeMargins?: boolean;
    /**
     *
     */
    typeExport?: IMimeTypeExport['value'];
    /**
     *
     */
    url?: boolean;
    /**
     *
     */
    date?: boolean;
    /**
     *
     */
    specs?: boolean;
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
    downloadFinished: string;
    downloadingImages: string;
    error: string;
    errorImage: string;
    printing: string;
    cancel: string;
    close: string;
    print: string;
    mapElements: string;
    extraInfo: string;
    url: string;
    date: string;
    specs: string;
    compass: string;
    scale: string;
    legends: string;
    layersAttributions: string;
    addNote: string;
    resolution: string;
    orientation: string;
    paperSize: string;
    landscape: string;
    portrait: string;
    current: string;
    paper: string;
    printerMargins: string;
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
     * Only added if `Add printer margins` is checked
     */
    paperMargin?:
        | number
        | {
              top: number;
              right: number;
              bottom: number;
              left: number;
          };

    watermark?: {
        /**
         * Watermark border color
         */
        brcolor?: string;

        /**
         * Watermark background color
         */
        bkcolor?: string;

        /**
         * Watermark title color
         */
        txcolortitle?: string;

        /**
         * Watermark subtitle color
         */
        txcolorsubtitle?: string;
    };

    url?: {
        /**
         * Url border color
         */
        brcolor?: string;

        /**
         * Url background color
         */
        bkcolor?: string;

        /**
         * Url text color
         */
        txcolor?: string;
    };

    attributions?: {
        /**
         * Attributions border color
         */
        brcolor?: string;

        /**
         * Attributions background color
         */
        bkcolor?: string;

        /**
         * Attributions text color
         */
        txcolor?: string;

        /**
         * Attributions links color
         */
        txcolorlink?: string;
    };

    scalebar?: {
        /**
         * Scalebar border color
         */
        brcolor?: string;

        /**
         * Scalebar background color
         */
        bkcolor?: string;

        /**
         * Scalebar text and graph color
         */
        txcolor?: string;
    };

    specs?: {
        /**
         * Specs border color
         */
        brcolor?: string;

        /**
         * Specs background color
         */
        bkcolor?: string;

        /**
         * Specs text color
         */
        txcolor?: string;
    };

    legends?: {
        /**
         * Legends border color
         */
        brcolor?: string;

        /**
         * Legends background color
         */
        bkcolor?: string;

        /**
         * Legends text color
         */
        txcolor?: string;
    };

    description?: {
        /**
         * Description border color
         */
        brcolor?: string;

        /**
         * Description background color
         */
        bkcolor?: string;

        /**
         * Description text color
         */
        txcolor?: string;
    };

    compass?: {
        /**
         * Compass border color
         */
        brcolor?: string;

        /**
         * Compass background color
         */
        bkcolor?: string;
    };
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
     * Check style section to change the color
     */
    title?: string;

    /**
     * Check style section to change the color
     */
    subtitle?: string;

    /**
     * Display a small logo next to the title
     */
    logo?: false | string | HTMLImageElement | SVGElement;
}

/**
 * **_[interface]_** - Print information at the bottom of the PDF
 */
export interface IExtraInfo {
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
    /**
     * Display WMS legends
     */
    legends?: LegendsOptions | boolean;
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
    units?: UnitsSystem;

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
     * Allow add extra description to the print
     * False to disable
     */
    description?: boolean;

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
     * Show the Btn toggler on the map
     */
    showControlBtn?: boolean;

    /**
     * ClassName to add to the Btn Control
     */
    ctrlBtnClass?: string;

    /**
     * Modal configuration
     */
    modal?: IModal;

    /**
     * Element to be displayed while processing in the modal
     */
    loader?: HTMLElement | string | false;

    /**
     * Language support
     */
    language?: 'es' | 'en';

    /**
     * Add custom translations
     */
    i18n?: I18n;
}
