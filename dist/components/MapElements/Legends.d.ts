import Map from 'ol/Map.js';
import BaseLayer from 'ol/layer/Base.js';
import TileWMS from 'ol/source/TileWMS.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import TileLayer from 'ol/layer/Tile.js';
import ImageLayer from 'ol/layer/Image.js';
import { Projection } from 'ol/proj.js';
export declare const legendsDefaultConfig: {
    legendOptions: {
        fontAntiAliasing: string;
        fontColor: string;
        bgColor: string;
        forceLabels: string;
        forceTitles: string;
        fontSize: number;
    };
    requestParams: {};
    order: boolean;
};
export interface LegendsOptions {
    /**
     * To control legend appearance
     * https://docs.geoserver.org/latest/en/user/services/wms/get_legend_graphic/index.html#controlling-legend-appearance-with-legend-options
     */
    legendOptions?: {
        [key: string]: string | number;
    };
    /**
     * Extra params to add/overwrite the default `GetLegendGraphic` request
     * https://docs.geoserver.org/latest/en/user/services/wms/get_legend_graphic/index.html#getlegendgraphic
     */
    requestParams?: {
        [key: string]: string;
    };
    /**
     * Order control legends by layer zindex
     * Default is `true`
     */
    order?: boolean;
}
export default class Legends {
    private _map;
    private _view;
    private _legendOptions;
    private _requestParams;
    private _order;
    constructor(options: LegendsOptions | true, map: Map);
    getImages(dpi: number, txcolor: string, bkcolor: string): Promise<HTMLImageElement[]>;
    /**
     *
     * @returns
     */
    getWmsLegendLayers(): Array<TileLayer<TileWMS> | ImageLayer<ImageWMS>>;
    getMapProjection(): Projection;
    getViewExtent(): number[];
    protected _getLegends(layer: BaseLayer): Promise<HTMLImageElement>;
    /**
     *
     * @param layer
     * @param inline
     * @returns
     */
    protected _getSrcFromParams(layer: any): string[];
    /**
     *
     * @param source
     * @param params
     * @returns
     */
    protected _getLegendUrl(source: TileWMS | ImageWMS, params: any): string;
    /**
     *
     */
    protected _orderImagesByIndex(images: HTMLImageElement[]): HTMLImageElement[];
    /**
     *
     * @returns
     */
    protected _getScale(): number;
}
//# sourceMappingURL=Legends.d.ts.map