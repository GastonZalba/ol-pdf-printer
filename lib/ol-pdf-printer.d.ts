import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Control, { Options as ControlOptions } from 'ol/control/Control.js';
import { EventsKey } from 'ol/events.js';
import { Extent } from 'ol/extent';
import { Coordinate } from 'ol/coordinate.js';
import Polygon from 'ol/geom/Polygon';
import { Locale } from 'locale-enum';
import Pdf from './components/Pdf';
import SettingsModal from './components/SettingsModal';
import ProcessingModal from './components/ProcessingModal';
import { LegendsOptions } from './components/MapElements/Legends';
import './assets/scss/-ol-pdf-printer.bootstrap5.scss';
import './assets/scss/ol-pdf-printer.scss';
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
    protected _initialViewCoords: Coordinate;
    protected _initialConstrainRes: boolean;
    protected _initialSize: number[];
    protected _options: Options;
    protected _renderCompleteKey: EventsKey | EventsKey[];
    protected _isCanceled: boolean;
    protected _eventsKey: EventsKey[];
    protected _imageCount: number;
    constructor(opt_options?: Options);
    setMap(map: Map): void;
    /**
     * @protected
     */
    protected _init(): void;
    /**
     *
     */
    protected _restoreConstrains(): void;
    /**
     * Restore inital view, remove classes, disable loading
     * @protected
     */
    protected _onEndPrint(): void;
    /**
     * @protected
     */
    protected _prepareLoading(): void;
    /**
     * @protected
     */
    protected _disableLoading(): void;
    /**
     *
     * @param dpi
     * @protected
     */
    protected _updateDPI(dpi?: number): void;
    /**
     *
     * @param form
     * @param showLoading
     * @param delay Delay to prevent glitching with modals animation
     * @protected
     */
    protected _printMap(form: IPrintOptions | false, showLoading?: boolean, delay?: number): void;
    /**
     * Add tile listener to show downloaded images count
     */
    protected _addDownloadCountListener(): void;
    /**
     * Remove WMS listeners
     */
    protected _removeListeners(): void;
    /**
     * @protected
     */
    protected _cancel(): void;
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
 * **_[enum]_**
 */
export declare enum UnitsSystem {
    Metric = "metric",
    Imperial = "imperial"
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
    scale?: number;
    /**
     * Area of interest. If this is provided,
     * the scale value is not used
     */
    regionOfInterest?: Extent | Polygon;
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
    escapeHint: string;
    reframeHint: string;
    process?: string;
    zoomIn?: string;
    zoomOut?: string;
    rotateLeft?: string;
    rotateRight?: string;
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
    paperMargin?: number | {
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
     * Uns PNG format if you provide a base64 string
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
     * Allow to reframe a precise Region of Interest before exporting
     */
    allowReframeRegionOfInterest?: boolean;
    /**
     * Show zoom control when the reframe insatnce is active
     */
    zoomControlOnReframe?: boolean;
    /**
     * Show rotation control when the reframe insatnce is active
     */
    rotationControlOnReframe?: boolean;
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
export {};
//# sourceMappingURL=ol-pdf-printer.d.ts.map