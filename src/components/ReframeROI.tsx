import Map from 'ol/Map.js';
import Polygon from 'ol/geom/Polygon';
import Overlay from 'ol/Overlay';

import { I18n } from '../ol-pdf-printer';

import myPragma from '../myPragma';
import { CLASS_HIDE_CONTROLS } from '../classnames';

const CLASS_OVERLAY = 'overlay-frame';
const CLASS_OVERLAY_RECTANGLE = CLASS_OVERLAY + '-rectangle';
const CLASS_OVERLAY_CANCEL_BTN = CLASS_OVERLAY + '-cancel-btn';
const CLASS_OVERLAY_SAVE_BTN = CLASS_OVERLAY + '-save-btn';
const CLASS_OVERLAY_REFRAME_HINT = CLASS_OVERLAY + '-reframe-hint';

export default class ReframeROI {
    private _map: Map;
    private _escapeKeyListener: EventListener;
    private _saveButton: HTMLButtonElement;
    private _cancelButton: HTMLButtonElement;
    private _rectangle: HTMLElement;
    private _overlay: Overlay;

    constructor(map: Map, i18n: I18n) {
        this._map = map;

        this._saveButton = (
            <button
                type="button"
                className={`btn btn-lg btn-primary ${CLASS_OVERLAY_SAVE_BTN}`}
            >
                {i18n.process}
            </button>
        );

        this._cancelButton = (
            <button
                type="button"
                className={`btn-close btn-close-white ${CLASS_OVERLAY_CANCEL_BTN}`}
                onclick={() => this.hideOverlay()}
                title={i18n.escapeHint}
            >
                <span aria-hidden="true">×</span>
            </button>
        );

        this._rectangle = (
            <div className={CLASS_OVERLAY_RECTANGLE}>
                {this._cancelButton}
                <div>
                    <div>{this._saveButton}</div>
                    <div className={CLASS_OVERLAY_REFRAME_HINT}>
                        {i18n.reframeHint}
                    </div>
                </div>
            </div>
        );
    }

    public showOverlay(
        mode: 'landscape' | 'portrait',
        callback: (polygon: Polygon) => void
    ): void {
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

    public hideOverlay(): void {
        if (this._overlay) {
            this._map.removeOverlay(this._overlay);
        }
        this._removeEvents();
        this._map.getTargetElement().classList.remove(CLASS_HIDE_CONTROLS);
    }

    private _getExtent(): Polygon {
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

    private _addEvents(): void {
        const escapeKeyListener = ({ key }) => {
            if (key === 'Escape') {
                this.hideOverlay();
            }
        };

        this._escapeKeyListener = escapeKeyListener.bind(this);
        document.addEventListener('keydown', this._escapeKeyListener);
    }

    private _removeEvents = (): void => {
        document.removeEventListener('keydown', this._escapeKeyListener);
    };
}
