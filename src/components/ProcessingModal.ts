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
    constructor(i18n: I18n, options: Options, onEndPrint: Function) {
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
    _setContentModal(string: string): void {
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
    show(string: string): void {
        this._setContentModal(string);
        if (!this._modal._visible) this._modal.show();
    }

    /**
     * @protected
     */
    hide(): void {
        this._modal.hide();
    }
}
