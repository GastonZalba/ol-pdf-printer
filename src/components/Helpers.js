import { METERS_PER_UNIT } from 'ol/proj/Units';

/**
 * @param {number} resolution Resolution.
 * @param {string} units Units
 * @param {boolean=} opt_round Whether to round the scale or not.
 * @return {number} Scale
 */
export const getMapScale = (map, opt_round = true) => {
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
