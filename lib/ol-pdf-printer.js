import Control from 'ol/control/Control';
import { getPointResolution } from 'ol/proj';
import domtoimage from 'dom-to-image-improved';
import { jsPDF } from 'jspdf';
import Modal from 'modal-vanilla';
import { METERS_PER_UNIT } from 'ol/proj/Units';

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
    if (Array.isArray(child)) elem.append(...child);else {
      elem.appendChild(child.nodeType === undefined ? document.createTextNode(child.toString()) : child);
    }
  }

  return elem;
}

/**
 * @param {number} resolution Resolution.
 * @param {string} units Units
 * @param {boolean=} opt_round Whether to round the scale or not.
 * @return {number} Scale
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

var modal;

var Content = (i18n, params) => {
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
    id: "printScale"
  }, createElement("option", {
    className: "actualScale",
    value: "",
    selected: true
  }), scales.map(scale => createElement("option", {
    value: scale
  }, "1:", (scale * 1000).toLocaleString('de')))))), mapElements.description && createElement("div", null, createElement("label", {
    htmlFor: "printDescription"
  }, i18n.addNote), createElement("textarea", {
    id: "printDescription",
    rows: "4"
  })), mapElements && createElement("div", null, createElement("div", null, i18n.mapElements), createElement("div", {
    className: "printElements"
  }, mapElements.compass && createElement("label", {
    htmlFor: "printCompass"
  }, createElement("input", {
    type: "checkbox",
    id: "printCompass",
    checked: true
  }), i18n.compass), mapElements.scalebar && createElement("label", {
    htmlFor: "printScalebar"
  }, createElement("input", {
    type: "checkbox",
    id: "printScalebar",
    checked: true
  }), i18n.scale), mapElements.attributions && createElement("label", {
    htmlFor: "printAttributions"
  }, createElement("input", {
    type: "checkbox",
    id: "printAttributions",
    checked: true
  }), i18n.layersAttributions))));
};

var Footer = lang => {
  return "\n        <div>\n            <button\n                type=\"button\"\n                class=\"btn-sm btn btn-secondary\"\n                data-dismiss=\"modal\"\n            >\n                ".concat(lang.cancel, "\n            </button>\n            <button\n                type=\"button\"\n                class=\"btn-sm btn btn-primary\"\n                data-print=\"true\"\n                data-dismiss=\"modal\"\n            >\n                ").concat(lang.print, "\n            </button>\n        </div>\n    ");
};

var initPrintModal = (map, options, lang, printMap) => {
  modal = new Modal(Object.assign({
    headerClose: true,
    header: true,
    animate: true,
    title: lang.printPdf,
    content: Content(lang, options),
    footer: Footer(lang)
  }, options.modal));
  modal.on('dismiss', (modal, event) => {
    var print = event.target.dataset.print;
    if (!print) return;
    var form = document.getElementById('printMap').elements;
    var formData = {
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
    var actualScaleVal = getMapScale(map);
    var actualScale = document.querySelector('.actualScale');
    actualScale.value = actualScaleVal / 1000;
    actualScale.innerHTML = "".concat(lang.current, " (1:").concat(actualScaleVal.toLocaleString('de'), ")");
  });
};
var hidePrintModal = () => {
  modal.hide();
};
var showPrintModal = () => {
  if (!modal._visible) modal.show();
};

class ProcessingModal {
  constructor() {
    var _this = this;

    this.initProcessingModal = (i18n, options, onEndPrint) => {
      this._i18n = i18n;
      this._footer = "\n            <button\n                type=\"button\"\n                class=\"btn-sm btn btn-secondary\"\n                data-dismiss=\"modal\"\n            >\n                ".concat(this._i18n.cancel, "\n            </button>\n        ");
      this._modal = new Modal(Object.assign({
        headerClose: false,
        animate: false,
        title: this._i18n.printing,
        backdrop: 'static',
        content: ' ',
        footer: ' '
      }, options.modal));

      this._modal.on('dismiss', () => {
        onEndPrint();
      });
    };

    this.setContentModal = string => {
      this._modal._html.body.innerHTML = string;
    };

    this.setFooterModal = string => {
      this._modal._html.footer.innerHTML = string;
    };

    this.showProcessingModal = function (string) {
      var footer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _this.setContentModal(string);

      if (footer) _this.setFooterModal(_this._footer);else _this.setFooterModal(' ');
      if (!_this._modal._visible) _this._modal.show();
    };

    this.hideProcessingModal = () => {
      this._modal.hide();
    };
  }

}

var {
  showProcessingModal,
  hideProcessingModal,
  initProcessingModal
} = new ProcessingModal();

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

class ElementsPDF {
  constructor() {
    var _this = this;

    this.addElementsToPDF = (view, pdf, form, scaleDenominator, options, i18n) => __awaiter$1(this, void 0, void 0, function* () {
      this._view = view;
      this._pdf = pdf;
      this._form = form;
      this._scaleDenominator = scaleDenominator;
      this._i18n = i18n;
      var {
        mapElements,
        extraInfo,
        style,
        watermark
      } = options;
      this._style = style; // Defaults

      var offset = {
        x: 2,
        y: 2
      };
      var centerX = this._pdf.width / 2;

      if (mapElements.compass && this._form.compass) {
        yield this.addCompass(mapElements.compass, 'bottomright', {
          x: 2,
          y: 6
        }, 6, this._view.getRotation());
      }

      if (mapElements.description && this._form.description) {
        this.addTextWithBack(this._form.description, 'topleft', offset, 8, 50);
      }

      if (watermark) {
        yield this.addWatermark(watermark, 'topright', {
          x: 0,
          y: 0
        }, 14);
      }

      if (mapElements.scalebar && this._form.scalebar) {
        this.addScaleBar('bottomleft', offset);
      }

      if (mapElements.attributions && this._form.attributions) {
        this.addAttributions('bottomright', 250, {
          x: 2,
          y: 2
        }, 7, '#ffffff', 'right');
      } // Bottom info


      if (extraInfo.url) {
        this.addUrl('bottomleft', 250, {
          x: 0,
          y: -5
        }, 7, '#000000');
      }

      if (extraInfo.date) {
        this.addDate('bottomright', 250, {
          x: 0,
          y: -5
        }, 7, '#000000', 'right');
      }

      if (extraInfo.scale) {
        this.addScale('bottomleft', 250, {
          x: centerX,
          y: -5
        }, 7, '#000000', 'center');
      }
    });

    this.calculateOffsetByPosition = function (position, offset) {
      var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var x, y;

      switch (position) {
        case 'topleft':
          x = offset.x + _this._style.margin;
          y = offset.y + _this._style.margin + size;
          break;

        case 'topright':
          x = _this._pdf.width - offset.x - _this._style.margin;
          y = offset.y + _this._style.margin + size;
          break;

        case 'bottomright':
          x = _this._pdf.width - offset.x - _this._style.margin;
          y = _this._pdf.height - offset.y - _this._style.margin - size;
          break;

        case 'bottomleft':
          y = _this._pdf.height - offset.y - _this._style.margin - size;
          x = offset.x + _this._style.margin;
          break;
      }

      return {
        x,
        y
      };
    };

    this.addRoundedBox = (x, y, width, height, bkcolor, brcolor) => {
      var rounding = 1;

      this._pdf.doc.setDrawColor(brcolor);

      this._pdf.doc.setFillColor(bkcolor);

      this._pdf.doc.roundedRect(x, y, width, height, rounding, rounding, 'FD');
    };

    this.addText = function (x, y, width, fontSize, color) {
      var align = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'left';
      var str = arguments.length > 6 ? arguments[6] : undefined;

      _this._pdf.doc.setTextColor(color);

      _this._pdf.doc.setFontSize(fontSize);

      _this._pdf.doc.text(str, x, y, {
        align: align,
        maxWidth: width
      });
    };

    this.addTextByOffset = (position, offset, width, fontSize, color, align, str) => {
      var {
        x,
        y
      } = this.calculateOffsetByPosition(position, offset);
      this.addText(x, y, width, fontSize, color, align, str);
    };

    this.addTextWithBack = (str, position, offset, fontSize, maxWidth) => {
      var paddingBack = 4;
      var {
        x,
        y
      } = this.calculateOffsetByPosition(position, offset);

      this._pdf.doc.setTextColor(this._style.txcolor);

      this._pdf.doc.setFontSize(fontSize);

      var {
        w,
        h
      } = this._pdf.doc.getTextDimensions(str, {
        maxWidth: maxWidth
      });

      this.addRoundedBox(x, y, w + paddingBack * 2, h + paddingBack, this._style.bkcolor, this._style.brcolor);

      this._pdf.doc.text(str, x + paddingBack, y + paddingBack + 1, {
        align: 'left',
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


    this.addWatermark = (watermark, position, offset, fontSize) => {
      return new Promise(resolve => {
        var imageSize = 12;
        var fontSizeSubtitle = fontSize / 1.8;
        var back = false;
        var {
          x,
          y
        } = this.calculateOffsetByPosition(position, offset);
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


          var height = 16;
          var widthBack = w + paddingBack;
          this.addRoundedBox(x - widthBack + 4 - acumulativeWidth, y - 4, widthBack + acumulativeWidth, height, '#ffffff', '#ffffff');
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

            this.addRoundedBox(x - _widthBack + 3 - acumulativeWidth, y - 4, _widthBack + acumulativeWidth, 16, '#ffffff', '#ffffff');
            acumulativeWidth += _widthBack;
            back = true;
          }

          var marginTop = watermark.title ? fontSize / 2 : 4;

          this._pdf.doc.text(watermark.subtitle, x, y + paddingBack + marginTop, {
            align: 'right'
          });
        }

        if (watermark.logo) {
          var addImage = image => {
            this._pdf.doc.addImage(image, 'PNG', x - acumulativeWidth + paddingBack * 2 - 1, y - 1, imageSize, imageSize);
          };

          if (!back) {
            var _widthBack2 = acumulativeWidth + paddingBack;

            this.addRoundedBox(x - _widthBack2 + 4, y - 4, _widthBack2, 16, '#ffffff', '#ffffff');
          }

          if (watermark.logo instanceof Image) {
            addImage(watermark.logo);
            resolve();
          } else {
            var image = new Image(imageSize, imageSize);

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

    this.addDate = (position, width, offset, fontSize, txcolor, align) => {
      this._pdf.doc.setFont('helvetica', 'normal');

      var str = new Date(Date.now()).toLocaleDateString();
      this.addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
    };

    this.addUrl = (position, width, offset, fontSize, txcolor, align) => {
      this._pdf.doc.setFont('helvetica', 'italic');

      var str = window.location.href;
      this.addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
    };

    this.addScale = (position, width, offset, fontSize, txcolor, align) => {
      this._pdf.doc.setFont('helvetica', 'bold');

      var str = "".concat(this._i18n.scale, " 1:").concat(this._scaleDenominator.toLocaleString('de'), " - ").concat(this._i18n.paper, " ").concat(this._form.format.toUpperCase());
      this.addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
    };

    this.addAttributions = (position, width, offset, fontSize, txcolor, align) => {
      this._pdf.doc.setFont('helvetica', 'normal');

      var attArr = [];
      var attributions = document.querySelectorAll('.ol-attribution li');
      attributions.forEach(attribution => {
        attArr.push(attribution.textContent);
      });
      var str = attArr.join(' | ');
      this.addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
    }; // Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252


    this.addScaleBar = (position, offset) => {
      // scaleDenominator is the x in 1:x of the map scale
      // hardcode maximal width for now
      var maxWidth = 80 + this._style.margin * 2; // in mm
      // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10#Polyfill

      var log10 = Math.log10 || // more precise, but unsupported by IE
      function (x) {
        return Math.log(x) * Math.LOG10E;
      };

      var maxLength = maxWidth * this._scaleDenominator;
      var unit = 'mm';
      var unitConversionFactor = 1;

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
      var porcentageMargin = this._pdf.width / this._style.margin;
      var unroundedLength = maxLength;
      var numberOfDigits = Math.floor(log10(unroundedLength));
      var factor = Math.pow(10, numberOfDigits);
      var mapped = unroundedLength / factor / porcentageMargin;
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
      var fullSize = size * 4; // x/y defaults to offset for topleft corner (normal x/y coordinates)

      var x = offset.x + this._style.margin;
      var y = offset.y + this._style.margin; // if position is on the right, x needs to be calculate with pdf width and
      // the size of the element

      if (['topright', 'bottomright'].indexOf(position) !== -1) {
        x = this._pdf.width - offset.x - fullSize - 8 - this._style.margin * 2;
      }

      if (['bottomright', 'bottomleft'].indexOf(position) !== -1) {
        y = this._pdf.height - offset.y - 10 - this._style.margin;
      } // to give the outer white box 4mm padding


      var scaleBarX = x + 4;
      var scaleBarY = y + 5; // 5 because above the scalebar will be the numbers
      // draw outer box

      this.addRoundedBox(x, y, fullSize + 8, 10, this._style.bkcolor, this._style.brcolor); // draw first part of scalebar

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

      this._pdf.doc.text(scaleBarX, scaleBarY - 1, '0'); // /4 and could give 2.5. We still round, because of floating point arith


      this._pdf.doc.text(scaleBarX + size - 1, scaleBarY - 1, (Math.round(length * 10 / 4) / 10).toString());

      this._pdf.doc.text(scaleBarX + size * 2 - 2, scaleBarY - 1, Math.round(length / 2).toString());

      this._pdf.doc.text(scaleBarX + size * 4 - 4, scaleBarY - 1, Math.round(length).toString() + ' ' + unit);
    };

    this.addCompass = (imgSrc, position, offset, size, rotationRadians) => {
      return new Promise(resolve => {
        var imageSize = 100;
        var {
          x,
          y
        } = this.calculateOffsetByPosition(position, offset, size);

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

        if (imgSrc instanceof Image) {
          addImage(imgSrc);
          resolve();
        } else {
          var image = new Image(imageSize, imageSize);

          image.onload = () => {
            addImage(image);
            resolve();
          };

          image.src = imgSrc;
        }
      });
    };
  }

}

var {
  addElementsToPDF
} = new ElementsPDF();

var es = {
  printPdf: 'Imprimir PDF',
  pleaseWait: 'Por favor espere...',
  almostThere: 'Ya casi...',
  error: 'Error al generar pdf',
  printing: 'Imprimiendo',
  cancel: 'Cancelar',
  close: 'Cerrar',
  print: 'Imprimir',
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
  printing: 'Printing',
  cancel: 'Cancel',
  close: 'Close',
  print: 'Print',
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

var img$1 = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3c!-- Generator: Adobe Illustrator 24.1.0%2c SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3e%3csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 300 300' style='enable-background:new 0 0 300 300%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .st0%7bfill:%23EA6868%3b%7d%3c/style%3e%3cg%3e %3cg%3e %3cg%3e %3cg%3e %3cg%3e %3cpath class='st0' d='M146.3%2c9.1L75.5%2c287.2c-0.5%2c1.8%2c0.5%2c3.7%2c2.1%2c4.4c1.8%2c0.8%2c3.7%2c0.2%2c4.7-1.5l68.4-106.7l66.8%2c106.7 c0.6%2c1.1%2c1.9%2c1.8%2c3.2%2c1.8c0.5%2c0%2c1-0.2%2c1.5-0.3c1.8-0.8%2c2.6-2.6%2c2.3-4.4L153.7%2c9.1C152.9%2c5.7%2c147.2%2c5.7%2c146.3%2c9.1z M154.2%2c174.2 c-0.6-1.1-1.9-1.8-3.2-1.8l0%2c0c-1.3%2c0-2.6%2c0.6-3.2%2c1.8l-59%2c92L150%2c25.5l61.1%2c239.9L154.2%2c174.2z'/%3e %3c/g%3e %3c/g%3e %3cg%3e %3cg%3e %3cpath class='st0' d='M220.8%2c293.1c-1.8%2c0-3.4-1-4.2-2.3l-65.8-105.1L83.4%2c290.8c-1.3%2c1.9-4%2c2.9-6.1%2c1.9c-2.3-1-3.4-3.4-2.9-5.8 L145.1%2c8.8c0.5-2.1%2c2.4-3.4%2c4.9-3.4s4.4%2c1.3%2c4.9%2c3.4l70.8%2c278.1c0.6%2c2.4-0.6%2c4.9-2.9%2c5.8C222.1%2c292.9%2c221.5%2c293.1%2c220.8%2c293.1z M150.8%2c181.2l1%2c1.6l66.8%2c106.7c0.6%2c1%2c1.9%2c1.5%2c3.2%2c1c1.1-0.5%2c1.8-1.8%2c1.5-3.1L152.4%2c9.3c-0.3-1.1-1.6-1.6-2.6-1.6 s-2.3%2c0.5-2.6%2c1.6L76.4%2c287.4c-0.3%2c1.3%2c0.3%2c2.6%2c1.5%2c3.1c1.1%2c0.5%2c2.6%2c0%2c3.2-1L150.8%2c181.2z M85.6%2c273.2L150%2c20.6l64.2%2c251.9 l-61.1-97.7c-1-1.6-3.4-1.5-4.4%2c0L85.6%2c273.2z'/%3e %3c/g%3e %3c/g%3e %3c/g%3e %3c/g%3e%3c/g%3e%3c/svg%3e";

var img = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 490 490' style='enable-background:new 0 0 490 490%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .st0%7bfill:white%3b%7d%3c/style%3e%3cg%3e %3cpath class='st0' d='M65.4%2c6v157.1c0%2c3.3-2.9%2c6-6.5%2c6H33.6c-3.6%2c0-6.5%2c2.7-6.5%2c6v189.6h0l36.3%2c33.8c1.2%2c1.1%2c1.9%2c2.7%2c1.9%2c4.3l0%2c81.2 c0%2c3.3%2c2.9%2c6%2c6.5%2c6h383.8c3.6%2c0%2c6.5-2.7%2c6.5-6V104.9c0-1.6-0.7-3.1-1.9-4.3l-106-98.9c-1.2-1.1-2.9-1.8-4.6-1.8H71.8 C68.2%2c0%2c65.4%2c2.7%2c65.4%2c6z M431.3%2c357.4h-374c-3.8%2c0-6.9-4-6.9-9V203.2c0-5%2c3.1-9%2c6.9-9h374c3.8%2c0%2c6.9%2c4%2c6.9%2c9v145.2 C438.2%2c353.4%2c435.1%2c357.4%2c431.3%2c357.4z M340.2%2c27.6l70.8%2c66c7.2%2c6.7%2c2.1%2c18.2-8.1%2c18.2h-70.8c-6.3%2c0-11.4-4.8-11.4-10.7v-66 C320.7%2c25.6%2c333%2c20.9%2c340.2%2c27.6z'/%3e %3cpath class='st0' d='M136.9%2c207.4h-6.5H87.9c-5.8%2c0-10.5%2c4.9-10.5%2c11v115.5c0%2c6.1%2c4.7%2c11%2c10.5%2c11h4c5.8%2c0%2c10.5-4.9%2c10.5-11v-22.4 c0-6.1%2c4.7-11%2c10.5-11h18.9l5.8-0.1c18%2c0%2c29.9-3%2c35.8-9.1c5.9-6.1%2c8.9-18.3%2c8.9-36.7c0-18.5-3.1-31-9.3-37.5 C166.6%2c210.6%2c154.7%2c207.4%2c136.9%2c207.4z M152.2%2c274.4c-3.1%2c2.7-10.2%2c4.1-21.5%2c4.1h-17.9c-5.8%2c0-10.5-4.9-10.5-11v-27.2 c0-6.1%2c4.7-11%2c10.5-11h20.4c10.6%2c0%2c17.2%2c1.4%2c19.8%2c4.2c2.5%2c2.8%2c3.8%2c10%2c3.8%2c21.6C156.8%2c265.2%2c155.3%2c271.6%2c152.2%2c274.4z'/%3e %3cpath class='st0' d='M262.6%2c207.4h-54.1c-5.8%2c0-10.5%2c4.9-10.5%2c11v115.5c0%2c6.1%2c4.7%2c11%2c10.5%2c11h54.9c20.7%2c0%2c34.1-4.9%2c39.9-14.6 c5.9-9.8%2c8.9-31.8%2c8.9-66.1c0-21-3.7-35.7-11-44.1C293.8%2c211.5%2c281%2c207.4%2c262.6%2c207.4z M281.6%2c314.2c-3.5%2c5.8-11.2%2c8.6-23.1%2c8.6 h-25c-5.8%2c0-10.5-4.9-10.5-11v-71.6c0-6.1%2c4.7-11%2c10.5-11H260c11.6%2c0%2c19%2c2.7%2c22.1%2c8.2c3.1%2c5.5%2c4.7%2c18.4%2c4.7%2c38.7 C286.9%2c295.8%2c285.1%2c308.5%2c281.6%2c314.2z'/%3e %3cpath class='st0' d='M340.9%2c344.8h3.9c5.8%2c0%2c10.5-4.9%2c10.5-11v-34.5c0-6.1%2c4.7-11%2c10.5-11h37.9c5.8%2c0%2c10.5-4.9%2c10.5-11v0 c0-6.1-4.7-11-10.5-11h-37.9c-5.8%2c0-10.5-4.9-10.5-11v-15.1c0-6.1%2c4.7-11%2c10.5-11h41.1c5.8%2c0%2c10.5-4.9%2c10.5-11v0 c0-6.1-4.7-11-10.5-11h-66c-5.8%2c0-10.5%2c4.9-10.5%2c11v115.5C330.4%2c339.9%2c335.1%2c344.8%2c340.9%2c344.8z'/%3e%3c/g%3e%3c/svg%3e";

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

var DEFAULT_FILE_NAME = 'Export';
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

    this._i18n = opt_options.lang in i18n ? i18n[opt_options.lang] : en;

    if (opt_options.i18n) {
      // Merge custom translations
      this._i18n = Object.assign(Object.assign({}, this._i18n), opt_options.i18n);
    } // Default options


    this._options = {
      lang: 'en',
      filename: DEFAULT_FILE_NAME,
      style: {
        margin: 10,
        brcolor: '#000000',
        bkcolor: '#273f50',
        txcolor: '#ffffff'
      },
      extraInfo: {
        date: true,
        url: true,
        scale: true
      },
      mapElements: {
        description: true,
        attributions: true,
        scalebar: true,
        compass: img$1
      },
      watermark: {
        title: 'Ol Pdf Printer',
        titleColor: '#d65959',
        subtitle: 'https://github.com/GastonZalba/ol-pdf-printer',
        subtitleColor: '#444444',
        logo: false
      },
      paperSizes: [//a0: { size: [1189, 841], value: 'A0' },
      //a1: { size: [841, 594], value: 'A1' },
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
      ctrlBtnClass: '',
      modal: {
        animateClass: 'fade',
        animateInClass: 'show',
        transition: 300,
        backdropTransition: 150,
        templates: {
          dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
          headerClose: "<button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"".concat(this._i18n.close, "\"><span aria-hidden=\"true\">\xD7</span></button>")
        }
      }
    };
    this._pdf = {
      doc: null,
      width: null,
      height: null
    }; // Merge options

    this._options = deepObjectAssign(this._options, opt_options);
    controlElement.className = "ol-print-btn-menu ".concat(this._options.ctrlBtnClass);
    controlElement.innerHTML = "<img src=\"".concat(img, "\"/>");
    controlElement.title = this._i18n.printPdf;

    controlElement.onclick = () => this.show();
  }

  show() {
    if (!this._initialized) this.init();
    showPrintModal();
  }

  init() {
    this._map = this.getMap();
    this._view = this._map.getView();
    this._mapTarget = this._map.getTargetElement();
    initPrintModal(this._map, this._options, this._i18n, this.printMap.bind(this));
    initProcessingModal(this._i18n, this._options, this.onEndPrint.bind(this));
    this._initialized = true;
  } // Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252


  calculateScaleDenominator(resolution, scaleResolution) {
    var pixelsPerMapMillimeter = resolution / 25.4;
    return Math.round(1000 * pixelsPerMapMillimeter * this.getMeterPerPixel(scaleResolution));
  }

  getMeterPerPixel(scaleResolution) {
    var proj = this._view.getProjection();

    return getPointResolution(proj, scaleResolution, this._view.getCenter()) * proj.getMetersPerUnit();
  }

  setMapSizForPrint(resolution) {
    var pixelsPerMapMillimeter = resolution / 25.4;
    return [Math.round(this._pdf.width * pixelsPerMapMillimeter), Math.round(this._pdf.height * pixelsPerMapMillimeter)];
  }
  /**
   * Restore inital view, remove classes, disable loading
   */


  onEndPrint() {
    this._mapTarget.style.width = '';
    this._mapTarget.style.height = '';

    this._map.updateSize();

    this._view.setResolution(this._initialViewResolution);

    this._mapTarget.classList.remove(CLASS_PRINT_MODE);

    this._view.setConstrainResolution(true);

    clearTimeout(this._timeoutProcessing);
  }

  prepareLoading() {
    showProcessingModal(this._i18n.pleaseWait);
    this._timeoutProcessing = setTimeout(() => {
      showProcessingModal(this._i18n.almostThere);
    }, 3500);
  }

  disableLoading() {
    hideProcessingModal();
  }

  printMap(form) {
    var _a;

    this.prepareLoading();
    this._form = form; // To allow intermediate zoom levels

    this._view.setConstrainResolution(false);

    this._mapTarget.classList.add(CLASS_PRINT_MODE);

    var dim = this._options.paperSizes.find(e => e.value === this._form.format).size;

    dim = this._form.orientation === 'landscape' ? dim : dim.reverse();
    this._pdf.width = dim[0];
    this._pdf.height = dim[1];
    var mapSizeForPrint = this.setMapSizForPrint(this._form.resolution);
    var [width, height] = mapSizeForPrint; // UMD support

    var _jsPDF = ((_a = window.jspdf) === null || _a === void 0 ? void 0 : _a.jsPDF) || jsPDF;

    this._pdf.doc = new _jsPDF({
      orientation: this._form.orientation,
      format: this._form.format
    }); // Save current resolution to restore it later

    this._initialViewResolution = this._view.getResolution();
    var pixelsPerMapMillimeter = this._form.resolution / 25.4;
    var scaleResolution = this._form.scale / getPointResolution(this._view.getProjection(), pixelsPerMapMillimeter, this._view.getCenter());

    this._map.once('rendercomplete', () => {
      domtoimage.toJpeg(this._mapTarget.querySelector('.ol-unselectable.ol-layers'), {
        width,
        height
      }).then(dataUrl => __awaiter(this, void 0, void 0, function* () {
        this._pdf.doc.addImage(dataUrl, 'JPEG', this._options.style.margin, // Add margins
        this._options.style.margin, this._pdf.width - this._options.style.margin * 2, this._pdf.height - this._options.style.margin * 2);

        var scaleDenominator = this.calculateScaleDenominator(this._form.resolution, scaleResolution);
        yield addElementsToPDF(this._view, this._pdf, this._form, scaleDenominator, this._options, this._i18n);

        this._pdf.doc.save(this._options.filename + '.pdf'); // Reset original map size


        this.onEndPrint();
        this.disableLoading();
      })).catch(err => {
        console.error(err);
        this.onEndPrint();
        showProcessingModal(this._i18n.error,
        /** footer */
        true);
      });
    }); // Set print size


    this._mapTarget.style.width = width + 'px';
    this._mapTarget.style.height = height + 'px';

    this._map.updateSize();

    this._map.getView().setResolution(scaleResolution);
  }

  showPrintModal() {
    showPrintModal();
  }

  hidePrintModal() {
    hidePrintModal();
  }

}

export default PdfPrinter;
