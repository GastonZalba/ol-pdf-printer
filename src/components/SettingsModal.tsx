import Modal from 'modal-vanilla';
import { PluggableMap } from 'ol';
import { I18n, Options } from 'src/ol-pdf-printer';
import myPragma from '../myPragma';

import { getMapScale } from './Helpers';

/**
 * @private
 */
export default class SettingsModal {
    _modal: typeof Modal;

    constructor(
        map: PluggableMap,
        options: Options,
        i18n: I18n,
        printMap: Function
    ) {
        this._modal = new Modal({
            headerClose: true,
            header: true,
            animate: true,
            title: i18n.printPdf,
            content: this.Content(i18n, options),
            footer: this.Footer(i18n),
            ...options.modal
        });

        this._modal.on('dismiss', (modal, event): void => {
            const print = event.target.dataset.print;
            if (!print) return;

            const form = (
                document.getElementById('printMap') as HTMLFormElement
            ).elements;

            const formData = {
                format: (form.namedItem('printFormat') as HTMLInputElement)
                    .value,
                orientation: (
                    form.namedItem('printOrientation') as HTMLInputElement
                ).value,
                resolution: (
                    form.namedItem('printResolution') as HTMLInputElement
                ).value,
                scale: (form.namedItem('printScale') as HTMLInputElement).value,
                description: (
                    form.namedItem('printDescription') as HTMLTextAreaElement
                ).value.trim(),
                compass: (form.namedItem('printCompass') as HTMLInputElement)
                    .checked,
                attributions: (
                    form.namedItem('printAttributions') as HTMLInputElement
                ).checked,
                scalebar: (form.namedItem('printScalebar') as HTMLInputElement)
                    .checked
            };

            printMap(formData);
        });

        this._modal.on('shown', (): void => {
            const actualScaleVal = getMapScale(map);
            const actualScale = document.querySelector('.actualScale');
            (actualScale as HTMLInputElement).value = String(
                actualScaleVal / 1000
            );
            actualScale.innerHTML = `${
                i18n.current
            } (1:${actualScaleVal.toLocaleString('de')})`;
        });
    }

    /**
     *
     * @param i18n
     * @param params
     * @returns
     * @protected
     */
    Content(i18n: I18n, params): void {
        const { scales, dpi, mapElements, paperSizes } = params;

        return (
            <form id="printMap">
                <div>
                    <div className="printFieldHalf">
                        <label htmlFor="printFormat">{i18n.paperSize}</label>
                        <select id="printFormat">
                            {paperSizes.map((paper) => (
                                <option
                                    value={paper.value}
                                    {...(paper.selected
                                        ? { selected: 'selected' }
                                        : {})}
                                >
                                    {paper.value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="printFieldHalf">
                        <label htmlFor="printOrientation">
                            {i18n.orientation}
                        </label>
                        <select id="printOrientation">
                            <option value="landscape" selected>
                                {i18n.landscape}
                            </option>
                            <option value="portrait">{i18n.portrait}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className="printFieldHalf">
                        <label htmlFor="printResolution">
                            {i18n.resolution}
                        </label>
                        <select id="printResolution">
                            {dpi.map((d) => (
                                <option
                                    value={d.value}
                                    {...(d.selected
                                        ? { selected: 'selected' }
                                        : {})}
                                >
                                    {d.value} dpi
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="printFieldHalf">
                        <label htmlFor="printScale">{i18n.scale}</label>
                        <select id="printScale">
                            <option
                                className="actualScale"
                                value=""
                                selected
                            ></option>
                            {scales.map((scale) => (
                                <option value={scale}>
                                    1:{(scale * 1000).toLocaleString('de')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {mapElements.description && (
                    <div>
                        <label htmlFor="printDescription">{i18n.addNote}</label>
                        <textarea id="printDescription" rows="4"></textarea>
                    </div>
                )}
                {mapElements && (
                    <div>
                        <div>{i18n.mapElements}</div>
                        <div className="printElements">
                            {mapElements.compass && (
                                <label htmlFor="printCompass">
                                    <input
                                        type="checkbox"
                                        id="printCompass"
                                        checked
                                    />
                                    {i18n.compass}
                                </label>
                            )}
                            {mapElements.scalebar && (
                                <label htmlFor="printScalebar">
                                    <input
                                        type="checkbox"
                                        id="printScalebar"
                                        checked
                                    />
                                    {i18n.scale}
                                </label>
                            )}
                            {mapElements.attributions && (
                                <label htmlFor="printAttributions">
                                    <input
                                        type="checkbox"
                                        id="printAttributions"
                                        checked
                                    />
                                    {i18n.layersAttributions}
                                </label>
                            )}
                        </div>
                    </div>
                )}
            </form>
        );
    }

    /**
     *
     * @param i18n
     * @returns
     * @protected
     */
    Footer(i18n: I18n) {
        return `
        <div>
            <button
                type="button"
                class="btn-sm btn btn-secondary"
                data-dismiss="modal"
            >
                ${i18n.cancel}
            </button>
            <button
                type="button"
                class="btn-sm btn btn-primary"
                data-print="true"
                data-dismiss="modal"
            >
                ${i18n.print}
            </button>
        </div>
    `;
    }

    hide() {
        this._modal.hide();
    }

    show() {
        if (!this._modal._visible) this._modal.show();
    }
}