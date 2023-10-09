/*!
 * ol-pdf-printer - v2.0.2
 * https://github.com/GastonZalba/ol-pdf-printer#readme
 * Built: Mon Oct 09 2023 11:44:39 GMT-0300 (hora estándar de Argentina)
*/
import Control from 'ol/control/Control.js';
import { getPointResolution } from 'ol/proj.js';
import { unByKey } from 'ol/Observable.js';
import Cluster from 'ol/source/Cluster.js';
import VectorLayer from 'ol/layer/Vector.js';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';
import { version, GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import { appendParams } from 'ol/uri.js';
import { METERS_PER_UNIT } from 'ol/proj/Units.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import TileLayer from 'ol/layer/Tile.js';
import ImageLayer from 'ol/layer/Image.js';
import TileWMS from 'ol/source/TileWMS.js';
import Modal from 'modal-vanilla';
import Polygon from 'ol/geom/Polygon';
import Overlay from 'ol/Overlay';

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
 *
 * @param layer
 * @returns
 */
const isWmsLayer = (layer) => {
    return ((layer instanceof ImageLayer || layer instanceof TileLayer) &&
        (layer.getSource() instanceof TileWMS ||
            layer.getSource() instanceof ImageWMS));
};

const legendsDefaultConfig = {
    legendOptions: {
        fontAntiAliasing: 'true',
        fontColor: '0x333333',
        bgColor: '0xffffff',
        forceLabels: 'on',
        forceTitles: 'on'
    },
    requestParams: {},
    order: true
};
class Legends {
    constructor(options, map) {
        this._legendOptions = {};
        this._requestParams = {};
        this._map = map;
        this._view = map.getView();
        this._legendOptions = legendsDefaultConfig.legendOptions;
        this._requestParams = legendsDefaultConfig.requestParams;
        this._order = legendsDefaultConfig.order;
        if (typeof options === 'object') {
            const { legendOptions, requestParams, order } = options;
            this._legendOptions = Object.assign(Object.assign({}, this._legendOptions), (legendOptions || {}));
            this._requestParams = Object.assign(Object.assign({}, this._requestParams), (requestParams || {}));
            this._order = typeof order !== 'undefined' ? order : this._order;
        }
    }
    async getImages(dpi, txcolor, bkcolor) {
        const images = [];
        const wmsLayers = this.getWmsLegendLayers();
        this._legendOptions = Object.assign(Object.assign({}, this._legendOptions), { dpi, fontColor: '0x' + txcolor.replace('#', ''), bgColor: '0x' + bkcolor.replace('#', '') });
        for (const wmsLayer of wmsLayers) {
            const image = await this._getLegends(wmsLayer);
            if (image) {
                images.push(image);
            }
        }
        if (this._order) {
            return this._orderImagesByIndex(images);
        }
        return images;
    }
    /**
     *
     * @returns
     */
    getWmsLegendLayers() {
        return this._map
            .getLayers()
            .getArray()
            .filter((layer) => isWmsLayer(layer) && layer.getVisible());
    }
    getMapProjection() {
        return this._view.getProjection();
    }
    getViewExtent() {
        return this._view.calculateExtent(this._map.getSize());
    }
    async _getLegends(layer) {
        return new Promise((resolve) => {
            const srcs = this._getSrcFromParams(layer);
            if (!srcs) {
                return resolve(null);
            }
            srcs.forEach((src) => {
                const img = new Image();
                // to enable reorder
                img.dataset.index = String(layer.getZIndex());
                img.onerror = () => {
                    resolve(null);
                };
                img.onload = () => {
                    // discard empty images
                    if (img.naturalHeight <= 1) {
                        resolve(null);
                    }
                    else {
                        resolve(img);
                    }
                };
                img.src = src;
            });
        });
    }
    /**
     *
     * @param layer
     * @param inline
     * @returns
     */
    _getSrcFromParams(layer) {
        const sourceParams = layer.getSource().getParams();
        const proj = this.getMapProjection().getCode();
        const legend_options = Object.assign({ fontColor: '0x000000', fontAntiAliasing: true, bgColor: '0xffffff', forceLabels: 'on', forceTitles: 'on', fontSize: 8 }, this._legendOptions);
        const params = Object.assign({ SERVICE: 'WMS', VERSION: '1.1.0', REQUEST: 'GetLegendGraphic', FORMAT: 'image/png', LEGEND_OPTIONS: Object.entries(legend_options)
                .map((a) => `${a[0]}:${a[1]}`)
                .join(';'), STYLE: sourceParams.STYLES, CQL_FILTER: sourceParams.CQL_FILTER, SLD_BODY: sourceParams.SLD_BODY, SLD: sourceParams.SLD, ENV: sourceParams.ENV, SRS: proj, SRCWIDTH: this._map.getSize()[0], SRCHEIGHT: this._map.getSize()[1], SCALE: this._getScale() }, this._requestParams
        // bug showing empty spaces betweeen labels
        //TRANSPARENT: true
        );
        const layersName = sourceParams.LAYERS;
        const layerNames = !Array.isArray(layersName)
            ? layersName.split(',')
            : layersName;
        return [
            this._getLegendUrl(layer.getSource(), Object.assign(Object.assign({}, params), { LAYER: layerNames[0] }))
        ];
    }
    /**
     *
     * @param source
     * @param params
     * @returns
     */
    _getLegendUrl(source, params) {
        const url = 'getUrls' in source
            ? source.getUrls()[0]
            : 'getUrl' in source
                ? source.getUrl()
                : undefined;
        if (!url)
            return undefined;
        return appendParams(url, params);
    }
    /**
     *
     */
    _orderImagesByIndex(images) {
        const t = Array.from(images).sort((x, y) => {
            const xIndex = Number(x.dataset.index);
            const yIndex = Number(y.dataset.index);
            if (xIndex > yIndex)
                return -1;
            if (xIndex < yIndex)
                return 1;
            return 0;
        });
        return t.reverse();
    }
    /**
     *
     * @returns
     */
    _getScale() {
        const resolution = this._view.getResolution();
        const mpu = this.getMapProjection()
            ? this.getMapProjection().getMetersPerUnit()
            : 1;
        const pixelSize = 0.00028;
        return (resolution * mpu) / pixelSize;
    }
}

function createElement(tagName, attrs = {}, ...children) {
    if (typeof tagName === 'function')
        return tagName(attrs, children);
    const elem = tagName === null
        ? new DocumentFragment()
        : document.createElement(tagName);
    Object.entries(attrs || {}).forEach(([name, value]) => {
        if (typeof value !== 'undefined' &&
            value !== null &&
            value !== undefined) {
            if (name.startsWith('on') && name.toLowerCase() in window)
                elem.addEventListener(name.toLowerCase().substr(2), value);
            else {
                if (name === 'className')
                    elem.setAttribute('class', value.toString());
                else if (name === 'htmlFor')
                    elem.setAttribute('for', value.toString());
                else
                    elem.setAttribute(name, value.toString());
            }
        }
    });
    for (const child of children) {
        if (!child)
            continue;
        if (Array.isArray(child))
            elem.append(...child);
        else {
            if (child.nodeType === undefined)
                elem.innerHTML += child;
            else
                elem.appendChild(child);
        }
    }
    return elem;
}

/**
 * @private
 */
class Pdf {
    constructor(params) {
        this._accumulativeOffsetBottomLeft = 0;
        /**
         *
         * @protected
         */
        this.addMapHelpers = async () => {
            const { mapElements, extraInfo, description, watermark } = this._config;
            if (watermark) {
                await this._addWatermark(watermark);
            }
            if (description && this._form.description) {
                this._addDescription();
            }
            if (extraInfo) {
                this._addExtraInfo(extraInfo);
            }
            if (mapElements) {
                if (mapElements.compass && this._form.compass) {
                    await this._addCompass(mapElements.compass);
                }
                if (mapElements.scalebar && this._form.scalebar) {
                    this._addScaleBar();
                }
                if (mapElements.attributions && this._form.attributions) {
                    this._addAttributions();
                }
                if (mapElements.legends && this._form.legends) {
                    await this._addLegends();
                }
            }
            if (this._form.safeMargins)
                this._fllWhite();
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
                    const data = new XMLSerializer().serializeToString(svg);
                    return URL.createObjectURL(new Blob([data], { type: 'image/svg+xml' }));
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
                            const imgData = canvas
                                .toDataURL('image/png')
                                .replace('image/png', 'octet/stream');
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
                    x = offset.x + this._printingMargins.left;
                    y = offset.y + this._printingMargins.top + size;
                    break;
                case 'topright':
                    x = this._pdf.width - offset.x - this._printingMargins.left;
                    y = offset.y + this._printingMargins.top + size;
                    break;
                case 'bottomright':
                    x = this._pdf.width - offset.x - this._printingMargins.left;
                    y =
                        this._pdf.height -
                            offset.y -
                            this._printingMargins.bottom -
                            size;
                    break;
                case 'bottomleft':
                    y =
                        this._pdf.height -
                            offset.y -
                            this._printingMargins.bottom -
                            size;
                    x = offset.x + this._printingMargins.left;
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
        this._addText = (x, y, fontSize, color, align = 'left', str) => {
            this._pdf.doc.setTextColor(color);
            this._pdf.doc.setFontSize(fontSize);
            this._pdf.doc.text(str, x, y, {
                align
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
            this._addText(fixX, y, fontSize, color, align, str);
        };
        /**
         * @protected
         */
        this._addDescription = () => {
            const str = this._form.description.trim();
            const position = 'topleft';
            const offset = {
                x: -0.7,
                y: this._config.extraInfo &&
                    ((this._config.extraInfo.date && this._form.date) ||
                        (this._config.extraInfo.specs && this._form.specs))
                    ? 10
                    : 2
            };
            const fontSize = 8;
            const maxWidth = 50;
            const paddingBack = 2;
            const { x, y } = this._calculateOffsetByPosition(position, offset);
            this._pdf.doc.setTextColor(this._style.description.txcolor);
            this._pdf.doc.setFontSize(fontSize);
            const { w, h } = this._pdf.doc.getTextDimensions(str, {
                maxWidth,
                fontSize
            });
            this._addRoundedBox(x, y, w + paddingBack * 2, h + paddingBack * 2, this._style.description.bkcolor, this._style.description.brcolor);
            this._pdf.doc.text(str, x + paddingBack, y + paddingBack * 2, {
                align: 'left',
                maxWidth
            });
        };
        /**
         * This functions is a mess
         * @returns
         * @protected
         */
        this._addWatermark = async (watermark) => {
            const position = 'topright';
            const offset = { x: 2, y: 0 };
            const fontSize = 14;
            const imageSize = 12;
            const fontSizeSubtitle = fontSize / 1.8;
            let back = false;
            const { x, y } = this._calculateOffsetByPosition(position, offset);
            const paddingBack = 2;
            let acumulativeWidth = watermark.logo ? imageSize + 0.5 : 0;
            if (watermark.title) {
                this._pdf.doc.setTextColor(this._style.watermark.txcolortitle);
                this._pdf.doc.setFontSize(fontSize);
                this._pdf.doc.setFont('helvetica', 'bold');
                // This function works bad
                let { w } = this._pdf.doc.getTextDimensions(watermark.title);
                if (watermark.subtitle) {
                    this._pdf.doc.setFontSize(fontSizeSubtitle);
                    const wSub = this._pdf.doc.getTextDimensions(watermark.subtitle).w;
                    w = wSub - 4 > w ? wSub + paddingBack : w + 4; // weird fix needed
                    this._pdf.doc.setFontSize(fontSize);
                }
                else {
                    w += 4;
                }
                // Adaptable width, fixed height
                const height = 16;
                const widthBack = w + paddingBack;
                this._addRoundedBox(x - widthBack + 4 - acumulativeWidth, y - 4, widthBack + acumulativeWidth, height, this._style.watermark.bkcolor, this._style.watermark.brcolor);
                back = true;
                this._pdf.doc.text(watermark.title, x, y + paddingBack + 3 + (!watermark.subtitle ? 2 : 0), {
                    align: 'right'
                });
                acumulativeWidth += w;
            }
            if (watermark.subtitle) {
                this._pdf.doc.setTextColor(this._style.watermark.txcolorsubtitle);
                this._pdf.doc.setFontSize(fontSizeSubtitle);
                this._pdf.doc.setFont('helvetica', 'normal');
                if (!back) {
                    const { w } = this._pdf.doc.getTextDimensions(watermark.subtitle);
                    const widthBack = paddingBack * 2 + w;
                    this._addRoundedBox(x - widthBack + 3 - acumulativeWidth, y - 4, widthBack + acumulativeWidth, 16, this._style.watermark.bkcolor, '#ffffff');
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
                this._addRoundedBox(x - widthBack + 4, y - 4, widthBack, 16, this._style.watermark.bkcolor, '#ffffff');
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
         * Info displayed at the bottom of the map
         * @protected
         */
        this._addExtraInfo = (extraInfo) => {
            if (extraInfo.url && this._form.url) {
                this._addUrl();
            }
            if ((extraInfo.specs && this._form.specs) ||
                (extraInfo.date && this._form.date)) {
                this._addSpecsAndDate();
            }
        };
        /**
         * @protected
         */
        this._addSpecsAndDate = () => {
            const position = 'topleft';
            const offset = {
                x: 1,
                y: 2.5
            };
            const fontSize = 6;
            const txcolor = this._style.specs.txcolor;
            const align = 'left';
            const { x, y } = this._calculateOffsetByPosition(position, offset);
            this._pdf.doc.setFont('helvetica', 'bold');
            this._pdf.doc.setFontSize(fontSize);
            let str = '';
            if (this._form.specs &&
                this._config.extraInfo &&
                this._config.extraInfo.specs) {
                const scale = `${this._i18n.scale} 1:${this._scaleDenominator.toLocaleString('de')}`;
                const paper = `${this._i18n.paper} ${this._form.format.toUpperCase()}`;
                const dpi = `${this._form.resolution} DPI`;
                const specs = [scale, dpi, paper];
                str = specs.join(' - ');
            }
            if (this._form.date &&
                this._config.extraInfo &&
                this._config.extraInfo.date) {
                const date = this._getDate();
                if (str) {
                    str += ` (${date})`;
                }
                else {
                    str = date;
                }
            }
            const { w, h } = this._pdf.doc.getTextDimensions(str, { fontSize });
            const paddingBack = 2;
            this._addRoundedBox(x - paddingBack * 2, y - h - paddingBack * 2, w + paddingBack * 3, h + paddingBack * 3, this._style.specs.bkcolor, this._style.specs.brcolor);
            this._addTextByOffset(position, offset, w, fontSize, txcolor, align, str);
        };
        /**
         * @protected
         */
        this._addUrl = () => {
            const position = 'bottomleft';
            const width = 250;
            const offset = {
                x: 1,
                y: 1
            };
            const fontSize = 6;
            const txcolor = this._style.url.txcolor;
            const align = 'left';
            this._pdf.doc.setFont('helvetica', 'italic');
            const str = window.location.href;
            const { x, y } = this._calculateOffsetByPosition(position, offset);
            const { w, h } = this._pdf.doc.getTextDimensions(str, {
                fontSize
            });
            const paddingBack = 2;
            this._addRoundedBox(x - paddingBack * 2, y - h - 1, w + paddingBack * 3, h + paddingBack * 3, this._style.url.bkcolor, this._style.url.brcolor);
            this._addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
            this._accumulativeOffsetBottomLeft = offset.y + h + 1;
        };
        /**
         * @protected
         */
        this._getDate = () => {
            return String(new Date(Date.now()).toLocaleDateString(this._config.dateFormat));
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
            const { w, h } = this._pdf.doc.getTextDimensions(attributionsUl.textContent, { fontSize });
            const paddingBack = 4;
            const whiteSpaceWidth = this._pdf.doc.getTextDimensions(ATTRI_SEPATATOR, { fontSize }).w;
            const attributions = document.querySelectorAll('.ol-attribution li');
            const sumWhiteSpaceWidth = whiteSpaceWidth * (attributions.length - 1);
            this._addRoundedBox(x - w - sumWhiteSpaceWidth - 2, y - h, w + paddingBack + sumWhiteSpaceWidth + 2, h + paddingBack, this._style.attributions.bkcolor, this._style.attributions.brcolor);
            Array.from(attributions)
                .reverse()
                .forEach((attribution, index) => {
                Array.from(attribution.childNodes)
                    .reverse()
                    .forEach((node) => {
                    const content = node.textContent;
                    if ('href' in node) {
                        this._pdf.doc.setTextColor(this._style.attributions.txcolorlink);
                        this._pdf.doc.textWithLink(content, xPos, y, {
                            align: 'right',
                            url: node.href
                        });
                    }
                    else {
                        this._pdf.doc.setTextColor(this._style.attributions.txcolor);
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
            const offset = {
                x: -0.7,
                y: this._config.extraInfo &&
                    ((this._form.url && this._config.extraInfo.url) ||
                        (this._form.specs && this._config.extraInfo.specs))
                    ? this._accumulativeOffsetBottomLeft + 2
                    : 2
            };
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
                ? ((this._printingMargins.left + this._printingMargins.right) /
                    this._pdf.width) *
                    100
                : null;
            // Reduce length acording to margins
            size = percentageMargin
                ? (size / 100) * (100 - percentageMargin)
                : size;
            const fullSize = size * 4;
            // x/y defaults to offset for topleft corner (normal x/y coordinates)
            const x = offset.x + this._printingMargins.left;
            let y = offset.y + this._printingMargins.top;
            y = this._pdf.height - offset.y - 10 - this._printingMargins.bottom;
            // to give the outer white box 4mm padding
            const scaleBarX = x + 4;
            const scaleBarY = y + 5; // 5 because above the scalebar will be the numbers
            const width = fullSize + 8;
            const height = 10;
            // draw outer box
            this._addRoundedBox(x, y, width, 10, this._style.scalebar.bkcolor, this._style.scalebar.brcolor);
            // draw first part of scalebar
            this._pdf.doc.setDrawColor(this._style.scalebar.txcolor);
            this._pdf.doc.setFillColor(this._style.scalebar.txcolor);
            this._pdf.doc.rect(scaleBarX, scaleBarY, size, 1, 'FD');
            // draw second part of scalebar
            this._pdf.doc.setDrawColor(this._style.scalebar.txcolor);
            this._pdf.doc.setFillColor(this._style.scalebar.bkcolor);
            this._pdf.doc.rect(scaleBarX + size, scaleBarY, size, 1, 'FD');
            // draw third part of scalebar
            this._pdf.doc.setDrawColor(this._style.scalebar.txcolor);
            this._pdf.doc.setFillColor(this._style.scalebar.txcolor);
            this._pdf.doc.rect(scaleBarX + size * 2, scaleBarY, size * 2, 1, 'FD');
            // draw numeric labels above scalebar
            this._pdf.doc.setTextColor(this._style.scalebar.txcolor);
            this._pdf.doc.setFontSize(6);
            this._pdf.doc.text('0', scaleBarX, scaleBarY - 1);
            // /4 and could give 2.5. We still round, because of floating point arith
            this._pdf.doc.text(String(Math.round((length * 10) / 4) / 10), scaleBarX + size - 1, scaleBarY - 1);
            this._pdf.doc.text(String(Math.round(length / 2)), scaleBarX + size * 2 - 2, scaleBarY - 1);
            this._pdf.doc.text(Math.round(length).toString() + ' ' + unit, scaleBarX + size * 4 - 4, scaleBarY - 1);
            this._accumulativeOffsetBottomLeft = offset.y + height;
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
                this._pdf.doc.setDrawColor(this._style.compass.brcolor);
                this._pdf.doc.setFillColor(this._style.compass.bkcolor);
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
        const { map, form, i18n, config, height, width, scaleResolution } = params;
        this._map = map;
        this._view = map.getView();
        this._form = form;
        this._i18n = i18n;
        this._config = config;
        this._style = config.style;
        if (this._form.safeMargins) {
            this._printingMargins =
                typeof config.style.paperMargin === 'number'
                    ? {
                        top: config.style.paperMargin,
                        left: config.style.paperMargin,
                        right: config.style.paperMargin,
                        bottom: config.style.paperMargin
                    }
                    : config.style.paperMargin;
        }
        else {
            this._printingMargins = {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            };
        }
        this._pdf = this.create(this._form.orientation, this._form.format, height, width);
        this._scaleDenominator = this._calculateScaleDenominator(this._form.resolution, scaleResolution);
        if (config.mapElements && config.mapElements.legends) {
            this._legends = new Legends(config.mapElements.legends, map);
        }
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
        this._pdf.doc.addImage(dataUrl, 'JPEG', this._printingMargins.left, // Add margins
        this._printingMargins.top, this._pdf.width -
            (this._printingMargins.left + this._printingMargins.right), this._pdf.height -
            (this._printingMargins.top + this._printingMargins.bottom));
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
                        // transform DPI correctly
                        const scale = (this._form.resolution / 100) * 1.39;
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
     * Add white rectangles to hide elements outside the map
     */
    _fllWhite() {
        this._pdf.doc.setFillColor('#ffffff');
        this._pdf.doc.rect(0, 0, this._printingMargins.left, this._pdf.height, 'F');
        this._pdf.doc.rect(this._pdf.width - this._printingMargins.right, 0, this._printingMargins.right, this._pdf.height, 'F');
        this._pdf.doc.rect(0, 0, this._pdf.width, this._printingMargins.top, 'F');
        this._pdf.doc.rect(0, this._pdf.height - this._printingMargins.bottom, this._pdf.width, this._printingMargins.bottom, 'F');
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
    async _addLegends() {
        const position = 'bottomleft';
        const offset = {
            x: 1,
            y: this._accumulativeOffsetBottomLeft + 3
        };
        const { x, y } = this._calculateOffsetByPosition(position, offset);
        let yPos = y;
        const images = await this._legends.getImages(this._form.resolution * 1.5, this._style.legends.txcolor, this._style.legends.bkcolor);
        if (!images.length) {
            return;
        }
        const ratioSize = 1 / (this._form.resolution / 15);
        const largestWidth = Math.max(...images.map((i) => i.naturalWidth)) * ratioSize;
        const accumulativeHeight = images.reduce((acc, curr) => acc + curr.naturalHeight * ratioSize, 0);
        const paddingBack = 1;
        this._addRoundedBox(x - paddingBack * 3, y - accumulativeHeight - paddingBack, largestWidth + paddingBack * 2 * 3, accumulativeHeight + paddingBack * 2, this._style.legends.bkcolor, this._style.legends.brcolor);
        images.forEach((img) => {
            const { naturalWidth, naturalHeight } = img;
            const width = naturalWidth * ratioSize;
            const height = naturalHeight * ratioSize;
            this._pdf.doc.addImage(img, x, yPos - height, width, height);
            yPos -= height;
        });
    }
}

/**
 * @protected
 */
const CLASS_PRINT_MODE = 'printMode';
const CLASS_HIDE_CONTROLS = 'hideControls';

const CLASS_OVERLAY = 'overlay-frame';
const CLASS_OVERLAY_RECTANGLE = CLASS_OVERLAY + '-rectangle';
const CLASS_OVERLAY_CANCEL_BTN = CLASS_OVERLAY + '-cancel-btn';
const CLASS_OVERLAY_SAVE_BTN = CLASS_OVERLAY + '-save-btn';
const CLASS_OVERLAY_REFRAME_HINT = CLASS_OVERLAY + '-reframe-hint';
class ReframeROI {
    constructor(map, i18n) {
        this._removeEvents = () => {
            document.removeEventListener('keydown', this._escapeKeyListener);
        };
        this._map = map;
        this._saveButton = (createElement("button", { type: "button", className: `btn btn-lg btn-primary ${CLASS_OVERLAY_SAVE_BTN}` }, i18n.process));
        this._cancelButton = (createElement("button", { type: "button", className: `btn-close btn-close-white ${CLASS_OVERLAY_CANCEL_BTN}`, onclick: () => this.hideOverlay(), title: i18n.escapeHint },
            createElement("span", { "aria-hidden": "true" }, "\u00D7")));
        this._rectangle = (createElement("div", { className: CLASS_OVERLAY_RECTANGLE },
            this._cancelButton,
            createElement("div", null,
                createElement("div", null, this._saveButton),
                createElement("div", { className: CLASS_OVERLAY_REFRAME_HINT }, i18n.reframeHint))));
    }
    showOverlay(mode, callback) {
        this._map.getTargetElement().classList.add(CLASS_HIDE_CONTROLS);
        this._overlay = new Overlay({
            className: `${CLASS_OVERLAY} ${mode}-mode`,
            element: this._rectangle,
            stopEvent: false
        });
        this._map.addOverlay(this._overlay);
        this._addEvents();
        this._saveButton.onclick = () => {
            callback(this._getExtent());
            setTimeout(() => {
                this.hideOverlay();
            }, 10);
        };
    }
    hideOverlay() {
        if (this._overlay) {
            this._map.removeOverlay(this._overlay);
        }
        this._removeEvents();
        this._map.getTargetElement().classList.remove(CLASS_HIDE_CONTROLS);
    }
    _getExtent() {
        const overlayFrame = this._rectangle.getBoundingClientRect();
        const topLeft = this._map.getCoordinateFromPixel([
            overlayFrame.left,
            overlayFrame.top
        ]);
        const topRight = this._map.getCoordinateFromPixel([
            overlayFrame.left + overlayFrame.width,
            overlayFrame.top
        ]);
        const bottomLeft = this._map.getCoordinateFromPixel([
            overlayFrame.left,
            overlayFrame.top + overlayFrame.height
        ]);
        const bottomRight = this._map.getCoordinateFromPixel([
            overlayFrame.left + overlayFrame.width,
            overlayFrame.top + overlayFrame.height
        ]);
        return new Polygon([[topLeft, topRight, bottomRight, bottomLeft]]);
    }
    _addEvents() {
        const escapeKeyListener = ({ key }) => {
            if (key === 'Escape') {
                this.hideOverlay();
            }
        };
        this._escapeKeyListener = escapeKeyListener.bind(this);
        document.addEventListener('keydown', this._escapeKeyListener);
    }
}

/**
 * @private
 */
class SettingsModal {
    constructor(map, options, i18n, printMap) {
        this._modal = new Modal(Object.assign({ headerClose: true, header: true, animate: true, title: i18n.printPdf, content: this.Content(i18n, options), footer: this.Footer(i18n, options) }, options.modal));
        if (options.allowReframeRegionOfInterest) {
            this._reframeROI = new ReframeROI(map, i18n);
        }
        this._modal.el.classList.add('settingsModal');
        this._modal.on('dismiss', (modal, event) => {
            const print = event.target.dataset.print;
            if (!print)
                return;
            const form = document.getElementById('printMap');
            const formData = new FormData(form);
            const values = {
                format: formData.get('printFormat'),
                orientation: formData.get('printOrientation'),
                resolution: Number(formData.get('printResolution')),
                description: formData.get('printDescription'),
                compass: formData.get('printCompass'),
                attributions: formData.get('printAttributions'),
                scalebar: formData.get('printScalebar'),
                legends: formData.get('printLegends'),
                url: formData.get('printUrl'),
                date: formData.get('printDate'),
                specs: formData.get('printSpecs'),
                safeMargins: formData.get('safeMargins'),
                typeExport: this._modal.el.querySelector('select[name="printTypeExport"]').value
            };
            if (this._reframeROI) {
                const callback = (extent) => {
                    printMap(Object.assign({ regionOfInterest: extent }, values), 
                    /* showLoading */ true, 
                    /* delay */ options.modal.transition);
                };
                this._reframeROI.showOverlay(values.orientation, callback);
            }
            else {
                printMap(values, 
                /* showLoading */ true, 
                /* delay */ options.modal.transition);
            }
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
        const { dpi, mapElements, extraInfo, description, paperSizes } = options;
        return (createElement("form", { id: "printMap" },
            createElement("section", null,
                createElement("div", null,
                    createElement("div", { className: "printField" },
                        createElement("label", { htmlFor: "printFormat" }, i18n.paperSize),
                        createElement("select", { name: "printFormat", id: "printFormat" }, paperSizes.map((paper) => (createElement("option", Object.assign({ value: paper.value }, (paper.selected
                            ? { selected: 'selected' }
                            : {})), paper.value))))),
                    createElement("div", { className: "printField" },
                        createElement("label", { htmlFor: "printOrientation" }, i18n.orientation),
                        createElement("select", { name: "printOrientation", id: "printOrientation" },
                            createElement("option", { value: "landscape", selected: true }, i18n.landscape),
                            createElement("option", { value: "portrait" }, i18n.portrait))),
                    createElement("div", { className: "printField" },
                        createElement("label", { htmlFor: "printResolution" }, i18n.resolution),
                        createElement("select", { name: "printResolution", id: "printResolution" }, dpi.map((d) => (createElement("option", Object.assign({ value: d.value }, (d.selected
                            ? { selected: 'selected' }
                            : {})),
                            d.value,
                            " dpi")))))),
                createElement("div", null, description && (createElement("div", null,
                    createElement("label", { htmlFor: "printDescription" }, i18n.addNote),
                    createElement("textarea", { id: "printDescription", name: "printDescription", rows: "4" }))))),
            mapElements && (createElement("fieldset", { className: "sectionChecks mapElements" },
                createElement("legend", null, i18n.mapElements),
                createElement("div", { className: "sectionChecksList" },
                    mapElements.compass && (createElement("label", { htmlFor: "printCompass" },
                        createElement("input", { type: "checkbox", id: "printCompass", name: "printCompass", checked: true }),
                        i18n.compass)),
                    mapElements.scalebar && (createElement("label", { htmlFor: "printScalebar" },
                        createElement("input", { type: "checkbox", id: "printScalebar", name: "printScalebar", checked: true }),
                        i18n.scale)),
                    mapElements.legends && (createElement("label", { htmlFor: "printLegends" },
                        createElement("input", { type: "checkbox", id: "printLegends", name: "printLegends", checked: true }),
                        i18n.legends)),
                    mapElements.attributions && (createElement("label", { htmlFor: "printAttributions" },
                        createElement("input", { type: "checkbox", id: "printAttributions", name: "printAttributions", checked: true }),
                        i18n.layersAttributions))))),
            extraInfo && (createElement("fieldset", { className: "sectionChecks extraInfo" },
                createElement("legend", null, i18n.extraInfo),
                createElement("div", { className: "sectionChecksList" },
                    extraInfo.url && (createElement("label", { htmlFor: "printUrl" },
                        createElement("input", { type: "checkbox", id: "printUrl", name: "printUrl", checked: true }),
                        i18n.url)),
                    extraInfo.date && (createElement("label", { htmlFor: "printDate" },
                        createElement("input", { type: "checkbox", id: "printDate", name: "printDate", checked: true }),
                        i18n.date)),
                    extraInfo.specs && (createElement("label", { htmlFor: "printSpecs" },
                        createElement("input", { type: "checkbox", id: "printSpecs", name: "printSpecs", checked: true }),
                        i18n.specs))))),
            createElement("div", { className: "safeMarginsSection sectionChecks" },
                createElement("label", { htmlFor: "safeMargins" },
                    createElement("input", { type: "checkbox", id: "safeMargins", name: "safeMargins" }),
                    i18n.printerMargins))));
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
        this._message = document.createElement('div');
        this._loaderContainer = document.createElement('div');
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
        this._modal.el.classList.add('processingModal');
        this._modal.once('shown', () => {
            if (options.loader) {
                this._loaderContainer.className = 'printLoader-container';
                if (typeof options.loader === 'string') {
                    this._loaderContainer.innerHTML = options.loader;
                }
                else {
                    this._loaderContainer.appendChild(options.loader);
                }
            }
            this._modal._html.body.append(this._message);
            this._modal._html.body.append(this._loaderContainer);
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
    _setContentModal(string) {
        this._message.innerHTML = String(string);
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
    show() {
        this._modal.show();
    }
    /**
     *
     * @param string
     * @param footer
     * @protected
     */
    set(string) {
        if (!this._modal._visible)
            return;
        this._setContentModal(string);
    }
    setLoading(bool = true) {
        if (bool) {
            this._modal.el.classList.add('showLoader');
        }
        else {
            this._modal.el.classList.remove('showLoader');
        }
    }
    /**
     * @protected
     */
    hide() {
        this._modal.hide();
    }
}

function compassIcon() {
	return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"compass\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"0 0 300 300\" xml:space=\"preserve\" width=\"50\" height=\"50\">\r\n<style type=\"text/css\">\r\n\t.st0{fill:#d54b4b;}\r\n</style>\r\n<g>\r\n\t<g>\r\n\t\t<g>\r\n\t\t\t<g>\r\n\t\t\t\t<g>\r\n\t\t\t\t\t<path class=\"st0\" d=\"M146.3,9.1L75.5,287.2c-0.5,1.8,0.5,3.7,2.1,4.4c1.8,0.8,3.7,0.2,4.7-1.5l68.4-106.7l66.8,106.7\r\n\t\t\t\t\t\tc0.6,1.1,1.9,1.8,3.2,1.8c0.5,0,1-0.2,1.5-0.3c1.8-0.8,2.6-2.6,2.3-4.4L153.7,9.1C152.9,5.7,147.2,5.7,146.3,9.1z M154.2,174.2\r\n\t\t\t\t\t\tc-0.6-1.1-1.9-1.8-3.2-1.8l0,0c-1.3,0-2.6,0.6-3.2,1.8l-59,92L150,25.5l61.1,239.9L154.2,174.2z\"/>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t\t<g>\r\n\t\t\t\t<g>\r\n\t\t\t\t\t<path class=\"st0\" d=\"M220.8,293.1c-1.8,0-3.4-1-4.2-2.3l-65.8-105.1L83.4,290.8c-1.3,1.9-4,2.9-6.1,1.9c-2.3-1-3.4-3.4-2.9-5.8\r\n\t\t\t\t\t\tL145.1,8.8c0.5-2.1,2.4-3.4,4.9-3.4s4.4,1.3,4.9,3.4l70.8,278.1c0.6,2.4-0.6,4.9-2.9,5.8C222.1,292.9,221.5,293.1,220.8,293.1z\r\n\t\t\t\t\t\t M150.8,181.2l1,1.6l66.8,106.7c0.6,1,1.9,1.5,3.2,1c1.1-0.5,1.8-1.8,1.5-3.1L152.4,9.3c-0.3-1.1-1.6-1.6-2.6-1.6\r\n\t\t\t\t\t\ts-2.3,0.5-2.6,1.6L76.4,287.4c-0.3,1.3,0.3,2.6,1.5,3.1c1.1,0.5,2.6,0,3.2-1L150.8,181.2z M85.6,273.2L150,20.6l64.2,251.9\r\n\t\t\t\t\t\tl-61.1-97.7c-1-1.6-3.4-1.5-4.4,0L85.6,273.2z\"/>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t</g>\r\n\t</g>\r\n</g>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
}

const DEFAULT_LANGUAGE = 'en';
const defaultOptions = (i18n) => ({
    language: DEFAULT_LANGUAGE,
    filename: 'Ol Pdf Printer',
    allowReframeRegionOfInterest: true,
    style: {
        paperMargin: {
            left: 4,
            top: 4,
            right: 4,
            bottom: 4
        },
        watermark: {
            brcolor: '#000000',
            bkcolor: '#ffffff',
            txcolortitle: '#d54b4b',
            txcolorsubtitle: '#444444'
        },
        url: {
            brcolor: '#000000',
            bkcolor: '#ffffff',
            txcolor: '#0077cc'
        },
        specs: {
            brcolor: '#000000',
            bkcolor: '#ffffff',
            txcolor: '#000000'
        },
        scalebar: {
            brcolor: '#000000',
            bkcolor: '#ffffff',
            txcolor: '#000000'
        },
        attributions: {
            brcolor: '#ffffff',
            bkcolor: '#ffffff',
            txcolor: '#666666',
            txcolorlink: '#0077cc'
        },
        legends: {
            brcolor: '#000000',
            bkcolor: '#ffffff',
            txcolor: '#000000'
        },
        description: {
            brcolor: '#333333',
            bkcolor: '#333333',
            txcolor: '#ffffff'
        },
        compass: {
            brcolor: '#000000',
            bkcolor: '#333333'
        }
    },
    extraInfo: {
        date: true,
        url: true,
        specs: true
    },
    description: true,
    mapElements: {
        attributions: true,
        scalebar: true,
        legends: true,
        compass: compassIcon()
    },
    watermark: {
        title: 'Ol Pdf Printer',
        subtitle: 'https://github.com/GastonZalba/ol-pdf-printer',
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
        { value: 96 },
        { value: 150, selected: true },
        { value: 200 },
        { value: 300 }
    ],
    mimeTypeExports: [
        { value: 'pdf', selected: true },
        { value: 'png' },
        { value: 'jpeg' },
        { value: 'webp' }
    ],
    units: UnitsSystem.Metric,
    dateFormat: undefined,
    showControlBtn: true,
    ctrlBtnClass: '',
    loader: '<span class="printLoader"></span>',
    modal: {
        animateClass: 'fade',
        animateInClass: 'show',
        transition: 150,
        backdropTransition: 0,
        templates: {
            dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
            headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${i18n.close}"><span aria-hidden="true">×</span></button>`
        }
    }
});

const es = {
    printPdf: 'Exportar PDF',
    pleaseWait: 'Por favor espere...',
    downloadFinished: 'Descarga completada, procesando...',
    downloadingImages: 'Descargando imágenes',
    error: 'Error al generar pdf',
    errorImage: 'Ocurrió un error al tratar de cargar una imagen',
    printing: 'Exportando',
    cancel: 'Cancelar',
    close: 'Cerrar',
    print: 'Exportar',
    mapElements: 'Elementos en el mapa',
    extraInfo: 'Información adicional',
    url: 'URL',
    date: 'Fecha',
    specs: 'Especificaciones',
    compass: 'Brújula',
    scale: 'Escala',
    legends: 'Leyendas',
    layersAttributions: 'Atribuciones de capas',
    addNote: 'Agregar nota (opcional)',
    resolution: 'Resolución',
    orientation: 'Orientación',
    paperSize: 'Tamaño de página',
    landscape: 'Paisaje',
    portrait: 'Retrato',
    current: 'Actual',
    paper: 'Hoja',
    printerMargins: 'Añadir márgenes de impresión',
    escapeHint: 'Presioná aquí o Escape para cancelar',
    reframeHint: 'Ajustá la región de interés paneando y zoomeando',
    process: 'Procesar'
};

const en = {
    printPdf: 'Print PDF',
    pleaseWait: 'Please wait...',
    downloadFinished: 'Download finished, processing...',
    downloadingImages: 'Downloading images',
    error: 'An error occurred while printing',
    errorImage: 'An error ocurred while loading an image',
    printing: 'Exporting',
    cancel: 'Cancel',
    close: 'Close',
    print: 'Export',
    mapElements: 'Map elements',
    extraInfo: 'Extra information',
    url: 'URL',
    date: 'Date',
    specs: 'Specifications',
    compass: 'Compass',
    scale: 'Scale',
    legends: 'Legends',
    layersAttributions: 'Layer attributions',
    addNote: 'Add note (optional)',
    resolution: 'Resolution',
    orientation: 'Orientation',
    paperSize: 'Paper size',
    landscape: 'Landscape',
    portrait: 'Portrait',
    current: 'Current',
    paper: 'Paper',
    printerMargins: 'Add printer margins',
    escapeHint: 'Press here or Escape to cancel',
    reframeHint: 'Adjust the region of interest panning and zooming',
    process: 'Process'
};

var i18n = /*#__PURE__*/Object.freeze({
    __proto__: null,
    en: en,
    es: es
});

function pdfIcon() {
	return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"0 0 256 256\" style=\"enable-background:new 0 0 256 256;\" xml:space=\"preserve\">\r\n<g id=\"Layer_1\">\r\n</g>\r\n<g id=\"Layer_2\">\r\n\t<g>\r\n\t\t<path d=\"M77.4,175.5H64.1v23.7h13.2c3.7,0,6.7-3,6.7-6.7v-10.2C84.1,178.5,81.1,175.5,77.4,175.5z\"/>\r\n\t\t<path d=\"M222.9,177.6v-31.2h-190v31.2v31.6v32.3c0,7,5.7,12.8,12.8,12.8h164.4c7,0,12.8-5.7,12.8-12.8L222.9,177.6\r\n\t\t\tL222.9,177.6z M94.7,192.4c0,9.6-7.8,17.3-17.3,17.3H64.1v18.2c0,2.9-2.4,5.3-5.3,5.3s-5.3-2.4-5.3-5.3v-23.5v-34.3\r\n\t\t\tc0-2.9,2.4-5.3,5.3-5.3h18.5c9.6,0,17.3,7.8,17.3,17.3V192.4z M147.9,214.7c0,10.2-8.3,18.6-18.6,18.6H112c-2.9,0-5.3-2.4-5.3-5.3\r\n\t\t\tv-57.8c0-2.9,2.4-5.3,5.3-5.3h17.3c10.2,0,18.6,8.3,18.6,18.6V214.7z M196.9,175.5h-25.3v18.3h14.7c2.9,0,5.3,2.4,5.3,5.3\r\n\t\t\ts-2.4,5.3-5.3,5.3h-14.7v23.6c0,2.9-2.4,5.3-5.3,5.3s-5.3-2.4-5.3-5.3v-57.8c0-2.9,2.4-5.3,5.3-5.3h30.6c2.9,0,5.3,2.4,5.3,5.3\r\n\t\t\tS199.8,175.5,196.9,175.5z\"/>\r\n\t\t<path d=\"M129.3,175.5h-12v47.2h12c4.4,0,8-3.6,8-8v-31.2C137.3,179,133.7,175.5,129.3,175.5z\"/>\r\n\t\t<path d=\"M222.9,59c0-3.4-1.3-6.6-3.7-9L174.3,5.1c-2.4-2.4-5.6-3.7-9-3.7H45.6c-7,0-12.8,5.7-12.8,12.8v108.5v18.9\r\n\t\t\th190V59z M164.2,86.3l-34.3,34.3c-0.5,0.5-1.3,0.8-2,0.8s-1.4-0.3-2-0.8L91.6,86.3c-0.8-0.8-1-2-0.6-3.1c0.4-1,1.5-1.7,2.6-1.7\r\n\t\t\tH107V48.4c0-1.6,1.3-2.8,2.8-2.8h36c1.6,0,2.8,1.3,2.8,2.8v33.1h13.5c1.1,0,2.2,0.7,2.6,1.7C165.2,84.3,165,85.5,164.2,86.3z\"/>\r\n\t</g>\r\n</g>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
}

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
/**
 * @constructor
 * @extends {ol/control/Control~Control}
 * @params options
 */
class PdfPrinter extends Control {
    constructor(opt_options) {
        const controlElement = document.createElement('button');
        super({
            target: opt_options.target,
            element: opt_options.showControlBtn === false
                ? document.createElement('div')
                : controlElement
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
        this._options = defaultOptions(this._i18n);
        // Merge options
        this._options = deepObjectAssign(this._options, opt_options);
        if (this._options.showControlBtn) {
            controlElement.className = `ol-print-btn-menu ${this._options.ctrlBtnClass}`;
            controlElement.title = this._i18n.printPdf;
            controlElement.onclick = () => this.showPrintSettingsModal();
            controlElement.append(pdfIcon());
        }
    }
    setMap(map) {
        super.setMap(map);
        if (!this._initialized && map)
            this._init();
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
     * Restore inital view, remove classes, disable loading
     * @protected
     */
    _onEndPrint() {
        this._mapTarget.style.width = '';
        this._mapTarget.style.height = '';
        this._map.updateSize();
        this._view.setResolution(this._initialViewResolution);
        this._view.setCenter(this._initialViewCoords);
        this._view.setConstrainResolution(this._initialConstrain);
        this._mapTarget.classList.remove(CLASS_PRINT_MODE, CLASS_HIDE_CONTROLS);
        this._updateDPI(90);
        this._removeListeners();
        clearTimeout(this._timeoutProcessing);
        this._processingModal.setLoading(false);
        this._cancel();
    }
    /**
     * @protected
     */
    _prepareLoading() {
        this._processingModal.show();
        this._processingModal.setLoading(true);
        this._processingModal.set(this._i18n.pleaseWait);
    }
    /**
     * @protected
     */
    _disableLoading() {
        this._processingModal.hide();
        this._processingModal.setLoading(false);
    }
    /**
     *
     * @param dpi
     * @protected
     */
    _updateDPI(dpi = 90) {
        const pixelRatio = dpi / 90;
        // @ts-expect-error There is no public method to do this
        this._map.pixelRatio_ = pixelRatio;
        this._map.getLayers().forEach((layer) => {
            if (layer.getVisible() &&
                'getSource' in layer &&
                typeof layer.getSource === 'function') {
                const source = layer.getSource();
                // @ts-expect-error There is no public method to do this
                if (source.tilePixelRatio_ !== undefined) {
                    // @ts-expect-error There is no public method to do this
                    source.tilePixelRatio_ = pixelRatio;
                    source.refresh();
                }
                else {
                    if (layer instanceof VectorLayer) {
                        if (source instanceof Cluster) {
                            source.getSource().changed();
                        }
                        else {
                            source.changed();
                        }
                    }
                }
            }
        });
        this._map.updateSize();
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
            this._mapTarget.classList.add(CLASS_PRINT_MODE, CLASS_HIDE_CONTROLS);
        }
        setTimeout(() => {
            if (showLoading) {
                this._prepareLoading();
            }
            this._isCanceled = false;
            this._addDownloadCountListener();
            // Save current resolution to restore it later
            this._initialViewResolution = this._view.getResolution();
            this._initialViewCoords = this._view.getCenter();
            this._initialConstrain = this._view.getConstrainResolution();
            // To allow intermediate zoom levels
            this._view.setConstrainResolution(false);
            let dim = this._options.paperSizes.find((e) => e.value === form.format).size;
            dim =
                form.orientation === 'landscape'
                    ? dim
                    : [...dim].reverse();
            const widthPaper = dim[0];
            const heightPaper = dim[1];
            this._updateDPI(form.resolution);
            const pixelsPerMapMillimeter = form.resolution / 25.4;
            const width = Math.round(widthPaper * pixelsPerMapMillimeter);
            const height = Math.round(heightPaper * pixelsPerMapMillimeter);
            const scale = form.scale && !form.regionOfInterest
                ? form.scale
                : getMapScale(this._map) / 1000;
            const scaleResolution = scale /
                getPointResolution(this._view.getProjection(), pixelsPerMapMillimeter, this._view.getCenter());
            this._renderCompleteKey = this._map.once('rendercomplete', () => {
                this._processingModal.set(this._i18n.downloadFinished);
                domtoimage
                    .toJpeg(this._mapTarget.querySelector('.ol-unselectable.ol-layers'), {
                    width,
                    height
                })
                    .then(async (dataUrl) => {
                    if (this._isCanceled)
                        return;
                    this._pdf = new Pdf({
                        form,
                        scaleResolution,
                        map: this._map,
                        i18n: this._i18n,
                        config: this._options,
                        height: heightPaper,
                        width: widthPaper
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
                    this._processingModal.set(message);
                });
            });
            // Adjust the size of the map target
            this._mapTarget.style.width = width + 'px';
            this._mapTarget.style.height = height + 'px';
            this._map.getView().setResolution(scaleResolution);
            this._map.updateSize();
            if (form.regionOfInterest) {
                this._view.fit(form.regionOfInterest, {
                    size: this._map.getSize(),
                    nearest: false
                });
            }
        }, delay);
    }
    /**
     * Add tile listener to show downloaded images count
     */
    _addDownloadCountListener() {
        this._eventsKey = [];
        this._imageCount = 0;
        this._map
            .getLayers()
            .getArray()
            .forEach((l) => {
            if (isWmsLayer(l)) {
                this._eventsKey.push(l
                    .getSource()
                    .on('tileloadend', () => {
                    this._imageCount = this._imageCount + 1;
                    if (this._imageCount % 10 == 0) {
                        this._processingModal.set(this._i18n.downloadingImages +
                            ': <b>' +
                            this._imageCount +
                            '</b>');
                    }
                }));
            }
        });
    }
    /**
     * Remove WMS listeners
     */
    _removeListeners() {
        unByKey(this._eventsKey);
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
                this._options.dpi[0]).value, orientation: 'landscape', compass: true, attributions: true, scalebar: true, legends: true, regionOfInterest: null, typeExport: 'pdf' }, options), showLoading);
    }
}
/**
 * **_[enum]_**
 */
var UnitsSystem;
(function (UnitsSystem) {
    UnitsSystem["Metric"] = "metric";
    UnitsSystem["Imperial"] = "imperial";
})(UnitsSystem || (UnitsSystem = {}));

export { UnitsSystem, PdfPrinter as default };
//# sourceMappingURL=ol-pdf-printer.js.map
