# Changelog

## v1.0.0
* Module created

## v1.0.1
* Fixed README details
* Removed folder "dist" and "lib" from .gitignore.

## v1.0.2
* Url links added to layer attributions

## v1.0.3
* Fixed bug on `showPrintSettingsModal` method

## v1.0.4
* Changed print button text

## v1.0.5-6
* Moved two devDependenceis to dependencies

## v1.0.7
* Added SVG support

## v1.0.8
* Added customizable `imperial` and `metric` units system
* Added customizable date format

## v1.0.9
* Added image MIME types to export
* Fixed deepObjectAssign helper (bug on merging configuration arrays)

## v1.0.10
* Updated example screenshot

## v1.0.11
* Fixed worker error on compiling lib module with webpack

## v1.0.12
* Improved worker version management and PDF.js version on example

## v1.0.13/14
* Improved typescript and rollup configuration
* Added "watch" script
* Updated dependencies
* Fixed minor css issues
* Excluded some folders from npm
* Added Source Maps

## v1.0.15
* Fixed overlapping elements on small paper prints with long urls
* Beter css builds
* Better watch mode
* Added .gitattributes
* Typescript improvements
* Changed separator on attributions

## v1.0.16
* Remove unnecessary max-width on texts

## v1.0.17
* Fix bug when printing multiples times on protrait mode

## v1.0.18
* Ol 7 compatibility
* Updated dependencies
* Updated CDNs in examples

## v1.0.19
* Minor fix on createPdf public function

## v1.0.20
* Moved modal-vanilla to peer dependencies
* Updated dependencies

## v1.0.21
* Improved README
* Added LICENSE FILE

## v1.1.0
* Removed "browser" attribute from package.json
* Added "type" module attribute to package.json
* Removed index.js
* Updated dependencies

## v1.1.1
* Improved rollup and ts configs

## v1.2.0
* Added ".js" extension on imports to work better with webpack 5 default's config
* Lib is builded with es2017 target (downgraded from esnext)
* Removed babel deps
* Added header to dist files

## v2.0.0
* Addded WMS Legends support
* Added extraInfo checkboxes
* Allow printing without safe margins (by default no margin is added)
* Improved `paperMargin` option (added customazable per margin size)
* Improved DPI accuracy
* Changed svg icon
* Fixed wrong scale transformation on exporting to image formats (now respecting the DPI)
* Improved downloading and processing status info
* Added customizable loader option
* Removed `description` attribute from inside `mapElements` option (_breaking change_)
* Removed some styles attributes from inside `watermark` option (_breaking change_)
* Added multiples customization options inside `style` attribute
* Added `showControlBtn` configuration to allow disable the control button
* Refactored using setMap method (and fixed error while using `createPdf` before the modal was displayed)
* Removed 72 DPI as a default option
* Added `createPdf` button to the example
* Replaced dependency `dom-to-image-improved` with `dom-to-image-more`
* Fixed compass not showing on firefox because of missin width and height svg attributes
* Updated to Ol8
* Updated dev dependencies
* Converted css to scss

## v2.0.1
* Added reframe ROI functionality to improve the control of the region of interest
* Removed scale parameter from the constructor and the settings modal
* Removed some forgotten console.log

## v2.0.2
* Fixed bug when legends is activated and no wms is on the map
* Fixed padding when watermark subtitle is largen than title

## v2.0.3
* Improved attributions functionality. Now extracts the data from the layers and not form the ui control
* Count loaded tiles and images in all layers (not only wms)
* Watermark logo now accepts non square images
* Added watermark logo in the example
* Added controls (zoom and rotation) on the reframe instance
* Improved css style in prinFields using flex
* Updated screenshots

## v2.0.4
* Small css fixes

## v2.0.5
* Restore contrain resolution view if reframe is cancelled

## v2.0.6
* Improved pointer events and stop event overlay
* Fixed reframe position when map is not full height and width
* Added some transparency to the reframe control buttons

## v2.1.0
* Some refactoring
* Removed `dom-to-image-more` dependency
* Improved README

## v2.1.1
* Fixed overview canvas visible in the final export (bug introduced in 2.1.0)

## v2.1.2
* Fixed bug with contraint resolution being restored before time (if it was enabled)
* Improved example