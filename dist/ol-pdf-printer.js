/*!
 * ol-pdf-printer - v2.0.2
 * https://github.com/GastonZalba/ol-pdf-printer#readme
 * Built: Tue Oct 10 2023 10:44:16 GMT-0300 (hora estándar de Argentina)
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/control/Control.js'), require('ol/proj.js'), require('ol/Observable.js'), require('ol/source/Cluster.js'), require('ol/layer/Vector.js'), require('jspdf'), require('pdfjs-dist'), require('ol/uri.js'), require('ol/proj/Units.js'), require('ol/source/ImageWMS.js'), require('ol/layer/Tile.js'), require('ol/layer/Image.js'), require('ol/source/TileWMS.js'), require('ol/geom/Polygon'), require('ol/Overlay')) :
	typeof define === 'function' && define.amd ? define(['ol/control/Control.js', 'ol/proj.js', 'ol/Observable.js', 'ol/source/Cluster.js', 'ol/layer/Vector.js', 'jspdf', 'pdfjs-dist', 'ol/uri.js', 'ol/proj/Units.js', 'ol/source/ImageWMS.js', 'ol/layer/Tile.js', 'ol/layer/Image.js', 'ol/source/TileWMS.js', 'ol/geom/Polygon', 'ol/Overlay'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PdfPrinter = factory(global.ol.control.Control, global.ol.proj, global.ol.Observable, global.ol.source.Cluster, global.ol.layer.Vector, global.jsPDF, global.pdfjsLib, global.ol.uri, global.ol.proj.Units, global.ol.source.ImageWMS, global.ol.layer.Tile, global.ol.layer.Image, global.ol.source.TileWMS, global.ol.geom.Polygon, global.ol.Overlay));
})(this, (function (Control, proj_js, Observable_js, Cluster, VectorLayer, jspdf, pdfjsDist, uri_js, Units_js, ImageWMS, TileLayer, ImageLayer, TileWMS, Polygon, Overlay) { 'use strict';

	var global = window;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var domToImageMore_min = {exports: {}};

	/*! dom-to-image-more 03-10-2023 */

	(function (module, exports) {
		!function(s){const f=function(){let e=0;return {escape:function(e){return e.replace(/([.*+?^${}()|[]\/\\])/g,"\\$1")},isDataUrl:function(e){return -1!==e.search(/^(data:)/)},canvasToBlob:function(t){if(t.toBlob)return new Promise(function(e){t.toBlob(e);});return function(r){return new Promise(function(e){var t=l(r.toDataURL().split(",")[1]),n=t.length,o=new Uint8Array(n);for(let e=0;e<n;e++)o[e]=t.charCodeAt(e);e(new Blob([o],{type:"image/png"}));})}(t)},resolveUrl:function(e,t){var n=document.implementation.createHTMLDocument(),o=n.createElement("base"),r=(n.head.appendChild(o),n.createElement("a"));return n.body.appendChild(r),o.href=t,r.href=e,r.href},getAndEncode:function(l){let e=c.impl.urlCache.find(function(e){return e.url===l});e||(e={url:l,promise:null},c.impl.urlCache.push(e));null===e.promise&&(c.impl.options.cacheBust&&(l+=(/\?/.test(l)?"&":"?")+(new Date).getTime()),e.promise=new Promise(function(t){const e=c.impl.options.httpTimeout,n=new XMLHttpRequest;if(n.onreadystatechange=function(){if(4===n.readyState)if(300<=n.status)r?t(r):i(`cannot fetch resource: ${l}, status: `+n.status);else {const e=new FileReader;e.onloadend=function(){t(e.result);},e.readAsDataURL(n.response);}},n.ontimeout=function(){r?t(r):i(`timeout of ${e}ms occured while fetching resource: `+l);},n.responseType="blob",n.timeout=e,c.impl.options.useCredentials&&(n.withCredentials=!0),c.impl.options.corsImg&&0===l.indexOf("http")&&-1===l.indexOf(window.location.origin)){var o="POST"===(c.impl.options.corsImg.method||"GET").toUpperCase()?"POST":"GET";n.open(o,(c.impl.options.corsImg.url||"").replace("#{cors}",l),!0);let t=!1;const s=c.impl.options.corsImg.headers||{},u=(Object.keys(s).forEach(function(e){-1!==s[e].indexOf("application/json")&&(t=!0),n.setRequestHeader(e,s[e]);}),function(e){try{return JSON.parse(JSON.stringify(e))}catch(e){i("corsImg.data is missing or invalid");}}(c.impl.options.corsImg.data||""));Object.keys(u).forEach(function(e){"string"==typeof u[e]&&(u[e]=u[e].replace("#{cors}",l));}),n.send(t?JSON.stringify(u):u);}else n.open("GET",l,!0),n.send();let r;function i(e){console.error(e),t("");}c.impl.options.imagePlaceholder&&(o=c.impl.options.imagePlaceholder.split(/,/))&&o[1]&&(r=o[1]);}));return e.promise},uid:function(){return "u"+("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)+e++},delay:function(n){return function(t){return new Promise(function(e){setTimeout(function(){e(t);},n);})}},asArray:function(t){var n=[],o=t.length;for(let e=0;e<o;e++)n.push(t[e]);return n},escapeXhtml:function(e){return e.replace(/%/g,"%25").replace(/#/g,"%23").replace(/\n/g,"%0A")},makeImage:function(o){return "data:,"!==o?new Promise(function(e,t){const n=new Image;c.impl.options.useCredentials&&(n.crossOrigin="use-credentials"),n.onload=function(){window&&window.requestAnimationFrame?window.requestAnimationFrame(function(){e(n);}):e(n);},n.onerror=t,n.src=o;}):Promise.resolve()},width:function(e){var t=i(e,"width");if(!isNaN(t))return t;var t=i(e,"border-left-width"),n=i(e,"border-right-width");return e.scrollWidth+t+n},height:function(e){var t=i(e,"height");if(!isNaN(t))return t;var t=i(e,"border-top-width"),n=i(e,"border-bottom-width");return e.scrollHeight+t+n},getWindow:t,isElement:r,isElementHostForOpenShadowRoot:function(e){return r(e)&&null!==e.shadowRoot},isShadowRoot:n,isInShadowRoot:o,isHTMLElement:function(e){return e instanceof t(e).HTMLElement},isHTMLCanvasElement:function(e){return e instanceof t(e).HTMLCanvasElement},isHTMLInputElement:function(e){return e instanceof t(e).HTMLInputElement},isHTMLImageElement:function(e){return e instanceof t(e).HTMLImageElement},isHTMLLinkElement:function(e){return e instanceof t(e).HTMLLinkElement},isHTMLScriptElement:function(e){return e instanceof t(e).HTMLScriptElement},isHTMLStyleElement:function(e){return e instanceof t(e).HTMLStyleElement},isHTMLTextAreaElement:function(e){return e instanceof t(e).HTMLTextAreaElement},isShadowSlotElement:function(e){return o(e)&&e instanceof t(e).HTMLSlotElement},isSVGElement:function(e){return e instanceof t(e).SVGElement},isSVGRectElement:function(e){return e instanceof t(e).SVGRectElement},isDimensionMissing:function(e){return isNaN(e)||e<=0}};function t(e){e=e?e.ownerDocument:void 0;return (e?e.defaultView:void 0)||s||window}function n(e){return e instanceof t(e).ShadowRoot}function o(e){return null!==e&&Object.prototype.hasOwnProperty.call(e,"getRootNode")&&n(e.getRootNode())}function r(e){return e instanceof t(e).Element}function i(t,n){if(t.nodeType===a){let e=m(t).getPropertyValue(n);if("px"===e.slice(-2))return e=e.slice(0,-2),parseFloat(e)}return NaN}}(),r=function(){const o=/url\(['"]?([^'"]+?)['"]?\)/g;return {inlineAll:function(t,o,r){if(!e(t))return Promise.resolve(t);return Promise.resolve(t).then(n).then(function(e){let n=Promise.resolve(t);return e.forEach(function(t){n=n.then(function(e){return i(e,t,o,r)});}),n})},shouldProcess:e,impl:{readUrls:n,inline:i}};function e(e){return -1!==e.search(o)}function n(e){for(var t,n=[];null!==(t=o.exec(e));)n.push(t[1]);return n.filter(function(e){return !f.isDataUrl(e)})}function i(n,o,t,e){return Promise.resolve(o).then(function(e){return t?f.resolveUrl(e,t):e}).then(e||f.getAndEncode).then(function(e){return n.replace((t=o,new RegExp(`(url\\(['"]?)(${f.escape(t)})(['"]?\\))`,"g")),`$1${e}$3`);var t;})}}(),e={resolveAll:function(){return t().then(function(e){return Promise.all(e.map(function(e){return e.resolve()}))}).then(function(e){return e.join("\n")})},impl:{readAll:t}};function t(){return Promise.resolve(f.asArray(document.styleSheets)).then(function(e){const n=[];return e.forEach(function(t){if(Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(t),"cssRules"))try{f.asArray(t.cssRules||[]).forEach(n.push.bind(n));}catch(e){console.error("domtoimage: Error while reading CSS rules from "+t.href,e.toString());}}),n}).then(function(e){return e.filter(function(e){return e.type===CSSRule.FONT_FACE_RULE}).filter(function(e){return r.shouldProcess(e.style.getPropertyValue("src"))})}).then(function(e){return e.map(t)});function t(t){return {resolve:function(){var e=(t.parentStyleSheet||{}).href;return r.inlineAll(t.cssText,e)},src:function(){return t.style.getPropertyValue("src")}}}}const n={inlineAll:function t(e){if(!f.isElement(e))return Promise.resolve(e);return n(e).then(function(){return f.isHTMLImageElement(e)?o(e).inline():Promise.all(f.asArray(e.childNodes).map(function(e){return t(e)}))});function n(o){const e=["background","background-image"],t=e.map(function(t){const e=o.style.getPropertyValue(t),n=o.style.getPropertyPriority(t);return e?r.inlineAll(e).then(function(e){o.style.setProperty(t,e,n);}):Promise.resolve()});return Promise.all(t).then(function(){return o})}},impl:{newImage:o}};function o(n){return {inline:function(e){if(f.isDataUrl(n.src))return Promise.resolve();return Promise.resolve(n.src).then(e||f.getAndEncode).then(function(t){return new Promise(function(e){n.onload=e,n.onerror=e,n.src=t;})})}}}const u={copyDefaultStyles:!0,imagePlaceholder:void 0,cacheBust:!1,useCredentials:!1,httpTimeout:3e4,styleCaching:"strict",corsImg:void 0},c={toSvg:d,toPng:function(e,t){return i(e,t).then(function(e){return e.toDataURL()})},toJpeg:function(e,t){return i(e,t).then(function(e){return e.toDataURL("image/jpeg",(t?t.quality:void 0)||1)})},toBlob:function(e,t){return i(e,t).then(f.canvasToBlob)},toPixelData:function(t,e){return i(t,e).then(function(e){return e.getContext("2d").getImageData(0,0,f.width(t),f.height(t)).data})},toCanvas:i,impl:{fontFaces:e,images:n,util:f,inliner:r,urlCache:[],options:{}}},a=(module.exports=c,("undefined"!=typeof Node?Node.ELEMENT_NODE:void 0)||1),m=(void 0!==s?s.getComputedStyle:void 0)||("undefined"!=typeof window?window.getComputedStyle:void 0)||globalThis.getComputedStyle,l=(void 0!==s?s.atob:void 0)||("undefined"!=typeof window?window.atob:void 0)||globalThis.atob;function d(e,r){c.impl.util.getWindow(e);var n=r=r||{};void 0===n.copyDefaultStyles?c.impl.options.copyDefaultStyles=u.copyDefaultStyles:c.impl.options.copyDefaultStyles=n.copyDefaultStyles,void 0===n.imagePlaceholder?c.impl.options.imagePlaceholder=u.imagePlaceholder:c.impl.options.imagePlaceholder=n.imagePlaceholder,void 0===n.cacheBust?c.impl.options.cacheBust=u.cacheBust:c.impl.options.cacheBust=n.cacheBust,void 0===n.corsImg?c.impl.options.corsImg=u.corsImg:c.impl.options.corsImg=n.corsImg,void 0===n.useCredentials?c.impl.options.useCredentials=u.useCredentials:c.impl.options.useCredentials=n.useCredentials,void 0===n.httpTimeout?c.impl.options.httpTimeout=u.httpTimeout:c.impl.options.httpTimeout=n.httpTimeout,void 0===n.styleCaching?c.impl.options.styleCaching=u.styleCaching:c.impl.options.styleCaching=n.styleCaching;let i=[];return Promise.resolve(e).then(function(e){if(e.nodeType===a)return e;var t=e,n=e.parentNode,o=document.createElement("span");return n.replaceChild(o,t),o.append(e),i.push({parent:n,child:t,wrapper:o}),o}).then(function(e){return function u(t,a,r,l){const e=a.filter;if(t===h||f.isHTMLScriptElement(t)||f.isHTMLStyleElement(t)||f.isHTMLLinkElement(t)||null!==r&&e&&!e(t))return Promise.resolve();return Promise.resolve(t).then(n).then(function(e){return i(e,o(t))}).then(function(e){return s(e,t)});function n(e){return f.isHTMLCanvasElement(e)?f.makeImage(e.toDataURL()):e.cloneNode(!1)}function o(e){return f.isElementHostForOpenShadowRoot(e)?e.shadowRoot:e}function i(t,e){const n=i(e);let o=Promise.resolve();if(0!==n.length){const s=m(r(e));f.asArray(n).forEach(function(e){o=o.then(function(){return u(e,a,s).then(function(e){e&&t.appendChild(e);})});});}return o.then(function(){return t});function r(e){return f.isShadowRoot(e)?e.host:e}function i(e){return f.isShadowSlotElement(e)?e.assignedNodes():e.childNodes}}function s(l,c){return !f.isElement(l)||f.isShadowSlotElement(c)?Promise.resolve(l):Promise.resolve().then(e).then(t).then(n).then(o).then(function(){return l});function e(){function o(e,t){t.font=e.font,t.fontFamily=e.fontFamily,t.fontFeatureSettings=e.fontFeatureSettings,t.fontKerning=e.fontKerning,t.fontSize=e.fontSize,t.fontStretch=e.fontStretch,t.fontStyle=e.fontStyle,t.fontVariant=e.fontVariant,t.fontVariantCaps=e.fontVariantCaps,t.fontVariantEastAsian=e.fontVariantEastAsian,t.fontVariantLigatures=e.fontVariantLigatures,t.fontVariantNumeric=e.fontVariantNumeric,t.fontVariationSettings=e.fontVariationSettings,t.fontWeight=e.fontWeight;}function e(e,t){const n=m(e);n.cssText?(t.style.cssText=n.cssText,o(n,t.style)):(y(a,e,n,r,t),null===r&&(["inset-block","inset-block-start","inset-block-end"].forEach(e=>t.style.removeProperty(e)),["left","right","top","bottom"].forEach(e=>{t.style.getPropertyValue(e)&&t.style.setProperty(e,"0px");})));}e(c,l);}function t(){const u=f.uid();function t(r){const i=m(c,r),s=i.getPropertyValue("content");if(""!==s&&"none"!==s){const t=l.getAttribute("class")||"",n=(l.setAttribute("class",t+" "+u),document.createElement("style"));function e(){const e=`.${u}:`+r,t=(i.cssText?n:o)();return document.createTextNode(e+`{${t}}`);function n(){return `${i.cssText} content: ${s};`}function o(){const e=f.asArray(i).map(t).join("; ");return e+";";function t(e){const t=i.getPropertyValue(e),n=i.getPropertyPriority(e)?" !important":"";return e+": "+t+n}}}n.appendChild(e()),l.appendChild(n);}}[":before",":after"].forEach(function(e){t(e);});}function n(){f.isHTMLTextAreaElement(c)&&(l.innerHTML=c.value),f.isHTMLInputElement(c)&&l.setAttribute("value",c.value);}function o(){f.isSVGElement(l)&&(l.setAttribute("xmlns","http://www.w3.org/2000/svg"),f.isSVGRectElement(l))&&["width","height"].forEach(function(e){const t=l.getAttribute(e);t&&l.style.setProperty(e,t);});}}}(e,r,null)}).then(p).then(g).then(function(t){r.bgcolor&&(t.style.backgroundColor=r.bgcolor);r.width&&(t.style.width=r.width+"px");r.height&&(t.style.height=r.height+"px");r.style&&Object.keys(r.style).forEach(function(e){t.style[e]=r.style[e];});let e=null;"function"==typeof r.onclone&&(e=r.onclone(t));return Promise.resolve(e).then(function(){return t})}).then(function(e){let n=r.width||f.width(e),o=r.height||f.height(e);return Promise.resolve(e).then(function(e){return e.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),(new XMLSerializer).serializeToString(e)}).then(f.escapeXhtml).then(function(e){var t=(f.isDimensionMissing(n)?' width="100%"':` width="${n}"`)+(f.isDimensionMissing(o)?' height="100%"':` height="${o}"`);return `<svg xmlns="http://www.w3.org/2000/svg"${(f.isDimensionMissing(n)?"":` width="${n}"`)+(f.isDimensionMissing(o)?"":` height="${o}"`)}><foreignObject${t}>${e}</foreignObject></svg>`}).then(function(e){return "data:image/svg+xml;charset=utf-8,"+e})}).then(function(e){for(;0<i.length;){var t=i.pop();t.parent.replaceChild(t.child,t.wrapper);}return e}).then(function(e){return c.impl.urlCache=[],function(){h&&(document.body.removeChild(h),h=null);w&&clearTimeout(w);w=setTimeout(()=>{w=null,E={};},2e4);}(),e})}function i(r,i){return d(r,i=i||{}).then(f.makeImage).then(function(e){var t="number"!=typeof i.scale?1:i.scale,n=function(e,t){let n=i.width||f.width(e),o=i.height||f.height(e);f.isDimensionMissing(n)&&(n=f.isDimensionMissing(o)?300:2*o);f.isDimensionMissing(o)&&(o=n/2);e=document.createElement("canvas");e.width=n*t,e.height=o*t,i.bgcolor&&((t=e.getContext("2d")).fillStyle=i.bgcolor,t.fillRect(0,0,e.width,e.height));return e}(r,t),o=n.getContext("2d");return o.msImageSmoothingEnabled=!1,o.imageSmoothingEnabled=!1,e&&(o.scale(t,t),o.drawImage(e,0,0)),n})}let h=null;function p(n){return e.resolveAll().then(function(e){var t;return ""!==e&&(t=document.createElement("style"),n.appendChild(t),t.appendChild(document.createTextNode(e))),n})}function g(e){return n.inlineAll(e).then(function(){return e})}function y(e,t,i,s,n){const u=c.impl.options.copyDefaultStyles?function(t,e){var e=function(e){var t=[];do{if(e.nodeType===a){var n=e.tagName;if(t.push(n),v.includes(n))break}}while(e=e.parentNode,e);return t}(e),n=function(e){return ("relaxed"!==t.styleCaching?e:e.filter((e,t,n)=>0===t||t===n.length-1)).join(">")}(e);if(E[n])return E[n];var o=function(){if(h)return h.contentWindow;var e=document.characterSet||"UTF-8",t=document.doctype,t=t?(`<!DOCTYPE ${n(t.name)} ${n(t.publicId)} `+n(t.systemId)).trim()+">":"";return (h=document.createElement("iframe")).id="domtoimage-sandbox-"+f.uid(),h.style.visibility="hidden",h.style.position="fixed",document.body.appendChild(h),function(e,t,n,o){try{return e.contentWindow.document.write(t+`<html><head><meta charset='${n}'><title>${o}</title></head><body></body></html>`),e.contentWindow}catch(e){}var r=document.createElement("meta");r.setAttribute("charset",n);try{var i=document.implementation.createHTMLDocument(o),s=(i.head.appendChild(r),t+i.documentElement.outerHTML);return e.setAttribute("srcdoc",s),e.contentWindow}catch(e){}return e.contentDocument.head.appendChild(r),e.contentDocument.title=o,e.contentWindow}(h,t,e,"domtoimage-sandbox");function n(e){var t;return e?((t=document.createElement("div")).innerText=e,t.innerHTML):""}}(),e=function(e,t){let n=e.body;do{var o=t.pop(),o=e.createElement(o);n.appendChild(o),n=o;}while(0<t.length);return n.textContent="​",n}(o.document,e),o=function(e,t){const n={},o=e.getComputedStyle(t);return f.asArray(o).forEach(function(e){n[e]="width"===e||"height"===e?"auto":o.getPropertyValue(e);}),n}(o,e);return function(e){do{var t=e.parentElement;null!==t&&t.removeChild(e),e=t;}while(e&&"BODY"!==e.tagName)}(e),E[n]=o}(e,t):{},l=n.style;f.asArray(i).forEach(function(e){var t,n=i.getPropertyValue(e),o=u[e],r=s?s.getPropertyValue(e):void 0;(n!==o||s&&n!==r)&&(o=i.getPropertyPriority(e),r=l,n=n,o=o,t=0<=["background-clip"].indexOf(e=e),o?(r.setProperty(e,n,o),t&&r.setProperty("-webkit-"+e,n,o)):(r.setProperty(e,n),t&&r.setProperty("-webkit-"+e,n)));});}let w=null,E={};const v=["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","DETAILS","DIALOG","DD","DIV","DL","DT","FIELDSET","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HGROUP","HR","LI","MAIN","NAV","OL","P","PRE","SECTION","SVG","TABLE","UL","math","svg","BODY","HEAD","HTML"];}(commonjsGlobal);
		
	} (domToImageMore_min));

	var domToImageMore_minExports = domToImageMore_min.exports;
	var domtoimage = /*@__PURE__*/getDefaultExportFromCjs(domToImageMore_minExports);

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
	    let scale = res * Units_js.METERS_PER_UNIT[unit] * inchesPerMetre * dpi;
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
	        return uri_js.appendParams(url, params);
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
	         * This function is a mess
	         * @returns
	         * @protected
	         */
	        this._addWatermark = async (watermark) => {
	            const getImageElement = async (image) => {
	                let imgData;
	                if (typeof image === 'string') {
	                    imgData = image;
	                }
	                else if (image instanceof SVGElement) {
	                    imgData = await this._processSvgImage(image);
	                }
	                else {
	                    throw this._i18n.errorImage;
	                }
	                return new Promise((resolve, reject) => {
	                    const image = new Image();
	                    image.onload = () => {
	                        try {
	                            resolve(image);
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
	            };
	            let logoImage;
	            const position = 'topright';
	            const offset = { x: 2, y: 2 };
	            const fontSize = 14;
	            const logoSizeHeight = 12;
	            let logoSizeWidth;
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
	                }
	                else {
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
	                    titleYPosition -= 2.5;
	                }
	            }
	            else {
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
	                    const wSub = this._pdf.doc.getTextDimensions(watermark.subtitle).w;
	                    w = wSub > w ? wSub : w;
	                    this._pdf.doc.setFontSize(fontSize);
	                }
	                // Adaptable width, fixed height
	                const widthBack = w + paddingBack * 2;
	                this._addRoundedBox(x - widthBack + 2 - marginRight, y - 4, widthBack + paddingBack + marginRight + logoSpace, backBoxHeight, this._style.watermark.bkcolor, this._style.watermark.brcolor);
	                back = true;
	                this._pdf.doc.setFont('helvetica', 'bold');
	                this._pdf.doc.text(watermark.title, x - marginRight, titleYPosition, {
	                    align: 'right'
	                });
	            }
	            if (watermark.subtitle) {
	                this._pdf.doc.setTextColor(this._style.watermark.txcolorsubtitle);
	                this._pdf.doc.setFontSize(fontSizeSubtitle);
	                this._pdf.doc.setFont('helvetica', 'normal');
	                // only subtitle, no title
	                if (!back) {
	                    const { w } = this._pdf.doc.getTextDimensions(watermark.subtitle);
	                    const widthBack = paddingBack * 2 + w;
	                    this._addRoundedBox(x - widthBack + 2 - marginRight, y - 4, widthBack + paddingBack + marginRight, backBoxHeight, this._style.watermark.bkcolor, this._style.watermark.brcolor);
	                    back = true;
	                }
	                this._pdf.doc.text(watermark.subtitle, x - marginRight, subtitleYPosition, {
	                    align: 'right'
	                });
	            }
	            if (!watermark.logo)
	                return;
	            if (!back) {
	                const widthBack = marginRight + paddingBack;
	                this._addRoundedBox(x, y - 4, widthBack, 16, this._style.watermark.bkcolor, this._style.watermark.brcolor);
	            }
	            this._pdf.doc.addImage(logoImage, 'PNG', x - logoSizeWidth, y, logoSizeWidth, logoSizeHeight);
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
	            const createNode = (content) => {
	                return createElement("span", null, content);
	            };
	            const attributions = this._map
	                .getLayers()
	                .getArray()
	                .flatMap((l) => {
	                if ('getSource' in l && typeof l.getSource === 'function') {
	                    const attr = l
	                        .getSource()
	                        .getAttributions();
	                    if (attr) {
	                        if (typeof attr === 'function') {
	                            try {
	                                return attr(null);
	                            }
	                            catch (err) {
	                                console.error(err);
	                            }
	                        }
	                        return attr;
	                    }
	                }
	                return [];
	            });
	            if (!attributions.length)
	                return;
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
	            const whiteSpaceWidth = this._pdf.doc.getTextDimensions(ATTRI_SEPATATOR, { fontSize }).w;
	            this._addRoundedBox(x - w - 2, y - h, w + paddingBack + 2, h + paddingBack, this._style.attributions.bkcolor, this._style.attributions.brcolor);
	            Array.from(attributionsList)
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
	                const versionPdfJS = ((_a = window === null || window === void 0 ? void 0 : window.pdfjsLib) === null || _a === void 0 ? void 0 : _a.version) || pdfjsDist.version;
	                pdfjsDist.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${versionPdfJS}/pdf.worker.js`;
	                pdfjsDist.getDocument(pdf).promise.then((pdf) => {
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
	        return (proj_js.getPointResolution(proj, scaleResolution, this._view.getCenter()) *
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

	/**
	 * Vanilla JS Modal compatible with Bootstrap
	 * modal-vanilla 0.12.0 <https://github.com/KaneCohen/modal-vanilla>
	 * Copyright 2020 Kane Cohen <https://github.com/KaneCohen>
	 * Available under BSD-3-Clause license
	 */

	let _factory = null;

	const _defaults = Object.freeze({
	  el: null,               // Existing DOM element that will be 'Modal-ized'.
	  animate: true,          // Show Modal using animation.
	  animateClass: 'fade',   //
	  animateInClass: 'show', //
	  appendTo: 'body',       // DOM element to which constructed Modal will be appended.
	  backdrop: true,         // Boolean or 'static', Show Modal backdrop blocking content.
	  keyboard: true,         // Close modal on esc key.
	  title: false,           // Content of the title in the constructed dialog.
	  header: true,           // Show header content.
	  content: false,         // Either string or an HTML element.
	  footer: true,           // Footer content. By default will use buttons.
	  buttons: null,          //
	  headerClose: true,      // Show close button in the header.
	  construct: false,       // Creates new HTML with a given content.
	  transition: 300,        //
	  backdropTransition: 150 //
	});

	const _buttons = deepFreeze({
	  dialog: [
	    {text: 'Cancel',
	      value: false,
	      attr: {
	        'class': 'btn btn-default',
	        'data-dismiss': 'modal'
	      }
	    },
	    {text: 'OK',
	      value: true,
	      attr: {
	        'class': 'btn btn-primary',
	        'data-dismiss': 'modal'
	      }
	    }
	  ],
	  alert: [
	    {text: 'OK',
	      attr: {
	        'class': 'btn btn-primary',
	        'data-dismiss': 'modal'
	      }
	    }
	  ],
	  confirm: [
	    {text: 'Cancel',
	      value: false,
	      attr: {
	        'class': 'btn btn-default',
	        'data-dismiss': 'modal'
	      }
	    },
	    {text: 'OK',
	      value: true,
	      attr: {
	        'class': 'btn btn-primary',
	        'data-dismiss': 'modal'
	      }
	    }
	  ]
	});

	const _templates = {
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
	  for (let k in obj) {
	    if (Array.isArray(obj[k])) {
	      obj[k].forEach(v => {
	        deepFreeze(v);
	      });
	    } else if (obj[k] !== null && typeof obj[k] === 'object') {
	      Object.freeze(obj[k]);
	    }
	  }
	  return Object.freeze(obj);
	}

	function guid() {
	  return (((1 + Math.random()) * 0x10000) | 0).toString(16) +
	    (((1 + Math.random()) * 0x10000) | 0).toString(16);
	}

	function data(el, prop, value) {
	 let prefix = 'data';
	 let elData = el[prefix] || {};
	 if (typeof value === 'undefined') {
	   if (el[prefix] && el[prefix][prop]) {
	     return el[prefix][prop];
	   } else {
	     var dataAttr = el.getAttribute(`${prefix}-${prop}`);
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
	  let inner;
	  let width;
	  let outerWidth;
	  let outer = document.createElement('div');
	  Object.assign(outer.style, {
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
	  let nodes = [node];
	  while (node.parentNode) {
	    node = node.parentNode;
	    nodes.push(node);
	  }
	  return nodes;
	}

	class Modal extends EventEmitter {
	  static set templates(templates) {
	    this._baseTemplates = templates;
	  }

	  static get templates() {
	    return Object.assign({}, _templates, Modal._baseTemplates || {});
	  }

	  static set buttons(buttons) {
	    this._baseButtons = buttons;
	  }

	  static get buttons() {
	    return Object.assign({}, _buttons, Modal._baseButtons || {});
	  }

	  static set options(options) {
	    this._baseOptions = options;
	  }

	  static get options() {
	    return Object.assign({}, _defaults, Modal._baseOptions || {});
	  }

	  static get version() {
	    return '0.12.0';
	  }

	  static alert(message, _options = {}) {
	    let options = Object.assign({},
	      _defaults,
	      {
	        title:  message,
	        content: false,
	        construct: true,
	        headerClose: false,
	        buttons: Modal.buttons.alert
	      },
	      _options
	    );

	    return new Modal(options);
	  }

	  static confirm(question, _options = {}) {
	    let options = Object.assign({},
	      _defaults,
	      {
	        title:  question,
	        content: false,
	        construct: true,
	        headerClose: false,
	        buttons: Modal.buttons.confirm
	      },
	      _options
	    );

	    return new Modal(options);
	  }

	  constructor(options = {}) {
	    super();

	    this.id = guid();
	    this.el = null;
	    this._html = {};
	    this._events = {};
	    this._visible = false;
	    this._pointerInContent = false;
	    this._options = Object.assign({}, Modal.options, options);
	    this._templates = Object.assign({}, Modal.templates, options.templates || {});
	    this._html.appendTo = document.querySelector(this._options.appendTo);
	    this._scrollbarWidth = calcScrollbarWidth();

	    if (this._options.buttons === null) {
	      this._options.buttons = Modal.buttons.dialog;
	    }

	    if (this._options.el) {
	      let el = this._options.el;
	      if (typeof this._options.el == 'string') {
	        el = document.querySelector(this._options.el);
	        if (! el) {
	          throw new Error(`Selector: DOM Element ${this._options.el} not found.`);
	        }
	      }
	      data(el, 'modal', this);
	      this.el = el;
	    } else {
	      this._options.construct = true;
	    }

	    if (this._options.construct) {
	      this._render();
	    } else {
	      this._mapDom();
	    }
	  }

	  _render() {
	    let html = this._html;
	    let o = this._options;
	    let t = this._templates;
	    let animate = o.animate ? o.animateClass : false;

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

	  _mapDom() {
	    let html = this._html;
	    let o = this._options;

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

	  _setHeader() {
	    let html = this._html;
	    let o = this._options;

	    if (o.header && html.header) {
	      if (o.title.nodeName) {
	        html.header.innerHTML = o.title.outerHTML;
	      } else if (typeof o.title === 'string') {
	        html.header.innerHTML = `<h4 class="modal-title">${o.title}</h4>`;
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

	  _setContent() {
	    let html = this._html;
	    let o = this._options;

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

	  _setFooter() {
	    let html = this._html;
	    let o = this._options;

	    if (o.footer && html.footer) {
	      if (o.footer.nodeName) {
	        html.footer.ineerHTML = o.footer.outerHTML;
	      } else if (typeof o.footer === 'string') {
	        html.footer.innerHTML = o.footer;
	      } else if (! html.footer.children.length) {
	        o.buttons.forEach((button) => {
	          let el = document.createElement('button');
	          data(el, 'button', button);
	          el.innerHTML = button.text;
	          el.setAttribute('type', 'button');
	          for (let j in button.attr) {
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

	  _setEvents() {
	    this._options;
	    let html = this._html;

	    this._events.keydownHandler = this._handleKeydownEvent.bind(this);
	    document.body.addEventListener('keydown',
	      this._events.keydownHandler
	    );

	    this._events.mousedownHandler = this._handleMousedownEvent.bind(this);
	    html.container.addEventListener('mousedown',
	      this._events.mousedownHandler
	    );

	    this._events.clickHandler = this._handleClickEvent.bind(this);
	    html.container.addEventListener('click',
	      this._events.clickHandler
	    );

	    this._events.resizeHandler = this._handleResizeEvent.bind(this);
	    window.addEventListener('resize',
	      this._events.resizeHandler
	    );
	  }

	  _handleMousedownEvent(e) {
	    this._pointerInContent = false;
	    let path = getPath(e.target);
	    path.every(node => {
	      if (node.classList && node.classList.contains('modal-content')) {
	        this._pointerInContent = true;
	        return false;
	      }
	      return true;
	    });
	  }

	  _handleClickEvent(e) {
	    let path = getPath(e.target);
	    path.every(node => {
	      if (node.tagName === 'HTML') {
	        return false;
	      }
	      if (this._options.backdrop !== true && node.classList.contains('modal')) {
	        return false;
	      }
	      if (node.classList.contains('modal-content')) {
	        return false;
	      }
	      if (node.getAttribute('data-dismiss') === 'modal') {
	        this.emit('dismiss', this, e, data(e.target, 'button'));
	        this.hide();
	        return false;
	      }

	      if (!this._pointerInContent && node.classList.contains('modal')) {
	        this.emit('dismiss', this, e, null);
	        this.hide();
	        return false;
	      }
	      return true;
	    });

	    this._pointerInContent = false;
	  }

	  _handleKeydownEvent(e) {
	    if (e.which === 27 && this._options.keyboard) {
	      this.emit('dismiss', this, e, null);
	      this.hide();
	    }
	  }

	  _handleResizeEvent(e) {
	    this._resize();
	  }

	  show() {
	    let o = this._options;
	    let html = this._html;
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
	      this.once('showBackdrop', () => {
	        this._setEvents();

	        if (o.animate) html.container.offsetWidth; // Force reflow

	        html.container.classList.add(o.animateInClass);

	        setTimeout(() => {
	          this._visible = true;
	          this.emit('shown', this);
	        }, o.transition);
	      });
	      this._backdrop();
	    } else {
	      this._setEvents();

	      if (o.animate) html.container.offsetWidth; // Force reflow

	      html.container.classList.add(o.animateInClass);

	      setTimeout(() => {
	        this._visible = true;
	        this.emit('shown', this);
	      }, o.transition);
	    }
	    this._resize();

	    return this;
	  }

	  toggle() {
	    if (this._visible) {
	      this.hide();
	    } else {
	      this.show();
	    }
	  }

	  _resize() {
	    var modalIsOverflowing =
	      this._html.container.scrollHeight > document.documentElement.clientHeight;

	    this._html.container.style.paddingLeft =
	      ! this.bodyIsOverflowing && modalIsOverflowing ? this._scrollbarWidth + 'px' : '';

	    this._html.container.style.paddingRight =
	      this.bodyIsOverflowing && ! modalIsOverflowing ? this._scrollbarWidth + 'px' : '';
	  }

	  _backdrop() {
	    let html = this._html;
	    let t = this._templates;
	    let o = this._options;
	    let animate = o.animate ? o.animateClass : false;

	    html.backdrop = build(t.backdrop);
	    if (animate) html.backdrop.classList.add(animate);
	    html.appendTo.appendChild(html.backdrop);

	    if (animate) html.backdrop.offsetWidth;

	    html.backdrop.classList.add(o.animateInClass);

	    setTimeout(() => {
	      this.emit('showBackdrop', this);
	    }, this._options.backdropTransition);
	  }

	  hide() {
	    let html = this._html;
	    let o = this._options;
	    let contCList = html.container.classList;
	    this.emit('hide', this);

	    contCList.remove(o.animateInClass);

	    if (o.backdrop) {
	      let backCList = html.backdrop.classList;
	      backCList.remove(o.animateInClass);
	    }

	    this._removeEvents();

	    setTimeout(() => {
	      document.body.classList.remove('modal-open');
	      document.body.style.paddingRight = this.originalBodyPad;
	    }, o.backdropTransition);

	    setTimeout(() => {
	      if (o.backdrop) {
	        html.backdrop.parentNode.removeChild(html.backdrop);
	      }
	      html.container.style.display = 'none';

	      if (o.construct) {
	        html.container.parentNode.removeChild(html.container);
	      }

	      this._visible = false;
	      this.emit('hidden', this);
	    }, o.transition);

	    return this;
	  }

	  _removeEvents() {
	    if (this._events.keydownHandler) {
	      document.body.removeEventListener('keydown',
	        this._events.keydownHandler
	      );
	    }

	    this._html.container.removeEventListener('mousedown',
	      this._events.mousedownHandler
	    );

	    this._html.container.removeEventListener('click',
	      this._events.clickHandler
	    );

	    window.removeEventListener('resize',
	      this._events.resizeHandler
	    );
	  }

	  _checkScrollbar() {
	    this.bodyIsOverflowing = document.body.clientWidth < window.innerWidth;
	  }

	  _setScrollbar() {
	    this.originalBodyPad = document.body.style.paddingRight || '';
	    if (this.bodyIsOverflowing) {
	      let basePadding = parseInt(this.originalBodyPad || 0, 10);
	      document.body.style.paddingRight = basePadding + this._scrollbarWidth + 'px';
	    }
	  }
	}

	/**
	 * @protected
	 */
	const CLASS_PRINT_MODE = 'printMode';
	const CLASS_HIDE_CONTROLS = 'hideControls';

	function rotateRight() {
		return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"384\" height=\"448\" viewBox=\"0 0 384 448\">\r\n<path d=\"M384 64v112c0 8.75-7.25 16-16 16h-112c-6.5 0-12.25-4-14.75-10-2.5-5.75-1.25-12.75 3.5-17.25l34.5-34.5c-23.5-21.75-54.5-34.25-87.25-34.25-70.5 0-128 57.5-128 128s57.5 128 128 128c39.75 0 76.5-18 101-49.75 1.25-1.75 3.5-2.75 5.75-3 2.25 0 4.5 0.75 6.25 2.25l34.25 34.5c3 2.75 3 7.5 0.5 10.75-36.5 44-90.5 69.25-147.75 69.25-105.75 0-192-86.25-192-192s86.25-192 192-192c49.25 0 97 19.75 132.25 53l32.5-32.25c4.5-4.75 11.5-6 17.5-3.5 5.75 2.5 9.75 8.25 9.75 14.75z\"></path>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
	}

	function rotateLeft() {
		return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"384\" height=\"448\" viewBox=\"0 0 384 448\">\r\n<path d=\"M384 224c0 105.75-86.25 192-192 192-57.25 0-111.25-25.25-147.75-69.25-2.5-3.25-2.25-8 0.5-10.75l34.25-34.5c1.75-1.5 4-2.25 6.25-2.25 2.25 0.25 4.5 1.25 5.75 3 24.5 31.75 61.25 49.75 101 49.75 70.5 0 128-57.5 128-128s-57.5-128-128-128c-32.75 0-63.75 12.5-87 34.25l34.25 34.5c4.75 4.5 6 11.5 3.5 17.25-2.5 6-8.25 10-14.75 10h-112c-8.75 0-16-7.25-16-16v-112c0-6.5 4-12.25 10-14.75 5.75-2.5 12.75-1.25 17.25 3.5l32.5 32.25c35.25-33.25 83-53 132.25-53 105.75 0 192 86.25 192 192z\"></path>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
	}

	function zoomIn() {
		return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"352\" height=\"448\" viewBox=\"0 0 352 448\">\r\n<path d=\"M352 184v48c0 13.25-10.75 24-24 24h-104v104c0 13.25-10.75 24-24 24h-48c-13.25 0-24-10.75-24-24v-104h-104c-13.25 0-24-10.75-24-24v-48c0-13.25 10.75-24 24-24h104v-104c0-13.25 10.75-24 24-24h48c13.25 0 24 10.75 24 24v104h104c13.25 0 24 10.75 24 24z\"></path>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
	}

	function zoomOut() {
		return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"352\" height=\"448\" viewBox=\"0 0 352 448\">\r\n<path d=\"M352 184v48c0 13.25-10.75 24-24 24h-304c-13.25 0-24-10.75-24-24v-48c0-13.25 10.75-24 24-24h304c13.25 0 24 10.75 24 24z\"></path>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
	}

	const CLASS_OVERLAY = 'opp-overlay-frame';
	const CLASS_OVERLAY_RECTANGLE = CLASS_OVERLAY + '-rectangle';
	const CLASS_OVERLAY_CONTROLS = CLASS_OVERLAY + '-controls';
	const CLASS_OVERLAY_ZOOM_ENABLED = CLASS_OVERLAY + '-zoom-enabled';
	const CLASS_OVERLAY_CANCEL_BTN = CLASS_OVERLAY + '-cancel-btn';
	const CLASS_OVERLAY_SAVE_BTN = CLASS_OVERLAY + '-save-btn';
	const CLASS_OVERLAY_REFRAME_HINT = CLASS_OVERLAY + '-reframe-hint';
	class ReframeROI {
	    constructor(map, i18n, options) {
	        this._removeEvents = () => {
	            document.removeEventListener('keydown', this._escapeKeyListener);
	        };
	        this._map = map;
	        this._view = this._map.getView();
	        this._saveButton = (createElement("button", { type: "button", className: `btn btn-lg btn-primary ${CLASS_OVERLAY_SAVE_BTN}` }, i18n.process));
	        this._cancelButton = (createElement("button", { type: "button", className: `btn-close btn-close-white ${CLASS_OVERLAY_CANCEL_BTN}`, onclick: () => this.hideOverlay(), title: i18n.escapeHint },
	            createElement("span", { "aria-hidden": "true" }, "\u00D7")));
	        this._controlButtons = createElement("div", { className: CLASS_OVERLAY_CONTROLS });
	        if (options.zoomControlOnReframe) {
	            this._controlButtons.append(createElement("div", { className: "opp-zoom ol-control ol-unselectable" },
	                createElement("button", { type: "button", className: "opp-zoom-in", onClick: () => this._zoom('in'), title: i18n.zoomIn }, zoomIn()),
	                createElement("button", { type: "button", className: "opp-zoom-out", onClick: () => this._zoom('out'), title: i18n.zoomOut }, zoomOut())));
	        }
	        if (options.rotationControlOnReframe) {
	            this._controlButtons.append(createElement("div", { className: "opp-rotation ol-control ol-unselectable" },
	                createElement("button", { type: "button", className: "opp-rotation-left", onClick: () => this._rotate('left'), title: i18n.rotateLeft }, rotateLeft()),
	                createElement("button", { type: "button", className: "opp-rotation-right", onClick: () => this._rotate('right'), title: i18n.rotateRight }, rotateRight())));
	        }
	        this._rectangle = (createElement("div", { className: `${CLASS_OVERLAY_RECTANGLE} ${options.zoomControlOnReframe
                ? CLASS_OVERLAY_ZOOM_ENABLED
                : ''}` },
	            this._cancelButton,
	            createElement("div", null,
	                createElement("div", null, this._saveButton),
	                createElement("div", { className: CLASS_OVERLAY_REFRAME_HINT }, i18n.reframeHint)),
	            (options.zoomControlOnReframe ||
	                options.rotationControlOnReframe) &&
	                this._controlButtons));
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
	    _zoom(direction, delta = 0.5) {
	        const rotate = 0.261799 * delta;
	        const dd = direction === 'in' ? '' : '-';
	        this._view.adjustZoom(Number(dd + rotate));
	    }
	    _rotate(direction, delta = 0.5) {
	        const rotate = 0.261799 * delta;
	        const dd = direction === 'right' ? '' : '-';
	        this._view.adjustRotation(Number(dd + rotate));
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
	            this._reframeROI = new ReframeROI(map, i18n, options);
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
	                createElement("div", { className: "printFields-container" },
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
	                        createElement("span", null, i18n.compass))),
	                    mapElements.scalebar && (createElement("label", { htmlFor: "printScalebar" },
	                        createElement("input", { type: "checkbox", id: "printScalebar", name: "printScalebar", checked: true }),
	                        createElement("span", null, i18n.scale))),
	                    mapElements.legends && (createElement("label", { htmlFor: "printLegends" },
	                        createElement("input", { type: "checkbox", id: "printLegends", name: "printLegends", checked: true }),
	                        createElement("span", null, i18n.legends))),
	                    mapElements.attributions && (createElement("label", { htmlFor: "printAttributions" },
	                        createElement("input", { type: "checkbox", id: "printAttributions", name: "printAttributions", checked: true }),
	                        createElement("span", null, i18n.layersAttributions)))))),
	            extraInfo && (createElement("fieldset", { className: "sectionChecks extraInfo" },
	                createElement("legend", null, i18n.extraInfo),
	                createElement("div", { className: "sectionChecksList" },
	                    extraInfo.url && (createElement("label", { htmlFor: "printUrl" },
	                        createElement("input", { type: "checkbox", id: "printUrl", name: "printUrl", checked: true }),
	                        createElement("span", null, i18n.url))),
	                    extraInfo.date && (createElement("label", { htmlFor: "printDate" },
	                        createElement("input", { type: "checkbox", id: "printDate", name: "printDate", checked: true }),
	                        createElement("span", null, i18n.date))),
	                    extraInfo.specs && (createElement("label", { htmlFor: "printSpecs" },
	                        createElement("input", { type: "checkbox", id: "printSpecs", name: "printSpecs", checked: true }),
	                        createElement("span", null, i18n.specs)))))),
	            createElement("div", { className: "safeMarginsSection sectionChecks" },
	                createElement("label", { htmlFor: "safeMargins" },
	                    createElement("input", { type: "checkbox", id: "safeMargins", name: "safeMargins" }),
	                    createElement("span", null,
	                        " ",
	                        i18n.printerMargins)))));
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
	    zoomControlOnReframe: true,
	    rotationControlOnReframe: true,
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
	    addNote: 'Agregar nota',
	    resolution: 'Resolución',
	    orientation: 'Orientación',
	    paperSize: 'Tamaño de página',
	    landscape: 'Paisaje',
	    portrait: 'Retrato',
	    current: 'Actual',
	    paper: 'Hoja',
	    printerMargins: 'Añadir márgenes de impresión',
	    escapeHint: 'Presioná aquí o Escape para cancelar',
	    reframeHint: 'Paneá y zoomeá para ajustar el área de impresión',
	    process: 'Procesar',
	    zoomIn: 'Acercar',
	    zoomOut: ' Alejar',
	    rotateLeft: 'Rotatar a la izquierda',
	    rotateRight: 'Rotate a la derecha'
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
	    addNote: 'Add note',
	    resolution: 'Resolution',
	    orientation: 'Orientation',
	    paperSize: 'Paper size',
	    landscape: 'Landscape',
	    portrait: 'Portrait',
	    current: 'Current',
	    paper: 'Paper',
	    printerMargins: 'Add printer margins',
	    escapeHint: 'Press here or Escape to cancel',
	    reframeHint: 'Pan and zoom to adjust the print area',
	    process: 'Process',
	    zoomIn: 'Zoom in',
	    zoomOut: 'Zoom out',
	    rotateLeft: 'Rotate left',
	    rotateRight: 'Rotate right'
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
	                proj_js.getPointResolution(this._view.getProjection(), pixelsPerMapMillimeter, this._view.getCenter());
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
	        const increaseCount = () => {
	            this._imageCount = this._imageCount + 1;
	            if (this._imageCount % 10 == 0) {
	                this._processingModal.set(this._i18n.downloadingImages +
	                    ': <b>' +
	                    this._imageCount +
	                    '</b>');
	            }
	        };
	        this._eventsKey = [];
	        this._imageCount = 0;
	        this._map
	            .getLayers()
	            .getArray()
	            .forEach((l) => {
	            if ('getSource' in l && typeof l.getSource === 'function') {
	                this._eventsKey.push(l.getSource().on('tileloadend', () => increaseCount()));
	                this._eventsKey.push(l.getSource().on('imageloadend', () => increaseCount()));
	            }
	        });
	    }
	    /**
	     * Remove WMS listeners
	     */
	    _removeListeners() {
	        Observable_js.unByKey(this._eventsKey);
	    }
	    /**
	     * @protected
	     */
	    _cancel() {
	        if (this._renderCompleteKey) {
	            Observable_js.unByKey(this._renderCompleteKey);
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

	var utils = /*#__PURE__*/Object.freeze({
		__proto__: null,
		get UnitsSystem () { return UnitsSystem; },
		default: PdfPrinter
	});

	// make enums and other methods accesible
	Object.assign(PdfPrinter, utils);

	return PdfPrinter;

}));
//# sourceMappingURL=ol-pdf-printer.js.map
