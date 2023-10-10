import Map from 'ol/Map.js';
import Modal from 'modal-vanilla';
import ReframeROI from './ReframeROI';
import { I18n, IPrintOptions, Options } from '../ol-pdf-printer';
/**
 * @private
 */
export default class SettingsModal {
    protected _modal: Modal;
    protected _reframeROI: ReframeROI;
    constructor(map: Map, options: Options, i18n: I18n, printMap: (values: IPrintOptions, showLoading: boolean, delay: number) => void);
    /**
     *
     * @param i18n
     * @param options
     * @returns
     * @protected
     */
    Content(i18n: I18n, options: Options): HTMLElement;
    /**
     *
     * @param i18n
     * @returns
     * @protected
     */
    Footer(i18n: I18n, options: Options): string;
    hide(): void;
    show(): void;
}
//# sourceMappingURL=SettingsModal.d.ts.map