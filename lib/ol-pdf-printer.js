/*!
 * ol-pdf-printer - v1.1.1
 * https://github.com/GastonZalba/ol-pdf-printer#readme
 * Built: Fri Apr 21 2023 20:07:07 GMT-0300 (Argentina Standard Time)
*/
import Control from 'ol/control/Control.js';
import TileWMS from 'ol/source/TileWMS.js';
import Tile from 'ol/layer/Tile.js';
import { getPointResolution } from 'ol/proj.js';
import { unByKey } from 'ol/Observable.js';
import domtoimage from 'dom-to-image-improved';
import { jsPDF } from 'jspdf';
import { version, GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import Modal from 'modal-vanilla';
import { METERS_PER_UNIT } from 'ol/proj/Units.js';

function createElement(tagName, attrs = {}, ...children) {
    if (tagName === 'null' || tagName === null) return children;
    if (typeof tagName === 'function') return tagName(attrs, children);

    const elem = document.createElement(tagName);

    Object.entries(attrs || {}).forEach(([name, value]) => {
        if (typeof value !== undefined && value !== null) {
            if (
                name.startsWith('on') &&
                name.toLowerCase() in window &&
                typeof value === 'function'
            )
                elem.addEventListener(name.toLowerCase().substr(2), value);
            else {
                if (name === 'className')
                    elem.setAttribute('class', value.toString());
                else if (name === 'htmlFor')
                    elem.setAttribute('for', value.toString());
                else elem.setAttribute(name, value.toString());
            }
        }
    });

    for (const child of children) {
        if (!child) continue;
        if (Array.isArray(child)) elem.append(...child);
        else {
            if (child.nodeType === undefined) elem.innerHTML += child;
            else elem.appendChild(child);
        }
    }
    return elem;
}

/**
 * @private
 */
class Pdf {
    constructor(params) {
        /**
         *
         * @protected
         */
        this.addMapHelpers = async () => {
            const { mapElements, extraInfo, style, watermark } = this._config;
            this._style = style;
            if (watermark) {
                await this._addWatermark(watermark);
            }
            if (mapElements) {
                if (mapElements.compass && this._form.compass) {
                    await this._addCompass(mapElements.compass);
                }
                if (mapElements.description && this._form.description) {
                    this._addDescription();
                }
                if (mapElements.scalebar && this._form.scalebar) {
                    this._addScaleBar();
                }
                if (mapElements.attributions && this._form.attributions) {
                    this._addAttributions();
                }
            }
            if (extraInfo) {
                // Bottom info
                if (extraInfo.url) {
                    this._addUrl();
                }
                if (extraInfo.date) {
                    this._addDate();
                }
                if (extraInfo.specs) {
                    this._addSpecs();
                }
            }
        };
        /**
         * Convert an SVGElement to an PNG string
         * @param svg
         * @returns
         */
        this._processSvgImage = (svg) => {
            // https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser#answer-58142441
            return new Promise((resolve, reject) => {
                const svgToPng = (svg, callback) => {
                    const url = getSvgUrl(svg);
                    svgUrlToPng(url, (imgData) => {
                        callback(imgData);
                        URL.revokeObjectURL(url);
                    });
                };
                const getSvgUrl = (svg) => {
                    return URL.createObjectURL(new Blob([svg.outerHTML], { type: 'image/svg+xml' }));
                };
                const svgUrlToPng = (svgUrl, callback) => {
                    const svgImage = document.createElement('img');
                    document.body.appendChild(svgImage);
                    svgImage.onerror = (err) => {
                        console.error(err);
                        return reject(this._i18n.errorImage);
                    };
                    svgImage.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = svgImage.clientWidth;
                            canvas.height = svgImage.clientHeight;
                            const canvasCtx = canvas.getContext('2d');
                            canvasCtx.drawImage(svgImage, 0, 0);
                            const imgData = canvas.toDataURL('image/png');
                            callback(imgData);
                            document.body.removeChild(svgImage);
                        }
                        catch (err) {
                            return reject(err);
                        }
                    };
                    svgImage.src = svgUrl;
                };
                svgToPng(svg, (imgData) => {
                    resolve(imgData);
                });
            });
        };
        /**
         *
         * @param position
         * @param offset
         * @param size
         * @returns
         * @protected
         */
        this._calculateOffsetByPosition = (position, offset, size = 0) => {
            let x, y;
            switch (position) {
                case 'topleft':
                    x = offset.x + this._style.paperMargin;
                    y = offset.y + this._style.paperMargin + size;
                    break;
                case 'topright':
                    x = this._pdf.width - offset.x - this._style.paperMargin;
                    y = offset.y + this._style.paperMargin + size;
                    break;
                case 'bottomright':
                    x = this._pdf.width - offset.x - this._style.paperMargin;
                    y =
                        this._pdf.height -
                            offset.y -
                            this._style.paperMargin -
                            size;
                    break;
                case 'bottomleft':
                    y =
                        this._pdf.height -
                            offset.y -
                            this._style.paperMargin -
                            size;
                    x = offset.x + this._style.paperMargin;
                    break;
            }
            return { x, y };
        };
        /**
         *
         * @param x
         * @param y
         * @param width
         * @param height
         * @param bkcolor
         * @param brcolor
         * @protected
         */
        this._addRoundedBox = (x, y, width, height, bkcolor, brcolor) => {
            const rounding = 1;
            this._pdf.doc.setDrawColor(brcolor);
            this._pdf.doc.setFillColor(bkcolor);
            this._pdf.doc.roundedRect(x, y, width, height, rounding, rounding, 'FD');
        };
        /**
         *
         * @param x
         * @param y
         * @param width
         * @param fontSize
         * @param color
         * @param align
         * @param str
         * @protected
         */
        this._addText = (x, y, width, fontSize, color, align = 'left', str) => {
            this._pdf.doc.setTextColor(color);
            this._pdf.doc.setFontSize(fontSize);
            this._pdf.doc.text(str, x, y, {
                align: align
            });
        };
        /**
         *
         * @param position
         * @param offset
         * @param width
         * @param fontSize
         * @param color
         * @param align
         * @param str
         * @protected
         */
        this._addTextByOffset = (position, offset, width, fontSize, color, align, str) => {
            const { x, y } = this._calculateOffsetByPosition(position, offset);
            const fixX = align === 'center' ? x - width / 2 : x;
            this._addText(fixX, y, width, fontSize, color, align, str);
        };
        /**
         * @protected
         */
        this._addDescription = () => {
            const str = this._form.description.trim();
            const position = 'topleft';
            const offset = { x: 2, y: 2 };
            const fontSize = 8;
            const maxWidth = 50;
            const paddingBack = 4;
            const { x, y } = this._calculateOffsetByPosition(position, offset);
            this._pdf.doc.setTextColor(this._style.txcolor);
            this._pdf.doc.setFontSize(fontSize);
            const { w, h } = this._pdf.doc.getTextDimensions(str, {
                maxWidth: maxWidth
            });
            this._addRoundedBox(x, y, w + paddingBack * 2, h + paddingBack, this._style.bkcolor, this._style.brcolor);
            this._pdf.doc.text(str, x + paddingBack, y + paddingBack, {
                align: 'left',
                maxWidth: maxWidth
            });
        };
        /**
         * This functions is a mess
         * @returns
         * @protected
         */
        this._addWatermark = async (watermark) => {
            const position = 'topright';
            const offset = { x: 0, y: 0 };
            const fontSize = 14;
            const imageSize = 12;
            const fontSizeSubtitle = fontSize / 1.8;
            let back = false;
            const { x, y } = this._calculateOffsetByPosition(position, offset);
            const paddingBack = 2;
            let acumulativeWidth = watermark.logo ? imageSize + 0.5 : 0;
            if (watermark.title) {
                this._pdf.doc.setTextColor(watermark.titleColor);
                this._pdf.doc.setFontSize(fontSize);
                this._pdf.doc.setFont('helvetica', 'bold');
                // This function works bad
                let { w } = this._pdf.doc.getTextDimensions(watermark.title);
                if (watermark.subtitle) {
                    this._pdf.doc.setFontSize(fontSizeSubtitle);
                    const wSub = this._pdf.doc.getTextDimensions(watermark.subtitle).w;
                    w = wSub - 4 > w ? wSub : w + 4; // weird fix needed
                    this._pdf.doc.setFontSize(fontSize);
                }
                else {
                    w += 4;
                }
                // Adaptable width, fixed height
                const height = 16;
                const widthBack = w + paddingBack;
                this._addRoundedBox(x - widthBack + 4 - acumulativeWidth, y - 4, widthBack + acumulativeWidth, height, '#ffffff', '#ffffff');
                back = true;
                this._pdf.doc.text(watermark.title, x, y + paddingBack + 3 + (!watermark.subtitle ? 2 : 0), {
                    align: 'right'
                });
                acumulativeWidth += w;
            }
            if (watermark.subtitle) {
                this._pdf.doc.setTextColor(watermark.subtitleColor);
                this._pdf.doc.setFontSize(fontSizeSubtitle);
                this._pdf.doc.setFont('helvetica', 'normal');
                if (!back) {
                    const { w } = this._pdf.doc.getTextDimensions(watermark.subtitle);
                    const widthBack = paddingBack * 2 + w;
                    this._addRoundedBox(x - widthBack + 3 - acumulativeWidth, y - 4, widthBack + acumulativeWidth, 16, '#ffffff', '#ffffff');
                    acumulativeWidth += widthBack;
                    back = true;
                }
                const marginTop = watermark.title ? fontSize / 2 : 4;
                this._pdf.doc.text(watermark.subtitle, x, y + paddingBack + marginTop, {
                    align: 'right'
                });
            }
            if (!watermark.logo)
                return;
            const addImage = (image) => {
                this._pdf.doc.addImage(image, 'PNG', x - acumulativeWidth + paddingBack * 2 - 1, y - 1, imageSize, imageSize);
            };
            if (!back) {
                const widthBack = acumulativeWidth + paddingBack;
                this._addRoundedBox(x - widthBack + 4, y - 4, widthBack, 16, '#ffffff', '#ffffff');
            }
            if (watermark.logo instanceof Image) {
                addImage(watermark.logo);
                return;
            }
            else {
                let imgData;
                if (typeof watermark.logo === 'string') {
                    imgData = watermark.logo;
                }
                else if (watermark.logo instanceof SVGElement) {
                    imgData = await this._processSvgImage(watermark.logo);
                }
                else {
                    throw this._i18n.errorImage;
                }
                return new Promise((resolve, reject) => {
                    const image = new Image(imageSize, imageSize);
                    image.onload = () => {
                        try {
                            addImage(image);
                            resolve();
                        }
                        catch (err) {
                            return reject(err);
                        }
                    };
                    image.onerror = () => {
                        return reject(this._i18n.errorImage);
                    };
                    image.src = imgData;
                });
            }
        };
        /**
         * @protected
         */
        this._addDate = () => {
            const position = 'bottomright';
            const width = 250;
            const offset = {
                x: 0,
                y: -5
            };
            const fontSize = 7;
            const txcolor = '#000000';
            const align = 'right';
            this._pdf.doc.setFont('helvetica', 'normal');
            const str = new Date(Date.now()).toLocaleDateString(this._config.dateFormat);
            this._addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
        };
        /**
         * @protected
         */
        this._addUrl = () => {
            const position = 'bottomleft';
            const width = 250;
            const offset = {
                x: 0,
                y: -6.5
            };
            const fontSize = 6;
            const txcolor = '#000000';
            const align = 'left';
            this._pdf.doc.setFont('helvetica', 'italic');
            const str = window.location.href;
            this._addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
        };
        /**
         * @protected
         */
        this._addSpecs = () => {
            const position = 'bottomleft';
            const offset = {
                x: 0,
                y: -3.5
            };
            const fontSize = 6;
            const txcolor = '#000000';
            const align = 'left';
            this._pdf.doc.setFont('helvetica', 'bold');
            this._pdf.doc.setFontSize(fontSize);
            const scale = `${this._i18n.scale} 1:${this._scaleDenominator.toLocaleString('de')}`;
            const paper = `${this._i18n.paper} ${this._form.format.toUpperCase()}`;
            const dpi = `${this._form.resolution} DPI`;
            const specs = [scale, dpi, paper];
            const str = specs.join(' - ');
            const { w } = this._pdf.doc.getTextDimensions(str);
            this._addTextByOffset(position, offset, w, fontSize, txcolor, align, str);
        };
        /**
         * The attributions are obtained from the Control in the DOM.
         * @protected
         */
        this._addAttributions = () => {
            const attributionsUl = document.querySelector('.ol-attribution ul');
            if (!attributionsUl)
                return;
            const ATTRI_SEPATATOR = ' · ';
            const position = 'bottomright';
            const offset = { x: 1, y: 1 };
            const fontSize = 7;
            this._pdf.doc.setFont('helvetica', 'normal');
            this._pdf.doc.setFontSize(fontSize);
            const { x, y } = this._calculateOffsetByPosition(position, offset);
            let xPos = x;
            const { w, h } = this._pdf.doc.getTextDimensions(attributionsUl.textContent);
            const paddingBack = 4;
            const whiteSpaceWidth = this._pdf.doc.getTextDimensions(ATTRI_SEPATATOR).w;
            const attributions = document.querySelectorAll('.ol-attribution li');
            const sumWhiteSpaceWidth = whiteSpaceWidth * (attributions.length - 1);
            this._addRoundedBox(x - w - sumWhiteSpaceWidth - 2, y - h, w + paddingBack + sumWhiteSpaceWidth + 2, h + paddingBack, '#ffffff', '#ffffff');
            Array.from(attributions)
                .reverse()
                .forEach((attribution, index) => {
                Array.from(attribution.childNodes)
                    .reverse()
                    .forEach((node) => {
                    const content = node.textContent;
                    if ('href' in node) {
                        this._pdf.doc.setTextColor('#0077cc');
                        this._pdf.doc.textWithLink(content, xPos, y, {
                            align: 'right',
                            url: node.href
                        });
                    }
                    else {
                        this._pdf.doc.setTextColor('#666666');
                        this._pdf.doc.text(content, xPos, y, {
                            align: 'right'
                        });
                    }
                    const { w } = this._pdf.doc.getTextDimensions(content);
                    xPos -= w;
                });
                // Excldue last element
                if (index !== attributions.length - 1) {
                    // To add separation between diferents attributtions
                    this._pdf.doc.text(ATTRI_SEPATATOR, xPos, y, {
                        align: 'right'
                    });
                    xPos -= whiteSpaceWidth;
                }
            });
        };
        /**
         * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
         * @protected
         */
        this._addScaleBar = () => {
            const offset = { x: 2, y: 2 };
            const maxWidth = 90; // in mm
            // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10#Polyfill
            const log10 = Math.log10 || // more precise, but unsupported by IE
                function (x) {
                    return Math.log(x) * Math.LOG10E;
                };
            let maxLength = maxWidth * this._scaleDenominator;
            let unit;
            let unitConversionFactor;
            if (this._config.units === 'metric') {
                unit = 'mm';
                const millimetre = 1;
                const metre = 1000;
                const kilometre = metre * 1000;
                unitConversionFactor = millimetre;
                if (maxLength >= kilometre * 10) {
                    unit = 'km';
                    unitConversionFactor = 1e6;
                }
                else if (maxLength >= metre * 10) {
                    unit = 'm';
                    unitConversionFactor = metre;
                }
            }
            else if (this._config.units === 'imperial') {
                const inch = 25.4; // Millimetre to inch
                const mile = inch * 63360;
                const yard = inch * 36;
                unit = 'in';
                unitConversionFactor = inch;
                if (maxLength >= mile * 10) {
                    unit = 'mi';
                    unitConversionFactor = mile;
                }
                else if (maxLength >= yard * 10) {
                    unit = 'yd';
                    unitConversionFactor = yard;
                }
            }
            maxLength /= unitConversionFactor;
            const unroundedLength = maxLength;
            const numberOfDigits = Math.floor(log10(unroundedLength));
            const factor = Math.pow(10, numberOfDigits);
            const mapped = unroundedLength / factor;
            let length = Math.floor(maxLength); // just to have an upper limit
            // manually only use numbers that are very nice to devide by 4
            // note that this is taken into account for rounding later
            if (mapped > 8) {
                length = 8 * factor;
            }
            else if (mapped > 4) {
                length = 4 * factor;
            }
            else if (mapped > 2) {
                length = 2 * factor;
            }
            else {
                length = factor;
            }
            let size = (length * unitConversionFactor) / this._scaleDenominator / 4;
            const percentageMargin = this._style.paperMargin
                ? ((this._style.paperMargin * 2) / this._pdf.width) * 100
                : null;
            // Reduce length acording to margins
            size = percentageMargin
                ? (size / 100) * (100 - percentageMargin)
                : size;
            const fullSize = size * 4;
            // x/y defaults to offset for topleft corner (normal x/y coordinates)
            const x = offset.x + this._style.paperMargin;
            let y = offset.y + this._style.paperMargin;
            y = this._pdf.height - offset.y - 10 - this._style.paperMargin;
            // to give the outer white box 4mm padding
            const scaleBarX = x + 4;
            const scaleBarY = y + 5; // 5 because above the scalebar will be the numbers
            // draw outer box
            this._addRoundedBox(x, y, fullSize + 8, 10, this._style.bkcolor, this._style.brcolor);
            // draw first part of scalebar
            this._pdf.doc.setDrawColor(this._style.brcolor);
            this._pdf.doc.setFillColor(0, 0, 0);
            this._pdf.doc.rect(scaleBarX, scaleBarY, size, 1, 'FD');
            // draw second part of scalebar
            this._pdf.doc.setDrawColor(this._style.brcolor);
            this._pdf.doc.setFillColor(255, 255, 255);
            this._pdf.doc.rect(scaleBarX + size, scaleBarY, size, 1, 'FD');
            // draw third part of scalebar
            this._pdf.doc.setDrawColor(this._style.brcolor);
            this._pdf.doc.setFillColor(0, 0, 0);
            this._pdf.doc.rect(scaleBarX + size * 2, scaleBarY, size * 2, 1, 'FD');
            // draw numeric labels above scalebar
            this._pdf.doc.setTextColor(this._style.txcolor);
            this._pdf.doc.setFontSize(6);
            this._pdf.doc.text('0', scaleBarX, scaleBarY - 1);
            // /4 and could give 2.5. We still round, because of floating point arith
            this._pdf.doc.text(String(Math.round((length * 10) / 4) / 10), scaleBarX + size - 1, scaleBarY - 1);
            this._pdf.doc.text(String(Math.round(length / 2)), scaleBarX + size * 2 - 2, scaleBarY - 1);
            this._pdf.doc.text(Math.round(length).toString() + ' ' + unit, scaleBarX + size * 4 - 4, scaleBarY - 1);
        };
        /**
         *
         * @param imgSrc
         * @returns
         * @protected
         */
        this._addCompass = async (imgSrc) => {
            const position = 'bottomright';
            const offset = { x: 2, y: 6 };
            const size = 6;
            const rotationRadians = this._view.getRotation();
            const imageSize = 100;
            const { x, y } = this._calculateOffsetByPosition(position, offset, size);
            const addRotation = (image) => {
                const canvas = document.createElement('canvas');
                // Must be bigger than the image to prevent clipping
                canvas.height = 120;
                canvas.width = 120;
                const context = canvas.getContext('2d');
                context.translate(canvas.width * 0.5, canvas.height * 0.5);
                context.rotate(rotationRadians);
                context.translate(-canvas.width * 0.5, -canvas.height * 0.5);
                context.drawImage(image, (canvas.height - imageSize) / 2, (canvas.width - imageSize) / 2, imageSize, imageSize);
                // Add back circle
                const xCircle = x - size;
                const yCircle = y;
                this._pdf.doc.setDrawColor(this._style.brcolor);
                this._pdf.doc.setFillColor(this._style.bkcolor);
                this._pdf.doc.circle(xCircle, yCircle, size, 'FD');
                return canvas;
            };
            const addImage = (image) => {
                const rotatedCanvas = addRotation(image);
                const sizeImage = size * 1.5;
                const xImage = x - sizeImage - size / 4.3;
                const yImage = y - sizeImage / 2;
                this._pdf.doc.addImage(rotatedCanvas, 'PNG', xImage, yImage, sizeImage, sizeImage);
            };
            let image;
            if (imgSrc instanceof Image) {
                addImage(image);
                return;
            }
            else {
                let imgData;
                if (typeof imgSrc === 'string') {
                    imgData = imgSrc;
                }
                else if (imgSrc instanceof SVGElement) {
                    imgData = await this._processSvgImage(imgSrc);
                }
                else {
                    throw this._i18n.errorImage;
                }
                return new Promise((resolve, reject) => {
                    const image = new Image(imageSize, imageSize);
                    image.onload = () => {
                        addImage(image);
                        resolve();
                    };
                    image.onerror = () => {
                        reject(this._i18n.errorImage);
                    };
                    image.src = imgData;
                });
            }
        };
        const { view, form, i18n, config, height, width, scaleResolution } = params;
        this._view = view;
        this._form = form;
        this._i18n = i18n;
        this._config = config;
        this._pdf = this.create(this._form.orientation, this._form.format, height, width);
        this._scaleDenominator = this._calculateScaleDenominator(this._form.resolution, scaleResolution);
    }
    /**
     *
     * @param orientation
     * @param format
     * @param width
     * @param height
     * @returns
     * @protected
     */
    create(orientation, format, height, width) {
        var _a;
        // UMD support
        const _jsPDF = ((_a = window.jspdf) === null || _a === void 0 ? void 0 : _a.jsPDF) || jsPDF;
        return {
            doc: new _jsPDF({ orientation, format }),
            height: height,
            width: width
        };
    }
    /**
     *
     * @param dataUrl
     * @protected
     */
    addMapImage(dataUrl) {
        this._pdf.doc.addImage(dataUrl, 'JPEG', this._config.style.paperMargin, // Add margins
        this._config.style.paperMargin, this._pdf.width - this._config.style.paperMargin * 2, this._pdf.height - this._config.style.paperMargin * 2);
    }
    /**
     * @protected
     */
    savePdf() {
        const downloadURI = (uri, name) => {
            const link = createElement("a", { download: name, href: uri });
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        return new Promise((resolve, reject) => {
            var _a;
            if (this._form.typeExport === 'pdf') {
                this._pdf.doc.save(this._config.filename + '.pdf');
                resolve();
            }
            else {
                const pdf = this._pdf.doc.output('dataurlstring');
                // UMD support
                const versionPdfJS = ((_a = window === null || window === void 0 ? void 0 : window.pdfjsLib) === null || _a === void 0 ? void 0 : _a.version) || version;
                GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${versionPdfJS}/pdf.worker.js`;
                getDocument(pdf).promise.then((pdf) => {
                    pdf.getPage(1).then((page) => {
                        const scale = 2;
                        const viewport = page.getViewport({ scale });
                        // Prepare canvas
                        const canvas = createElement("canvas", null);
                        canvas.style.display = 'none';
                        document.body.appendChild(canvas);
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        // Render PDF page into canvas context
                        const task = page.render({
                            canvasContext: context,
                            viewport: viewport
                        });
                        task.promise.then(() => {
                            downloadURI(canvas.toDataURL(`image/${this._form.typeExport}`), this._config.filename +
                                `.${this._form.typeExport}`);
                            canvas.remove();
                            resolve();
                        });
                    });
                }, (error) => {
                    reject(error);
                    console.log(error);
                });
            }
        });
    }
    /**
     * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
     * @protected
     */
    _calculateScaleDenominator(resolution, scaleResolution) {
        const pixelsPerMapMillimeter = resolution / 25.4;
        return Math.round(1000 *
            pixelsPerMapMillimeter *
            this._getMeterPerPixel(scaleResolution));
    }
    /**
     * @protected
     */
    _getMeterPerPixel(scaleResolution) {
        const proj = this._view.getProjection();
        return (getPointResolution(proj, scaleResolution, this._view.getCenter()) *
            proj.getMetersPerUnit());
    }
}

/**
 *
 * @param map
 * @param opt_round
 * @returns
 * @protected
 */
const getMapScale = (map, opt_round = true) => {
    const dpi = 25.4 / 0.28;
    const view = map.getView();
    const unit = view.getProjection().getUnits();
    const res = view.getResolution();
    const inchesPerMetre = 39.37;
    let scale = res * METERS_PER_UNIT[unit] * inchesPerMetre * dpi;
    if (opt_round) {
        scale = Math.round(scale);
    }
    return scale;
};

/**
 * @private
 */
class SettingsModal {
    constructor(map, options, i18n, printMap) {
        this._modal = new Modal(Object.assign({ headerClose: true, header: true, animate: true, title: i18n.printPdf, content: this.Content(i18n, options), footer: this.Footer(i18n, options) }, options.modal));
        this._modal.on('dismiss', (modal, event) => {
            const print = event.target.dataset.print;
            if (!print)
                return;
            const form = document.getElementById('printMap');
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
                typeExport: this._modal.el.querySelector('select[name="printTypeExport"]').value
            };
            printMap(values, 
            /* showLoading */ true, 
            /* delay */ options.modal.transition);
        });
        this._modal.on('shown', () => {
            const actualScaleVal = getMapScale(map);
            const actualScale = this._modal.el.querySelector('.actualScale');
            actualScale.value = String(actualScaleVal / 1000);
            actualScale.innerHTML = `${i18n.current} (1:${actualScaleVal.toLocaleString('de')})`;
        });
    }
    /**
     *
     * @param i18n
     * @param options
     * @returns
     * @protected
     */
    Content(i18n, options) {
        const { scales, dpi, mapElements, paperSizes } = options;
        return (createElement("form", { id: "printMap" },
            createElement("div", null,
                createElement("div", { className: "printFieldHalf" },
                    createElement("label", { htmlFor: "printFormat" }, i18n.paperSize),
                    createElement("select", { name: "printFormat", id: "printFormat" }, paperSizes.map((paper) => (createElement("option", Object.assign({ value: paper.value }, (paper.selected
                        ? { selected: 'selected' }
                        : {})), paper.value))))),
                createElement("div", { className: "printFieldHalf" },
                    createElement("label", { htmlFor: "printOrientation" }, i18n.orientation),
                    createElement("select", { name: "printOrientation", id: "printOrientation" },
                        createElement("option", { value: "landscape", selected: true }, i18n.landscape),
                        createElement("option", { value: "portrait" }, i18n.portrait)))),
            createElement("div", null,
                createElement("div", { className: "printFieldHalf" },
                    createElement("label", { htmlFor: "printResolution" }, i18n.resolution),
                    createElement("select", { name: "printResolution", id: "printResolution" }, dpi.map((d) => (createElement("option", Object.assign({ value: d.value }, (d.selected
                        ? { selected: 'selected' }
                        : {})),
                        d.value,
                        " dpi"))))),
                createElement("div", { className: "printFieldHalf" },
                    createElement("label", { htmlFor: "printScale" }, i18n.scale),
                    createElement("select", { name: "printScale", id: "printScale" },
                        createElement("option", { className: "actualScale", value: "", selected: true }),
                        scales.map((scale) => (createElement("option", { value: scale },
                            "1:",
                            (scale * 1000).toLocaleString('de'))))))),
            mapElements && (createElement("div", null,
                mapElements.description && (createElement("div", null,
                    createElement("label", { htmlFor: "printDescription" }, i18n.addNote),
                    createElement("textarea", { id: "printDescription", name: "printDescription", rows: "4" }))),
                createElement("div", null, i18n.mapElements),
                createElement("div", { className: "printElements" },
                    mapElements.compass && (createElement("label", { htmlFor: "printCompass" },
                        createElement("input", { type: "checkbox", id: "printCompass", name: "printCompass", checked: true }),
                        i18n.compass)),
                    mapElements.scalebar && (createElement("label", { htmlFor: "printScalebar" },
                        createElement("input", { type: "checkbox", id: "printScalebar", name: "printScalebar", checked: true }),
                        i18n.scale)),
                    mapElements.attributions && (createElement("label", { htmlFor: "printAttributions" },
                        createElement("input", { type: "checkbox", id: "printAttributions", name: "printAttributions", checked: true }),
                        i18n.layersAttributions)))))));
    }
    /**
     *
     * @param i18n
     * @returns
     * @protected
     */
    Footer(i18n, options) {
        const { mimeTypeExports } = options;
        return (createElement("div", null,
            createElement("button", { type: "button", className: "btn-sm btn btn-secondary", "data-dismiss": "modal" }, i18n.cancel),
            createElement("div", { class: "typeExportContainer" },
                createElement("button", { type: "button", className: "btn-sm btn btn-primary", "data-print": "true", "data-dismiss": "modal" }, i18n.print),
                createElement("select", { className: "typeExport", name: "printTypeExport", id: "printTypeExport" }, mimeTypeExports.map((type) => (createElement("option", Object.assign({ value: type.value }, (type.selected
                    ? { selected: 'selected' }
                    : {})), type.value))))))).outerHTML;
    }
    hide() {
        this._modal.hide();
    }
    show() {
        if (!this._modal._visible)
            this._modal.show();
    }
}

/**
 * @private
 */
class ProcessingModal {
    /**
     *
     * @param i18n
     * @param options
     * @param onEndPrint
     * @protected
     */
    constructor(i18n, options, onEndPrint) {
        this._i18n = i18n;
        this._modal = new Modal(Object.assign({ headerClose: false, title: this._i18n.printing, backdrop: 'static', content: ' ', footer: `
            <button
                type="button"
                class="btn-sm btn btn-secondary"
                data-dismiss="modal"
            >
                ${this._i18n.cancel}
            </button>
            ` }, options.modal));
        this._modal.on('dismiss', () => {
            onEndPrint();
        });
    }
    /**
     *
     * @param string
     * @protected
     */
    _setContentModal(string) {
        this._modal._html.body.innerHTML = string;
    }
    /**
     *
     * @param string
     * @protected
     */
    _setFooterModal(string) {
        this._modal._html.footer.innerHTML = string;
    }
    /**
     *
     * @param string
     * @param footer
     * @protected
     */
    show(string) {
        this._setContentModal(string);
        if (!this._modal._visible)
            this._modal.show();
    }
    /**
     * @protected
     */
    hide() {
        this._modal.hide();
    }
}

const es = {
    printPdf: 'Exportar PDF',
    pleaseWait: 'Por favor espere...',
    almostThere: 'Ya casi...',
    error: 'Error al generar pdf',
    errorImage: 'Ocurrió un error al tratar de cargar una imagen',
    printing: 'Exportando',
    cancel: 'Cancelar',
    close: 'Cerrar',
    print: 'Exportar',
    mapElements: 'Elementos en el mapa',
    compass: 'Brújula',
    scale: 'Escala',
    layersAttributions: 'Atribuciones de capas',
    addNote: 'Agregar nota (opcional)',
    resolution: 'Resolución',
    orientation: 'Orientación',
    paperSize: 'Tamaño de página',
    landscape: 'Paisaje',
    portrait: 'Retrato',
    current: 'Actual',
    paper: 'Hoja'
};

const en = {
    printPdf: 'Print PDF',
    pleaseWait: 'Please wait...',
    almostThere: 'Almost there...',
    error: 'An error occurred while printing',
    errorImage: 'An error ocurred while loading an image',
    printing: 'Exporting',
    cancel: 'Cancel',
    close: 'Close',
    print: 'Export',
    mapElements: 'Map elements',
    compass: 'Compass',
    scale: 'Scale',
    layersAttributions: 'Layer attributions',
    addNote: 'Add note (optional)',
    resolution: 'Resolution',
    orientation: 'Orientation',
    paperSize: 'Paper size',
    landscape: 'Landscape',
    portrait: 'Portrait',
    current: 'Current',
    paper: 'Paper'
};

var i18n = /*#__PURE__*/Object.freeze({
    __proto__: null,
    en: en,
    es: es
});

function compassIcon() {
	return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"compass\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"0 0 300 300\" style=\"enable-background:new 0 0 300 300;\" xml:space=\"preserve\">\r\n<style type=\"text/css\">\r\n\t.st0{fill:#EA6868;}\r\n</style>\r\n<g>\r\n\t<g>\r\n\t\t<g>\r\n\t\t\t<g>\r\n\t\t\t\t<g>\r\n\t\t\t\t\t<path class=\"st0\" d=\"M146.3,9.1L75.5,287.2c-0.5,1.8,0.5,3.7,2.1,4.4c1.8,0.8,3.7,0.2,4.7-1.5l68.4-106.7l66.8,106.7\r\n\t\t\t\t\t\tc0.6,1.1,1.9,1.8,3.2,1.8c0.5,0,1-0.2,1.5-0.3c1.8-0.8,2.6-2.6,2.3-4.4L153.7,9.1C152.9,5.7,147.2,5.7,146.3,9.1z M154.2,174.2\r\n\t\t\t\t\t\tc-0.6-1.1-1.9-1.8-3.2-1.8l0,0c-1.3,0-2.6,0.6-3.2,1.8l-59,92L150,25.5l61.1,239.9L154.2,174.2z\"/>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t\t<g>\r\n\t\t\t\t<g>\r\n\t\t\t\t\t<path class=\"st0\" d=\"M220.8,293.1c-1.8,0-3.4-1-4.2-2.3l-65.8-105.1L83.4,290.8c-1.3,1.9-4,2.9-6.1,1.9c-2.3-1-3.4-3.4-2.9-5.8\r\n\t\t\t\t\t\tL145.1,8.8c0.5-2.1,2.4-3.4,4.9-3.4s4.4,1.3,4.9,3.4l70.8,278.1c0.6,2.4-0.6,4.9-2.9,5.8C222.1,292.9,221.5,293.1,220.8,293.1z\r\n\t\t\t\t\t\t M150.8,181.2l1,1.6l66.8,106.7c0.6,1,1.9,1.5,3.2,1c1.1-0.5,1.8-1.8,1.5-3.1L152.4,9.3c-0.3-1.1-1.6-1.6-2.6-1.6\r\n\t\t\t\t\t\ts-2.3,0.5-2.6,1.6L76.4,287.4c-0.3,1.3,0.3,2.6,1.5,3.1c1.1,0.5,2.6,0,3.2-1L150.8,181.2z M85.6,273.2L150,20.6l64.2,251.9\r\n\t\t\t\t\t\tl-61.1-97.7c-1-1.6-3.4-1.5-4.4,0L85.6,273.2z\"/>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t</g>\r\n\t</g>\r\n</g>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
}

function pdfIcon() {
	return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"0 0 490 490\" xml:space=\"preserve\">\r\n<g>\r\n\t<path d=\"M65.4,6v157.1c0,3.3-2.9,6-6.5,6H33.6c-3.6,0-6.5,2.7-6.5,6v189.6h0l36.3,33.8c1.2,1.1,1.9,2.7,1.9,4.3l0,81.2\r\n\t\tc0,3.3,2.9,6,6.5,6h383.8c3.6,0,6.5-2.7,6.5-6V104.9c0-1.6-0.7-3.1-1.9-4.3l-106-98.9c-1.2-1.1-2.9-1.8-4.6-1.8H71.8\r\n\t\tC68.2,0,65.4,2.7,65.4,6z M431.3,357.4h-374c-3.8,0-6.9-4-6.9-9V203.2c0-5,3.1-9,6.9-9h374c3.8,0,6.9,4,6.9,9v145.2\r\n\t\tC438.2,353.4,435.1,357.4,431.3,357.4z M340.2,27.6l70.8,66c7.2,6.7,2.1,18.2-8.1,18.2h-70.8c-6.3,0-11.4-4.8-11.4-10.7v-66\r\n\t\tC320.7,25.6,333,20.9,340.2,27.6z\"/>\r\n\t<path d=\"M136.9,207.4h-6.5H87.9c-5.8,0-10.5,4.9-10.5,11v115.5c0,6.1,4.7,11,10.5,11h4c5.8,0,10.5-4.9,10.5-11v-22.4\r\n\t\tc0-6.1,4.7-11,10.5-11h18.9l5.8-0.1c18,0,29.9-3,35.8-9.1c5.9-6.1,8.9-18.3,8.9-36.7c0-18.5-3.1-31-9.3-37.5\r\n\t\tC166.6,210.6,154.7,207.4,136.9,207.4z M152.2,274.4c-3.1,2.7-10.2,4.1-21.5,4.1h-17.9c-5.8,0-10.5-4.9-10.5-11v-27.2\r\n\t\tc0-6.1,4.7-11,10.5-11h20.4c10.6,0,17.2,1.4,19.8,4.2c2.5,2.8,3.8,10,3.8,21.6C156.8,265.2,155.3,271.6,152.2,274.4z\"/>\r\n\t<path d=\"M262.6,207.4h-54.1c-5.8,0-10.5,4.9-10.5,11v115.5c0,6.1,4.7,11,10.5,11h54.9c20.7,0,34.1-4.9,39.9-14.6\r\n\t\tc5.9-9.8,8.9-31.8,8.9-66.1c0-21-3.7-35.7-11-44.1C293.8,211.5,281,207.4,262.6,207.4z M281.6,314.2c-3.5,5.8-11.2,8.6-23.1,8.6\r\n\t\th-25c-5.8,0-10.5-4.9-10.5-11v-71.6c0-6.1,4.7-11,10.5-11H260c11.6,0,19,2.7,22.1,8.2c3.1,5.5,4.7,18.4,4.7,38.7\r\n\t\tC286.9,295.8,285.1,308.5,281.6,314.2z\"/>\r\n\t<path d=\"M340.9,344.8h3.9c5.8,0,10.5-4.9,10.5-11v-34.5c0-6.1,4.7-11,10.5-11h37.9c5.8,0,10.5-4.9,10.5-11v0\r\n\t\tc0-6.1-4.7-11-10.5-11h-37.9c-5.8,0-10.5-4.9-10.5-11v-15.1c0-6.1,4.7-11,10.5-11h41.1c5.8,0,10.5-4.9,10.5-11v0\r\n\t\tc0-6.1-4.7-11-10.5-11h-66c-5.8,0-10.5,4.9-10.5,11v115.5C330.4,339.9,335.1,344.8,340.9,344.8z\"/>\r\n</g>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
}

/**
 * @protected
 */
const DEFAULT_LANGUAGE = 'en';
/**
 * @protected
 */
const CLASS_PRINT_MODE = 'printMode';
/**
 * @protected
 */
function deepObjectAssign(target, ...sources) {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            const s_val = source[key];
            const t_val = target[key];
            target[key] =
                t_val &&
                    s_val &&
                    typeof t_val === 'object' &&
                    typeof s_val === 'object' &&
                    !Array.isArray(t_val) // Don't merge arrays
                    ? deepObjectAssign(t_val, s_val)
                    : s_val;
        });
    });
    return target;
}
class PdfPrinter extends Control {
    constructor(opt_options) {
        const controlElement = document.createElement('button');
        super({
            target: opt_options.target,
            element: controlElement
        });
        // Check if the selected language exists
        this._i18n =
            opt_options.language && opt_options.language in i18n
                ? i18n[opt_options.language]
                : i18n[DEFAULT_LANGUAGE];
        if (opt_options.i18n) {
            // Merge custom translations
            this._i18n = Object.assign(Object.assign({}, this._i18n), opt_options.i18n);
        }
        // Default options
        this._options = {
            language: DEFAULT_LANGUAGE,
            filename: 'Ol Pdf Printer',
            style: {
                paperMargin: 10,
                brcolor: '#000000',
                bkcolor: '#273f50',
                txcolor: '#ffffff'
            },
            extraInfo: {
                date: true,
                url: true,
                specs: true
            },
            mapElements: {
                description: true,
                attributions: true,
                scalebar: true,
                compass: compassIcon()
            },
            watermark: {
                title: 'Ol Pdf Printer',
                titleColor: '#d65959',
                subtitle: 'https://github.com/GastonZalba/ol-pdf-printer',
                subtitleColor: '#444444',
                logo: false
            },
            paperSizes: [
                // { size: [1189, 841], value: 'A0' },
                // { size: [841, 594], value: 'A1' },
                { size: [594, 420], value: 'A2' },
                { size: [420, 297], value: 'A3' },
                { size: [297, 210], value: 'A4', selected: true },
                { size: [210, 148], value: 'A5' }
            ],
            dpi: [
                { value: 72 },
                { value: 96 },
                { value: 150, selected: true },
                { value: 200 },
                { value: 300 }
            ],
            scales: [10000, 5000, 1000, 500, 250, 100, 50, 25, 10],
            mimeTypeExports: [
                { value: 'pdf', selected: true },
                { value: 'png' },
                { value: 'jpeg' },
                { value: 'webp' }
            ],
            units: 'metric',
            dateFormat: undefined,
            ctrlBtnClass: '',
            modal: {
                animateClass: 'fade',
                animateInClass: 'show',
                transition: 150,
                backdropTransition: 100,
                templates: {
                    dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
                    headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${this._i18n.close}"><span aria-hidden="true">×</span></button>`
                }
            }
        };
        // Merge options
        this._options = deepObjectAssign(this._options, opt_options);
        controlElement.className = `ol-print-btn-menu ${this._options.ctrlBtnClass}`;
        controlElement.title = this._i18n.printPdf;
        controlElement.onclick = () => this.showPrintSettingsModal();
        controlElement.append(pdfIcon());
    }
    /**
     * @protected
     */
    _init() {
        this._map = this.getMap();
        this._view = this._map.getView();
        this._mapTarget = this._map.getTargetElement();
        this._settingsModal = new SettingsModal(this._map, this._options, this._i18n, this._printMap.bind(this));
        this._processingModal = new ProcessingModal(this._i18n, this._options, this._onEndPrint.bind(this));
        this._initialized = true;
    }
    /**
     * @protected
     */
    _setMapSizForPrint(width, height, resolution) {
        const pixelsPerMapMillimeter = resolution / 25.4;
        return [
            Math.round(width * pixelsPerMapMillimeter),
            Math.round(height * pixelsPerMapMillimeter)
        ];
    }
    /**
     * Restore inital view, remove classes, disable loading
     * @protected
     */
    _onEndPrint() {
        this._mapTarget.style.width = '';
        this._mapTarget.style.height = '';
        this._map.updateSize();
        this._view.setResolution(this._initialViewResolution);
        this._mapTarget.classList.remove(CLASS_PRINT_MODE);
        this._view.setConstrainResolution(true);
        clearTimeout(this._timeoutProcessing);
        this._cancel();
    }
    /**
     * @protected
     */
    _prepareLoading() {
        this._processingModal.show(this._i18n.pleaseWait);
        this._timeoutProcessing = setTimeout(() => {
            this._processingModal.show(this._i18n.almostThere);
        }, 4000);
    }
    /**
     * @protected
     */
    _disableLoading() {
        this._processingModal.hide();
    }
    /**
     * This could be used to increment the DPI before printing
     * @protected
     */
    _setFormatOptions(string = '') {
        const layers = this._map.getLayers();
        layers.forEach((layer) => {
            if (layer instanceof Tile) {
                const source = layer.getSource();
                // Set WMS DPI
                if (source instanceof TileWMS) {
                    source.updateParams({
                        FORMAT_OPTIONS: string
                    });
                }
            }
        });
    }
    /**
     *
     * @param form
     * @param showLoading
     * @param delay Delay to prevent glitching with modals animation
     * @protected
     */
    _printMap(form, showLoading = true, delay = 0) {
        if (showLoading) {
            this._mapTarget.classList.add(CLASS_PRINT_MODE);
        }
        setTimeout(() => {
            if (showLoading) {
                this._prepareLoading();
            }
            this._isCanceled = false;
            // To allow intermediate zoom levels
            this._view.setConstrainResolution(false);
            let dim = this._options.paperSizes.find((e) => e.value === form.format).size;
            dim =
                form.orientation === 'landscape'
                    ? dim
                    : [...dim].reverse();
            const widthPaper = dim[0];
            const heightPaper = dim[1];
            const mapSizeForPrint = this._setMapSizForPrint(widthPaper, heightPaper, form.resolution);
            const [width, height] = mapSizeForPrint;
            // Save current resolution to restore it later
            this._initialViewResolution = this._view.getResolution();
            const pixelsPerMapMillimeter = form.resolution / 25.4;
            const scaleResolution = form.scale /
                getPointResolution(this._view.getProjection(), pixelsPerMapMillimeter, this._view.getCenter());
            this._renderCompleteKey = this._map.once('rendercomplete', () => {
                domtoimage
                    .toJpeg(this._mapTarget.querySelector('.ol-unselectable.ol-layers'), {
                    width,
                    height
                })
                    .then(async (dataUrl) => {
                    if (this._isCanceled)
                        return;
                    this._pdf = new Pdf({
                        view: this._view,
                        i18n: this._i18n,
                        config: this._options,
                        form: form,
                        height: heightPaper,
                        width: widthPaper,
                        scaleResolution
                    });
                    this._pdf.addMapImage(dataUrl);
                    await this._pdf.addMapHelpers();
                    if (this._isCanceled)
                        return;
                    await this._pdf.savePdf();
                    // Reset original map size
                    this._onEndPrint();
                    if (showLoading)
                        this._disableLoading();
                })
                    .catch((err) => {
                    const message = typeof err === 'string' ? err : this._i18n.error;
                    console.error(err);
                    this._onEndPrint();
                    this._processingModal.show(message);
                });
            });
            // Set print size
            this._mapTarget.style.width = width + 'px';
            this._mapTarget.style.height = height + 'px';
            this._map.updateSize();
            this._map.getView().setResolution(scaleResolution);
        }, delay);
    }
    /**
     * @protected
     */
    _cancel() {
        if (this._renderCompleteKey) {
            unByKey(this._renderCompleteKey);
        }
        this._isCanceled = true;
    }
    /**
     * Show the Settings Modal
     * @public
     */
    showPrintSettingsModal() {
        if (!this._initialized)
            this._init();
        this._settingsModal.show();
    }
    /**
     * Hide the Settings Modal
     * @public
     */
    hidePrintSettingsModal() {
        this._settingsModal.hide();
    }
    /**
     * Create PDF programatically without displaying the Settings Modal
     * @param options
     * @public
     */
    createPdf(options, showLoading) {
        options = {};
        this._printMap(Object.assign({ format: (this._options.paperSizes.find((p) => p.selected) ||
                this._options.paperSizes[0]).value, resolution: (this._options.dpi.find((p) => p.selected) ||
                this._options.dpi[0]).value, orientation: 'landscape', compass: true, attributions: true, scalebar: true, scale: 1000, typeExport: 'pdf' }, options), showLoading);
    }
}

export { PdfPrinter as default };
//# sourceMappingURL=ol-pdf-printer.js.map
