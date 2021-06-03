import { Image, PluggableMap, View } from 'ol';
import { Options as ControlOptions } from 'ol/control/Control';
import Control from 'ol/control/Control';
import { jsPDF } from 'jspdf';
import './assets/css/print.css';
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
    constructor(opt_options?: Options);
    show(): void;
    init(): void;
    calculateScaleDenominator(resolution: any, scaleResolution: any): number;
    getMeterPerPixel(scaleResolution: any): number;
    setMapSizForPrint(resolution: any): number[];
    /**
     * Restore inital view, remove classes, disable loading
     */
    onEndPrint(): void;
    prepareLoading(): void;
    disableLoading(): void;
    printMap(form: Form): void;
    showPrintModal(): void;
    hidePrintModal(): void;
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
export {};
