import { getPointResolution } from 'ol/proj';
import Control from 'ol/control/Control';
import TileWMS from 'ol/source/TileWMS';
import Tile from 'ol/layer/Tile';
import { unByKey } from 'ol/Observable';
import domtoimage from 'dom-to-image-improved';
import { jsPDF } from 'jspdf';
import Modal from 'modal-vanilla';
import { METERS_PER_UNIT } from 'ol/proj/Units';

var __awaiter$1 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/**
 * @private
 */

class Pdf {
  constructor(params) {
    var _this = this;

    /**
     *
     * @protected
     */
    this.addMapHelpers = () => __awaiter$1(this, void 0, void 0, function* () {
      var {
        mapElements,
        extraInfo,
        style,
        watermark
      } = this._config;
      this._style = style;

      if (watermark) {
        yield this._addWatermark(watermark);
      }

      if (mapElements) {
        if (mapElements.compass && this._form.compass) {
          yield this._addCompass(mapElements.compass);
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
    });
    /**
     * Convert an SVGElement to an PNG string
     * @param svg
     * @returns
     */


    this._processSvgImage = svg => {
      // https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser#answer-58142441
      return new Promise((resolve, reject) => {
        var svgToPng = (svg, callback) => {
          var url = getSvgUrl(svg);
          svgUrlToPng(url, imgData => {
            callback(imgData);
            URL.revokeObjectURL(url);
          });
        };

        var getSvgUrl = svg => {
          return URL.createObjectURL(new Blob([svg.outerHTML], {
            type: 'image/svg+xml'
          }));
        };

        var svgUrlToPng = (svgUrl, callback) => {
          var svgImage = document.createElement('img');
          document.body.appendChild(svgImage);

          svgImage.onerror = err => {
            console.error(err);
            return reject(this._i18n.errorImage);
          };

          svgImage.onload = () => {
            try {
              var canvas = document.createElement('canvas');
              canvas.width = svgImage.clientWidth;
              canvas.height = svgImage.clientHeight;
              var canvasCtx = canvas.getContext('2d');
              canvasCtx.drawImage(svgImage, 0, 0);
              var imgData = canvas.toDataURL('image/png');
              callback(imgData);
              document.body.removeChild(svgImage);
            } catch (err) {
              return reject(err);
            }
          };

          svgImage.src = svgUrl;
        };

        svgToPng(svg, imgData => {
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


    this._calculateOffsetByPosition = function (position, offset) {
      var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var x, y;

      switch (position) {
        case 'topleft':
          x = offset.x + _this._style.paperMargin;
          y = offset.y + _this._style.paperMargin + size;
          break;

        case 'topright':
          x = _this._pdf.width - offset.x - _this._style.paperMargin;
          y = offset.y + _this._style.paperMargin + size;
          break;

        case 'bottomright':
          x = _this._pdf.width - offset.x - _this._style.paperMargin;
          y = _this._pdf.height - offset.y - _this._style.paperMargin - size;
          break;

        case 'bottomleft':
          y = _this._pdf.height - offset.y - _this._style.paperMargin - size;
          x = offset.x + _this._style.paperMargin;
          break;
      }

      return {
        x,
        y
      };
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
      var rounding = 1;

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


    this._addText = function (x, y, width, fontSize, color) {
      var align = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'left';
      var str = arguments.length > 6 ? arguments[6] : undefined;

      _this._pdf.doc.setTextColor(color);

      _this._pdf.doc.setFontSize(fontSize);

      _this._pdf.doc.text(str, x, y, {
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


    this._addTextByOffset = (position, offset, width, fontSize, color, align, str) => {
      var {
        x,
        y
      } = this._calculateOffsetByPosition(position, offset);

      x = align === 'center' ? x - width / 2 : x;

      this._addText(x, y, width, fontSize, color, align, str);
    };
    /**
     * @protected
     */


    this._addDescription = () => {
      var str = this._form.description.trim();

      var position = 'topleft';
      var offset = {
        x: 2,
        y: 2
      };
      var fontSize = 8;
      var maxWidth = 50;
      var paddingBack = 4;

      var {
        x,
        y
      } = this._calculateOffsetByPosition(position, offset);

      this._pdf.doc.setTextColor(this._style.txcolor);

      this._pdf.doc.setFontSize(fontSize);

      var {
        w,
        h
      } = this._pdf.doc.getTextDimensions(str, {
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


    this._addWatermark = watermark => {
      return new Promise((resolve, reject) => __awaiter$1(this, void 0, void 0, function* () {
        var position = 'topright';
        var offset = {
          x: 0,
          y: 0
        };
        var fontSize = 14;
        var imageSize = 12;
        var fontSizeSubtitle = fontSize / 1.8;
        var back = false;

        var {
          x,
          y
        } = this._calculateOffsetByPosition(position, offset);

        var paddingBack = 2;
        var acumulativeWidth = watermark.logo ? imageSize + 0.5 : 0;

        if (watermark.title) {
          this._pdf.doc.setTextColor(watermark.titleColor);

          this._pdf.doc.setFontSize(fontSize);

          this._pdf.doc.setFont('helvetica', 'bold'); // This function works bad


          var {
            w
          } = this._pdf.doc.getTextDimensions(watermark.title);

          if (watermark.subtitle) {
            this._pdf.doc.setFontSize(fontSizeSubtitle);

            var wSub = this._pdf.doc.getTextDimensions(watermark.subtitle).w;

            w = wSub - 4 > w ? wSub : w + 4; // weird fix needed

            this._pdf.doc.setFontSize(fontSize);
          } else {
            w += 4;
          } // Adaptable width, fixed height


          var _height = 16;
          var widthBack = w + paddingBack;

          this._addRoundedBox(x - widthBack + 4 - acumulativeWidth, y - 4, widthBack + acumulativeWidth, _height, '#ffffff', '#ffffff');

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
            var {
              w: _w
            } = this._pdf.doc.getTextDimensions(watermark.subtitle);

            var _widthBack = paddingBack * 2 + _w;

            this._addRoundedBox(x - _widthBack + 3 - acumulativeWidth, y - 4, _widthBack + acumulativeWidth, 16, '#ffffff', '#ffffff');

            acumulativeWidth += _widthBack;
            back = true;
          }

          var marginTop = watermark.title ? fontSize / 2 : 4;

          this._pdf.doc.text(watermark.subtitle, x, y + paddingBack + marginTop, {
            align: 'right'
          });
        }

        if (!watermark.logo) return resolve();

        var addImage = image => {
          this._pdf.doc.addImage(image, 'PNG', x - acumulativeWidth + paddingBack * 2 - 1, y - 1, imageSize, imageSize);
        };

        if (!back) {
          var _widthBack2 = acumulativeWidth + paddingBack;

          this._addRoundedBox(x - _widthBack2 + 4, y - 4, _widthBack2, 16, '#ffffff', '#ffffff');
        }

        if (watermark.logo instanceof Image) {
          addImage(watermark.logo);
          resolve();
        } else {
          var imgData;

          if (typeof watermark.logo === 'string') {
            imgData = watermark.logo;
          } else if (watermark.logo instanceof SVGElement) {
            try {
              imgData = yield this._processSvgImage(watermark.logo);
            } catch (err) {
              return reject(err);
            }
          } else {
            throw this._i18n.errorImage;
          }

          var image = new Image(imageSize, imageSize);

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
        }
      }));
    };
    /**
     * @protected
     */


    this._addDate = () => {
      var position = 'bottomright';
      var width = 250;
      var offset = {
        x: 0,
        y: -5
      };
      var fontSize = 7;
      var txcolor = '#000000';
      var align = 'right';

      this._pdf.doc.setFont('helvetica', 'normal');

      var str = new Date(Date.now()).toLocaleDateString(this._config.dateFormat);

      this._addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
    };
    /**
     * @protected
     */


    this._addUrl = () => {
      var position = 'bottomleft';
      var width = 250;
      var offset = {
        x: 0,
        y: -5
      };
      var fontSize = 7;
      var txcolor = '#000000';
      var align = 'left';

      this._pdf.doc.setFont('helvetica', 'italic');

      var str = window.location.href;

      this._addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
    };
    /**
     * @protected
     */


    this._addSpecs = () => {
      var position = 'bottomleft';
      var offset = {
        x: this._pdf.width / 2 + this._style.paperMargin,
        y: -5
      };
      var fontSize = 7;
      var txcolor = '#000000';
      var align = 'center';

      this._pdf.doc.setFont('helvetica', 'bold');

      this._pdf.doc.setFontSize(fontSize);

      var scale = "".concat(this._i18n.scale, " 1:").concat(this._scaleDenominator.toLocaleString('de'));
      var paper = "".concat(this._i18n.paper, " ").concat(this._form.format.toUpperCase());
      var dpi = "".concat(this._form.resolution, " DPI");
      var specs = [scale, dpi, paper];
      var str = specs.join(' - ');

      var {
        w
      } = this._pdf.doc.getTextDimensions(str);

      this._addTextByOffset(position, offset, w, fontSize, txcolor, align, str);
    };
    /**
     * The attributions are obtained from the Control in the DOM.
     * @protected
     */


    this._addAttributions = () => {
      var attributionsUl = document.querySelector('.ol-attribution ul');
      if (!attributionsUl) return;
      var position = 'bottomright';
      var offset = {
        x: 1,
        y: 1
      };
      var fontSize = 7;

      this._pdf.doc.setFont('helvetica', 'normal');

      this._pdf.doc.setFontSize(fontSize);

      var {
        x,
        y
      } = this._calculateOffsetByPosition(position, offset);

      var xPos = x;

      var {
        w,
        h
      } = this._pdf.doc.getTextDimensions(attributionsUl.textContent);

      var paddingBack = 4;

      this._addRoundedBox(x - w - 2, y - h, w + paddingBack, h + paddingBack, '#ffffff', '#ffffff');

      var attributions = document.querySelectorAll('.ol-attribution li');
      Array.from(attributions).reverse().forEach(attribution => {
        Array.from(attribution.childNodes).reverse().forEach(node => {
          var content = node.textContent;

          if ('href' in node) {
            this._pdf.doc.setTextColor('#0077cc');

            this._pdf.doc.textWithLink(content, xPos, y, {
              align: 'right',
              url: node.href
            });
          } else {
            this._pdf.doc.setTextColor('#666666');

            this._pdf.doc.text(content, xPos, y, {
              align: 'right'
            });
          }

          var {
            w
          } = this._pdf.doc.getTextDimensions(content);

          xPos -= w;
        }); // To add separation between diferents attributtions

        this._pdf.doc.text(' ', xPos, y, {
          align: 'right'
        });

        var {
          w
        } = this._pdf.doc.getTextDimensions(' ');

        xPos -= w;
      });
    };
    /**
     * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
     * @protected
     */


    this._addScaleBar = () => {
      var offset = {
        x: 2,
        y: 2
      };
      var maxWidth = 90; // in mm
      // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10#Polyfill

      var log10 = Math.log10 || // more precise, but unsupported by IE
      function (x) {
        return Math.log(x) * Math.LOG10E;
      };

      var maxLength = maxWidth * this._scaleDenominator;
      var unit;
      var unitConversionFactor;

      if (this._config.units === 'metric') {
        unit = 'mm';
        var millimetre = 1;
        var metre = 1000;
        var kilometre = metre * 1000;
        unitConversionFactor = millimetre;

        if (maxLength >= kilometre * 10) {
          unit = 'km';
          unitConversionFactor = 1e6;
        } else if (maxLength >= metre * 10) {
          unit = 'm';
          unitConversionFactor = metre;
        }
      } else if (this._config.units === 'imperial') {
        var inch = 25.4; // Millimetre to inch

        var mile = inch * 63360;
        var yard = inch * 36;
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
      var unroundedLength = maxLength;
      var numberOfDigits = Math.floor(log10(unroundedLength));
      var factor = Math.pow(10, numberOfDigits);
      var mapped = unroundedLength / factor;
      var length = Math.floor(maxLength); // just to have an upper limit
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

      var size = length * unitConversionFactor / this._scaleDenominator / 4;
      var percentageMargin = this._style.paperMargin ? this._style.paperMargin * 2 / this._pdf.width * 100 : null; // Reduce length acording to margins

      size = percentageMargin ? size / 100 * (100 - percentageMargin) : size;
      var fullSize = size * 4; // x/y defaults to offset for topleft corner (normal x/y coordinates)

      var x = offset.x + this._style.paperMargin;
      var y = offset.y + this._style.paperMargin;
      y = this._pdf.height - offset.y - 10 - this._style.paperMargin; // to give the outer white box 4mm padding

      var scaleBarX = x + 4;
      var scaleBarY = y + 5; // 5 because above the scalebar will be the numbers
      // draw outer box

      this._addRoundedBox(x, y, fullSize + 8, 10, this._style.bkcolor, this._style.brcolor); // draw first part of scalebar


      this._pdf.doc.setDrawColor(this._style.brcolor);

      this._pdf.doc.setFillColor(0, 0, 0);

      this._pdf.doc.rect(scaleBarX, scaleBarY, size, 1, 'FD'); // draw second part of scalebar


      this._pdf.doc.setDrawColor(this._style.brcolor);

      this._pdf.doc.setFillColor(255, 255, 255);

      this._pdf.doc.rect(scaleBarX + size, scaleBarY, size, 1, 'FD'); // draw third part of scalebar


      this._pdf.doc.setDrawColor(this._style.brcolor);

      this._pdf.doc.setFillColor(0, 0, 0);

      this._pdf.doc.rect(scaleBarX + size * 2, scaleBarY, size * 2, 1, 'FD'); // draw numeric labels above scalebar


      this._pdf.doc.setTextColor(this._style.txcolor);

      this._pdf.doc.setFontSize(6);

      this._pdf.doc.text('0', scaleBarX, scaleBarY - 1); // /4 and could give 2.5. We still round, because of floating point arith


      this._pdf.doc.text(String(Math.round(length * 10 / 4) / 10), scaleBarX + size - 1, scaleBarY - 1);

      this._pdf.doc.text(String(Math.round(length / 2)), scaleBarX + size * 2 - 2, scaleBarY - 1);

      this._pdf.doc.text(Math.round(length).toString() + ' ' + unit, scaleBarX + size * 4 - 4, scaleBarY - 1);
    };
    /**
     *
     * @param imgSrc
     * @returns
     * @protected
     */


    this._addCompass = imgSrc => {
      return new Promise((resolve, reject) => __awaiter$1(this, void 0, void 0, function* () {
        var position = 'bottomright';
        var offset = {
          x: 2,
          y: 6
        };
        var size = 6;

        var rotationRadians = this._view.getRotation();

        var imageSize = 100;

        var {
          x,
          y
        } = this._calculateOffsetByPosition(position, offset, size);

        var addRotation = image => {
          var canvas = document.createElement('canvas'); // Must be bigger than the image to prevent clipping

          canvas.height = 120;
          canvas.width = 120;
          var context = canvas.getContext('2d');
          context.translate(canvas.width * 0.5, canvas.height * 0.5);
          context.rotate(rotationRadians);
          context.translate(-canvas.width * 0.5, -canvas.height * 0.5);
          context.drawImage(image, (canvas.height - imageSize) / 2, (canvas.width - imageSize) / 2, imageSize, imageSize); // Add back circle

          var xCircle = x - size;
          var yCircle = y;

          this._pdf.doc.setDrawColor(this._style.brcolor);

          this._pdf.doc.setFillColor(this._style.bkcolor);

          this._pdf.doc.circle(xCircle, yCircle, size, 'FD');

          return canvas;
        };

        var addImage = image => {
          var rotatedCanvas = addRotation(image);
          var sizeImage = size * 1.5;
          var xImage = x - sizeImage - size / 4.3;
          var yImage = y - sizeImage / 2;

          this._pdf.doc.addImage(rotatedCanvas, 'PNG', xImage, yImage, sizeImage, sizeImage);
        };

        var image;

        if (imgSrc instanceof Image) {
          addImage(image);
          resolve();
        } else {
          var imgData;

          if (typeof imgSrc === 'string') {
            imgData = imgSrc;
          } else if (imgSrc instanceof SVGElement) {
            try {
              imgData = yield this._processSvgImage(imgSrc);
            } catch (err) {
              return reject(err);
            }
          } else {
            throw this._i18n.errorImage;
          }

          var _image = new Image(imageSize, imageSize);

          _image.onload = () => {
            try {
              addImage(_image);
              resolve();
            } catch (err) {
              return reject(err);
            }
          };

          _image.onerror = () => {
            return reject(this._i18n.errorImage);
          };

          _image.src = imgData;
        }
      }));
    };

    var {
      view,
      form,
      i18n,
      config,
      height,
      width,
      scaleResolution
    } = params;
    this._view = view;
    this._form = form;
    this._i18n = i18n;
    this._config = config;
    this._pdf = this.createPdf(this._form.orientation, this._form.format, height, width);
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


  createPdf(orientation, format, height, width) {
    var _a; // UMD support


    var _jsPDF = ((_a = window.jspdf) === null || _a === void 0 ? void 0 : _a.jsPDF) || jsPDF;

    return {
      doc: new _jsPDF({
        orientation,
        format
      }),
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
    this._pdf.doc.save(this._config.filename + '.pdf');
  }
  /**
   * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
   * @protected
   */


  _calculateScaleDenominator(resolution, scaleResolution) {
    var pixelsPerMapMillimeter = resolution / 25.4;
    return Math.round(1000 * pixelsPerMapMillimeter * this._getMeterPerPixel(scaleResolution));
  }
  /**
   * @protected
   */


  _getMeterPerPixel(scaleResolution) {
    var proj = this._view.getProjection();

    return getPointResolution(proj, scaleResolution, this._view.getCenter()) * proj.getMetersPerUnit();
  }

}

function createElement(tagName) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  if (tagName === 'fragment') return children;
  if (typeof tagName === 'function') return tagName(attrs, children);
  var elem = document.createElement(tagName);
  Object.entries(attrs || {}).forEach(_ref => {
    var [name, value] = _ref;
    if (name.startsWith('on') && name.toLowerCase() in window) elem.addEventListener(name.toLowerCase().substr(2), value);else {
      if (name === 'className') elem.setAttribute('class', value.toString());else if (name === 'htmlFor') elem.setAttribute('for', value.toString());else elem.setAttribute(name, value.toString());
    }
  });

  for (var child of children) {
    if (!child) continue;
    if (Array.isArray(child)) elem.append(...child);else {
      elem.appendChild(child.nodeType === undefined ? document.createTextNode(child.toString()) : child);
    }
  }

  return elem;
}

/**
 *
 * @param map
 * @param opt_round
 * @returns
 * @protected
 */

var getMapScale = function getMapScale(map) {
  var opt_round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var dpi = 25.4 / 0.28;
  var view = map.getView();
  var unit = view.getProjection().getUnits();
  var res = view.getResolution();
  var inchesPerMetre = 39.37;
  var scale = res * METERS_PER_UNIT[unit] * inchesPerMetre * dpi;

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
    this._modal = new Modal(Object.assign({
      headerClose: true,
      header: true,
      animate: true,
      title: i18n.printPdf,
      content: this.Content(i18n, options),
      footer: this.Footer(i18n)
    }, options.modal));

    this._modal.on('dismiss', (modal, event) => {
      var print = event.target.dataset.print;
      if (!print) return;
      var form = document.getElementById('printMap');
      var formData = new FormData(form);
      var values = {
        format: formData.get('printFormat'),
        orientation: formData.get('printOrientation'),
        resolution: formData.get('printResolution'),
        scale: formData.get('printScale'),
        description: formData.get('printDescription'),
        compass: formData.get('printCompass'),
        attributions: formData.get('printAttributions'),
        scalebar: formData.get('printScalebar')
      };
      printMap(values,
      /* showLaoding */
      true,
      /* delay */
      options.modal.transition);
    });

    this._modal.on('shown', () => {
      var actualScaleVal = getMapScale(map);
      var actualScale = document.querySelector('.actualScale');
      actualScale.value = String(actualScaleVal / 1000);
      actualScale.innerHTML = "".concat(i18n.current, " (1:").concat(actualScaleVal.toLocaleString('de'), ")");
    });
  }
  /**
   *
   * @param i18n
   * @param params
   * @returns
   * @protected
   */


  Content(i18n, params) {
    var {
      scales,
      dpi,
      mapElements,
      paperSizes
    } = params;
    return createElement("form", {
      id: "printMap"
    }, createElement("div", null, createElement("div", {
      className: "printFieldHalf"
    }, createElement("label", {
      htmlFor: "printFormat"
    }, i18n.paperSize), createElement("select", {
      name: "printFormat",
      id: "printFormat"
    }, paperSizes.map(paper => createElement("option", Object.assign({
      value: paper.value
    }, paper.selected ? {
      selected: 'selected'
    } : {}), paper.value)))), createElement("div", {
      className: "printFieldHalf"
    }, createElement("label", {
      htmlFor: "printOrientation"
    }, i18n.orientation), createElement("select", {
      name: "printOrientation",
      id: "printOrientation"
    }, createElement("option", {
      value: "landscape",
      selected: true
    }, i18n.landscape), createElement("option", {
      value: "portrait"
    }, i18n.portrait)))), createElement("div", null, createElement("div", {
      className: "printFieldHalf"
    }, createElement("label", {
      htmlFor: "printResolution"
    }, i18n.resolution), createElement("select", {
      name: "printResolution",
      id: "printResolution"
    }, dpi.map(d => createElement("option", Object.assign({
      value: d.value
    }, d.selected ? {
      selected: 'selected'
    } : {}), d.value, " dpi")))), createElement("div", {
      className: "printFieldHalf"
    }, createElement("label", {
      htmlFor: "printScale"
    }, i18n.scale), createElement("select", {
      name: "printScale",
      id: "printScale"
    }, createElement("option", {
      className: "actualScale",
      value: "",
      selected: true
    }), scales.map(scale => createElement("option", {
      value: scale
    }, "1:", (scale * 1000).toLocaleString('de')))))), mapElements && createElement("div", null, mapElements.description && createElement("div", null, createElement("label", {
      htmlFor: "printDescription"
    }, i18n.addNote), createElement("textarea", {
      id: "printDescription",
      name: "printDescription",
      rows: "4"
    })), createElement("div", null, i18n.mapElements), createElement("div", {
      className: "printElements"
    }, mapElements.compass && createElement("label", {
      htmlFor: "printCompass"
    }, createElement("input", {
      type: "checkbox",
      id: "printCompass",
      name: "printCompass",
      checked: true
    }), i18n.compass), mapElements.scalebar && createElement("label", {
      htmlFor: "printScalebar"
    }, createElement("input", {
      type: "checkbox",
      id: "printScalebar",
      name: "printScalebar",
      checked: true
    }), i18n.scale), mapElements.attributions && createElement("label", {
      htmlFor: "printAttributions"
    }, createElement("input", {
      type: "checkbox",
      id: "printAttributions",
      name: "printAttributions",
      checked: true
    }), i18n.layersAttributions))));
  }
  /**
   *
   * @param i18n
   * @returns
   * @protected
   */


  Footer(i18n) {
    return "\n        <div>\n            <button\n                type=\"button\"\n                class=\"btn-sm btn btn-secondary\"\n                data-dismiss=\"modal\"\n            >\n                ".concat(i18n.cancel, "\n            </button>\n            <button\n                type=\"button\"\n                class=\"btn-sm btn btn-primary\"\n                data-print=\"true\"\n                data-dismiss=\"modal\"\n            >\n                ").concat(i18n.print, "\n            </button>\n        </div>\n    ");
  }

  hide() {
    this._modal.hide();
  }

  show() {
    if (!this._modal._visible) this._modal.show();
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
    this._modal = new Modal(Object.assign({
      headerClose: false,
      title: this._i18n.printing,
      backdrop: 'static',
      content: ' ',
      footer: "\n            <button\n                type=\"button\"\n                class=\"btn-sm btn btn-secondary\"\n                data-dismiss=\"modal\"\n            >\n                ".concat(this._i18n.cancel, "\n            </button>\n            ")
    }, options.modal));

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

    if (!this._modal._visible) this._modal.show();
  }
  /**
   * @protected
   */


  hide() {
    this._modal.hide();
  }

}

var es = {
  printPdf: 'Imprimir PDF',
  pleaseWait: 'Por favor espere...',
  almostThere: 'Ya casi...',
  error: 'Error al generar pdf',
  errorImage: 'Ocurrió un error al tratar de cargar una imagen',
  printing: 'Imprimiendo',
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

var en = {
  printPdf: 'Print PDF',
  pleaseWait: 'Please wait...',
  almostThere: 'Almost there...',
  error: 'An error occurred while printing',
  errorImage: 'An error ocurred while loading an image',
  printing: 'Printing',
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
    es: es,
    en: en
});

function compassIcon() {
  return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"compass\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"0 0 300 300\" style=\"enable-background:new 0 0 300 300;\" xml:space=\"preserve\">\r\n<style type=\"text/css\">\r\n\t.st0{fill:#EA6868;}\r\n</style>\r\n<g>\r\n\t<g>\r\n\t\t<g>\r\n\t\t\t<g>\r\n\t\t\t\t<g>\r\n\t\t\t\t\t<path class=\"st0\" d=\"M146.3,9.1L75.5,287.2c-0.5,1.8,0.5,3.7,2.1,4.4c1.8,0.8,3.7,0.2,4.7-1.5l68.4-106.7l66.8,106.7\r\n\t\t\t\t\t\tc0.6,1.1,1.9,1.8,3.2,1.8c0.5,0,1-0.2,1.5-0.3c1.8-0.8,2.6-2.6,2.3-4.4L153.7,9.1C152.9,5.7,147.2,5.7,146.3,9.1z M154.2,174.2\r\n\t\t\t\t\t\tc-0.6-1.1-1.9-1.8-3.2-1.8l0,0c-1.3,0-2.6,0.6-3.2,1.8l-59,92L150,25.5l61.1,239.9L154.2,174.2z\"/>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t\t<g>\r\n\t\t\t\t<g>\r\n\t\t\t\t\t<path class=\"st0\" d=\"M220.8,293.1c-1.8,0-3.4-1-4.2-2.3l-65.8-105.1L83.4,290.8c-1.3,1.9-4,2.9-6.1,1.9c-2.3-1-3.4-3.4-2.9-5.8\r\n\t\t\t\t\t\tL145.1,8.8c0.5-2.1,2.4-3.4,4.9-3.4s4.4,1.3,4.9,3.4l70.8,278.1c0.6,2.4-0.6,4.9-2.9,5.8C222.1,292.9,221.5,293.1,220.8,293.1z\r\n\t\t\t\t\t\t M150.8,181.2l1,1.6l66.8,106.7c0.6,1,1.9,1.5,3.2,1c1.1-0.5,1.8-1.8,1.5-3.1L152.4,9.3c-0.3-1.1-1.6-1.6-2.6-1.6\r\n\t\t\t\t\t\ts-2.3,0.5-2.6,1.6L76.4,287.4c-0.3,1.3,0.3,2.6,1.5,3.1c1.1,0.5,2.6,0,3.2-1L150.8,181.2z M85.6,273.2L150,20.6l64.2,251.9\r\n\t\t\t\t\t\tl-61.1-97.7c-1-1.6-3.4-1.5-4.4,0L85.6,273.2z\"/>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t</g>\r\n\t</g>\r\n</g>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
}

function pdfIcon() {
  return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"0 0 490 490\" style=\"enable-background:new 0 0 490 490;\" xml:space=\"preserve\">\r\n<g>\r\n\t<path d=\"M65.4,6v157.1c0,3.3-2.9,6-6.5,6H33.6c-3.6,0-6.5,2.7-6.5,6v189.6h0l36.3,33.8c1.2,1.1,1.9,2.7,1.9,4.3l0,81.2\r\n\t\tc0,3.3,2.9,6,6.5,6h383.8c3.6,0,6.5-2.7,6.5-6V104.9c0-1.6-0.7-3.1-1.9-4.3l-106-98.9c-1.2-1.1-2.9-1.8-4.6-1.8H71.8\r\n\t\tC68.2,0,65.4,2.7,65.4,6z M431.3,357.4h-374c-3.8,0-6.9-4-6.9-9V203.2c0-5,3.1-9,6.9-9h374c3.8,0,6.9,4,6.9,9v145.2\r\n\t\tC438.2,353.4,435.1,357.4,431.3,357.4z M340.2,27.6l70.8,66c7.2,6.7,2.1,18.2-8.1,18.2h-70.8c-6.3,0-11.4-4.8-11.4-10.7v-66\r\n\t\tC320.7,25.6,333,20.9,340.2,27.6z\"/>\r\n\t<path d=\"M136.9,207.4h-6.5H87.9c-5.8,0-10.5,4.9-10.5,11v115.5c0,6.1,4.7,11,10.5,11h4c5.8,0,10.5-4.9,10.5-11v-22.4\r\n\t\tc0-6.1,4.7-11,10.5-11h18.9l5.8-0.1c18,0,29.9-3,35.8-9.1c5.9-6.1,8.9-18.3,8.9-36.7c0-18.5-3.1-31-9.3-37.5\r\n\t\tC166.6,210.6,154.7,207.4,136.9,207.4z M152.2,274.4c-3.1,2.7-10.2,4.1-21.5,4.1h-17.9c-5.8,0-10.5-4.9-10.5-11v-27.2\r\n\t\tc0-6.1,4.7-11,10.5-11h20.4c10.6,0,17.2,1.4,19.8,4.2c2.5,2.8,3.8,10,3.8,21.6C156.8,265.2,155.3,271.6,152.2,274.4z\"/>\r\n\t<path d=\"M262.6,207.4h-54.1c-5.8,0-10.5,4.9-10.5,11v115.5c0,6.1,4.7,11,10.5,11h54.9c20.7,0,34.1-4.9,39.9-14.6\r\n\t\tc5.9-9.8,8.9-31.8,8.9-66.1c0-21-3.7-35.7-11-44.1C293.8,211.5,281,207.4,262.6,207.4z M281.6,314.2c-3.5,5.8-11.2,8.6-23.1,8.6\r\n\t\th-25c-5.8,0-10.5-4.9-10.5-11v-71.6c0-6.1,4.7-11,10.5-11H260c11.6,0,19,2.7,22.1,8.2c3.1,5.5,4.7,18.4,4.7,38.7\r\n\t\tC286.9,295.8,285.1,308.5,281.6,314.2z\"/>\r\n\t<path d=\"M340.9,344.8h3.9c5.8,0,10.5-4.9,10.5-11v-34.5c0-6.1,4.7-11,10.5-11h37.9c5.8,0,10.5-4.9,10.5-11v0\r\n\t\tc0-6.1-4.7-11-10.5-11h-37.9c-5.8,0-10.5-4.9-10.5-11v-15.1c0-6.1,4.7-11,10.5-11h41.1c5.8,0,10.5-4.9,10.5-11v0\r\n\t\tc0-6.1-4.7-11-10.5-11h-66c-5.8,0-10.5,4.9-10.5,11v115.5C330.4,339.9,335.1,344.8,340.9,344.8z\"/>\r\n</g>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
}

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/**
 * @protected
 */

var DEFAULT_LANGUAGE = 'en';
/**
 * @protected
 */

var CLASS_PRINT_MODE = 'printMode';
/**
 * @protected
 */

function deepObjectAssign(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  sources.forEach(source => {
    Object.keys(source).forEach(key => {
      var s_val = source[key];
      var t_val = target[key];
      target[key] = t_val && s_val && typeof t_val === 'object' && typeof s_val === 'object' ? deepObjectAssign(t_val, s_val) : s_val;
    });
  });
  return target;
}

class PdfPrinter extends Control {
  constructor(opt_options) {
    var controlElement = document.createElement('button');
    super({
      target: opt_options.target,
      element: controlElement
    }); // Check if the selected language exists

    this._i18n = opt_options.language && opt_options.language in i18n ? i18n[opt_options.language] : i18n[DEFAULT_LANGUAGE];

    if (opt_options.i18n) {
      // Merge custom translations
      this._i18n = Object.assign(Object.assign({}, this._i18n), opt_options.i18n);
    } // Default options


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
      paperSizes: [// { size: [1189, 841], value: 'A0' },
      // { size: [841, 594], value: 'A1' },
      {
        size: [594, 420],
        value: 'A2'
      }, {
        size: [420, 297],
        value: 'A3'
      }, {
        size: [297, 210],
        value: 'A4',
        selected: true
      }, {
        size: [210, 148],
        value: 'A5'
      }],
      dpi: [{
        value: 72
      }, {
        value: 96
      }, {
        value: 150,
        selected: true
      }, {
        value: 200
      }, {
        value: 300
      }],
      scales: [10000, 5000, 1000, 500, 250, 100, 50, 25, 10],
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
          headerClose: "<button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"".concat(this._i18n.close, "\"><span aria-hidden=\"true\">\xD7</span></button>")
        }
      }
    }; // Merge options

    this._options = deepObjectAssign(this._options, opt_options);
    controlElement.className = "ol-print-btn-menu ".concat(this._options.ctrlBtnClass);
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
    var pixelsPerMapMillimeter = resolution / 25.4;
    return [Math.round(width * pixelsPerMapMillimeter), Math.round(height * pixelsPerMapMillimeter)];
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


  _setFormatOptions() {
    var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var layers = this._map.getLayers();

    layers.forEach(layer => {
      if (layer instanceof Tile) {
        var source = layer.getSource(); // Set WMS DPI

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


  _printMap(form) {
    var showLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (showLoading) {
      this._mapTarget.classList.add(CLASS_PRINT_MODE);
    }

    setTimeout(() => {
      if (showLoading) {
        this._prepareLoading();
      }

      this._isCanceled = false; // To allow intermediate zoom levels

      this._view.setConstrainResolution(false); // this._prepareLayers(form);


      var dim = this._options.paperSizes.find(e => e.value === form.format).size;

      dim = form.orientation === 'landscape' ? dim : dim.reverse();
      var widthPaper = dim[0];
      var heightPaper = dim[1];

      var mapSizeForPrint = this._setMapSizForPrint(widthPaper, heightPaper, form.resolution);

      var [width, height] = mapSizeForPrint; // Save current resolution to restore it later

      this._initialViewResolution = this._view.getResolution();
      var pixelsPerMapMillimeter = form.resolution / 25.4;
      var scaleResolution = form.scale / getPointResolution(this._view.getProjection(), pixelsPerMapMillimeter, this._view.getCenter());
      this._renderCompleteKey = this._map.once('rendercomplete', () => {
        domtoimage.toJpeg(this._mapTarget.querySelector('.ol-unselectable.ol-layers'), {
          width,
          height
        }).then(dataUrl => __awaiter(this, void 0, void 0, function* () {
          if (this._isCanceled) return;
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

          yield this._pdf.addMapHelpers();
          if (this._isCanceled) return;

          this._pdf.savePdf(); // Reset original map size


          this._onEndPrint();

          if (showLoading) this._disableLoading();
        })).catch(err => {
          var message = typeof err === 'string' ? err : this._i18n.error;
          console.error(err);

          this._onEndPrint();

          this._processingModal.show(message);
        });
      }); // Set print size

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
    if (!this._initialized) this._init();

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
    options = Object.assign({
      format: (this._options.paperSizes.find(p => p.selected) || this._options.paperSizes[0]).value,
      resolution: (this._options.dpi.find(p => p.selected) || this._options.dpi[0]).value,
      orientation: 'landscape',
      compass: true,
      attributions: true,
      scale: true
    }, options);

    this._printMap(options, showLoading);
  }

}

export default PdfPrinter;
