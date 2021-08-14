import View from 'ol/View';
import { I18n, Options, IPrintOptions, IWatermark } from 'src/ol-pdf-printer';
import { jsPDF, TextOptionsLight } from 'jspdf';
/**
 * @private
 */
export default class Pdf {
    protected _pdf: IPdf;
    protected _view: View;
    protected _scaleDenominator: number;
    protected _form: IPrintOptions;
    protected _style: Options['style'];
    protected _i18n: I18n;
    protected _config: Options;
    constructor(params: IPdfOptions);
    /**
     *
     * @param orientation
     * @param format
     * @param width
     * @param height
     * @returns
     * @protected
     */
    create(orientation: IPrintOptions['orientation'], format: IPrintOptions['format'], height: number, width: number): IPdf;
    /**
     *
     * @param dataUrl
     * @protected
     */
    addMapImage(dataUrl: string): void;
    /**
     *
     * @protected
     */
    addMapHelpers: () => Promise<void>;
    /**
     * @protected
     */
    savePdf(): Promise<void>;
    /**
     * Convert an SVGElement to an PNG string
     * @param svg
     * @returns
     */
    _processSvgImage: (svg: SVGElement) => Promise<string>;
    /**
     * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
     * @protected
     */
    _calculateScaleDenominator(resolution: number, scaleResolution: number): number;
    /**
     * @protected
     */
    _getMeterPerPixel(scaleResolution: number): number;
    /**
     *
     * @param position
     * @param offset
     * @param size
     * @returns
     * @protected
     */
    _calculateOffsetByPosition: (position: string, offset: any, size?: number) => {
        x: number;
        y: number;
    };
    /**
     *
     * @param x
     * @param y
     * @param width
     * @param height
     * @param bkcolor
     * @param brcolor
     * @protected
     */
    _addRoundedBox: (x: number, y: number, width: number, height: number, bkcolor: string, brcolor: string) => void;
    /**
     *
     * @param x
     * @param y
     * @param width
     * @param fontSize
     * @param color
     * @param align
     * @param str
     * @protected
     */
    _addText: (x: number, y: number, width: number, fontSize: number, color: string, align: TextOptionsLight['align'], str: string) => void;
    /**
     *
     * @param position
     * @param offset
     * @param width
     * @param fontSize
     * @param color
     * @param align
     * @param str
     * @protected
     */
    _addTextByOffset: (position: string, offset: any, width: number, fontSize: number, color: string, align: TextOptionsLight['align'], str: string) => void;
    /**
     * @protected
     */
    _addDescription: () => void;
    /**
     * This functions is a mess
     * @returns
     * @protected
     */
    _addWatermark: (watermark: IWatermark) => Promise<void>;
    /**
     * @protected
     */
    _addDate: () => void;
    /**
     * @protected
     */
    _addUrl: () => void;
    /**
     * @protected
     */
    _addSpecs: () => void;
    /**
     * The attributions are obtained from the Control in the DOM.
     * @protected
     */
    _addAttributions: () => void;
    /**
     * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
     * @protected
     */
    _addScaleBar: () => void;
    /**
     *
     * @param imgSrc
     * @returns
     * @protected
     */
    _addCompass: (imgSrc: HTMLImageElement | string | SVGElement) => Promise<void>;
}
/**
 * **_[interface]_**
 * @protected
 */
export interface IPdf {
    doc: jsPDF;
    width: number;
    height: number;
}
interface IPdfOptions {
    view: View;
    form: IPrintOptions;
    i18n: I18n;
    config: Options;
    height: number;
    width: number;
    scaleResolution: number;
}
export {};
//# sourceMappingURL=Pdf.d.ts.map