import Map from 'ol/Map.js';
import Polygon from 'ol/geom/Polygon';
import { I18n, Options } from '../ol-pdf-printer';
export default class ReframeROI {
    private _map;
    private _view;
    private _escapeKeyListener;
    private _saveButton;
    private _cancelButton;
    private _rectangle;
    private _overlay;
    private _controlButtons;
    constructor(map: Map, i18n: I18n, options: Options);
    showOverlay(mode: 'landscape' | 'portrait', callback: (polygon: Polygon) => void): void;
    hideOverlay(): void;
    private _zoom;
    private _rotate;
    private _getExtent;
    private _addEvents;
    private _removeEvents;
}
//# sourceMappingURL=ReframeROI.d.ts.map