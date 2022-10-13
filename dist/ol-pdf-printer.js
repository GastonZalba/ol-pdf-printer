(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/proj'), require('ol/control/Control'), require('ol/source/TileWMS'), require('ol/layer/Tile'), require('ol/Observable'), require('jspdf'), require('pdfjs-dist'), require('ol/proj/Units')) :
    typeof define === 'function' && define.amd ? define(['ol/proj', 'ol/control/Control', 'ol/source/TileWMS', 'ol/layer/Tile', 'ol/Observable', 'jspdf', 'pdfjs-dist', 'ol/proj/Units'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PdfPrinter = factory(global.ol.proj, global.ol.control.Control, global.ol.source.TileWMS, global.ol.layer.Tile, global.ol.Observable, global.jsPDF, global.pdfjsLib, global.ol.proj.Units));
})(this, (function (proj, Control, TileWMS, Tile, Observable, jspdf, pdfjsDist, Units) { 'use strict';

    var global = window;

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Control__default = /*#__PURE__*/_interopDefaultLegacy(Control);
    var TileWMS__default = /*#__PURE__*/_interopDefaultLegacy(TileWMS);
    var Tile__default = /*#__PURE__*/_interopDefaultLegacy(Tile);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var domToImageImproved = createCommonjsModule(function (module, exports) {
    (function(global) {

        var util = newUtil();
        var inliner = newInliner();
        var fontFaces = newFontFaces();
        var images = newImages();

        // Default impl options
        var defaultOptions = {
            // Default is to fail on error, no placeholder
            imagePlaceholder: undefined,
            // Default cache bust is false, it will use the cache
            cacheBust: false,
            // Use (existing) authentication credentials for external URIs (CORS requests)
            useCredentials: false
        };

        var domtoimage = {
            toSvg: toSvg,
            toPng: toPng,
            toJpeg: toJpeg,
            toBlob: toBlob,
            toPixelData: toPixelData,
            toCanvas: toCanvas,
            impl: {
                fontFaces: fontFaces,
                images: images,
                util: util,
                inliner: inliner,
                options: {}
            }
        };

        module.exports = domtoimage;

        /**
         * @param {Node} node - The DOM Node object to render
         * @param {Object} options - Rendering options
         * @param {Function} options.filter - Should return true if passed node should be included in the output
         *          (excluding node means excluding it's children as well). Not called on the root node.
         * @param {String} options.bgcolor - color for the background, any valid CSS color value.
         * @param {Number} options.width - width to be applied to node before rendering.
         * @param {Number} options.height - height to be applied to node before rendering.
         * @param {Object} options.style - an object whose properties to be copied to node's style before rendering.
         * @param {Number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),
         defaults to 1.0.
         * @param {Number} options.scale - a Number multiplier to scale up the canvas before rendering to reduce fuzzy images, defaults to 1.0.
         * @param {String} options.imagePlaceholder - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch
         * @param {Boolean} options.cacheBust - set to true to cache bust by appending the time to the request url
         * @return {Promise} - A promise that is fulfilled with a SVG image data URL
         * */
        function toSvg(node, options) {
            options = options || {};
            copyOptions(options);
            return Promise.resolve(node)
            .then(function(node) {
                return cloneNode(node, options.filter, true);
            })
            .then(embedFonts)
            .then(inlineImages)
            .then(applyOptions)
            .then(function(clone) {
                return makeSvgDataUri(clone,
                  options.width || util.width(node),
                  options.height || util.height(node)
                );
            });

            function applyOptions(clone) {
                if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;
                if (options.width) clone.style.width = options.width + 'px';
                if (options.height) clone.style.height = options.height + 'px';

                if (options.style)
                    Object.keys(options.style).forEach(function(property) {
                        clone.style[property] = options.style[property];
                    });

                return clone;
            }
        }

        /**
         * @param {Node} node - The DOM Node object to render
         * @param {Object} options - Rendering options, @see {@link toSvg}
         * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
         * */
        function toPixelData(node, options) {
            return draw(node, options || {})
            .then(function(canvas) {
                return canvas.getContext('2d').getImageData(
                  0,
                  0,
                  util.width(node),
                  util.height(node)
                ).data;
            });
        }

        /**
         * @param {Node} node - The DOM Node object to render
         * @param {Object} options - Rendering options, @see {@link toSvg}
         * @return {Promise} - A promise that is fulfilled with a PNG image data URL
         * */
        function toPng(node, options) {
            return draw(node, options || {})
            .then(function(canvas) {
                return canvas.toDataURL();
            });
        }

        /**
         * @param {Node} node - The DOM Node object to render
         * @param {Object} options - Rendering options, @see {@link toSvg}
         * @return {Promise} - A promise that is fulfilled with a JPEG image data URL
         * */
        function toJpeg(node, options) {
            options = options || {};
            return draw(node, options)
            .then(function(canvas) {
                return canvas.toDataURL('image/jpeg', options.quality || 1.0);
            });
        }

        /**
         * @param {Node} node - The DOM Node object to render
         * @param {Object} options - Rendering options, @see {@link toSvg}
         * @return {Promise} - A promise that is fulfilled with a PNG image blob
         * */
        function toBlob(node, options) {
            return draw(node, options || {})
            .then(util.canvasToBlob);
        }

        /**
         * @param {Node} node - The DOM Node object to render
         * @param {Object} options - Rendering options, @see {@link toSvg}
         * @return {Promise} - A promise that is fulfilled with a canvas object
         * */
        function toCanvas(node, options) {
            return draw(node, options || {});
        }

        function copyOptions(options) {
            // Copy options to impl options for use in impl
            if (typeof(options.imagePlaceholder) === 'undefined') {
                domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;
            } else {
                domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;
            }

            if (typeof(options.cacheBust) === 'undefined') {
                domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;
            } else {
                domtoimage.impl.options.cacheBust = options.cacheBust;
            }

            if(typeof(options.useCredentials) === 'undefined') {
                domtoimage.impl.options.useCredentials = defaultOptions.useCredentials;
            } else {
                domtoimage.impl.options.useCredentials = options.useCredentials;
            }
        }

        function draw(domNode, options) {
            return toSvg(domNode, options)
            .then(util.makeImage)
            .then(util.delay(100))
            .then(function(image) {
                var scale = typeof(options.scale) !== 'number' ? 1 : options.scale;
                console.log('scale', scale);
                var canvas = newCanvas(domNode, scale);
                var ctx = canvas.getContext('2d');
                if (image) {
                    //console.log('should be scaled', image);
                    ctx.scale(scale, scale);
                    //canvas.height = 620;
                    //ctx.drawImage(image, 150, 600, 1150, 700, 0, 0, 1150, 700);
                    // canvas.height = options.image.height + 50;
                    // //canvas.width = options.image.width - 135;// - options.image.offsetRight
                    // canvas.width = options.image.width - options.image.offsetRight - options.image.offsetLeft + 60;
                    // ctx.drawImage(image, options.image.offsetLeft, options.image.offsetTop - 50, options.image.width, options.image.height + 50, 0, 0, options.image.width, options.image.height);

                    if (options.canvas && options.canvas.width) {
                        canvas.width = options.canvas.width;
                    }

                    if (options.canvas && options.canvas.height) {
                        canvas.height = options.canvas.height;
                    }

                    if (options.canvas) {
                        console.log('canv', options.canvas);
                        ctx.drawImage(
                          image,
                          options.canvas.sx  || 0,
                          options.canvas.sy || 0,
                          options.canvas.sw || options.width,
                          options.canvas.sh || options.height,
                          options.canvas.dx || 0,
                          options.canvas.dy || 0,
                          options.canvas.dw || options.width,
                          options.canvas.dh || options.height
                        );
                    } else {
                        ctx.drawImage(image, 0, 0);
                    }

                }
                return canvas;
            });

            function newCanvas(domNode, scale) {
                var canvas = document.createElement('canvas');
                canvas.width = (options.width || util.width(domNode)) * scale;
                canvas.height = (options.height || util.height(domNode)) * scale;

                console.log(canvas.width, canvas.height);

                if (options.bgcolor) {
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = options.bgcolor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                return canvas;
            }
        }

        function cloneNode(node, filter, root) {
            if (!root && filter && !filter(node)) return Promise.resolve();

            return Promise.resolve(node)
            .then(makeNodeCopy)
            .then(function(clone) {
                return cloneChildren(node, clone, filter);
            })
            .then(function(clone) {
                return processClone(node, clone);
            });

            function makeNodeCopy(node) {
                if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());
                return node.cloneNode(false);
            }

            function cloneChildren(original, clone, filter) {
                var children = original.tagName === 'use' ? copyShadowChild(original) : original.childNodes;
                if (children.length === 0) return Promise.resolve(clone);

                return cloneChildrenInOrder(clone, util.asArray(children), filter)
                .then(function() {
                    return clone;
                });

                function cloneChildrenInOrder(parent, children, filter) {
                    var done = Promise.resolve();
                    children.forEach(function(child) {
                        done = done
                        .then(function() {
                            return cloneNode(child, filter);
                        })
                        .then(function(childClone) {
                            if (childClone) parent.appendChild(childClone);
                        });
                    });
                    return done;
                }
            }

            function copyShadowChild(original) {
                var child = document.getElementById(original.href.baseVal.replace('#', ''));
                return [child.cloneNode(true)];
            }

            function processClone(original, clone) {
                if (!(clone instanceof Element)) return clone;

                return Promise.resolve()
                .then(cloneStyle)
                .then(clonePseudoElements)
                .then(copyUserInput)
                .then(fixSvg)
                .then(function() {
                    return clone;
                });

                function cloneStyle() {
                    copyStyle(window.getComputedStyle(original), clone.style);

                    if (util.isChrome() && clone.style.marker && ( clone.tagName === 'line' || clone.tagName === 'path')) {
                        clone.style.marker = '';
                    }

                    function copyStyle(source, target) {
                        if (source.cssText) {
                            target.cssText = source.cssText;
                            target.font = source.font; // here, we re-assign the font prop.
                        } else copyProperties(source, target);

                        function copyProperties(source, target) {
                            util.asArray(source).forEach(function(name) {
                                target.setProperty(
                                  name,
                                  source.getPropertyValue(name),
                                  source.getPropertyPriority(name)
                                );
                            });
                        }
                    }
                }

                function clonePseudoElements() {
                    [':before', ':after'].forEach(function(element) {
                        clonePseudoElement(element);
                    });

                    function clonePseudoElement(element) {
                        var style = window.getComputedStyle(original, element);
                        var content = style.getPropertyValue('content');

                        if (content === '' || content === 'none') return;

                        var className = util.uid();
                        var currentClass = clone.getAttribute('class');
                        if (currentClass) {
                            clone.setAttribute('class', currentClass + ' ' + className);
                        }

                        var styleElement = document.createElement('style');
                        styleElement.appendChild(formatPseudoElementStyle(className, element, style));
                        clone.appendChild(styleElement);

                        function formatPseudoElementStyle(className, element, style) {
                            var selector = '.' + className + ':' + element;
                            var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);
                            return document.createTextNode(selector + '{' + cssText + '}');

                            function formatCssText(style) {
                                var content = style.getPropertyValue('content');
                                return style.cssText + ' content: ' + content + ';';
                            }

                            function formatCssProperties(style) {

                                return util.asArray(style)
                                .map(formatProperty)
                                .join('; ') + ';';

                                function formatProperty(name) {
                                    return name + ': ' +
                                      style.getPropertyValue(name) +
                                      (style.getPropertyPriority(name) ? ' !important' : '');
                                }
                            }
                        }
                    }
                }

                function copyUserInput() {
                    if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
                    if (original instanceof HTMLInputElement) clone.setAttribute("value", original.value);
                }

                function fixSvg() {
                    if (!(clone instanceof SVGElement)) return;
                    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                    if (!(clone instanceof SVGRectElement)) return;
                    ['width', 'height'].forEach(function(attribute) {
                        var value = clone.getAttribute(attribute);
                        if (!value) return;

                        clone.style.setProperty(attribute, value);
                    });
                }
            }
        }

        function embedFonts(node) {
            return fontFaces.resolveAll()
            .then(function(cssText) {
                var styleNode = document.createElement('style');
                node.appendChild(styleNode);
                styleNode.appendChild(document.createTextNode(cssText));
                return node;
            });
        }

        function inlineImages(node) {
            return images.inlineAll(node)
            .then(function() {
                return node;
            });
        }

        function makeSvgDataUri(node, width, height) {
            return Promise.resolve(node)
            .then(function(node) {
                node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
                return new XMLSerializer().serializeToString(node);
            })
            .then(util.escapeXhtml)
            .then(function(xhtml) {
                return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>';
            })
            .then(function(foreignObject) {
                return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
                  foreignObject + '</svg>';
            })
            .then(function(svg) {
                return 'data:image/svg+xml;charset=utf-8,' + svg;
            });
        }

        function newUtil() {
            return {
                escape: escape,
                parseExtension: parseExtension,
                mimeType: mimeType,
                dataAsUrl: dataAsUrl,
                isDataUrl: isDataUrl,
                canvasToBlob: canvasToBlob,
                resolveUrl: resolveUrl,
                getAndEncode: getAndEncode,
                uid: uid(),
                delay: delay,
                asArray: asArray,
                isChrome: isChrome,
                escapeXhtml: escapeXhtml,
                makeImage: makeImage,
                width: width,
                height: height
            };

            function mimes() {
                /*
                 * Only WOFF and EOT mime types for fonts are 'real'
                 * see http://www.iana.org/assignments/media-types/media-types.xhtml
                 */
                var WOFF = 'application/font-woff';
                var JPEG = 'image/jpeg';

                return {
                    'woff': WOFF,
                    'woff2': WOFF,
                    'ttf': 'application/font-truetype',
                    'eot': 'application/vnd.ms-fontobject',
                    'png': 'image/png',
                    'jpg': JPEG,
                    'jpeg': JPEG,
                    'gif': 'image/gif',
                    'tiff': 'image/tiff',
                    'svg': 'image/svg+xml'
                };
            }

            function parseExtension(url) {
                var match = /\.([^\.\/]*?)(\?|$)/g.exec(url);
                if (match) return match[1];
                else return '';
            }

            function mimeType(url) {
                var extension = parseExtension(url).toLowerCase();
                return mimes()[extension] || '';
            }

            function isDataUrl(url) {
                return url.search(/^(data:)/) !== -1;
            }

            function toBlob(canvas) {
                return new Promise(function(resolve) {
                    var binaryString = window.atob(canvas.toDataURL().split(',')[1]);
                    var length = binaryString.length;
                    var binaryArray = new Uint8Array(length);

                    for (var i = 0; i < length; i++)
                        binaryArray[i] = binaryString.charCodeAt(i);

                    resolve(new Blob([binaryArray], {
                        type: 'image/png'
                    }));
                });
            }

            function canvasToBlob(canvas) {
                if (canvas.toBlob)
                    return new Promise(function(resolve) {
                        canvas.toBlob(resolve);
                    });

                return toBlob(canvas);
            }

            function resolveUrl(url, baseUrl) {
                var doc = document.implementation.createHTMLDocument();
                var base = doc.createElement('base');
                doc.head.appendChild(base);
                var a = doc.createElement('a');
                doc.body.appendChild(a);
                base.href = baseUrl;
                a.href = url;
                return a.href;
            }

            function uid() {
                var index = 0;

                return function() {
                    return 'u' + fourRandomChars() + index++;

                    function fourRandomChars() {
                        /* see http://stackoverflow.com/a/6248722/2519373 */
                        return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
                    }
                };
            }

            function makeImage(uri) {
                if (uri === 'data:,') return Promise.resolve();
                return new Promise(function(resolve, reject) {
                    var image = new Image();
                    if(domtoimage.impl.options.useCredentials) {
                        image.crossOrigin = 'use-credentials';
                    }
                    image.onload = function() {
                        resolve(image);
                    };
                    image.onerror = reject;
                    image.src = uri;
                });
            }

            function getAndEncode(url) {
                var TIMEOUT = 30000;
                if (domtoimage.impl.options.cacheBust) {
                    // Cache bypass so we dont have CORS issues with cached images
                    // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
                    url += ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
                }

                return new Promise(function(resolve) {
                    var request = new XMLHttpRequest();

                    request.onreadystatechange = done;
                    request.ontimeout = timeout;
                    request.responseType = 'blob';
                    request.timeout = TIMEOUT;
                    if(domtoimage.impl.options.useCredentials) {
                        request.withCredentials = true;
                    }
                    request.open('GET', url, true);
                    request.send();

                    var placeholder;
                    if (domtoimage.impl.options.imagePlaceholder) {
                        var split = domtoimage.impl.options.imagePlaceholder.split(/,/);
                        if (split && split[1]) {
                            placeholder = split[1];
                        }
                    }

                    function done() {
                        if (request.readyState !== 4) return;

                        if (request.status !== 200) {
                            if (placeholder) {
                                resolve(placeholder);
                            } else {
                                fail('cannot fetch resource: ' + url + ', status: ' + request.status);
                            }

                            return;
                        }

                        var encoder = new FileReader();
                        encoder.onloadend = function() {
                            var content = encoder.result.split(/,/)[1];
                            resolve(content);
                        };
                        encoder.readAsDataURL(request.response);
                    }

                    function timeout() {
                        if (placeholder) {
                            resolve(placeholder);
                        } else {
                            fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url);
                        }
                    }

                    function fail(message) {
                        console.error(message);
                        resolve('');
                    }
                });
            }

            function dataAsUrl(content, type) {
                return 'data:' + type + ';base64,' + content;
            }

            function escape(string) {
                return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
            }

            function isChrome() {
                return /chrome/i.test( navigator.userAgent );
            }

            function delay(ms) {
                return function(arg) {
                    return new Promise(function(resolve) {
                        setTimeout(function() {
                            resolve(arg);
                        }, ms);
                    });
                };
            }

            function asArray(arrayLike) {
                var array = [];
                var length = arrayLike.length;
                for (var i = 0; i < length; i++) array.push(arrayLike[i]);
                return array;
            }

            function escapeXhtml(string) {
                return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
            }

            function width(node) {
                var leftBorder = px(node, 'border-left-width');
                var rightBorder = px(node, 'border-right-width');
                return node.scrollWidth + leftBorder + rightBorder;
            }

            function height(node) {
                var topBorder = px(node, 'border-top-width');
                var bottomBorder = px(node, 'border-bottom-width');
                return node.scrollHeight + topBorder + bottomBorder;
            }

            function px(node, styleProperty) {
                var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
                return parseFloat(value.replace('px', ''));
            }
        }

        function newInliner() {
            var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

            return {
                inlineAll: inlineAll,
                shouldProcess: shouldProcess,
                impl: {
                    readUrls: readUrls,
                    inline: inline
                }
            };

            function shouldProcess(string) {
                return string.search(URL_REGEX) !== -1;
            }

            function readUrls(string) {
                var result = [];
                var match;
                while ((match = URL_REGEX.exec(string)) !== null) {
                    result.push(match[1]);
                }
                return result.filter(function(url) {
                    return !util.isDataUrl(url);
                });
            }

            function inline(string, url, baseUrl, get) {
                return Promise.resolve(url)
                .then(function(url) {
                    return baseUrl ? util.resolveUrl(url, baseUrl) : url;
                })
                .then(get || util.getAndEncode)
                .then(function(data) {
                    return util.dataAsUrl(data, util.mimeType(url));
                })
                .then(function(dataUrl) {
                    return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3');
                });

                function urlAsRegex(url) {
                    return new RegExp('(url\\([\'"]?)(' + util.escape(url) + ')([\'"]?\\))', 'g');
                }
            }

            function inlineAll(string, baseUrl, get) {
                if (nothingToInline()) return Promise.resolve(string);

                return Promise.resolve(string)
                .then(readUrls)
                .then(function(urls) {
                    var done = Promise.resolve(string);
                    urls.forEach(function(url) {
                        done = done.then(function(string) {
                            return inline(string, url, baseUrl, get);
                        });
                    });
                    return done;
                });

                function nothingToInline() {
                    return !shouldProcess(string);
                }
            }
        }

        function newFontFaces() {
            return {
                resolveAll: resolveAll,
                impl: {
                    readAll: readAll
                }
            };

            function resolveAll() {
                return readAll()
                .then(function(webFonts) {
                    return Promise.all(
                      webFonts.map(function(webFont) {
                          return webFont.resolve();
                      })
                    );
                })
                .then(function(cssStrings) {
                    return cssStrings.join('\n');
                });
            }

            function readAll() {
                return Promise.resolve(util.asArray(document.styleSheets))
                .then(getCssRules)
                .then(selectWebFontRules)
                .then(function(rules) {
                    return rules.map(newWebFont);
                });

                function selectWebFontRules(cssRules) {
                    return cssRules
                    .filter(function(rule) {
                        return rule.type === CSSRule.FONT_FACE_RULE;
                    })
                    .filter(function(rule) {
                        return inliner.shouldProcess(rule.style.getPropertyValue('src'));
                    });
                }

                function getCssRules(styleSheets) {
                    var cssRules = [];
                    styleSheets.forEach(function(sheet) {
                        if (sheet.hasOwnProperty("cssRules")) {
                            try {
                                util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
                            } catch (e) {
                                console.log('Error while reading CSS rules from ' + sheet.href, e.toString());
                            }
                        }
                    });
                    return cssRules;
                }

                function newWebFont(webFontRule) {
                    return {
                        resolve: function resolve() {
                            var baseUrl = (webFontRule.parentStyleSheet || {}).href;
                            return inliner.inlineAll(webFontRule.cssText, baseUrl);
                        },
                        src: function() {
                            return webFontRule.style.getPropertyValue('src');
                        }
                    };
                }
            }
        }

        function newImages() {
            return {
                inlineAll: inlineAll,
                impl: {
                    newImage: newImage
                }
            };

            function newImage(element) {
                return {
                    inline: inline
                };

                function inline(get) {
                    if (util.isDataUrl(element.src)) return Promise.resolve();

                    return Promise.resolve(element.src)
                    .then(get || util.getAndEncode)
                    .then(function(data) {
                        return util.dataAsUrl(data, util.mimeType(element.src));
                    })
                    .then(function(dataUrl) {
                        return new Promise(function(resolve, reject) {
                            element.onload = resolve;
                            // for any image with invalid src(such as <img src />), just ignore it
                            element.onerror = resolve;
                            element.src = dataUrl;
                        });
                    });
                }
            }

            function inlineAll(node) {
                if (!(node instanceof Element)) return Promise.resolve(node);

                return inlineBackground(node)
                .then(function() {
                    if (node instanceof HTMLImageElement)
                        return newImage(node).inline();
                    else
                        return Promise.all(
                          util.asArray(node.childNodes).map(function(child) {
                              return inlineAll(child);
                          })
                        );
                });

                function inlineBackground(node) {
                    var background = node.style.getPropertyValue('background');

                    if (!background) return Promise.resolve(node);

                    return inliner.inlineAll(background)
                    .then(function(inlined) {
                        node.style.setProperty(
                          'background',
                          inlined,
                          node.style.getPropertyPriority('background')
                        );
                    })
                    .then(function() {
                        return node;
                    });
                }
            }
        }
    })();
    });

    var arrayLikeToArray = createCommonjsModule(function (module) {
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var arrayWithoutHoles = createCommonjsModule(function (module) {
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return arrayLikeToArray(arr);
    }

    module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var iterableToArray = createCommonjsModule(function (module) {
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }

    module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var unsupportedIterableToArray = createCommonjsModule(function (module) {
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
    }

    module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var nonIterableSpread = createCommonjsModule(function (module) {
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var toConsumableArray = createCommonjsModule(function (module) {
    function _toConsumableArray(arr) {
      return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
    }

    module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var _toConsumableArray = /*@__PURE__*/getDefaultExportFromCjs(toConsumableArray);

    var arrayWithHoles = createCommonjsModule(function (module) {
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var iterableToArrayLimit = createCommonjsModule(function (module) {
    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;

      var _s, _e;

      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var nonIterableRest = createCommonjsModule(function (module) {
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var slicedToArray = createCommonjsModule(function (module) {
    function _slicedToArray(arr, i) {
      return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
    }

    module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
    });

    var _slicedToArray = /*@__PURE__*/getDefaultExportFromCjs(slicedToArray);

    function createElement(tagName) {
      var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }
      if (tagName === 'null') return children;
      if (typeof tagName === 'function') return tagName(attrs, children);
      var elem = document.createElement(tagName);
      Object.entries(attrs || {}).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          name = _ref2[0],
          value = _ref2[1];
        if (name.startsWith('on') && name.toLowerCase() in window) elem.addEventListener(name.toLowerCase().substr(2), value);else {
          if (name === 'className') elem.setAttribute('class', value.toString());else if (name === 'htmlFor') elem.setAttribute('for', value.toString());else elem.setAttribute(name, value.toString());
        }
      });
      for (var _i = 0, _children = children; _i < _children.length; _i++) {
        var child = _children[_i];
        if (!child) continue;
        if (Array.isArray(child)) elem.append.apply(elem, _toConsumableArray(child));else {
          elem.appendChild(child.nodeType === undefined ? document.createTextNode(child.toString()) : child);
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
            this.addMapHelpers = () => __awaiter(this, void 0, void 0, function* () {
                const { mapElements, extraInfo, style, watermark } = this._config;
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
            this._addWatermark = (watermark) => __awaiter(this, void 0, void 0, function* () {
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
                        imgData = yield this._processSvgImage(watermark.logo);
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
            });
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
            this._addCompass = (imgSrc) => __awaiter(this, void 0, void 0, function* () {
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
                        imgData = yield this._processSvgImage(imgSrc);
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
            });
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
            const _jsPDF = ((_a = window.jspdf) === null || _a === void 0 ? void 0 : _a.jsPDF) || jspdf.jsPDF;
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
                    const versionPdfJS = ((_a = window === null || window === void 0 ? void 0 : window.pdfjsLib) === null || _a === void 0 ? void 0 : _a.version) || pdfjsDist.version;
                    pdfjsDist.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${versionPdfJS}/pdf.worker.js`;
                    pdfjsDist.getDocument(pdf).promise.then((pdf) => {
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
            const proj$1 = this._view.getProjection();
            return (proj.getPointResolution(proj$1, scaleResolution, this._view.getCenter()) *
                proj$1.getMetersPerUnit());
        }
    }

    var domain;

    // This constructor is used to store event handlers. Instantiating this is
    // faster than explicitly calling `Object.create(null)` to get a "clean" empty
    // object (tested with v8 v4.9).
    function EventHandlers() {}
    EventHandlers.prototype = Object.create(null);

    function EventEmitter() {
      EventEmitter.init.call(this);
    }

    // nodejs oddity
    // require('events') === require('events').EventEmitter
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.usingDomains = false;

    EventEmitter.prototype.domain = undefined;
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10;

    EventEmitter.init = function() {
      this.domain = null;
      if (EventEmitter.usingDomains) {
        // if there is an active domain, then attach to it.
        if (domain.active ) ;
      }

      if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      }

      this._maxListeners = this._maxListeners || undefined;
    };

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || isNaN(n))
        throw new TypeError('"n" argument must be a positive number');
      this._maxListeners = n;
      return this;
    };

    function $getMaxListeners(that) {
      if (that._maxListeners === undefined)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }

    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return $getMaxListeners(this);
    };

    // These standalone emit* functions are used to optimize calling of event
    // handlers for fast cases because emit() itself often has a variable number of
    // arguments and can be deoptimized because of that. These functions always have
    // the same number of arguments and thus do not get deoptimized, so the code
    // inside them can execute faster.
    function emitNone(handler, isFn, self) {
      if (isFn)
        handler.call(self);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self);
      }
    }
    function emitOne(handler, isFn, self, arg1) {
      if (isFn)
        handler.call(self, arg1);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1);
      }
    }
    function emitTwo(handler, isFn, self, arg1, arg2) {
      if (isFn)
        handler.call(self, arg1, arg2);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1, arg2);
      }
    }
    function emitThree(handler, isFn, self, arg1, arg2, arg3) {
      if (isFn)
        handler.call(self, arg1, arg2, arg3);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1, arg2, arg3);
      }
    }

    function emitMany(handler, isFn, self, args) {
      if (isFn)
        handler.apply(self, args);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].apply(self, args);
      }
    }

    EventEmitter.prototype.emit = function emit(type) {
      var er, handler, len, args, i, events, domain;
      var doError = (type === 'error');

      events = this._events;
      if (events)
        doError = (doError && events.error == null);
      else if (!doError)
        return false;

      domain = this.domain;

      // If there is no 'error' event listener then throw.
      if (doError) {
        er = arguments[1];
        if (domain) {
          if (!er)
            er = new Error('Uncaught, unspecified "error" event');
          er.domainEmitter = this;
          er.domain = domain;
          er.domainThrown = false;
          domain.emit('error', er);
        } else if (er instanceof Error) {
          throw er; // Unhandled 'error' event
        } else {
          // At least give some kind of context to the user
          var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
          err.context = er;
          throw err;
        }
        return false;
      }

      handler = events[type];

      if (!handler)
        return false;

      var isFn = typeof handler === 'function';
      len = arguments.length;
      switch (len) {
        // fast cases
        case 1:
          emitNone(handler, isFn, this);
          break;
        case 2:
          emitOne(handler, isFn, this, arguments[1]);
          break;
        case 3:
          emitTwo(handler, isFn, this, arguments[1], arguments[2]);
          break;
        case 4:
          emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
          break;
        // slower
        default:
          args = new Array(len - 1);
          for (i = 1; i < len; i++)
            args[i - 1] = arguments[i];
          emitMany(handler, isFn, this, args);
      }

      return true;
    };

    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = target._events;
      if (!events) {
        events = target._events = new EventHandlers();
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener) {
          target.emit('newListener', type,
                      listener.listener ? listener.listener : listener);

          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }

      if (!existing) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] = prepend ? [listener, existing] :
                                              [existing, listener];
        } else {
          // If we've already got an array, just append.
          if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
        }

        // Check for listener leak
        if (!existing.warned) {
          m = $getMaxListeners(target);
          if (m && m > 0 && existing.length > m) {
            existing.warned = true;
            var w = new Error('Possible EventEmitter memory leak detected. ' +
                                existing.length + ' ' + type + ' listeners added. ' +
                                'Use emitter.setMaxListeners() to increase limit');
            w.name = 'MaxListenersExceededWarning';
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            emitWarning(w);
          }
        }
      }

      return target;
    }
    function emitWarning(e) {
      typeof console.warn === 'function' ? console.warn(e) : console.log(e);
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.prependListener =
        function prependListener(type, listener) {
          return _addListener(this, type, listener, true);
        };

    function _onceWrap(target, type, listener) {
      var fired = false;
      function g() {
        target.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(target, arguments);
        }
      }
      g.listener = listener;
      return g;
    }

    EventEmitter.prototype.once = function once(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };

    EventEmitter.prototype.prependOnceListener =
        function prependOnceListener(type, listener) {
          if (typeof listener !== 'function')
            throw new TypeError('"listener" argument must be a function');
          this.prependListener(type, _onceWrap(this, type, listener));
          return this;
        };

    // emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener =
        function removeListener(type, listener) {
          var list, events, position, i, originalListener;

          if (typeof listener !== 'function')
            throw new TypeError('"listener" argument must be a function');

          events = this._events;
          if (!events)
            return this;

          list = events[type];
          if (!list)
            return this;

          if (list === listener || (list.listener && list.listener === listener)) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else {
              delete events[type];
              if (events.removeListener)
                this.emit('removeListener', type, list.listener || listener);
            }
          } else if (typeof list !== 'function') {
            position = -1;

            for (i = list.length; i-- > 0;) {
              if (list[i] === listener ||
                  (list[i].listener && list[i].listener === listener)) {
                originalListener = list[i].listener;
                position = i;
                break;
              }
            }

            if (position < 0)
              return this;

            if (list.length === 1) {
              list[0] = undefined;
              if (--this._eventsCount === 0) {
                this._events = new EventHandlers();
                return this;
              } else {
                delete events[type];
              }
            } else {
              spliceOne(list, position);
            }

            if (events.removeListener)
              this.emit('removeListener', type, originalListener || listener);
          }

          return this;
        };
        
    // Alias for removeListener added in NodeJS 10.0
    // https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
    EventEmitter.prototype.off = function(type, listener){
        return this.removeListener(type, listener);
    };

    EventEmitter.prototype.removeAllListeners =
        function removeAllListeners(type) {
          var listeners, events;

          events = this._events;
          if (!events)
            return this;

          // not listening for removeListener, no need to emit
          if (!events.removeListener) {
            if (arguments.length === 0) {
              this._events = new EventHandlers();
              this._eventsCount = 0;
            } else if (events[type]) {
              if (--this._eventsCount === 0)
                this._events = new EventHandlers();
              else
                delete events[type];
            }
            return this;
          }

          // emit removeListener for all listeners on all events
          if (arguments.length === 0) {
            var keys = Object.keys(events);
            for (var i = 0, key; i < keys.length; ++i) {
              key = keys[i];
              if (key === 'removeListener') continue;
              this.removeAllListeners(key);
            }
            this.removeAllListeners('removeListener');
            this._events = new EventHandlers();
            this._eventsCount = 0;
            return this;
          }

          listeners = events[type];

          if (typeof listeners === 'function') {
            this.removeListener(type, listeners);
          } else if (listeners) {
            // LIFO order
            do {
              this.removeListener(type, listeners[listeners.length - 1]);
            } while (listeners[0]);
          }

          return this;
        };

    EventEmitter.prototype.listeners = function listeners(type) {
      var evlistener;
      var ret;
      var events = this._events;

      if (!events)
        ret = [];
      else {
        evlistener = events[type];
        if (!evlistener)
          ret = [];
        else if (typeof evlistener === 'function')
          ret = [evlistener.listener || evlistener];
        else
          ret = unwrapListeners(evlistener);
      }

      return ret;
    };

    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };

    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;

      if (events) {
        var evlistener = events[type];

        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener) {
          return evlistener.length;
        }
      }

      return 0;
    }

    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
    };

    // About 1.5x faster than the two-arg version of Array#splice().
    function spliceOne(list, index) {
      for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
        list[i] = list[k];
      list.pop();
    }

    function arrayClone(arr, i) {
      var copy = new Array(i);
      while (i--)
        copy[i] = arr[i];
      return copy;
    }

    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }

    var modal = createCommonjsModule(function (module) {
    module.exports =
    /******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/
    /******/ 		// Check if module is in cache
    /******/ 		if(installedModules[moduleId]) {
    /******/ 			return installedModules[moduleId].exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = installedModules[moduleId] = {
    /******/ 			i: moduleId,
    /******/ 			l: false,
    /******/ 			exports: {}
    /******/ 		};
    /******/
    /******/ 		// Execute the module function
    /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ 		// Flag the module as loaded
    /******/ 		module.l = true;
    /******/
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/ 	__webpack_require__.d = function(exports, name, getter) {
    /******/ 		if(!__webpack_require__.o(exports, name)) {
    /******/ 			Object.defineProperty(exports, name, {
    /******/ 				configurable: false,
    /******/ 				enumerable: true,
    /******/ 				get: getter
    /******/ 			});
    /******/ 		}
    /******/ 	};
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/ 	__webpack_require__.n = function(module) {
    /******/ 		var getter = module && module.__esModule ?
    /******/ 			function getDefault() { return module['default']; } :
    /******/ 			function getModuleExports() { return module; };
    /******/ 		__webpack_require__.d(getter, 'a', getter);
    /******/ 		return getter;
    /******/ 	};
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(__webpack_require__.s = 0);
    /******/ })
    /************************************************************************/
    /******/ ([
    /* 0 */
    /***/ (function(module, exports, __webpack_require__) {

    module.exports = __webpack_require__(1).default;


    /***/ }),
    /* 1 */
    /***/ (function(module, exports, __webpack_require__) {


    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                                   * Vanilla JS Modal compatible with Bootstrap
                                                                                                                                                                                                                                                                                   * modal-vanilla 0.12.0 <https://github.com/KaneCohen/modal-vanilla>
                                                                                                                                                                                                                                                                                   * Copyright 2020 Kane Cohen <https://github.com/KaneCohen>
                                                                                                                                                                                                                                                                                   * Available under BSD-3-Clause license
                                                                                                                                                                                                                                                                                   */


    var _events = __webpack_require__(2);

    var _events2 = _interopRequireDefault(_events);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var _factory = null;

    var _defaults = Object.freeze({
      el: null, // Existing DOM element that will be 'Modal-ized'.
      animate: true, // Show Modal using animation.
      animateClass: 'fade', //
      animateInClass: 'show', //
      appendTo: 'body', // DOM element to which constructed Modal will be appended.
      backdrop: true, // Boolean or 'static', Show Modal backdrop blocking content.
      keyboard: true, // Close modal on esc key.
      title: false, // Content of the title in the constructed dialog.
      header: true, // Show header content.
      content: false, // Either string or an HTML element.
      footer: true, // Footer content. By default will use buttons.
      buttons: null, //
      headerClose: true, // Show close button in the header.
      construct: false, // Creates new HTML with a given content.
      transition: 300, //
      backdropTransition: 150 //
    });

    var _buttons = deepFreeze({
      dialog: [{ text: 'Cancel',
        value: false,
        attr: {
          'class': 'btn btn-default',
          'data-dismiss': 'modal'
        }
      }, { text: 'OK',
        value: true,
        attr: {
          'class': 'btn btn-primary',
          'data-dismiss': 'modal'
        }
      }],
      alert: [{ text: 'OK',
        attr: {
          'class': 'btn btn-primary',
          'data-dismiss': 'modal'
        }
      }],
      confirm: [{ text: 'Cancel',
        value: false,
        attr: {
          'class': 'btn btn-default',
          'data-dismiss': 'modal'
        }
      }, { text: 'OK',
        value: true,
        attr: {
          'class': 'btn btn-primary',
          'data-dismiss': 'modal'
        }
      }]
    });

    var _templates = {
      container: '<div class="modal"></div>',
      dialog: '<div class="modal-dialog"></div>',
      content: '<div class="modal-content"></div>',
      header: '<div class="modal-header"></div>',
      headerClose: '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>',
      body: '<div class="modal-body"></div>',
      footer: '<div class="modal-footer"></div>',
      backdrop: '<div class="modal-backdrop"></div>'
    };

    function deepFreeze(obj) {
      for (var k in obj) {
        if (Array.isArray(obj[k])) {
          obj[k].forEach(function (v) {
            deepFreeze(v);
          });
        } else if (obj[k] !== null && _typeof(obj[k]) === 'object') {
          Object.freeze(obj[k]);
        }
      }
      return Object.freeze(obj);
    }

    function guid() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16) + ((1 + Math.random()) * 0x10000 | 0).toString(16);
    }

    function data(el, prop, value) {
      var prefix = 'data';
      var elData = el[prefix] || {};
      if (typeof value === 'undefined') {
        if (el[prefix] && el[prefix][prop]) {
          return el[prefix][prop];
        } else {
          var dataAttr = el.getAttribute(prefix + '-' + prop);
          if (typeof dataAttr !== 'undefined') {
            return dataAttr;
          }
          return null;
        }
      } else {
        elData[prop] = value;
        el[prefix] = elData;
        return el;
      }
    }

    function build(html, all) {
      if (html.nodeName) return html;
      html = html.replace(/(\t|\n$)/g, '');

      if (!_factory) {
        _factory = document.createElement('div');
      }

      _factory.innerHTML = '';
      _factory.innerHTML = html;
      if (all === true) {
        return _factory.childNodes;
      } else {
        return _factory.childNodes[0];
      }
    }

    function calcScrollbarWidth() {
      var inner = void 0;
      var width = void 0;
      var outerWidth = void 0;
      var outer = document.createElement('div');
      _extends(outer.style, {
        visibility: 'hidden',
        width: '100px'
      });
      document.body.appendChild(outer);

      outerWidth = outer.offsetWidth;
      outer.style.overflow = 'scroll';

      inner = document.createElement('div');
      inner.style.width = '100%';
      outer.appendChild(inner);

      width = outerWidth - inner.offsetWidth;
      document.body.removeChild(outer);

      return width;
    }

    function getPath(node) {
      var nodes = [node];
      while (node.parentNode) {
        node = node.parentNode;
        nodes.push(node);
      }
      return nodes;
    }

    var Modal = function (_EventEmitter) {
      _inherits(Modal, _EventEmitter);

      _createClass(Modal, null, [{
        key: 'alert',
        value: function alert(message) {
          var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          var options = _extends({}, _defaults, {
            title: message,
            content: false,
            construct: true,
            headerClose: false,
            buttons: Modal.buttons.alert
          }, _options);

          return new Modal(options);
        }
      }, {
        key: 'confirm',
        value: function confirm(question) {
          var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          var options = _extends({}, _defaults, {
            title: question,
            content: false,
            construct: true,
            headerClose: false,
            buttons: Modal.buttons.confirm
          }, _options);

          return new Modal(options);
        }
      }, {
        key: 'templates',
        set: function set(templates) {
          this._baseTemplates = templates;
        },
        get: function get() {
          return _extends({}, _templates, Modal._baseTemplates || {});
        }
      }, {
        key: 'buttons',
        set: function set(buttons) {
          this._baseButtons = buttons;
        },
        get: function get() {
          return _extends({}, _buttons, Modal._baseButtons || {});
        }
      }, {
        key: 'options',
        set: function set(options) {
          this._baseOptions = options;
        },
        get: function get() {
          return _extends({}, _defaults, Modal._baseOptions || {});
        }
      }, {
        key: 'version',
        get: function get() {
          return '0.12.0';
        }
      }]);

      function Modal() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Modal);

        var _this = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this));

        _this.id = guid();
        _this.el = null;
        _this._html = {};
        _this._events = {};
        _this._visible = false;
        _this._pointerInContent = false;
        _this._options = _extends({}, Modal.options, options);
        _this._templates = _extends({}, Modal.templates, options.templates || {});
        _this._html.appendTo = document.querySelector(_this._options.appendTo);
        _this._scrollbarWidth = calcScrollbarWidth();

        if (_this._options.buttons === null) {
          _this._options.buttons = Modal.buttons.dialog;
        }

        if (_this._options.el) {
          var el = _this._options.el;
          if (typeof _this._options.el == 'string') {
            el = document.querySelector(_this._options.el);
            if (!el) {
              throw new Error('Selector: DOM Element ' + _this._options.el + ' not found.');
            }
          }
          data(el, 'modal', _this);
          _this.el = el;
        } else {
          _this._options.construct = true;
        }

        if (_this._options.construct) {
          _this._render();
        } else {
          _this._mapDom();
        }
        return _this;
      }

      _createClass(Modal, [{
        key: '_render',
        value: function _render() {
          var html = this._html;
          var o = this._options;
          var t = this._templates;
          var animate = o.animate ? o.animateClass : false;

          html.container = build(t.container);
          html.dialog = build(t.dialog);
          html.content = build(t.content);
          html.header = build(t.header);
          html.headerClose = build(t.headerClose);
          html.body = build(t.body);
          html.footer = build(t.footer);
          if (animate) html.container.classList.add(animate);

          this._setHeader();
          this._setContent();
          this._setFooter();

          this.el = html.container;

          html.dialog.appendChild(html.content);
          html.container.appendChild(html.dialog);

          return this;
        }
      }, {
        key: '_mapDom',
        value: function _mapDom() {
          var html = this._html;
          var o = this._options;

          if (this.el.classList.contains(o.animateClass)) {
            o.animate = true;
          }

          html.container = this.el;
          html.dialog = this.el.querySelector('.modal-dialog');
          html.content = this.el.querySelector('.modal-content');
          html.header = this.el.querySelector('.modal-header');
          html.headerClose = this.el.querySelector('.modal-header .close');
          html.body = this.el.querySelector('.modal-body');
          html.footer = this.el.querySelector('.modal-footer');

          this._setHeader();
          this._setContent();
          this._setFooter();

          return this;
        }
      }, {
        key: '_setHeader',
        value: function _setHeader() {
          var html = this._html;
          var o = this._options;

          if (o.header && html.header) {
            if (o.title.nodeName) {
              html.header.innerHTML = o.title.outerHTML;
            } else if (typeof o.title === 'string') {
              html.header.innerHTML = '<h4 class="modal-title">' + o.title + '</h4>';
            }
            // Add header close button only to constructed modals.
            if (this.el === null && html.headerClose && o.headerClose) {
              html.header.appendChild(html.headerClose);
            }
            if (o.construct) {
              html.content.appendChild(html.header);
            }
          }
        }
      }, {
        key: '_setContent',
        value: function _setContent() {
          var html = this._html;
          var o = this._options;

          if (o.content && html.body) {
            if (typeof o.content === 'string') {
              html.body.innerHTML = o.content;
            } else {
              html.body.innerHTML = o.content.outerHTML;
            }
            if (o.construct) {
              html.content.appendChild(html.body);
            }
          }
        }
      }, {
        key: '_setFooter',
        value: function _setFooter() {
          var html = this._html;
          var o = this._options;

          if (o.footer && html.footer) {
            if (o.footer.nodeName) {
              html.footer.ineerHTML = o.footer.outerHTML;
            } else if (typeof o.footer === 'string') {
              html.footer.innerHTML = o.footer;
            } else if (!html.footer.children.length) {
              o.buttons.forEach(function (button) {
                var el = document.createElement('button');
                data(el, 'button', button);
                el.innerHTML = button.text;
                el.setAttribute('type', 'button');
                for (var j in button.attr) {
                  el.setAttribute(j, button.attr[j]);
                }
                html.footer.appendChild(el);
              });
            }
            if (o.construct) {
              html.content.appendChild(html.footer);
            }
          }
        }
      }, {
        key: '_setEvents',
        value: function _setEvents() {
          this._options;
          var html = this._html;

          this._events.keydownHandler = this._handleKeydownEvent.bind(this);
          document.body.addEventListener('keydown', this._events.keydownHandler);

          this._events.mousedownHandler = this._handleMousedownEvent.bind(this);
          html.container.addEventListener('mousedown', this._events.mousedownHandler);

          this._events.clickHandler = this._handleClickEvent.bind(this);
          html.container.addEventListener('click', this._events.clickHandler);

          this._events.resizeHandler = this._handleResizeEvent.bind(this);
          window.addEventListener('resize', this._events.resizeHandler);
        }
      }, {
        key: '_handleMousedownEvent',
        value: function _handleMousedownEvent(e) {
          var _this2 = this;

          this._pointerInContent = false;
          var path = getPath(e.target);
          path.every(function (node) {
            if (node.classList && node.classList.contains('modal-content')) {
              _this2._pointerInContent = true;
              return false;
            }
            return true;
          });
        }
      }, {
        key: '_handleClickEvent',
        value: function _handleClickEvent(e) {
          var _this3 = this;

          var path = getPath(e.target);
          path.every(function (node) {
            if (node.tagName === 'HTML') {
              return false;
            }
            if (_this3._options.backdrop !== true && node.classList.contains('modal')) {
              return false;
            }
            if (node.classList.contains('modal-content')) {
              return false;
            }
            if (node.getAttribute('data-dismiss') === 'modal') {
              _this3.emit('dismiss', _this3, e, data(e.target, 'button'));
              _this3.hide();
              return false;
            }

            if (!_this3._pointerInContent && node.classList.contains('modal')) {
              _this3.emit('dismiss', _this3, e, null);
              _this3.hide();
              return false;
            }
            return true;
          });

          this._pointerInContent = false;
        }
      }, {
        key: '_handleKeydownEvent',
        value: function _handleKeydownEvent(e) {
          if (e.which === 27 && this._options.keyboard) {
            this.emit('dismiss', this, e, null);
            this.hide();
          }
        }
      }, {
        key: '_handleResizeEvent',
        value: function _handleResizeEvent(e) {
          this._resize();
        }
      }, {
        key: 'show',
        value: function show() {
          var _this4 = this;

          var o = this._options;
          var html = this._html;
          this.emit('show', this);

          this._checkScrollbar();
          this._setScrollbar();
          document.body.classList.add('modal-open');

          if (o.construct) {
            html.appendTo.appendChild(html.container);
          }

          html.container.style.display = 'block';
          html.container.scrollTop = 0;

          if (o.backdrop !== false) {
            this.once('showBackdrop', function () {
              _this4._setEvents();

              if (o.animate) html.container.offsetWidth; // Force reflow

              html.container.classList.add(o.animateInClass);

              setTimeout(function () {
                _this4._visible = true;
                _this4.emit('shown', _this4);
              }, o.transition);
            });
            this._backdrop();
          } else {
            this._setEvents();

            if (o.animate) html.container.offsetWidth; // Force reflow

            html.container.classList.add(o.animateInClass);

            setTimeout(function () {
              _this4._visible = true;
              _this4.emit('shown', _this4);
            }, o.transition);
          }
          this._resize();

          return this;
        }
      }, {
        key: 'toggle',
        value: function toggle() {
          if (this._visible) {
            this.hide();
          } else {
            this.show();
          }
        }
      }, {
        key: '_resize',
        value: function _resize() {
          var modalIsOverflowing = this._html.container.scrollHeight > document.documentElement.clientHeight;

          this._html.container.style.paddingLeft = !this.bodyIsOverflowing && modalIsOverflowing ? this._scrollbarWidth + 'px' : '';

          this._html.container.style.paddingRight = this.bodyIsOverflowing && !modalIsOverflowing ? this._scrollbarWidth + 'px' : '';
        }
      }, {
        key: '_backdrop',
        value: function _backdrop() {
          var _this5 = this;

          var html = this._html;
          var t = this._templates;
          var o = this._options;
          var animate = o.animate ? o.animateClass : false;

          html.backdrop = build(t.backdrop);
          if (animate) html.backdrop.classList.add(animate);
          html.appendTo.appendChild(html.backdrop);

          if (animate) html.backdrop.offsetWidth;

          html.backdrop.classList.add(o.animateInClass);

          setTimeout(function () {
            _this5.emit('showBackdrop', _this5);
          }, this._options.backdropTransition);
        }
      }, {
        key: 'hide',
        value: function hide() {
          var _this6 = this;

          var html = this._html;
          var o = this._options;
          var contCList = html.container.classList;
          this.emit('hide', this);

          contCList.remove(o.animateInClass);

          if (o.backdrop) {
            var backCList = html.backdrop.classList;
            backCList.remove(o.animateInClass);
          }

          this._removeEvents();

          setTimeout(function () {
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = _this6.originalBodyPad;
          }, o.backdropTransition);

          setTimeout(function () {
            if (o.backdrop) {
              html.backdrop.parentNode.removeChild(html.backdrop);
            }
            html.container.style.display = 'none';

            if (o.construct) {
              html.container.parentNode.removeChild(html.container);
            }

            _this6._visible = false;
            _this6.emit('hidden', _this6);
          }, o.transition);

          return this;
        }
      }, {
        key: '_removeEvents',
        value: function _removeEvents() {
          if (this._events.keydownHandler) {
            document.body.removeEventListener('keydown', this._events.keydownHandler);
          }

          this._html.container.removeEventListener('mousedown', this._events.mousedownHandler);

          this._html.container.removeEventListener('click', this._events.clickHandler);

          window.removeEventListener('resize', this._events.resizeHandler);
        }
      }, {
        key: '_checkScrollbar',
        value: function _checkScrollbar() {
          this.bodyIsOverflowing = document.body.clientWidth < window.innerWidth;
        }
      }, {
        key: '_setScrollbar',
        value: function _setScrollbar() {
          this.originalBodyPad = document.body.style.paddingRight || '';
          if (this.bodyIsOverflowing) {
            var basePadding = parseInt(this.originalBodyPad || 0, 10);
            document.body.style.paddingRight = basePadding + this._scrollbarWidth + 'px';
          }
        }
      }]);

      return Modal;
    }(_events2.default);

    exports.default = Modal;

    /***/ }),
    /* 2 */
    /***/ (function(module, exports) {

    module.exports = EventEmitter;

    /***/ })
    /******/ ]);
    });

    var Modal = /*@__PURE__*/getDefaultExportFromCjs(modal);

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
        let scale = res * Units.METERS_PER_UNIT[unit] * inchesPerMetre * dpi;
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
        es: es,
        en: en
    });

    function compassIcon() {
      return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" id=\"compass\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 300 300\" style=\"enable-background:new 0 0 300 300;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:#EA6868;}\n</style>\n<g>\n\t<g>\n\t\t<g>\n\t\t\t<g>\n\t\t\t\t<g>\n\t\t\t\t\t<path class=\"st0\" d=\"M146.3,9.1L75.5,287.2c-0.5,1.8,0.5,3.7,2.1,4.4c1.8,0.8,3.7,0.2,4.7-1.5l68.4-106.7l66.8,106.7\n\t\t\t\t\t\tc0.6,1.1,1.9,1.8,3.2,1.8c0.5,0,1-0.2,1.5-0.3c1.8-0.8,2.6-2.6,2.3-4.4L153.7,9.1C152.9,5.7,147.2,5.7,146.3,9.1z M154.2,174.2\n\t\t\t\t\t\tc-0.6-1.1-1.9-1.8-3.2-1.8l0,0c-1.3,0-2.6,0.6-3.2,1.8l-59,92L150,25.5l61.1,239.9L154.2,174.2z\"/>\n\t\t\t\t</g>\n\t\t\t</g>\n\t\t\t<g>\n\t\t\t\t<g>\n\t\t\t\t\t<path class=\"st0\" d=\"M220.8,293.1c-1.8,0-3.4-1-4.2-2.3l-65.8-105.1L83.4,290.8c-1.3,1.9-4,2.9-6.1,1.9c-2.3-1-3.4-3.4-2.9-5.8\n\t\t\t\t\t\tL145.1,8.8c0.5-2.1,2.4-3.4,4.9-3.4s4.4,1.3,4.9,3.4l70.8,278.1c0.6,2.4-0.6,4.9-2.9,5.8C222.1,292.9,221.5,293.1,220.8,293.1z\n\t\t\t\t\t\t M150.8,181.2l1,1.6l66.8,106.7c0.6,1,1.9,1.5,3.2,1c1.1-0.5,1.8-1.8,1.5-3.1L152.4,9.3c-0.3-1.1-1.6-1.6-2.6-1.6\n\t\t\t\t\t\ts-2.3,0.5-2.6,1.6L76.4,287.4c-0.3,1.3,0.3,2.6,1.5,3.1c1.1,0.5,2.6,0,3.2-1L150.8,181.2z M85.6,273.2L150,20.6l64.2,251.9\n\t\t\t\t\t\tl-61.1-97.7c-1-1.6-3.4-1.5-4.4,0L85.6,273.2z\"/>\n\t\t\t\t</g>\n\t\t\t</g>\n\t\t</g>\n\t</g>\n</g>\n</svg>\n", 'image/svg+xml')).firstChild;
    }

    function pdfIcon() {
      return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 490 490\" xml:space=\"preserve\">\n<g>\n\t<path d=\"M65.4,6v157.1c0,3.3-2.9,6-6.5,6H33.6c-3.6,0-6.5,2.7-6.5,6v189.6h0l36.3,33.8c1.2,1.1,1.9,2.7,1.9,4.3l0,81.2\n\t\tc0,3.3,2.9,6,6.5,6h383.8c3.6,0,6.5-2.7,6.5-6V104.9c0-1.6-0.7-3.1-1.9-4.3l-106-98.9c-1.2-1.1-2.9-1.8-4.6-1.8H71.8\n\t\tC68.2,0,65.4,2.7,65.4,6z M431.3,357.4h-374c-3.8,0-6.9-4-6.9-9V203.2c0-5,3.1-9,6.9-9h374c3.8,0,6.9,4,6.9,9v145.2\n\t\tC438.2,353.4,435.1,357.4,431.3,357.4z M340.2,27.6l70.8,66c7.2,6.7,2.1,18.2-8.1,18.2h-70.8c-6.3,0-11.4-4.8-11.4-10.7v-66\n\t\tC320.7,25.6,333,20.9,340.2,27.6z\"/>\n\t<path d=\"M136.9,207.4h-6.5H87.9c-5.8,0-10.5,4.9-10.5,11v115.5c0,6.1,4.7,11,10.5,11h4c5.8,0,10.5-4.9,10.5-11v-22.4\n\t\tc0-6.1,4.7-11,10.5-11h18.9l5.8-0.1c18,0,29.9-3,35.8-9.1c5.9-6.1,8.9-18.3,8.9-36.7c0-18.5-3.1-31-9.3-37.5\n\t\tC166.6,210.6,154.7,207.4,136.9,207.4z M152.2,274.4c-3.1,2.7-10.2,4.1-21.5,4.1h-17.9c-5.8,0-10.5-4.9-10.5-11v-27.2\n\t\tc0-6.1,4.7-11,10.5-11h20.4c10.6,0,17.2,1.4,19.8,4.2c2.5,2.8,3.8,10,3.8,21.6C156.8,265.2,155.3,271.6,152.2,274.4z\"/>\n\t<path d=\"M262.6,207.4h-54.1c-5.8,0-10.5,4.9-10.5,11v115.5c0,6.1,4.7,11,10.5,11h54.9c20.7,0,34.1-4.9,39.9-14.6\n\t\tc5.9-9.8,8.9-31.8,8.9-66.1c0-21-3.7-35.7-11-44.1C293.8,211.5,281,207.4,262.6,207.4z M281.6,314.2c-3.5,5.8-11.2,8.6-23.1,8.6\n\t\th-25c-5.8,0-10.5-4.9-10.5-11v-71.6c0-6.1,4.7-11,10.5-11H260c11.6,0,19,2.7,22.1,8.2c3.1,5.5,4.7,18.4,4.7,38.7\n\t\tC286.9,295.8,285.1,308.5,281.6,314.2z\"/>\n\t<path d=\"M340.9,344.8h3.9c5.8,0,10.5-4.9,10.5-11v-34.5c0-6.1,4.7-11,10.5-11h37.9c5.8,0,10.5-4.9,10.5-11v0\n\t\tc0-6.1-4.7-11-10.5-11h-37.9c-5.8,0-10.5-4.9-10.5-11v-15.1c0-6.1,4.7-11,10.5-11h41.1c5.8,0,10.5-4.9,10.5-11v0\n\t\tc0-6.1-4.7-11-10.5-11h-66c-5.8,0-10.5,4.9-10.5,11v115.5C330.4,339.9,335.1,344.8,340.9,344.8z\"/>\n</g>\n</svg>\n", 'image/svg+xml')).firstChild;
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
    class PdfPrinter extends Control__default["default"] {
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
                if (layer instanceof Tile__default["default"]) {
                    const source = layer.getSource();
                    // Set WMS DPI
                    if (source instanceof TileWMS__default["default"]) {
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
                    proj.getPointResolution(this._view.getProjection(), pixelsPerMapMillimeter, this._view.getCenter());
                this._renderCompleteKey = this._map.once('rendercomplete', () => {
                    domToImageImproved
                        .toJpeg(this._mapTarget.querySelector('.ol-unselectable.ol-layers'), {
                        width,
                        height
                    })
                        .then((dataUrl) => __awaiter(this, void 0, void 0, function* () {
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
                        yield this._pdf.addMapHelpers();
                        if (this._isCanceled)
                            return;
                        yield this._pdf.savePdf();
                        // Reset original map size
                        this._onEndPrint();
                        if (showLoading)
                            this._disableLoading();
                    }))
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
                Observable.unByKey(this._renderCompleteKey);
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

    return PdfPrinter;

}));
//# sourceMappingURL=ol-pdf-printer.js.map
