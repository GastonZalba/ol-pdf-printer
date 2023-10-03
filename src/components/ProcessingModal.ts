import Modal from 'modal-vanilla';
import { I18n, Options } from '../ol-pdf-printer';

/**
 * @private
 */
export default class ProcessingModal {
    protected _modal: Modal;
    protected _footer: string;
    protected _i18n: I18n;

    /**
     *
     * @param i18n
     * @param options
     * @param onEndPrint
     * @protected
     */
    constructor(i18n: I18n, options: Options, onEndPrint: () => void) {
        this._i18n = i18n;

        this._modal = new Modal({
            headerClose: false,
            title: this._i18n.printing,
            backdrop: 'static', // To prevent close on clicking backdrop
            content: ' ',
            footer: `
            <button
                type="button"
                class="btn-sm btn btn-secondary"
                data-dismiss="modal"
            >
                ${this._i18n.cancel}
            </button>
            `,
            ...options.modal
        });

        this._modal.on('dismiss', () => {
            onEndPrint();
        });
    }

    /**
     *
     * @param string
     * @protected
     */
    _setContentModal(string: string | number): void {
        this._modal._html.body.innerHTML = string;
    }

    /**
     *
     * @param string
     * @protected
     */
    _setFooterModal(string: string): void {
        this._modal._html.footer.innerHTML = string;
    }

    /**
     *
     * @param string
     * @param footer
     * @protected
     */
    show(): void {
        this._modal.show();
    }

    /**
     *
     * @param string
     * @param footer
     * @protected
     */
    set(string: string | number): void {
        if (!this._modal._visible) return;
        this._setContentModal(string);
    }

    /**
     * @protected
     */
    hide(): void {
        this._modal.hide();
    }
}
