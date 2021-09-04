import View from 'ol/View';
import { getPointResolution } from 'ol/proj';
import { I18n, Options, IPrintOptions, IWatermark } from 'src/ol-pdf-printer';
import { jsPDF, TextOptionsLight } from 'jspdf';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';
import myPragma from '../myPragma';

/**
 * @private
 */
export default class Pdf {
    protected _pdf: IPdf;
    protected _view: View;
    protected _scaleDenominator: number;
    protected _form: IPrintOptions;
    protected _style: Options['style'];
    protected _i18n: I18n;

    protected _config: Options;

    constructor(params: IPdfOptions) {
        const { view, form, i18n, config, height, width, scaleResolution } =
            params;

        this._view = view;
        this._form = form;
        this._i18n = i18n;
        this._config = config;

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
            this._config.style.paperMargin, // Add margins
            this._config.style.paperMargin,
            this._pdf.width - this._config.style.paperMargin * 2,
            this._pdf.height - this._config.style.paperMargin * 2
        );
    }

    /**
     *
     * @protected
     */
    addMapHelpers = async (): Promise<void> => {
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
                            const scale = 2;

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
                return URL.createObjectURL(
                    new Blob([svg.outerHTML], { type: 'image/svg+xml' })
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
                        const imgData = canvas.toDataURL('image/png');
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
        width: number,
        fontSize: number,
        color: string,
        align: TextOptionsLight['align'] = 'left',
        str: string
    ): void => {
        this._pdf.doc.setTextColor(color);
        this._pdf.doc.setFontSize(fontSize);

        this._pdf.doc.text(str, x, y, {
            align: align,
            maxWidth: width
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
        this._addText(fixX, y, width, fontSize, color, align, str);
    };

    /**
     * @protected
     */
    _addDescription = (): void => {
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

        this._addRoundedBox(
            x,
            y,
            w + paddingBack * 2,
            h + paddingBack,
            this._style.bkcolor,
            this._style.brcolor
        );

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
    _addWatermark = async (watermark: IWatermark): Promise<void> => {
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
                const wSub = this._pdf.doc.getTextDimensions(
                    watermark.subtitle
                ).w;
                w = wSub - 4 > w ? wSub : w + 4; // weird fix needed
                this._pdf.doc.setFontSize(fontSize);
            } else {
                w += 4;
            }

            // Adaptable width, fixed height
            const height = 16;
            const widthBack = w + paddingBack;

            this._addRoundedBox(
                x - widthBack + 4 - acumulativeWidth,
                y - 4,
                widthBack + acumulativeWidth,
                height,
                '#ffffff',
                '#ffffff'
            );
            back = true;

            this._pdf.doc.text(
                watermark.title,
                x,
                y + paddingBack + 3 + (!watermark.subtitle ? 2 : 0),
                {
                    align: 'right'
                }
            );

            acumulativeWidth += w;
        }

        if (watermark.subtitle) {
            this._pdf.doc.setTextColor(watermark.subtitleColor);
            this._pdf.doc.setFontSize(fontSizeSubtitle);
            this._pdf.doc.setFont('helvetica', 'normal');

            if (!back) {
                const { w } = this._pdf.doc.getTextDimensions(
                    watermark.subtitle
                );
                const widthBack = paddingBack * 2 + w;
                this._addRoundedBox(
                    x - widthBack + 3 - acumulativeWidth,
                    y - 4,
                    widthBack + acumulativeWidth,
                    16,
                    '#ffffff',
                    '#ffffff'
                );
                acumulativeWidth += widthBack;
                back = true;
            }

            const marginTop = watermark.title ? fontSize / 2 : 4;

            this._pdf.doc.text(
                watermark.subtitle,
                x,
                y + paddingBack + marginTop,
                {
                    align: 'right'
                }
            );
        }

        if (!watermark.logo) return;

        const addImage = (image: HTMLImageElement): void => {
            this._pdf.doc.addImage(
                image,
                'PNG',
                x - acumulativeWidth + paddingBack * 2 - 1,
                y - 1,
                imageSize,
                imageSize
            );
        };

        if (!back) {
            const widthBack = acumulativeWidth + paddingBack;
            this._addRoundedBox(
                x - widthBack + 4,
                y - 4,
                widthBack,
                16,
                '#ffffff',
                '#ffffff'
            );
        }

        if (watermark.logo instanceof Image) {
            addImage(watermark.logo);
            return;
        } else {
            let imgData: string;

            if (typeof watermark.logo === 'string') {
                imgData = watermark.logo;
            } else if (watermark.logo instanceof SVGElement) {
                imgData = await this._processSvgImage(watermark.logo);
            } else {
                throw this._i18n.errorImage;
            }

            return new Promise((resolve, reject) => {
                const image = new Image(imageSize, imageSize);
                image.onload = () => {
                    try {
                        addImage(image);
                        resolve();
                    } catch (err) {
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
    _addDate = (): void => {
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
        const str = new Date(Date.now()).toLocaleDateString(
            this._config.dateFormat
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
    };

    /**
     * @protected
     */
    _addUrl = (): void => {
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
        this._addTextByOffset(
            position,
            offset,
            width,
            fontSize,
            txcolor,
            align,
            str
        );
    };
    /**
     * @protected
     */
    _addSpecs = (): void => {
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

        const scale = `${
            this._i18n.scale
        } 1:${this._scaleDenominator.toLocaleString('de')}`;
        const paper = `${this._i18n.paper} ${this._form.format.toUpperCase()}`;
        const dpi = `${this._form.resolution} DPI`;

        const specs = [scale, dpi, paper];
        const str = specs.join(' - ');

        const { w } = this._pdf.doc.getTextDimensions(str);

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
     * The attributions are obtained from the Control in the DOM.
     * @protected
     */
    _addAttributions = (): void => {
        const attributionsUl = document.querySelector('.ol-attribution ul');

        if (!attributionsUl) return;

        const ATTRI_SEPATATOR = ' · ';

        const position = 'bottomright';
        const offset = { x: 1, y: 1 };
        const fontSize = 7;

        this._pdf.doc.setFont('helvetica', 'normal');
        this._pdf.doc.setFontSize(fontSize);
        const { x, y } = this._calculateOffsetByPosition(position, offset);

        let xPos = x;

        const { w, h } = this._pdf.doc.getTextDimensions(
            attributionsUl.textContent
        );

        const paddingBack = 4;

        const whiteSpaceWidth =
            this._pdf.doc.getTextDimensions(ATTRI_SEPATATOR).w;

        const attributions = document.querySelectorAll('.ol-attribution li');

        const sumWhiteSpaceWidth = whiteSpaceWidth * (attributions.length - 1);

        this._addRoundedBox(
            x - w - sumWhiteSpaceWidth - 2,
            y - h,
            w + paddingBack + sumWhiteSpaceWidth + 2,
            h + paddingBack,
            '#ffffff',
            '#ffffff'
        );

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
                                url: (node as HTMLAnchorElement).href
                            });
                        } else {
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
    _addScaleBar = (): void => {
        const offset = { x: 2, y: 2 };

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
        this._addRoundedBox(
            x,
            y,
            fullSize + 8,
            10,
            this._style.bkcolor,
            this._style.brcolor
        );

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
    };

    /**
     *
     * @param imgSrc
     * @returns
     * @protected
     */
    _addCompass = async (
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
            this._pdf.doc.setDrawColor(this._style.brcolor);
            this._pdf.doc.setFillColor(this._style.bkcolor);
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
    view: View;
    form: IPrintOptions;
    i18n: I18n;
    config: Options;
    height: number;
    width: number;
    scaleResolution: number;
}
