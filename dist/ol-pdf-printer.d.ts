import { Image, PluggableMap, View } from 'ol';
import Control, { Options as ControlOptions } from 'ol/control/Control';
import { jsPDF } from 'jspdf';
import './assets/css/ol-pdf-printer.css';
export default class PdfPrinter extends Control {
    protected _i18n: I18n;
    protected _map: PluggableMap;
    protected _view: View;
    protected _mapTarget: HTMLElement;
    protected _form: Form;
    protected element: HTMLElement;
    protected _processingModal: any;
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
    /**
     * @protected
     */
    _show(): void;
    /**
     * @protected
     */
    _init(): void;
    /**
     *   Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
     * @protected
     */
    _calculateScaleDenominator(resolution: number, scaleResolution: number): number;
    /**
     * @protected
     */
    _getMeterPerPixel(scaleResolution: number): number;
    /**
     * @protected
     */
    _setMapSizForPrint(resolution: number): number[];
    /**
     * Restore inital view, remove classes, disable loading
     */
    _onEndPrint(): void;
    /**
     * @protected
     */
    _prepareLoading(): void;
    /**
     * @protected
     */
    _disableLoading(): void;
    /**
     * @protected
     */
    _printMap(form: Form): void;
    /**
     * @public
     */
    showPrintModal(): void;
    /**
     * @public
     */
    hidePrintModal(): void;
}
/**
 * **_[interface]_** - Custom Language specified when creating a WFST instance
 * @protected
 */
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
/**
 * **_[interface]_**
 * @protected
 */
interface PaperSize {
    size: number[];
    value: string;
    selected?: boolean;
}
/**
 * **_[interface]_**
 * @protected
 */
interface Dpi {
    value: number;
    selected?: boolean;
}
/**
 * **_[interface]_**
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
/**
 * **_[interface]_** - Options specified when creating an instance
 */
export interface Options extends ControlOptions {
    language?: string;
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
