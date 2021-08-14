import Modal from 'modal-vanilla';
import { PluggableMap } from 'ol';
import { I18n, Options } from 'src/ol-pdf-printer';
/**
 * @private
 */
export default class SettingsModal {
    _modal: typeof Modal;
    constructor(map: PluggableMap, options: Options, i18n: I18n, printMap: Function);
    /**
     *
     * @param i18n
     * @param params
     * @returns
     * @protected
     */
    Content(i18n: I18n, params: any): void;
    /**
     *
     * @param i18n
     * @returns
     * @protected
     */
    Footer(i18n: I18n, params: any): any;
    hide(): void;
    show(): void;
}
//# sourceMappingURL=SettingsModal.d.ts.map