# OpenLayers Pdf Printer
Basic Pdf Printer for Open Layers.

Tested with OpenLayers version 5 and 6.

## IMPORTANT
Layer source and Icons that use external sites must be setted to `crossOrigin: 'anonymous'`. Otherwise, it will ocurr a `DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported`.

## Examples
-   Basic usage: create an OpenLayers map instance, and pass that map and options to the PdfPrinter constructor.
    -   [Basic](https://raw.githack.com/GastonZalba/ol-pdf-printer/v1.0.0/examples/basic.html)

## Changelog

See [CHANGELOG](./CHANGELOG.md) for details of changes in each release.

## Install

### Browser

#### JS
Load `ol-pdf-printer.js` after [OpenLayers](https://www.npmjs.com/package/ol) and [jspdf](https://www.npmjs.com/package/jspdf). Ol Pdf Printer is available as `PdfPrinter`.

```HTML
<script src="https://unpkg.com/ol-pdf-printer@1.0.0"></script>
```

#### CSS
```HTML
<link rel="stylesheet" href="https://unpkg.com/ol-pdf-printer@1.0.0/dist/ol-pdf-printer.css" />
<link rel="stylesheet" href="https://unpkg.com/ol-pdf-printer@1.0.0/dist/bootstrap.min.css" />
```

### Parcel, Webpack, etc.

NPM package: [ol-pdf-printer](https://www.npmjs.com/package/ol-pdf-printer).

#### JS

Install the package via `npm`

    npm install ol-pdf-printer --save-dev

#### CSS

The CSS files `ol-pdf-printer.css` and `boostrap.min.css` can be found in `./node_modules/ol-pdf-printer/dist/css`

##### TypeScript type definition

TypeScript types are shipped with the project in the dist directory and should be automatically used in a TypeScript project. Interfaces are provided for DjiGeozones Options.


## Usage

## API

## TODO
* Convert all files to Typescript
* Interface comments
* Example screenshots
* Legends support
* Tests!
* Improve Scalebar