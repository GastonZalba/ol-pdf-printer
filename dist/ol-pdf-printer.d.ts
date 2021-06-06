import { PluggableMap, View } from 'ol';
import Control, { Options as ControlOptions } from 'ol/control/Control';
import { EventsKey } from 'ol/events';
import Pdf from './components/Pdf';
import SettingsModal from './components/SettingsModal';
import ProcessingModal from './components/ProcessingModal';
import './assets/css/ol-pdf-printer.css';
export default class PdfPrinter extends Control {
    protected _i18n: I18n;
    protected _map: PluggableMap;
    protected _view: View;
    protected _mapTarget: HTMLElement;
    protected _pdf: Pdf;
    protected _processingModal: ProcessingModal;
    protected _settingsModal: SettingsModal;
    protected _initialized: boolean;
    protected _timeoutProcessing: ReturnType<typeof setTimeout>;
    protected _initialViewResolution: number;
    protected _options: Options;
    protected _renderCompleteKey: EventsKey;
    protected _isCanceled: boolean;
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
     * @protected
     */
    _setMapSizForPrint(width: number, height: number, resolution: number): number[];
    /**
     * Restore inital view, remove classes, disable loading
     * @protected
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
     * This could be used to increment the DPI before printing
     * @protected
     */
    _setFormatOptions(string?: string): void;
    /**
     *
     * @param form
     * @param showLoading
     * @param delay Delay to prevent glitching with modals animation
     * @protected
     */
    _printMap(form: IPrintOptions, showLoading?: boolean, delay?: number): void;
    /**
     * @protected
     */
    _cancel(): void;
    /**
     * Show the Settings Modal
     * @public
     */
    showPrintSettingsModal(): void;
    /**
     * Hide the Settings Modal
     * @public
     */
    hidePrintSettingsModal(): void;
    /**
     * Create PDF programatically without displaying the Settings Modal
     * @param options
     * @public
     */
    createPdf(options: IPrintOptions, showLoading: boolean): void;
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
    scale: IScale;
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
declare type IScale = number;
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
    logo?: false | string | HTMLImageElement;
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
    compass?: false | string | HTMLImageElement;
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
export {};
