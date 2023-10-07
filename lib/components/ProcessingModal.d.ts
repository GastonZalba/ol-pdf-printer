import Modal from 'modal-vanilla';
import { I18n, Options } from '../ol-pdf-printer';
/**
 * @private
 */
export default class ProcessingModal {
    protected _modal: Modal;
    protected _footer: string;
    protected _i18n: I18n;
    protected _message: HTMLElement;
    protected _loaderContainer: HTMLElement;
    /**
     *
     * @param i18n
     * @param options
     * @param onEndPrint
     * @protected
     */
    constructor(i18n: I18n, options: Options, onEndPrint: () => void);
    /**
     *
     * @param string
     * @protected
     */
    _setContentModal(string: string | number): void;
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
    show(): void;
    /**
     *
     * @param string
     * @param footer
     * @protected
     */
    set(string: string | number): void;
    setLoading(bool?: boolean): void;
    /**
     * @protected
     */
    hide(): void;
}
//# sourceMappingURL=ProcessingModal.d.ts.map