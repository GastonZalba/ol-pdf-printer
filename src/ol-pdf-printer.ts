import { Image, PluggableMap, View } from 'ol';
import { Options as ControlOptions } from 'ol/control/Control';
import Control from 'ol/control/Control';
import { getPointResolution } from 'ol/proj';

// External
import domtoimage from 'dom-to-image-improved';
import { jsPDF } from 'jspdf';

import {
    initPrintModal,
    showPrintModal,
    hidePrintModal
} from './components/PrintModal';
import {
    initProcessingModal,
    showProcessingModal,
    hideProcessingModal
} from './components/ProcessingModal';
import { addElementsToPDF } from './components/PdfElements';

import * as i18n from './components/i18n/index.js';

import compassIcon from './assets/images/compass.svg';
import pdfIcon from './assets/images/pdf.svg';
import './assets/css/print.css';

/**
 * @protected
 */
const DEFAULT_FILE_NAME = 'Export';

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
                typeof s_val === 'object'
                    ? deepObjectAssign(t_val, s_val)
                    : s_val;
        });
    });
    return target;
}

export default class PdfPrinter extends Control {
    protected _i18n: I18n;

    protected _map: PluggableMap;
    protected _view: View;
    protected _mapTarget: HTMLElement;
    protected _form: Form;

    protected element: HTMLElement;

    protected _initialized: boolean;

    protected _timeoutProcessing: ReturnType<typeof setTimeout>;

    protected _initialViewResolution: number;

    protected _pdf: {
        doc: jsPDF;
        width: number;
        height: number;
    };

    protected _options: Options;

    constructor(opt_options?: Options) {
        const controlElement = document.createElement('button');

        super({
            target: opt_options.target,
            element: controlElement
        });

        // Check if the selected language exists
        this._i18n =
            opt_options.lang in i18n ? i18n[opt_options.lang] : i18n['en'];

        if (opt_options.i18n) {
            // Merge custom translations
            this._i18n = {
                ...this._i18n,
                ...opt_options.i18n
            };
        }

        // Default options
        this._options = {
            lang: 'en',
            filename: DEFAULT_FILE_NAME,
            style: {
                margin: 10,
                brcolor: '#000000',
                bkcolor: '#273f50',
                txcolor: '#ffffff'
            },
            extraInfo: {
                date: true,
                url: true,
                scale: true
            },
            mapElements: {
                description: true,
                attributions: true,
                scalebar: true,
                compass: compassIcon as string
            },
            watermark: {
                title: 'Ol Pdf Printer',
                titleColor: '#d65959',
                subtitle: 'https://github.com/GastonZalba/ol-pdf-printer',
                subtitleColor: '#444444',
                logo: false
            },
            paperSizes: [
                //a0: { size: [1189, 841], value: 'A0' },
                //a1: { size: [841, 594], value: 'A1' },
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
            ctrlBtnClass: '',
            modal: {
                animateClass: 'fade',
                animateInClass: 'show',
                transition: 300,
                backdropTransition: 150,
                templates: {
                    dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
                    headerClose: `
                    <button type="button" class="btn-close" data-dismiss="modal" aria-label="${this._i18n.close}">
                        <span aria-hidden="true">×</span>
                    </button>
                    `
                }
            }
        };

        // Merge options
        this._options = deepObjectAssign(this._options, opt_options);

        controlElement.className = `ol-print-btn-menu ${this._options.ctrlBtnClass}`;
        controlElement.innerHTML = `<img src="${pdfIcon}"/>`;
        controlElement.title = this._i18n.printPdf;
        controlElement.onclick = () => this.show();
    }

    show(): void {
        if (!this._initialized) this.init();
        showPrintModal();
    }

    init(): void {
        this._map = this.getMap();
        this._view = this._map.getView();
        this._mapTarget = this._map.getTargetElement();
        initPrintModal(this._map, this._options, this._i18n, this.printMap);
        initProcessingModal(this._i18n, this._options, this.onEndPrint);
        this._initialized = true;
    }

    // Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
    calculateScaleDenominator(resolution, scaleResolution) {
        const pixelsPerMapMillimeter = resolution / 25.4;
        return Math.round(
            1000 *
                pixelsPerMapMillimeter *
                this.getMeterPerPixel(scaleResolution)
        );
    }

    getMeterPerPixel(scaleResolution) {
        const proj = this._view.getProjection();
        return (
            getPointResolution(proj, scaleResolution, this._view.getCenter()) *
            proj.getMetersPerUnit()
        );
    }

    setMapSizForPrint(resolution): number[] {
        const pixelsPerMapMillimeter = resolution / 25.4;
        return [
            Math.round(this._pdf.width * pixelsPerMapMillimeter),
            Math.round(this._pdf.height * pixelsPerMapMillimeter)
        ];
    }

    /**
     * Restore inital view, remove classes, disable loading
     */
    onEndPrint(): void {
        this._mapTarget.style.width = '';
        this._mapTarget.style.height = '';
        this._map.updateSize();
        this._view.setResolution(this._initialViewResolution);
        this._mapTarget.classList.remove(CLASS_PRINT_MODE);

        this._view.setConstrainResolution(true);

        clearTimeout(this._timeoutProcessing);
    }

    prepareLoading(): void {
        showProcessingModal(this._i18n.pleaseWait);

        this._timeoutProcessing = setTimeout(() => {
            showProcessingModal(this._i18n.almostThere);
        }, 3500);
    }

    disableLoading(): void {
        hideProcessingModal();
    }

    printMap(form: Form): void {
        this.prepareLoading();

        this._form = form;

        // To allow intermediate zoom levels
        this._view.setConstrainResolution(false);

        this._mapTarget.classList.add(CLASS_PRINT_MODE);

        let dim = this._options.paperSizes.find(
            (e) => e.value === this._form.format
        ).size;
        dim = this._form.orientation === 'landscape' ? dim : dim.reverse();

        this._pdf.width = dim[0];
        this._pdf.height = dim[1];

        const mapSizeForPrint = this.setMapSizForPrint(this._form.resolution);
        const [width, height] = mapSizeForPrint;

        this._pdf.doc = new jsPDF({
            orientation: this._form.orientation,
            format: this._form.format
        });

        // Save current resolution to restore it later
        this._initialViewResolution = this._view.getResolution();

        const pixelsPerMapMillimeter = this._form.resolution / 25.4;

        const scaleResolution =
            this._form.scale /
            getPointResolution(
                this._view.getProjection(),
                pixelsPerMapMillimeter,
                this._view.getCenter()
            );

        this._map.once(
            'rendercomplete',
            function () {
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
                        this._pdf.doc.addImage(
                            dataUrl,
                            'JPEG',
                            this._options.style.margin, // Add margins
                            this._options.style.margin,
                            this._pdf.width - this._options.style.margin * 2,
                            this._pdf.height - this._options.style.margin * 2
                        );

                        const scaleDenominator = this.calculateScaleDenominator(
                            this._form.resolution,
                            scaleResolution
                        );

                        await addElementsToPDF(
                            this._view,
                            this._pdf,
                            this._form,
                            scaleDenominator,
                            this._options
                        );

                        this._pdf.doc.save(this._options.filename + '.pdf');

                        // Reset original map size
                        this.onEndPrint();
                        this.disableLoading();
                    })
                    .catch((err) => {
                        console.error(err);
                        this.onEndPrint();
                        showProcessingModal(
                            this._118n.error,
                            /** footer */ true
                        );
                    });
            }.bind(this)
        );

