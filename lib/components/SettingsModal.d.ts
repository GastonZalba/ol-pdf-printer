import Map from 'ol/Map.js';
import Modal from 'modal-vanilla';
import { I18n, IValues, Options } from '../ol-pdf-printer';
/**
 * @private
 */
export default class SettingsModal {
    _modal: Modal;
    constructor(map: Map, options: Options, i18n: I18n, printMap: (values: IValues, showLoading: boolean, delay: number) => void);
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