import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import Draw from 'ol/interaction/Draw.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Map from 'ol/Map.js';
import Polygon from 'ol/geom/Polygon.js';
import { EventsKey } from 'ol/events.js';
import { unByKey } from 'ol/Observable.js';
import { Extent } from 'ol/extent';

export default class DrawROI {
    private _map: Map;
    private _escapeKeyListener: EventListener;
    private _addFeatureEventKey: EventsKey;

    private _source = new VectorSource({ wrapX: false });

    private _layer = new VectorLayer({
        source: this._source
    });

    private _interaction = new Draw({
        source: this._source,
        type: 'Polygon',
        stopClick: true,
        style: [
            new Style({
                fill: new Fill({
                    color: [0, 177, 199, 0.4]
                }),
                stroke: new Stroke({
                    color: [0, 177, 199, 0.9],
                    width: 2
                })
            }),
            new Style({
                image: new CircleStyle({
                    radius: 4,
                    fill: new Fill({
                        color: '#00b1c7'
                    }),
                    stroke: new Stroke({
                        width: 2,
                        color: '#ffffff'
                    })
                })
            })
        ]
    });

    constructor(map: Map) {
        this._map = map;
        this._map.addLayer(this._layer);
    }

    /**
     * Init tool to draw geometry and trigger
     * the search if a feature is added
     */
    drawRegion(callback: (extent: Extent) => any): void {
        this._addEvents();

        this._map.addInteraction(this._interaction);

        this._addFeatureEventKey = this._source.once(
            'addfeature',
            ({ feature }) => {
                const geom = feature.getGeometry() as Polygon;
                callback(geom.getExtent());
                this._reset();
            }
        );
    }

    private _clear(): void {
        this._cleanSource();
        this._map.removeInteraction(this._interaction);
        this._removeEvents();
    }

    private _cleanSource(): void {
        this._source.clear();
    }

    private _reset(): void {
        this._clear();
    }

    private _addEvents(): void {
        const escapeKeyListener = ({ key }) => {
            if (key === 'Escape') {
                this._reset();
            }
        };

        this._escapeKeyListener = escapeKeyListener.bind(this);
        document.addEventListener('keydown', this._escapeKeyListener);
    }

    private _removeEvents = (): void => {
        unByKey(this._addFeatureEventKey);
        document.removeEventListener('keydown', this._escapeKeyListener);
    };
}
