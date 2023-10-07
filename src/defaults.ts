import compassIcon from './assets/images/compass.svg';
import { I18n, Options, UnitsSystem } from './ol-pdf-printer';

export const DEFAULT_LANGUAGE = 'en';

export const defaultOptions = (i18n: I18n): Options => ({
    language: DEFAULT_LANGUAGE,
    filename: 'Ol Pdf Printer',
    style: {
        paperMargin: {
            left: 4,
            top: 4,
            right: 4,
            bottom: 4
        },
        brcolor: '#000000',
        bkcolor: '#ffffff',
        txcolor: '#000000',
        descbrcolor: '#333333',
        descbkcolor: '#000000',
        desctxcolor: '#ffffff',
        compassbrcolor: '#000000',
        compassbkcolor: '#333333'
    },
    extraInfo: {
        date: true,
        url: true,
        specs: true
    },
    description: true,
    mapElements: {
        attributions: true,
        scalebar: true,
        legends: true,
        compass: compassIcon() as SVGElement
    },
    watermark: {
        title: 'Ol Pdf Printer',
        titleColor: '#d54b4b',
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
    units: UnitsSystem.Metric,
    dateFormat: undefined,
    showControlBtn: true,
    ctrlBtnClass: '',
    loader: '<span class="printLoader"></span>',
    modal: {
        animateClass: 'fade',
        animateInClass: 'show',
        transition: 150,
        backdropTransition: 0,
        templates: {
            dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
            headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${i18n.close}"><span aria-hidden="true">×</span></button>`
        }
    }
});
