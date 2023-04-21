import Map from 'ol/Map.js';
import { METERS_PER_UNIT } from 'ol/proj/Units.js';

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
