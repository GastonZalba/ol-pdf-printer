import Control from 'ol/control/Control';
import { getPointResolution } from 'ol/proj';

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

/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as i18n from './components/i18n';

import compassIcon from './assets/images/compass.svg';
import pdfIcon from './assets/images/pdf.svg';
import './assets/css/print.css';

const DEFAULT_FILE_NAME = 'Export';
const CLASS_PRINT_MODE = 'printMode';

let initialized = false;

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
    _map;
    _mapTarget;
    _view;
    _target;
    _form;
    _i18n;

    _btnControl;

    _timeoutProcessing;

    _initialViewResolution;

    _pdf = {
        doc: null,
        width: null,
        height: null
    };

    _options;

    constructor(opt_options) {
        const btnControl = document.createElement('button');

        super({
            target: opt_options.target,
            element: btnControl
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
                compass: compassIcon
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
            modal: {
                animateClass: 'fade',
                animateInClass: 'show',
                transition: 300,
                backdropTransition: 150,
                templates: {
                    dialog:
                        '<div class="modal-dialog modal-dialog-centered"></div>',
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

        btnControl.className = 'ol-print-btn-menu ol-md-btn';
        btnControl.innerHTML = `<img crossorigin="anonymous" src="${pdfIcon}"/>`;
        btnControl.title = this._i18n.printPdf;
        btnControl.onclick = this.show;
        this._btnControl = btnControl;
    }

    show = () => {
        if (!initialized) this.init();
        showPrintModal();
    };

    init = () => {
        this._map = this.getMap();
        this._view = this._map.getView();
        this._mapTarget = this._map.getTargetElement();
        initPrintModal(this._map, this._options, this._i18n, this.printMap);
        initProcessingModal(this._i18n, this._options, this.onEndPrint);
        initialized = true;
    };

    // Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
    calculateScaleDenominator = (resolution, scaleResolution) => {
        const pixelsPerMapMillimeter = resolution / 25.4;
        return Math.round(
            1000 *
            pixelsPerMapMillimeter *
            this.getMeterPerPixel(scaleResolution)
        );
    };

    getMeterPerPixel = (scaleResolution) => {
        const proj = this._view.getProjection();
        return (
            getPointResolution(proj, scaleResolution, this._view.getCenter()) *
            proj.getMetersPerUnit()
        );
    };

    setMapSizForPrint = (resolution) => {
        const pixelsPerMapMillimeter = resolution / 25.4;
        return [
            Math.round(this._pdf.width * pixelsPerMapMillimeter),
            Math.round(this._pdf.height * pixelsPerMapMillimeter)
        ];
    };

    /**
     * Restore inital view, remove classes, disable loading
     */
    onEndPrint = () => {
        this._mapTarget.style.width = '';
        this._mapTarget.style.height = '';
        this._map.updateSize();
        this._view.setResolution(this._initialViewResolution);
        this._mapTarget.classList.remove(CLASS_PRINT_MODE);

        this._view.setConstrainResolution(true);

        clearTimeout(this._timeoutProcessing);
    };

    prepareLoading = () => {
        showProcessingModal(this._i18n.pleaseWait);

        this._timeoutProcessing = setTimeout(() => {
            showProcessingModal(this._i18n.almostThere);
        }, 3500);
    };

    disableLoading = () => {
        hideProcessingModal();
    };

    printMap = (form) => {
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
    };
}

export { showPrintModal, hidePrintModal };
