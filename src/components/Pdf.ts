import { TextOptionsLight } from 'jspdf';
import { View } from 'ol';
import { getPointResolution } from 'ol/proj';
import { I18n, Options, IPrintOptions, IWatermark } from 'src/ol-pdf-printer';
import { jsPDF } from 'jspdf';

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

        this._pdf = this.createPdf(
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
    createPdf(
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
    savePdf(): void {
        this._pdf.doc.save(this._config.filename + '.pdf');
    }

    /**
     *   Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
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
        offset,
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
    ) => {
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
        offset,
        width: number,
        fontSize: number,
        color: string,
        align: TextOptionsLight['align'],
        str: string
    ) => {
        let { x, y } = this._calculateOffsetByPosition(position, offset);
        x = align === 'center' ? x - width / 2 : x;
        this._addText(x, y, width, fontSize, color, align, str);
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
    _addWatermark = (watermark: IWatermark): Promise<void> => {
        return new Promise((resolve, reject) => {
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

            if (!watermark.logo) return resolve();

            const addImage = (image) => {
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
                resolve();
            } else {
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
                image.src = watermark.logo;
            }
        });
    };

    /**
     * @protected
     */
    _addDate = () => {
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
        const str = new Date(Date.now()).toLocaleDateString();
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
            y: -5
        };
        const fontSize = 7;
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
            x: this._pdf.width / 2 + this._style.paperMargin,
            y: -5
        };
        const fontSize = 7;
        const txcolor = '#000000';
        const align = 'center';

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
     * @protected
     */
    _addAttributions = (): void => {
        const position = 'bottomright';
        const offset = { x: 1, y: 1 };
        const fontSize = 7;
        const maxWidth = 400;

        this._pdf.doc.setFont('helvetica', 'normal');

        const attArr = [];
        const attributions = document.querySelectorAll('.ol-attribution li');
        attributions.forEach((attribution) => {
            attArr.push(attribution.textContent);
        });

        const str = attArr.join(' | ');

        const { x, y } = this._calculateOffsetByPosition(position, offset);

        this._pdf.doc.setTextColor('#666666');
        this._pdf.doc.setFontSize(fontSize);

        const { w, h } = this._pdf.doc.getTextDimensions(str, {
            maxWidth: maxWidth
        });

        const paddingBack = 4;

        this._addRoundedBox(
            x - w - 2,
            y - 3,
            w + paddingBack,
            h + paddingBack,
            '#ffffff',
            '#ffffff'
        );

        this._pdf.doc.text(str, x, y, {
            align: 'right',
            maxWidth: maxWidth
        });
    };

    /**
     * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
     * @protected
     */
    _addScaleBar = (): void => {
        const position = 'bottomleft';

        const offset = { x: 2, y: 2 };

        const maxWidth = 100; // in mm

        // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10#Polyfill
        const log10 =
            Math.log10 || // more precise, but unsupported by IE
            function (x) {
                return Math.log(x) * Math.LOG10E;
            };

        let maxLength = maxWidth * this._scaleDenominator;

        let unit = 'mm';
        let unitConversionFactor = 1;
        if (maxLength >= 1e7) {
            // >= 10 km
            unit = 'km';
            unitConversionFactor = 1e6;
        } else if (maxLength >= 1e4) {
            // >= 10 m
            unit = 'm';
            unitConversionFactor = 1e3;
        }

        maxLength /= unitConversionFactor;

        const porcentageMargin = this._pdf.width / this._style.paperMargin;

        const unroundedLength = maxLength;
        const numberOfDigits = Math.floor(log10(unroundedLength));
        const factor = Math.pow(10, numberOfDigits);
        const mapped = unroundedLength / factor / porcentageMargin;

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

        const size =
            (length * unitConversionFactor) / this._scaleDenominator / 4;
        const fullSize = size * 4;

        // x/y defaults to offset for topleft corner (normal x/y coordinates)
        let x = offset.x + this._style.paperMargin;
        let y = offset.y + this._style.paperMargin;

        // if position is on the right, x needs to be calculate with pdf width and
        // the size of the element
        if (['topright', 'bottomright'].indexOf(position) !== -1) {
            x =
                this._pdf.width -
                offset.x -
                fullSize -
                8 -
                this._style.paperMargin * 2;
        }
        if (['bottomright', 'bottomleft'].indexOf(position) !== -1) {
            y = this._pdf.height - offset.y - 10 - this._style.paperMargin;
        }

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
    _addCompass = (imgSrc: HTMLImageElement | string): Promise<void> => {
        return new Promise((resolve, reject) => {
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

            if (imgSrc instanceof Image) {
                addImage(imgSrc);
                resolve();
            } else if (typeof imgSrc === 'string') {
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

                image.src = imgSrc;
            }
        });
    };
}

/**
 * **_[interface]_**
 * @protected
 */
interface IWindow extends Window {
    jspdf: any;
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
