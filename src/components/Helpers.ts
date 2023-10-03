import Map from 'ol/Map.js';
import { METERS_PER_UNIT } from 'ol/proj/Units.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import TileLayer from 'ol/layer/Tile.js';
import ImageLayer from 'ol/layer/Image.js';
import BaseLayer from 'ol/layer/Base.js';
import TileWMS from 'ol/source/TileWMS.js';

/**
 *
 * @param map
 * @param opt_round
 * @returns
 * @protected
 */
export const getMapScale = (map: Map, opt_round = true): number => {
    const dpi = 25.4 / 0.28;

    const view = map.getView();
    const unit = view.getProjection().getUnits();
    const res = view.getResolution();
    const inchesPerMetre = 39.37;

    let scale = res * METERS_PER_UNIT[unit] * inchesPerMetre * dpi;

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
export const isWmsLayer = (layer: BaseLayer): boolean => {
    return (
        (layer instanceof ImageLayer || layer instanceof TileLayer) &&
        (layer.getSource() instanceof TileWMS ||
            layer.getSource() instanceof ImageWMS)
    );
};
