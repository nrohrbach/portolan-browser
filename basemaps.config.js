// Basemaps come from swisstopo's vector tile styles, served at
// https://vectortiles.geo.admin.ch/. The style files are MapLibre styles.
// swisstopo requires a source reference on every map. MapMixin adds it with
// BASEMAP_ATTRIBUTION, so it shows whether or not the style carries one.
// Terms of use: https://opendata.swiss/terms-of-use
export const BASEMAP_ATTRIBUTION = '© swisstopo';

const STYLES = 'https://vectortiles.geo.admin.ch/styles';

const BASEMAPS = {
  earth: [
    {
      url: `${STYLES}/ch.swisstopo.lightbasemap.vt/style.json`,
      title: 'Basiskarte hell',
    },
    {
      url: `${STYLES}/ch.swisstopo.basemap.vt/style.json`,
      title: 'Basiskarte',
    },
    {
      url: `${STYLES}/ch.swisstopo.imagerybasemap.vt/style.json`,
      title: 'Luftbild',
    },
  ],
};

// The initial view frames Switzerland. The bounds sit well outside the
// country so border regions stay visible. minZoom keeps the country filling
// the viewport instead of shrinking into a world map.
//
// maxBounds must stay wider than what minZoom renders on a large screen, or
// MapLibre fights its own constraints. At minZoom 7 a 1920 px wide viewport
// spans about 10.6 degrees, and these bounds span 13.
export const MAP_CONSTRAINTS = {
  center: [8.23, 46.8],
  zoom: 7.5,
  minZoom: 7,
  maxZoom: 18,
  maxBounds: [[2.0, 43.0], [15.0, 51.0]],
};

/**
 * This browser shows one catalog on Earth, so every STAC object gets the same
 * swisstopo basemaps. The `stac` argument stays in the signature because the
 * map code calls it with the STAC object.
 *
 * @returns {Array.<BasemapOptions>}
 */
export default function configureBasemap() {
  return BASEMAPS.earth;
}
