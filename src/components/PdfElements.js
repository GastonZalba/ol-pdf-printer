class ElementsPDF {
    _pdf;
    _printMargin;
    _scaleDenominator;
    _form;
    _style;

    addElementsToPDF = async (view, pdf, form, scaleDenominator, options) => {
        this._view = view;
        this._pdf = pdf;
        this._form = form;
        this._scaleDenominator = scaleDenominator;

        const { mapElements, extraInfo, style, watermark } = options;

        this._style = style;

        // Defaults
        const offset = { x: 2, y: 2 };

        const centerX = this._pdf.width / 2;

        if (mapElements.compass && this._form.compass) {
            await this.addCompass(
                mapElements.compass,
                'bottomright',
                { x: 2, y: 6 },
                6,
                this._view.getRotation()
            );
        }

        if (mapElements.description && this._form.description) {
            this.addTextWithBack(
                this._form.description,
                'topleft',
                offset,
                8,
                50
            );
        }

        if (watermark) {
            await this.addWatermark(watermark, 'topright', { x: 0, y: 0 }, 14);
        }

        if (mapElements.scalebar && this._form.scalebar) {
            this.addScaleBar('bottomleft', offset);
        }

        if (mapElements.attributions && this._form.attributions) {
            this.addAttributions(
                'bottomright',
                250,
                { x: 2, y: 2 },
                7,
                '#ffffff',
                'right'
            );
        }

        // Bottom info
        if (extraInfo.url) {
            this.addUrl(
                'bottomleft',
                250,
                {
                    x: 0,
                    y: -5
                },
                7,
                '#000000'
            );
        }

        if (extraInfo.date) {
            this.addDate(
                'bottomright',
                250,
                {
                    x: 0,
                    y: -5
                },
                7,
                '#000000',
                'right'
            );
        }

        if (extraInfo.scale) {
            this.addScale(
                'bottomleft',
                250,
                {
                    x: centerX,
                    y: -5
                },
                7,
                '#000000',
                'center'
            );
        }
    };

    calculateOffsetByPosition = (position, offset, size = 0) => {
        let x, y;

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

    addRoundedBox = (x, y, width, height, bkcolor, brcolor) => {
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

    addText = (x, y, width, fontSize, color, align = 'left', str) => {
        this._pdf.doc.setTextColor(color);
        this._pdf.doc.setFontSize(fontSize);

        this._pdf.doc.text(str, x, y, {
            align: align,
            maxWidth: width
        });
    };

    addTextByOffset = (
        position,
        offset,
        width,
        fontSize,
        color,
        align,
        str
    ) => {
        const { x, y } = this.calculateOffsetByPosition(position, offset);
        this.addText(x, y, width, fontSize, color, align, str);
    };

    addTextWithBack = (
        str,
        position,
        offset,
        fontSize,
        txcolor,
        bkcolor,
        brcolor,
        maxWidth,
        align
    ) => {
        const paddingBack = 4;

        const { x, y } = this.calculateOffsetByPosition(position, offset);

        this._pdf.doc.setTextColor(txcolor);
        this._pdf.doc.setFontSize(fontSize);

        const { w, h } = this._pdf.doc.getTextDimensions(str, {
            maxWidth: maxWidth
        });

        this.addRoundedBox(
            x,
            y,
            w + paddingBack * 2,
            h + paddingBack,
            bkcolor,
            brcolor
        );

        this._pdf.doc.text(str, x + paddingBack, y + paddingBack + 1, {
            align: align,
            maxWidth: maxWidth
        });
    };

    /**
     * This functions is a mess
     * @param {object} watermark
     * @param {string} position
     * @param {object} offset
     * @param {number} fontSize
     * @returns
     */
    addWatermark = (watermark, position, offset, fontSize) => {
        return new Promise((resolve) => {
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
                    image.onload = () => {
                        addImage(image);
                        resolve();
                    };
                    image.src = watermark.logo;
                }
            } else {
                resolve();
            }
        });
    };

    addDate = (position, width, offset, fontSize, txcolor, align) => {
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

    addUrl = (position, width, offset, fontSize, txcolor, align) => {
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

    addScale = (position, width, offset, fontSize, txcolor, align) => {
        this._pdf.doc.setFont('helvetica', 'bold');
        const str = `Escala 1:${this._scaleDenominator.toLocaleString(
            'de'
        )} - Hoja ${this._form.format.toUpperCase()}`;
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

    addAttributions = (position, width, offset, fontSize, txcolor, align) => {
        this._pdf.doc.setFont('helvetica', 'normal');
        const attArr = [];
        const attributions = document.querySelectorAll('.ol-attribution li');
        attributions.forEach((attribution) => {
            attArr.push(attribution.textContent);
        });

        const str = attArr.join(' | ');

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

    // Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
    addScaleBar = (position, offset) => {
        // scaleDenominator is the x in 1:x of the map scale

        // hardcode maximal width for now
        const maxWidth = 80 + this._style.margin * 2; // in mm

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
        this._pdf.doc.text(scaleBarX, scaleBarY - 1, '0');
        // /4 and could give 2.5. We still round, because of floating point arith
        this._pdf.doc.text(
            scaleBarX + size - 1,
            scaleBarY - 1,
            (Math.round((length * 10) / 4) / 10).toString()
        );
        this._pdf.doc.text(
            scaleBarX + size * 2 - 2,
            scaleBarY - 1,
            Math.round(length / 2).toString()
        );
        this._pdf.doc.text(
            scaleBarX + size * 4 - 4,
            scaleBarY - 1,
            Math.round(length).toString() + ' ' + unit
        );
    };

    addCompass = (imgSrc, position, offset, size, rotationRadians) => {
        return new Promise((resolve) => {
            const imageSize = 100;

            const { x, y } = this.calculateOffsetByPosition(
                position,
                offset,
                size
            );

            const addRotation = (image) => {
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

            const addImage = (image) => {
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
            } else {
                const image = new Image(imageSize, imageSize);

                image.onload = () => {
                    addImage(image);
                    resolve();
                };

                image.src = imgSrc;
            }
        });
    };
}

export const { addElementsToPDF } = new ElementsPDF();
