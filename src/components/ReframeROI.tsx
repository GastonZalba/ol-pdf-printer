import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Polygon from 'ol/geom/Polygon';
import Overlay from 'ol/Overlay';
import { Extent } from 'ol/extent';

import { I18n, Options } from '../ol-pdf-printer';

import { CLASS_HIDE_CONTROLS } from '../classnames';

import myPragma from '../myPragma';

import rotateRight from '../assets/images/rotateRight.svg';
import rotateLeft from '../assets/images/rotateLeft.svg';
import zoomIn from '../assets/images/zoomIn.svg';
import zoomOut from '../assets/images/zoomOut.svg';

const CLASS_OVERLAY = 'opp-overlay-frame';
const CLASS_OVERLAY_RECTANGLE = CLASS_OVERLAY + '-rectangle';
const CLASS_OVERLAY_CONTROLS = CLASS_OVERLAY + '-controls';
const CLASS_OVERLAY_ZOOM_ENABLED = CLASS_OVERLAY + '-zoom-enabled';
const CLASS_OVERLAY_CANCEL_BTN = CLASS_OVERLAY + '-cancel-btn';
const CLASS_OVERLAY_SAVE_BTN = CLASS_OVERLAY + '-save-btn';
const CLASS_OVERLAY_REFRAME_HINT = CLASS_OVERLAY + '-reframe-hint';

export default class ReframeROI {
    private _map: Map;
    private _view: View;

    private _callback: (extent: Extent | Polygon) => void;

    private _escapeKeyListener: EventListener;
    private _saveButton: HTMLButtonElement;
    private _cancelButton: HTMLButtonElement;
    private _rectangle: HTMLElement;
    private _overlay: Overlay;
    private _controlButtons: HTMLElement;

    constructor(map: Map, i18n: I18n, options: Options) {
        this._map = map;
        this._view = this._map.getView();

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

        this._controlButtons = <div className={CLASS_OVERLAY_CONTROLS}></div>;

        if (options.zoomControlOnReframe) {
            this._controlButtons.append(
                <div className="opp-zoom ol-control ol-unselectable">
                    <button
                        type="button"
                        className="opp-zoom-in"
                        onClick={() => this._zoom('in')}
                        title={i18n.zoomIn}
                    >
                        {zoomIn()}
                    </button>
                    <button
                        type="button"
                        className="opp-zoom-out"
                        onClick={() => this._zoom('out')}
                        title={i18n.zoomOut}
                    >
                        {zoomOut()}
                    </button>
                </div>
            );
        }

        if (options.rotationControlOnReframe) {
            this._controlButtons.append(
                <div className="opp-rotation ol-control ol-unselectable">
                    <button
                        type="button"
                        className="opp-rotation-left"
                        onClick={() => this._rotate('left')}
                        title={i18n.rotateLeft}
                    >
                        {rotateLeft()}
                    </button>
                    <button
                        type="button"
                        className="opp-rotation-right"
                        onClick={() => this._rotate('right')}
                        title={i18n.rotateRight}
                    >
                        {rotateRight()}
                    </button>
                </div>
            );
        }

        this._rectangle = (
            <div
                className={`${CLASS_OVERLAY_RECTANGLE} ${
                    options.zoomControlOnReframe
                        ? CLASS_OVERLAY_ZOOM_ENABLED
                        : ''
                }`}
            >
                {this._cancelButton}
                <div>
                    <div>{this._saveButton}</div>
                    <div className={CLASS_OVERLAY_REFRAME_HINT}>
                        {i18n.reframeHint}
                    </div>
                </div>
                {(options.zoomControlOnReframe ||
                    options.rotationControlOnReframe) &&
                    this._controlButtons}
            </div>
        );
    }

    public showOverlay(
        mode: 'landscape' | 'portrait',
        callback: (polygon: Extent | Polygon) => void
    ): void {
        this._map.getTargetElement().classList.add(CLASS_HIDE_CONTROLS);

        this._overlay = new Overlay({
            className: `${CLASS_OVERLAY} ${mode}-mode`,
            element: this._rectangle,
            stopEvent: true
        });

        this._map.addOverlay(this._overlay);

        this._view.setConstrainResolution(false);

        this._addEvents();
        this._callback = callback;

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

        if (this._callback) {
            this._callback(null);
        }
    }

    private _zoom(direction: 'in' | 'out', delta = 0.5): void {
        const rotate = 0.261799 * delta;
        const dd = direction === 'in' ? '' : '-';
        this._view.adjustZoom(Number(dd + rotate));
    }

    private _rotate(direction: 'left' | 'right', delta = 0.5): void {
        const rotate = 0.261799 * delta;
        const dd = direction === 'right' ? '' : '-';
        this._view.adjustRotation(Number(dd + rotate));
    }

    private _getExtent(): Polygon {
        const mapBounds = this._map.getTargetElement().getBoundingClientRect();

        const overlayFrameBounds = this._rectangle.getBoundingClientRect();

        const relativePosition = {
            left: overlayFrameBounds.left - mapBounds.left,
            top: overlayFrameBounds.top - mapBounds.top
        };

        const topLeft = this._map.getCoordinateFromPixel([
            relativePosition.left,
            relativePosition.top
        ]);

        const topRight = this._map.getCoordinateFromPixel([
            relativePosition.left + overlayFrameBounds.width,
            relativePosition.top
        ]);

        const bottomLeft = this._map.getCoordinateFromPixel([
            relativePosition.left,
            relativePosition.top + overlayFrameBounds.height
        ]);

        const bottomRight = this._map.getCoordinateFromPixel([
            relativePosition.left + overlayFrameBounds.width,
            relativePosition.top + overlayFrameBounds.height
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
