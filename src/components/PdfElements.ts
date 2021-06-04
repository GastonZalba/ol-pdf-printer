import { TextOptionsLight } from 'jspdf';
import { View } from 'ol';
import { I18n, Options, Pdf } from 'src/ol-pdf-printer';

/**
 * @private
 */
class ElementsPDF {
    protected _pdf: Pdf;
    protected _scaleDenominator: number;
    protected _form;
    protected _style;
    protected _view: View;
    protected _i18n: I18n;
    protected _watermark: Options['watermark'];

    /**
     *
     * @param view
     * @param pdf
     * @param form
     * @param scaleDenominator
     * @param options
     * @param i18n
     * @protected
     */
    addElementsToPDF = async (
        view: View,
        pdf: Pdf,
        form,
        scaleDenominator: number,
        options: Options,
        i18n: I18n
    ) => {
        this._view = view;
        this._pdf = pdf;
        this._form = form;
        this._scaleDenominator = scaleDenominator;
        this._i18n = i18n;

        const { mapElements, extraInfo, style, watermark } = options;

        this._style = style;
        this._watermark = watermark;

        if (watermark) {
            await this.addWatermark();
        }

        if (mapElements.compass && this._form.compass) {
            await this.addCompass(mapElements.compass);
        }

        if (mapElements.description && this._form.description) {
            this.addDescription();
        }

        if (mapElements.scalebar && this._form.scalebar) {
            this.addScaleBar();
        }

        if (mapElements.attributions && this._form.attributions) {
            this.addAttributions();
        }

        // Bottom info
        if (extraInfo.url) {
            this.addUrl();
        }

        if (extraInfo.date) {
            this.addDate();
        }

        if (extraInfo.scale) {
            this.addScale();
        }
    };

    /**
     *
     * @param position
     * @param offset
     * @param size
     * @returns
     * @protected
     */
    calculateOffsetByPosition = (
        position: string,
        offset,
        size = 0
    ): { x: number; y: number } => {
        let x: number, y: number;

        switch (position) {
            case 'topleft':
                x = offset.x + this._style.margin;
                y = offset.y + this._style.margin + size;
                break;

            case 'topright':
                x = this._pdf.width - offset.x - this._style.margin;
                y = offset.y + this._style.margin + size;
                break;

            case 'bottomright':
                x = this._pdf.width - offset.x - this._style.margin;
                y = this._pdf.height - offset.y - this._style.margin - size;
                break;

            case 'bottomleft':
                y = this._pdf.height - offset.y - this._style.margin - size;
                x = offset.x + this._style.margin;
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
    addRoundedBox = (
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
    addText = (
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
    addTextByOffset = (
        position: string,
        offset,
        width: number,
        fontSize: number,
        color: string,
        align: TextOptionsLight['align'],
        str: string
    ) => {
        const { x, y } = this.calculateOffsetByPosition(position, offset);
        this.addText(x, y, width, fontSize, color, align, str);
    };

    /**
     * @protected
     */
    addDescription = (): void => {
        const str = this._form.description;
        const position = 'topleft';
        const offset = { x: 2, y: 2 };
        const fontSize = 8;
        const maxWidth = 50;

        const paddingBack = 4;

        const { x, y } = this.calculateOffsetByPosition(position, offset);

        this._pdf.doc.setTextColor(this._style.txcolor);
        this._pdf.doc.setFontSize(fontSize);

        const { w, h } = this._pdf.doc.getTextDimensions(str, {
            maxWidth: maxWidth
        });

        this.addRoundedBox(
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
    addWatermark = (): Promise<void> => {
        const watermark = this._watermark;
        const position = 'topright';
        const offset = { x: 0, y: 0 };
        const fontSize = 14;

        return new Promise((resolve, reject) => {
            const imageSize = 12;
            const fontSizeSubtitle = fontSize / 1.8;
            let back = false;

            const { x, y } = this.calculateOffsetByPosition(position, offset);

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

                this.addRoundedBox(
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
                    this.addRoundedBox(
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

            if (watermark.logo) {
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
                    this.addRoundedBox(
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
                    image.crossOrigin = 'Anonymous';
                    image.onload = () => {
                        try {
                            addImage(image);
                        } catch (err) {
                            return reject(err);
                        }
                        resolve();
                    };
                    image.onerror = () => {
                        return reject(this._i18n.errorImage);
                    };
                    image.src = watermark.logo;
                }
            } else {
                resolve();
            }
        });
    };

    /**
     * @protected
     */
    addDate = () => {
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
        this.addTextByOffset(
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
    addUrl = (): void => {
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
        this.addTextByOffset(
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
    addScale = (): void => {
        const position = 'bottomleft';
        const width = 250;
        const offset = {
            x: this._pdf.width / 2,
            y: -5
        };
        const fontSize = 7;
        const txcolor = '#000000';
        const align = 'center';

        this._pdf.doc.setFont('helvetica', 'bold');

        const str = `${
            this._i18n.scale
        } 1:${this._scaleDenominator.toLocaleString('de')} - ${
            this._i18n.paper
        } ${this._form.format.toUpperCase()}`;

        this.addTextByOffset(
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
    addAttributions = (): void => {
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

        const { x, y } = this.calculateOffsetByPosition(position, offset);

        this._pdf.doc.setTextColor('#666666');
        this._pdf.doc.setFontSize(fontSize);

        const { w, h } = this._pdf.doc.getTextDimensions(str, {
            maxWidth: maxWidth
        });

        const paddingBack = 4;

        this.addRoundedBox(
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
    addScaleBar = (): void => {
        const position = 'bottomleft';

        const offset = { x: 2, y: 2 };

        // hardcode maximal width for now
        const maxWidth = 100 + this._style.margin * 2; // in mm

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

        const porcentageMargin = this._pdf.width / this._style.margin;

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
        let x = offset.x + this._style.margin;
        let y = offset.y + this._style.margin;

        // if position is on the right, x needs to be calculate with pdf width and
        // the size of the element
        if (['topright', 'bottomright'].indexOf(position) !== -1) {
            x =
                this._pdf.width -
                offset.x -
                fullSize -
                8 -
                this._style.margin * 2;
        }
        if (['bottomright', 'bottomleft'].indexOf(position) !== -1) {
            y = this._pdf.height - offset.y - 10 - this._style.margin;
        }

        // to give the outer white box 4mm padding
        const scaleBarX = x + 4;
        const scaleBarY = y + 5; // 5 because above the scalebar will be the numbers

        // draw outer box
        this.addRoundedBox(
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
    addCompass = (imgSrc: HTMLImageElement | string): Promise<void> => {
        const position = 'bottomright';
        const offset = { x: 2, y: 6 };
        const size = 6;
        const rotationRadians = this._view.getRotation();

        return new Promise((resolve, reject) => {
            const imageSize = 100;

            const { x, y } = this.calculateOffsetByPosition(
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

export const { addElementsToPDF } = new ElementsPDF();
