import View from 'ol/View.js';
import Map from 'ol/Map.js';
import BaseLayer from 'ol/layer/Base.js';
import TileWMS from 'ol/source/TileWMS.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import TileLayer from 'ol/layer/Tile.js';
import ImageLayer from 'ol/layer/Image.js';
import { appendParams } from 'ol/uri.js';
import { Projection } from 'ol/proj.js';

import { isWmsLayer } from '../Helpers';

export const legendsDefaultConfig = {
    legendOptions: {
        fontAntiAliasing: 'true',
        fontColor: '0x333333',
        bgColor: '0xffffff',
        forceLabels: 'on',
        forceTitles: 'on'
    },
    requestParams: {},
    order: true
};

export interface LegendsOptions {
    /**
     * To control legend appearance
     * https://docs.geoserver.org/latest/en/user/services/wms/get_legend_graphic/index.html#controlling-legend-appearance-with-legend-options
     */
    legendOptions?: { [key: string]: string | number };

    /**
     * Extra params to add/overwrite the default `GetLegendGraphic` request
     * https://docs.geoserver.org/latest/en/user/services/wms/get_legend_graphic/index.html#getlegendgraphic
     */
    requestParams?: { [key: string]: string };

    /**
     * Order control legends by layer zindex
     * Default is `true`
     */
    order?: boolean;
}

export default class Legends {
    private _map: Map;
    private _view: View;

    private _legendOptions: { [key: string]: string | number } = {};
    private _requestParams: { [key: string]: string } = {};

    private _order: boolean;

    constructor(options: LegendsOptions | true, map: Map) {
        this._map = map;
        this._view = map.getView();

        this._legendOptions = legendsDefaultConfig.legendOptions;
        this._requestParams = legendsDefaultConfig.requestParams;
        this._order = legendsDefaultConfig.order;

        if (typeof options === 'object') {
            const { legendOptions, requestParams, order } = options;
            this._legendOptions = {
                ...this._legendOptions,
                ...(legendOptions || {})
            };
            this._requestParams = {
                ...this._requestParams,
                ...(requestParams || {})
            };
            this._order = typeof order !== 'undefined' ? order : this._order;
        }
    }

    public async getImages(
        dpi: number,
        txcolor: string,
        bkcolor: string
    ): Promise<HTMLImageElement[]> {
        const images: HTMLImageElement[] = [];
        const wmsLayers = this.getWmsLegendLayers();
        this._legendOptions = {
            ...this._legendOptions,
            dpi,
            fontColor: '0x' + txcolor.replace('#', ''),
            bgColor: '0x' + bkcolor.replace('#', '')
        };

        for (const wmsLayer of wmsLayers) {
            const image = await this._getLegends(wmsLayer);
            if (image) {
                images.push(image);
            }
        }

        if (this._order) {
            return this._orderImagesByIndex(images);
        }

        return images;
    }

    /**
     *
     * @returns
     */
    public getWmsLegendLayers(): Array<
        TileLayer<TileWMS> | ImageLayer<ImageWMS>
    > {
        return this._map
            .getLayers()
            .getArray()
            .filter(
                (layer) => isWmsLayer(layer) && layer.getVisible()
            ) as Array<TileLayer<TileWMS> | ImageLayer<ImageWMS>>;
    }

    public getMapProjection(): Projection {
        return this._view.getProjection();
    }

    public getViewExtent(): number[] {
        return this._view.calculateExtent(this._map.getSize());
    }

    protected async _getLegends(layer: BaseLayer): Promise<HTMLImageElement> {
        return new Promise((resolve) => {
            const srcs = this._getSrcFromParams(layer);

            if (!srcs) {
                return resolve(null);
            }

            srcs.forEach((src) => {
                const img = new Image();
                // to enable reorder
                img.dataset.index = String(layer.getZIndex());

                img.onerror = () => {
                    resolve(null);
                };
                img.onload = () => {
                    // discard empty images
                    if (img.naturalHeight <= 1) {
                        resolve(null);
                    } else {
                        resolve(img);
                    }
                };
                img.src = src;
            });
        });
    }

    /**
     *
     * @param layer
     * @param inline
     * @returns
     */
    protected _getSrcFromParams(layer): string[] {
        const sourceParams = layer.getSource().getParams();

        const proj = this.getMapProjection().getCode();

        const legend_options = {
            fontColor: '0x000000',
            fontAntiAliasing: true,
            bgColor: '0xffffff',
            forceLabels: 'on',
            forceTitles: 'on',
            fontSize: 8,
            ...this._legendOptions
        };

        const params = {
            SERVICE: 'WMS',
            VERSION: '1.1.0',
            REQUEST: 'GetLegendGraphic',
            FORMAT: 'image/png',
            LEGEND_OPTIONS: Object.entries(legend_options)
                .map((a) => `${a[0]}:${a[1]}`)
                .join(';'),
            STYLE: sourceParams.STYLES,
            CQL_FILTER: sourceParams.CQL_FILTER,
            SLD_BODY: sourceParams.SLD_BODY,
            SLD: sourceParams.SLD,
            ENV: sourceParams.ENV,
            SRS: proj,
            SRCWIDTH: this._map.getSize()[0],
            SRCHEIGHT: this._map.getSize()[1],
            SCALE: this._getScale(),
            ...this._requestParams
            // bug showing empty spaces betweeen labels
            //TRANSPARENT: true
        };

        const layersName = sourceParams.LAYERS;
        const layerNames = !Array.isArray(layersName)
            ? layersName.split(',')
            : layersName;

        return [
            this._getLegendUrl(layer.getSource() as TileWMS | ImageWMS, {
                ...params,
                LAYER: layerNames[0]
            })
        ];
    }

    /**
     *
     * @param source
     * @param params
     * @returns
     */
    protected _getLegendUrl(source: TileWMS | ImageWMS, params) {
        const url =
            'getUrls' in source
                ? source.getUrls()[0]
                : 'getUrl' in source
                ? source.getUrl()
                : undefined;

        if (!url) return undefined;

        return appendParams(url, params);
    }

    /**
     *
     */
    protected _orderImagesByIndex(
        images: HTMLImageElement[]
    ): HTMLImageElement[] {
        const t = Array.from(images).sort((x, y) => {
            const xIndex = Number(x.dataset.index);
            const yIndex = Number(y.dataset.index);
            if (xIndex > yIndex) return -1;
            if (xIndex < yIndex) return 1;
            return 0;
        });

        return t.reverse();
    }

    /**
     *
     * @returns
     */
    protected _getScale() {
        const resolution = this._view.getResolution();
        const mpu = this.getMapProjection()
            ? this.getMapProjection().getMetersPerUnit()
            : 1;
        const pixelSize = 0.00028;
        return (resolution * mpu) / pixelSize;
    }
}
