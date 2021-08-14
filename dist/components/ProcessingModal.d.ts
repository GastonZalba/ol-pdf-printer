import Modal from 'modal-vanilla';
import { I18n, Options } from 'src/ol-pdf-printer';
/**
 * @private
 */
export default class ProcessingModal {
    protected _modal: typeof Modal;
    protected _footer: string;
    protected _i18n: I18n;
    /**
     *
     * @param i18n
     * @param options
     * @param onEndPrint
     * @protected
     */
    constructor(i18n: I18n, options: Options, onEndPrint: Function);
    /**
     *
     * @param string
     * @protected
     */
    _setContentModal(string: string): void;
    /**
     *
     * @param string
     * @protected
     */
    _setFooterModal(string: string): void;
    /**
     *
     * @param string
     * @param footer
     * @protected
     */
    show(string: string): void;
    /**
     * @protected
     */
    hide(): void;
}
//# sourceMappingURL=ProcessingModal.d.ts.map