        // Set print size
        this._mapTarget.style.width = width + 'px';
        this._mapTarget.style.height = height + 'px';
        this._map.updateSize();
        this._map.getView().setResolution(scaleResolution);
    }

    showPrintModal() {
        showPrintModal();
    }

    hidePrintModal() {
        hidePrintModal();
    }
}

export interface I18n {
    printPdf: string;
    pleaseWait: string;
    almostThere: string;
    error: string;
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

interface PaperSize {
    size: number[];
    value: string;
    selected?: boolean;
}

interface Dpi {
    value: number;
    selected?: boolean;
}

/**
 * @protected
 */
interface Form {
    format: string;
    orientation: 'landscape' | 'portrait';
    resolution: number;
    scale: number;
    description: string;
    compass: boolean;
    attributions: boolean;
    scalebar: boolean;
}

export interface Options extends ControlOptions {
    lang?: string;
    filename?: string;
    style?: {
        margin: number;
        brcolor: string;
        bkcolor: string;
        txcolor: string;
    };
    extraInfo?: {
        date: boolean;
        url: boolean;
        scale: boolean;
    };
    mapElements?: {
        description: boolean;
        attributions: boolean;
        scalebar: boolean;
        compass: string | Image;
    };
    watermark?: {
        title?: string;
        titleColor?: string;
        subtitle: string;
        subtitleColor: string;
        logo: boolean;
    };
    paperSizes?: PaperSize[];
    dpi?: Dpi[];
    scales?: number[];
    ctrlBtnClass?: string;
    modal?: {
        animateClass?: string;
        animateInClass?: string;
        transition?: number;
        backdropTransition?: number;
        templates?: {
            dialog?: string | HTMLElement;
            headerClose?: string | HTMLElement;
        };
    };
    i18n?: I18n;
}
