import Modal from 'modal-vanilla';
import myPragma from '../myPragma';

import { getMapScale } from './Helpers';

let modal;

const Content = (i18n, params) => {
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
                    <label htmlFor="printOrientation">{i18n.orientation}</label>
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
                    <label htmlFor="printResolution">{i18n.resolution}</label>
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
};

const Footer = (lang) => {
    return `
        <div>
            <button
                type="button"
                class="btn-sm btn btn-secondary"
                data-dismiss="modal"
            >
                ${lang.cancel}
            </button>
            <button
                type="button"
                class="btn-sm btn btn-primary"
                data-print="true"
                data-dismiss="modal"
            >
                ${lang.print}
            </button>
        </div>
    `;
};

export const initPrintModal = (map, options, lang, printMap) => {
    modal = new Modal({
        headerClose: true,
        header: true,
        animate: true,
        title: lang.printPdf,
        content: Content(lang, options),
        footer: Footer(lang),
        ...options.modal
    });

    modal.on('dismiss', (modal, event) => {
        const print = event.target.dataset.print;
        if (!print) return;

        const form = document.getElementById('printMap').elements;

        const formData = {
            format: form.namedItem('printFormat').value,
            orientation: form.namedItem('printOrientation').value,
            resolution: form.namedItem('printResolution').value,
            scale: form.namedItem('printScale').value,
            description: form.namedItem('printDescription').value.trim(),
            compass: form.namedItem('printCompass').checked,
            attributions: form.namedItem('printAttributions').checked,
            scalebar: form.namedItem('printScalebar').checked
        };

        printMap(formData);
    });

    modal.on('shown', () => {
        const actualScaleVal = getMapScale(map);
        const actualScale = document.querySelector('.actualScale');
        actualScale.value = actualScaleVal / 1000;
        actualScale.innerHTML = `${
            lang.current
        } (1:${actualScaleVal.toLocaleString('de')})`;
    });
};

export const hidePrintModal = () => {
    modal.hide();
};

export const showPrintModal = () => {
    if (!modal._visible) modal.show();
};
