import Modal from 'modal-vanilla';

class ProcessingModal {
    _modal;
    _footer;
    _lang;

    initProcessingModal = (i18n, options, onEndPrint) => {
        this._i18n = i18n;

        this._footer = `
            <button
                type="button"
                class="btn-sm btn btn-secondary"
                data-dismiss="modal"
            >
                ${this._i18n.cancel}
            </button>
        `;

        this._modal = new Modal({
            headerClose: false,
            animate: false,
            title: this._i18n.printing,
            backdrop: 'static', // To prevent close on clicking backdrop
            content: ' ',
            footer: ' ',
            ...options.modal
        });

        this._modal.on('dismiss', () => {
            onEndPrint();
        });
    };

    setContentModal = (string) => {
        this._modal._html.body.innerHTML = string;
    };

    setFooterModal = (string) => {
        this._modal._html.footer.innerHTML = string;
    };

    showProcessingModal = (string, footer = false) => {
        this.setContentModal(string);

        if (footer) this.setFooterModal(this._footer);
        else this.setFooterModal(' ');

        if (!this._modal._visible) this._modal.show();
    };

    hideProcessingModal = () => {
        this._modal.hide();
    };
}

export const {
    showProcessingModal,
    hideProcessingModal,
    initProcessingModal
} = new ProcessingModal();
