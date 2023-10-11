import Map from 'ol/Map';
import View from 'ol/View.js';
import { getPointResolution } from 'ol/proj.js';
import { AttributionLike } from 'ol/source/Source';

import { jsPDF, TextOptionsLight } from 'jspdf';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';

import {
    I18n,
    Options,
    IPrintOptions,
    IWatermark,
    IExtraInfo
} from '../ol-pdf-printer';
import Legends from './MapElements/Legends';

import myPragma from '../myPragma';

/**
 * @private
 */
export default class Pdf {
    protected _pdf: IPdf;
    protected _view: View;
    protected _map: Map;
    protected _scaleDenominator: number;
    protected _legends: Legends;
    protected _form: IPrintOptions;
    protected _style: Options['style'];
    protected _i18n: I18n;
    protected _printingMargins: IMargins;
    protected _accumulativeOffsetBottomLeft = 0;

    protected _config: Options;

    constructor(params: IPdfOptions) {
        const { map, form, i18n, config, height, width, scaleResolution } =
            params;

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
        } else {
            this._printingMargins = {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            };
        }

        this._pdf = this.create(
            this._form.orientation,
            this._form.format,
            height,
            width
        );

        this._scaleDenominator = this._calculateScaleDenominator(
            this._form.resolution,
            scaleResolution
        );

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
    create(
        orientation: IPrintOptions['orientation'],
        format: IPrintOptions['format'],
        height: number,
        width: number
    ): IPdf {
        // UMD support
        const _jsPDF =
            (window as IWindow & typeof globalThis).jspdf?.jsPDF || jsPDF;

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
    addMapImage(dataUrl: string): void {
        this._pdf.doc.addImage(
            dataUrl,
            'JPEG',
            this._printingMargins.left, // Add margins
            this._printingMargins.top,
            this._pdf.width -
                (this._printingMargins.left + this._printingMargins.right),
            this._pdf.height -
                (this._printingMargins.top + this._printingMargins.bottom)
        );
    }

    /**
     *
     * @protected
     */
    addMapHelpers = async (): Promise<void> => {
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

        if (this._form.safeMargins) this._fllWhite();
    };

    /**
     * @protected
     */
    savePdf(): Promise<void> {
        const downloadURI = (uri: string, name: string): void => {
            const link = <a download={name} href={uri}></a>;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        return new Promise((resolve, reject) => {
            if (this._form.typeExport === 'pdf') {
                this._pdf.doc.save(this._config.filename + '.pdf');
                resolve();
            } else {
                const pdf = this._pdf.doc.output('dataurlstring');

                // UMD support
                const versionPdfJS =
                    (window as IWindow & typeof globalThis)?.pdfjsLib
                        ?.version || version;

                GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${versionPdfJS}/pdf.worker.js`;

                getDocument(pdf).promise.then(
                    (pdf) => {
                        pdf.getPage(1).then((page) => {
                            // transform DPI correctly
                            const scale = (this._form.resolution / 100) * 1.39;

                            const viewport = page.getViewport({ scale });

                            // Prepare canvas
                            const canvas = <canvas />;
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
                                downloadURI(
                                    canvas.toDataURL(
                                        `image/${this._form.typeExport}`
                                    ),
                                    this._config.filename +
                                        `.${this._form.typeExport}`
                                );
                                canvas.remove();
                                resolve();
                            });
                        });
                    },
                    (error: Error) => {
                        reject(error);
                        console.log(error);
                    }
                );
            }
        });
    }

    /**
     * Add white rectangles to hide elements outside the map
     */
    protected _fllWhite(): void {
        this._pdf.doc.setFillColor('#ffffff');
        this._pdf.doc.rect(
            0,
            0,
            this._printingMargins.left,
            this._pdf.height,
            'F'
        );
        this._pdf.doc.rect(
            this._pdf.width - this._printingMargins.right,
            0,
            this._printingMargins.right,
            this._pdf.height,
            'F'
        );
        this._pdf.doc.rect(
            0,
            0,
            this._pdf.width,
            this._printingMargins.top,
            'F'
        );
        this._pdf.doc.rect(
            0,
            this._pdf.height - this._printingMargins.bottom,
            this._pdf.width,
            this._printingMargins.bottom,
            'F'
        );
    }

    /**
     * Convert an SVGElement to an PNG string
     * @param svg
     * @returns
     */
    _processSvgImage = (svg: SVGElement): Promise<string> => {
        // https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser#answer-58142441
        return new Promise((resolve, reject) => {
            const svgToPng = (svg: SVGElement, callback) => {
                const url = getSvgUrl(svg);
                svgUrlToPng(url, (imgData: string) => {
                    callback(imgData);
                    URL.revokeObjectURL(url);
                });
            };

            const getSvgUrl = (svg: SVGElement) => {
                const data = new XMLSerializer().serializeToString(svg);
                return URL.createObjectURL(
                    new Blob([data], { type: 'image/svg+xml' })
                );
            };

            const svgUrlToPng = (svgUrl: string, callback) => {
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
                    } catch (err) {
                        return reject(err);
                    }
                };
                svgImage.src = svgUrl;
            };

            svgToPng(svg, (imgData: string) => {
                resolve(imgData);
            });
        });
    };

    /**
     * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
     * @protected
     */
    _calculateScaleDenominator(
        resolution: number,
        scaleResolution: number
    ): number {
        const pixelsPerMapMillimeter = resolution / 25.4;
        return Math.round(
            1000 *
                pixelsPerMapMillimeter *
                this._getMeterPerPixel(scaleResolution)
        );
    }

    /**
     * @protected
     */
    _getMeterPerPixel(scaleResolution: number): number {
        const proj = this._view.getProjection();
        return (
            getPointResolution(proj, scaleResolution, this._view.getCenter()) *
            proj.getMetersPerUnit()
        );
    }

    /**
     *
     * @param position
     * @param offset
     * @param size
     * @returns
     * @protected
     */
    _calculateOffsetByPosition = (
        position: string,
        offset: { x: number; y: number },
        size = 0
    ): { x: number; y: number } => {
        let x: number, y: number;

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
    _addRoundedBox = (
        x: number,
        y: number,
        width: number,
        height: number,
        bkcolor: string,
        brcolor: string
    ): void => {
        const rounding = 1;

        this._pdf.doc.setDrawColor(brcolor);
        this._pdf.doc.setFillColor(bkcolor);

        this._pdf.doc.roundedRect(
            x,
            y,
            width,
            height,
            rounding,
            rounding,
            'FD'
        );
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
    _addText = (
        x: number,
        y: number,
        fontSize: number,
        color: string,
        align: TextOptionsLight['align'] = 'left',
        str: string
    ): void => {
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
    _addTextByOffset = (
        position: string,
        offset: { x: number; y: number },
        width: number,
        fontSize: number,
        color: string,
        align: TextOptionsLight['align'],
        str: string
    ): void => {
        const { x, y } = this._calculateOffsetByPosition(position, offset);
        const fixX = align === 'center' ? x - width / 2 : x;
        this._addText(fixX, y, fontSize, color, align, str);
    };

    /**
     * @protected
     */
    _addDescription = (): void => {
        const str = this._form.description.trim();
        const position = 'topleft';
        const offset = {
            x: -0.7,
            y:
                this._config.extraInfo &&
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

        this._addRoundedBox(
            x,
            y,
            w + paddingBack * 2,
            h + paddingBack * 2,
            this._style.description.bkcolor,
            this._style.description.brcolor
        );

        this._pdf.doc.text(str, x + paddingBack, y + paddingBack * 2, {
            align: 'left',
            maxWidth
        });
    };

    /**
     * This function is a mess
     * @returns
     * @protected
     */
    _addWatermark = async (watermark: IWatermark): Promise<void> => {
        const getImageElement = async (
            image: string | SVGElement
        ): Promise<HTMLImageElement> => {
            let imgData: string;

            if (typeof image === 'string') {
                imgData = image;
            } else if (image instanceof SVGElement) {
                imgData = await this._processSvgImage(image);
            } else {
                throw this._i18n.errorImage;
            }

            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    try {
                        resolve(image);
                    } catch (err) {
                        return reject(err);
                    }
                };
                image.onerror = () => {
                    return reject(this._i18n.errorImage);
                };
                image.src = imgData;
            });
        };

        let logoImage: HTMLImageElement;

        const position = 'topright';
        const offset = { x: 2, y: 2 };
        const fontSize = 14;

        const logoSizeHeight = 12;
        let logoSizeWidth: number;

        const fontSizeSubtitle = fontSize / 1.8;

        let back = false;

        const { x, y } = this._calculateOffsetByPosition(position, offset);

        const paddingBack = 2;

        let marginRight = 0;

        let backBoxHeight = paddingBack * 2;

        let titleYPosition = y + paddingBack + 1.5;

        let subtitleYPosition = y + paddingBack;

        let logoSpace = 0;

        if (watermark.logo) {
            if (watermark.logo instanceof Image) {
                logoImage = watermark.logo;
            } else {
                logoImage = await getImageElement(watermark.logo);
            }

            const aspectRatio = logoImage.width / logoImage.height;

            logoSizeWidth = logoSizeHeight * aspectRatio;

            // space between text and logo
            logoSpace = 3;

            marginRight = logoSizeWidth + logoSpace;

            backBoxHeight += 14;

            if (watermark.title) {
                titleYPosition += 4;
                subtitleYPosition += 2;
            }

            if (watermark.subtitle) {
                subtitleYPosition += 5;
                titleYPosition -= 2;
            }
        } else {
            if (watermark.title) {
                backBoxHeight += 5;
                subtitleYPosition += 5;
            }

            if (watermark.subtitle) {
                backBoxHeight += 3;
            }

            if (watermark.title && watermark.subtitle) {
                backBoxHeight += 1;
            }
        }

        if (watermark.title) {
            this._pdf.doc.setTextColor(this._style.watermark.txcolortitle);
            this._pdf.doc.setFontSize(fontSize);
            this._pdf.doc.setFont('helvetica', 'bold');

            let { w } = this._pdf.doc.getTextDimensions(watermark.title);

            if (watermark.subtitle) {
                this._pdf.doc.setFontSize(fontSizeSubtitle);
                this._pdf.doc.setFont('helvetica', 'normal');
                const wSub = this._pdf.doc.getTextDimensions(
                    watermark.subtitle
                ).w;
                w = wSub > w ? wSub : w;
                this._pdf.doc.setFontSize(fontSize);
            }

            // Adaptable width, fixed height
            const widthBack = w + paddingBack * 2;

            this._addRoundedBox(
                x - widthBack + 2 - marginRight,
                y - 4,
                widthBack + paddingBack + marginRight + logoSpace,
                backBoxHeight,
                this._style.watermark.bkcolor,
                this._style.watermark.brcolor
            );
            back = true;
            this._pdf.doc.setFont('helvetica', 'bold');
            this._pdf.doc.text(
                watermark.title,
                x - marginRight,
                titleYPosition,
                {
                    align: 'right'
                }
            );
        }

        if (watermark.subtitle) {
            this._pdf.doc.setTextColor(this._style.watermark.txcolorsubtitle);
            this._pdf.doc.setFontSize(fontSizeSubtitle);
            this._pdf.doc.setFont('helvetica', 'normal');

            // only subtitle, no title
            if (!back) {
                const { w } = this._pdf.doc.getTextDimensions(
                    watermark.subtitle
                );
                const widthBack = paddingBack * 2 + w;
                this._addRoundedBox(
                    x - widthBack + 2 - marginRight,
                    y - 4,
                    widthBack + paddingBack + marginRight,
                    backBoxHeight,
                    this._style.watermark.bkcolor,
                    this._style.watermark.brcolor
                );
                back = true;
            }

            this._pdf.doc.text(
                watermark.subtitle,
                x - marginRight,
                subtitleYPosition,
                {
                    align: 'right'
                }
            );
        }

        if (!watermark.logo) return;

        if (!back) {
            const widthBack = marginRight + paddingBack;
            this._addRoundedBox(
                x,
                y - 4,
                widthBack,
                16,
                this._style.watermark.bkcolor,
                this._style.watermark.brcolor
            );
        }

        this._pdf.doc.addImage(
            logoImage,
            'PNG',
            x - logoSizeWidth,
            y,
            logoSizeWidth,
            logoSizeHeight
        );
    };

    /**
     * Info displayed at the bottom of the map
     * @protected
     */
    protected _addExtraInfo = (extraInfo: IExtraInfo): void => {
        if (extraInfo.url && this._form.url) {
            this._addUrl();
        }

        if (
            (extraInfo.specs && this._form.specs) ||
            (extraInfo.date && this._form.date)
        ) {
            this._addSpecsAndDate();
        }
    };

    /**
     * @protected
     */
    protected _addSpecsAndDate = (): void => {
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

        if (
            this._form.specs &&
            this._config.extraInfo &&
            this._config.extraInfo.specs
        ) {
            const scale = `${
                this._i18n.scale
            } 1:${this._scaleDenominator.toLocaleString('de')}`;
            const paper = `${
                this._i18n.paper
            } ${this._form.format.toUpperCase()}`;
            const dpi = `${this._form.resolution} DPI`;
            const specs = [scale, dpi, paper];
            str = specs.join(' - ');
        }

        if (
            this._form.date &&
            this._config.extraInfo &&
            this._config.extraInfo.date
        ) {
            const date = this._getDate();

            if (str) {
                str += ` (${date})`;
            } else {
                str = date;
            }
        }

        const { w, h } = this._pdf.doc.getTextDimensions(str, { fontSize });

        const paddingBack = 2;

        this._addRoundedBox(
            x - paddingBack * 2,
            y - h - paddingBack * 2,
            w + paddingBack * 3,
            h + paddingBack * 3,
            this._style.specs.bkcolor,
            this._style.specs.brcolor
        );

        this._addTextByOffset(
            position,
            offset,
            w,
            fontSize,
            txcolor,
            align,
            str
        );
    };

    /**
     * @protected
     */
    protected _addUrl = (): void => {
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

        this._addRoundedBox(
            x - paddingBack * 2,
            y - h - 1,
            w + paddingBack * 3,
            h + paddingBack * 3,
            this._style.url.bkcolor,
            this._style.url.brcolor
        );

        this._addTextByOffset(
            position,
            offset,
            width,
            fontSize,
            txcolor,
            align,
            str
        );

        this._accumulativeOffsetBottomLeft = offset.y + h + 1;
    };

    /**
     * @protected
     */
    protected _getDate = (): string => {
        return String(
            new Date(Date.now()).toLocaleDateString(this._config.dateFormat)
        );
    };

    /**
     * The attributions are obtained from the Control in the DOM.
     * @protected
     */
    protected _addAttributions = (): void => {
        const createNode = (content: string): HTMLElement => {
            return <span>{content}</span>;
        };

        const attributions: string[] = this._map
            .getLayers()
            .getArray()
            .flatMap((l) => {
                if ('getSource' in l && typeof l.getSource === 'function') {
                    const attr = l
                        .getSource()
                        .getAttributions() as AttributionLike;
                    if (attr) {
                        if (typeof attr === 'function') {
                            try {
                                return attr(null);
                            } catch (err) {
                                console.error(err);
                            }
                        }
                        return attr as string | string[];
                    }
                }
                return [];
            });

        if (!attributions.length) return;

        // remove duplicates and create nodes
        const attributionsList = [...new Set(attributions)].map((a) => {
            return createNode(a);
        });

        const ATTRI_SEPATATOR = ' · ';

        const position = 'bottomright';
        const offset = { x: 1, y: 1 };
        const fontSize = 7;

        this._pdf.doc.setFont('helvetica', 'normal');
        this._pdf.doc.setFontSize(fontSize);
        const { x, y } = this._calculateOffsetByPosition(position, offset);

        let xPos = x;

        const attributionsText = attributionsList
            .map((a) => a.textContent)
            .join(ATTRI_SEPATATOR);

        const { w, h } = this._pdf.doc.getTextDimensions(attributionsText, {
            fontSize
        });

        const paddingBack = 4;

        const whiteSpaceWidth = this._pdf.doc.getTextDimensions(
            ATTRI_SEPATATOR,
            { fontSize }
        ).w;

        this._addRoundedBox(
            x - w - 2,
            y - h,
            w + paddingBack + 2,
            h + paddingBack,
            this._style.attributions.bkcolor,
            this._style.attributions.brcolor
        );

        Array.from(attributionsList)
            .reverse()
            .forEach((attribution, index) => {
                Array.from(attribution.childNodes)
                    .reverse()
                    .forEach((node) => {
                        const content = node.textContent;

                        if ('href' in node) {
                            this._pdf.doc.setTextColor(
                                this._style.attributions.txcolorlink
                            );
                            this._pdf.doc.textWithLink(content, xPos, y, {
                                align: 'right',
                                url: (node as HTMLAnchorElement).href
                            });
                        } else {
                            this._pdf.doc.setTextColor(
                                this._style.attributions.txcolor
                            );
                            this._pdf.doc.text(content, xPos, y, {
                                align: 'right'
                            });
                        }

                        const { w } = this._pdf.doc.getTextDimensions(content);
                        xPos -= w;
                    });

                // Excldue last element
                if (index !== attributionsList.length - 1) {
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
    protected _addScaleBar = (): void => {
        const offset = {
            x: -0.7,
            y:
                this._config.extraInfo &&
                ((this._form.url && this._config.extraInfo.url) ||
                    (this._form.specs && this._config.extraInfo.specs))
                    ? this._accumulativeOffsetBottomLeft + 12
                    : 12
        };

        const position = 'bottomleft';

        const { x, y } = this._calculateOffsetByPosition(
            position,
            offset
        );

        const maxWidth = 90; // in mm

        // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10#Polyfill
        const log10 =
            Math.log10 || // more precise, but unsupported by IE
            function (x) {
                return Math.log(x) * Math.LOG10E;
            };

        let maxLength = maxWidth * this._scaleDenominator;

        let unit: string;
        let unitConversionFactor: number;

        if (this._config.units === 'metric') {
            unit = 'mm';

            const millimetre = 1;
            const metre = 1000;
            const kilometre = metre * 1000;

            unitConversionFactor = millimetre;

            if (maxLength >= kilometre * 10) {
                unit = 'km';
                unitConversionFactor = 1e6;
            } else if (maxLength >= metre * 10) {
                unit = 'm';
                unitConversionFactor = metre;
            }
        } else if (this._config.units === 'imperial') {
            const inch = 25.4; // Millimetre to inch
            const mile = inch * 63360;
            const yard = inch * 36;

            unit = 'in';
            unitConversionFactor = inch;

            if (maxLength >= mile * 10) {
                unit = 'mi';
                unitConversionFactor = mile;
            } else if (maxLength >= yard * 10) {
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
        } else if (mapped > 4) {
            length = 4 * factor;
        } else if (mapped > 2) {
            length = 2 * factor;
        } else {
            length = factor;
        }

        let size = (length * unitConversionFactor) / this._scaleDenominator / 4;

        const percentageMargin = this._form.safeMargins
            ? ((this._printingMargins.left + this._printingMargins.right) /
                  this._pdf.width) *
              100
            : null;

        // Reduce length acording to margins
        size = percentageMargin
            ? (size / 100) * (100 - percentageMargin)
            : size;

        const fullSize = size * 4;

        // to give the outer white box 4mm padding
        const scaleBarX = x + 4;
        const scaleBarY = y + 5; // 5, a little more, to make space for the numbers above

        // draw outer box
        this._addRoundedBox(
            x,
            y,
            fullSize + 8,
            10,
            this._style.scalebar.bkcolor,
            this._style.scalebar.brcolor
        );

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
        this._pdf.doc.text(
            String(Math.round((length * 10) / 4) / 10),
            scaleBarX + size - 1,
            scaleBarY - 1
        );
        this._pdf.doc.text(
            String(Math.round(length / 2)),
            scaleBarX + size * 2 - 2,
            scaleBarY - 1
        );
        this._pdf.doc.text(
            Math.round(length).toString() + ' ' + unit,
            scaleBarX + size * 4 - 4,
            scaleBarY - 1
        );

        this._accumulativeOffsetBottomLeft = offset.y;
    };

    /**
     *
     * @param imgSrc
     * @returns
     * @protected
     */
    protected _addCompass = async (
        imgSrc: HTMLImageElement | string | SVGElement
    ): Promise<void> => {
        const position = 'bottomright';
        const offset = { x: 2, y: 6 };
        const size = 6;
        const rotationRadians = this._view.getRotation();
        const imageSize = 100;

        const { x, y } = this._calculateOffsetByPosition(
            position,
            offset,
            size
        );

        const addRotation = (image: CanvasImageSource) => {
            const canvas = document.createElement('canvas');

            // Must be bigger than the image to prevent clipping
            canvas.height = 120;
            canvas.width = 120;
            const context = canvas.getContext('2d');

            context.translate(canvas.width * 0.5, canvas.height * 0.5);
            context.rotate(rotationRadians);
            context.translate(-canvas.width * 0.5, -canvas.height * 0.5);
            context.drawImage(
                image,
                (canvas.height - imageSize) / 2,
                (canvas.width - imageSize) / 2,
                imageSize,
                imageSize
            );

            // Add back circle
            const xCircle = x - size;
            const yCircle = y;
            this._pdf.doc.setDrawColor(this._style.compass.brcolor);
            this._pdf.doc.setFillColor(this._style.compass.bkcolor);
            this._pdf.doc.circle(xCircle, yCircle, size, 'FD');

            return canvas;
        };

        const addImage = (image: CanvasImageSource): void => {
            const rotatedCanvas = addRotation(image);

            const sizeImage = size * 1.5;
            const xImage = x - sizeImage - size / 4.3;
            const yImage = y - sizeImage / 2;

            this._pdf.doc.addImage(
                rotatedCanvas,
                'PNG',
                xImage,
                yImage,
                sizeImage,
                sizeImage
            );
        };

        let image: HTMLImageElement;

        if (imgSrc instanceof Image) {
            addImage(image);
            return;
        } else {
            let imgData: string;

            if (typeof imgSrc === 'string') {
                imgData = imgSrc;
            } else if (imgSrc instanceof SVGElement) {
                imgData = await this._processSvgImage(imgSrc);
            } else {
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

    protected async _addLegends() {
        const position = 'bottomleft';

        const offset = {
            x: 1,
            y: this._accumulativeOffsetBottomLeft + 3
        };

        const { x, y } = this._calculateOffsetByPosition(position, offset);

        let yPos = y;

        const images: HTMLImageElement[] = await this._legends.getImages(
            this._form.resolution * 1.5,
            this._style.legends.txcolor,
            this._style.legends.bkcolor
        );

        if (!images.length) {
            return;
        }

        const ratioSize = 1 / (this._form.resolution / 15);

        const largestWidth =
            Math.max(...images.map((i) => i.naturalWidth)) * ratioSize;
        const accumulativeHeight = images.reduce(
            (acc, curr) => acc + curr.naturalHeight * ratioSize,
            0
        );

        const paddingBack = 1;

        this._addRoundedBox(
            x - paddingBack * 3,
            y - accumulativeHeight - paddingBack,
            largestWidth + paddingBack * 2 * 3,
            accumulativeHeight + paddingBack * 2,
            this._style.legends.bkcolor,
            this._style.legends.brcolor
        );

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
 * **_[interface]_**
 * @protected
 */
interface IMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

/**
 * **_[interface]_**
 * @protected
 */
interface IWindow extends Window {
    jspdf: any;
    pdfjsLib: any;
}

/**
 * **_[interface]_**
 * @protected
 */
export interface IPdf {
    doc: jsPDF;
    width: number;
    height: number;
}

interface IPdfOptions {
    map: Map;
    form: IPrintOptions;
    i18n: I18n;
    config: Options;
    height: number;
    width: number;
    scaleResolution: number;
}
