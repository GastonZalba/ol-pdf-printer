import Map from 'ol/Map.js';
import Polygon from 'ol/geom/Polygon';
import { I18n } from '../ol-pdf-printer';
export default class ReframeROI {
    private _map;
    private _escapeKeyListener;
    private _saveButton;
    private _cancelButton;
    private _rectangle;
    private _overlay;
    constructor(map: Map, i18n: I18n);
    showOverlay(mode: 'landscape' | 'portrait', callback: (polygon: Polygon) => void): void;
    hideOverlay(): void;
    private _getExtent;
    private _addEvents;
    private _removeEvents;
}
//# sourceMappingURL=ReframeROI.d.ts.map