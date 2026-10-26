import { mapState } from 'vuex';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import { markRaw } from 'vue';
import configureBasemap, { BASEMAP_ATTRIBUTION, MAP_CONSTRAINTS, MAP_INTRO, MAP_INTRO_QUIET_MS, MAP_INTRO_TIMEOUT_MS } from '../../../basemaps.config';

export const pmtilesProtocol = new Protocol({ metadata: true });
maplibregl.addProtocol('pmtiles', pmtilesProtocol.tile);

const MAPTERHORN_SOURCE_ID = 'mapterhorn-terrain';
const MAPTERHORN_HILLSHADE_ID = 'mapterhorn-hillshade';

export default {
  computed: {
    ...mapState(['buildTileUrlTemplate', 'crossOriginMedia', 'displayGeoTiffByDefault', 'displayPreview', 'displayOverview', 'getMapSourceOptions', 'useTileLayerAsFallback', 'uiLanguage']),
    stacLayerOptions() {
      return {
        displayPreview: this.displayPreview,
        displayOverview: this.displayOverview,
        displayGeoTiffByDefault: this.displayGeoTiffByDefault,
        crossOriginMedia: this.crossOriginMedia,
      };
    },
    hasBasemap() {
      return this.basemaps.length > 0;
    }
  },
  data() {
    return {
      map: null,
      maxZoom: 16,
      basemaps: [],
      activeBasemapIndex: 0,
      isFullScreen: false,
      is3D: false,
    };
  },
  methods: {
    async createMap(element, stac, onfocusOnly = false) {
      this.basemaps = configureBasemap(stac);

      this.map = markRaw(new maplibregl.Map({
        container: element,
        style: { version: 8, sources: {}, layers: [] },
        center: MAP_INTRO.center,
        zoom: MAP_INTRO.zoom,
        maxZoom: MAP_CONSTRAINTS.maxZoom,
        attributionControl: false,
        interactive: !onfocusOnly,
        maxTileCacheSize: 300,
      }));

      this._applyConstraintsAfterIntro(this.map);

      this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
      this.map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: BASEMAP_ATTRIBUTION }), 'bottom-right');

      await new Promise(resolve => {
        if (this.map.isStyleLoaded()) {
          resolve();
        } else {
          this.map.once('style.load', resolve);
        }
      });

      if (this.basemaps.length > 0) {
        this._loadBasemapAsync(this.basemaps[0]);
      }
    },

    /**
     * The map starts zoomed out and flies in to the data. Applying minZoom and
     * maxBounds at creation would cut that approach short. They apply once the
     * camera has left the intro zoom and then stood still for a moment.
     *
     * Other code can call fit() again while the camera flies, for example when
     * children or assets load. A new flight stops the old one, which fires
     * moveend at a zoom in between. The quiet period ignores that moveend,
     * because the next movestart cancels it. The timeout covers maps that never
     * zoom, for example a STAC object without a bounding box.
     */
    _applyConstraintsAfterIntro(map) {
      let done = false;
      let quietTimer = null;
      let timeoutTimer = null;
      const apply = () => {
        if (done) {return;}
        if (map.isMoving()) {
          timeoutTimer = setTimeout(apply, MAP_INTRO_QUIET_MS);
          return;
        }
        done = true;
        clearTimeout(quietTimer);
        clearTimeout(timeoutTimer);
        if (this.map !== map) {return;}
        map.setMinZoom(MAP_CONSTRAINTS.minZoom);
        map.setMaxBounds(MAP_CONSTRAINTS.maxBounds);
      };
      map.on('movestart', () => clearTimeout(quietTimer));
      map.on('moveend', () => {
        if (!done && Math.abs(map.getZoom() - MAP_INTRO.zoom) > 0.01) {
          clearTimeout(quietTimer);
          quietTimer = setTimeout(apply, MAP_INTRO_QUIET_MS);
        }
      });
      timeoutTimer = setTimeout(apply, MAP_INTRO_TIMEOUT_MS);
    },

    _loadBasemapAsync(basemap) {
      const style = basemap.raster ? this.buildRasterStyle(basemap) : basemap.url;
      if (!style) {return;}

      this.map.once('style.load', () => {
        if (this.is3D) {
          this.enable3D();
        }
        if (typeof this.onBasemapChanged === 'function') {
          // Fire-and-forget by design, but readdAfterStyleChange can reject
          // (e.g. applyGlStyle's map.addLayer) — surface it instead of an
          // unhandled rejection.
          Promise.resolve(this.onBasemapChanged()).catch(console.warn);
        }
      });
      this.map.setStyle(style);
    },

    buildRasterStyle(basemap) {
      return {
        version: 8,
        sources: {
          'raster-basemap': {
            type: 'raster',
            tiles: basemap.tiles,
            tileSize: 256,
            attribution: basemap.attribution || '',
          }
        },
        layers: [{
          id: 'raster-basemap-layer',
          type: 'raster',
          source: 'raster-basemap',
        }],
      };
    },

    async switchBasemap(index) {
      if (index === this.activeBasemapIndex || !this.map) {return;}
      this.activeBasemapIndex = index;
      const basemap = this.basemaps[index];
      if (!basemap) {return;}

      const was3D = this.is3D;

      const style = basemap.raster ? this.buildRasterStyle(basemap) : basemap.url;
      this.map.setStyle(style);

      await new Promise(resolve => { this.map.once('style.load', resolve); });

      if (was3D) {
        this.enable3D();
      }

      if (typeof this.onBasemapChanged === 'function') {
        // See _loadBasemapAsync: catch instead of an unhandled rejection.
        Promise.resolve(this.onBasemapChanged()).catch(console.warn);
      }
    },

    toggle3D() {
      if (this.is3D) {
        this.disable3D();
      } else {
        this.enable3D();
      }
    },

    enable3D() {
      if (!this.map) {return;}

      if (!this.map.getSource(MAPTERHORN_SOURCE_ID)) {
        this.map.addSource(MAPTERHORN_SOURCE_ID, {
          type: 'raster-dem',
          url: 'https://tiles.mapterhorn.com/tilejson.json',
        });
      }

      this.map.setTerrain({ source: MAPTERHORN_SOURCE_ID, exaggeration: 1 });
      this.map.setProjection({ type: 'globe' });

      if (!this.map.getSource(MAPTERHORN_HILLSHADE_ID)) {
        this.map.addSource(MAPTERHORN_HILLSHADE_ID, {
          type: 'raster-dem',
          url: 'https://tiles.mapterhorn.com/tilejson.json',
        });
      }
      if (!this.map.getLayer('hillshade-layer')) {
        this.map.addLayer({
          id: 'hillshade-layer',
          type: 'hillshade',
          source: MAPTERHORN_HILLSHADE_ID,
          layout: { visibility: 'visible' },
          paint: { 'hillshade-shadow-color': '#473B24' },
        }, this.getFirstSymbolLayerId());
      }

      this.map.setSky({
        'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0],
      });

      this.is3D = true;
    },

    disable3D() {
      if (!this.map) {return;}

      this.map.setTerrain(null);
      this.map.setProjection({ type: 'mercator' });
      this.map.setSky(null);

      if (this.map.getLayer('hillshade-layer')) {
        this.map.removeLayer('hillshade-layer');
      }
      if (this.map.getSource(MAPTERHORN_HILLSHADE_ID)) {
        this.map.removeSource(MAPTERHORN_HILLSHADE_ID);
      }
      if (this.map.getSource(MAPTERHORN_SOURCE_ID)) {
        this.map.removeSource(MAPTERHORN_SOURCE_ID);
      }

      this.is3D = false;
    },

    getFirstSymbolLayerId() {
      if (!this.map) {return undefined;}
      const layers = this.map.getStyle()?.layers;
      if (!layers) {return undefined;}
      for (const layer of layers) {
        if (layer.type === 'symbol') {return layer.id;}
      }
      return undefined;
    },
  }
};
