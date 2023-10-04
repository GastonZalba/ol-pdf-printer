import Map from 'ol/Map.js';

import Modal from 'modal-vanilla';

import { I18n, IValues, Options } from '../ol-pdf-printer';
import { getMapScale } from './Helpers';
import myPragma from '../myPragma';

/**
 * @private
 */
export default class SettingsModal {
    _modal: Modal;

    constructor(
        map: Map,
        options: Options,
        i18n: I18n,
        printMap: (values: IValues, showLoading: boolean, delay: number) => void
    ) {
        this._modal = new Modal({
            headerClose: true,
            header: true,
            animate: true,
            title: i18n.printPdf,
            content: this.Content(i18n, options),
            footer: this.Footer(i18n, options),
            ...options.modal
        });

        this._modal.el.classList.add('settingsModal');

        this._modal.on('dismiss', (modal: Modal, event: Event): void => {
            const print = (event.target as HTMLElement).dataset.print;
            if (!print) return;

            const form = document.getElementById('printMap') as HTMLFormElement;

            const formData = new FormData(form);

            const values = {
                format: formData.get('printFormat'),
                orientation: formData.get('printOrientation'),
                resolution: formData.get('printResolution'),
                scale: formData.get('printScale'),
                description: formData.get('printDescription'),
                compass: formData.get('printCompass'),
                attributions: formData.get('printAttributions'),
                scalebar: formData.get('printScalebar'),
                legends: formData.get('printLegends'),
                url: formData.get('printUrl'),
                date: formData.get('printDate'),
                specs: formData.get('printSpecs'),
                safeMargins: formData.get('safeMargins'),
                typeExport: this._modal.el.querySelector(
                    'select[name="printTypeExport"]'
                ).value
            };

            printMap(
                values,
                /* showLoading */ true,
                /* delay */ options.modal.transition
            );
        });

        this._modal.on('shown', (): void => {
            const actualScaleVal = getMapScale(map);
            const actualScale = this._modal.el.querySelector('.actualScale');
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
     * @param options
     * @returns
     * @protected
     */
    Content(i18n: I18n, options: Options): HTMLElement {
        const { scales, dpi, mapElements, extraInfo, description, paperSizes } =
            options;

        return (
            <form id="printMap">
                <section>
                    <div>
                        <div className="printFieldHalf">
                            <label htmlFor="printFormat">
                                {i18n.paperSize}
                            </label>
                            <select name="printFormat" id="printFormat">
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
                            <select
                                name="printOrientation"
                                id="printOrientation"
                            >
                                <option value="landscape" selected>
                                    {i18n.landscape}
                                </option>
                                <option value="portrait">
                                    {i18n.portrait}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div className="printFieldHalf">
                            <label htmlFor="printResolution">
                                {i18n.resolution}
                            </label>
                            <select name="printResolution" id="printResolution">
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
                            <select name="printScale" id="printScale">
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
                        {description && (
                            <div>
                                <label htmlFor="printDescription">
                                    {i18n.addNote}
                                </label>
                                <textarea
                                    id="printDescription"
                                    name="printDescription"
                                    rows="4"
                                ></textarea>
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="safeMargins">
                            <input
                                type="checkbox"
                                id="safeMargins"
                                name="safeMargins"
                            />
                            {i18n.printerMargins}
                        </label>
                    </div>
                </section>
                {mapElements && (
                    <fieldset className="sectionChecks mapElements">
                        <legend>{i18n.mapElements}</legend>
                        <div className="sectionChecksList">
                            {mapElements.compass && (
                                <label htmlFor="printCompass">
                                    <input
                                        type="checkbox"
                                        id="printCompass"
                                        name="printCompass"
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
                                        name="printScalebar"
                                        checked
                                    />
                                    {i18n.scale}
                                </label>
                            )}
                            {mapElements.legends && (
                                <label htmlFor="printLegends">
                                    <input
                                        type="checkbox"
                                        id="printLegends"
                                        name="printLegends"
                                        checked
                                    />
                                    {i18n.legends}
                                </label>
                            )}
                            {mapElements.attributions && (
                                <label htmlFor="printAttributions">
                                    <input
                                        type="checkbox"
                                        id="printAttributions"
                                        name="printAttributions"
                                        checked
                                    />
                                    {i18n.layersAttributions}
                                </label>
                            )}
                        </div>
                    </fieldset>
                )}
                {extraInfo && (
                    <fieldset className="sectionChecks extraInfo">
                        <legend>{i18n.extraInfo}</legend>
                        <div className="sectionChecksList">
                            {extraInfo.url && (
                                <label htmlFor="printUrl">
                                    <input
                                        type="checkbox"
                                        id="printUrl"
                                        name="printUrl"
                                        checked
                                    />
                                    {i18n.url}
                                </label>
                            )}
                            {extraInfo.date && (
                                <label htmlFor="printDate">
                                    <input
                                        type="checkbox"
                                        id="printDate"
                                        name="printDate"
                                        checked
                                    />
                                    {i18n.date}
                                </label>
                            )}
                            {extraInfo.specs && (
                                <label htmlFor="printSpecs">
                                    <input
                                        type="checkbox"
                                        id="printSpecs"
                                        name="printSpecs"
                                        checked
                                    />
                                    {i18n.specs}
                                </label>
                            )}
                        </div>
                    </fieldset>
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
    Footer(i18n: I18n, options: Options): string {
        const { mimeTypeExports } = options;

        return (
            <div>
                <button
                    type="button"
                    className="btn-sm btn btn-secondary"
                    data-dismiss="modal"
                >
                    {i18n.cancel}
                </button>
                <div class="typeExportContainer">
                    <button
                        type="button"
                        className="btn-sm btn btn-primary"
                        data-print="true"
                        data-dismiss="modal"
                    >
                        {i18n.print}
                    </button>
                    <select
                        className="typeExport"
                        name="printTypeExport"
                        id="printTypeExport"
                    >
                        {mimeTypeExports.map((type) => (
                            <option
                                value={type.value}
                                {...(type.selected
                                    ? { selected: 'selected' }
                                    : {})}
                            >
                                {type.value}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        ).outerHTML;
    }

    hide(): void {
        this._modal.hide();
    }

    show(): void {
        if (!this._modal._visible) this._modal.show();
    }
}
