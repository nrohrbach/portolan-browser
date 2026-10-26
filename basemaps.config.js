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

// The map starts zoomed out over central Europe, and the camera then flies in
// to the extent of the data. The bounds below apply after that first zoom, so
// they do not cut the approach short.
export const MAP_INTRO = {
  center: [8.23, 46.8],
  zoom: 4.5,
};

// Once the approach has ended, the map stays near Switzerland. The bounds sit
// well outside the country so border regions stay visible. minZoom keeps the
// country filling the viewport instead of shrinking into a world map. It sits
// below the zoom that fits the whole country on a laptop screen (about 6.4),
// so applying it does not move the camera.
//
// On a very wide screen the bounds can be smaller than the view at minZoom.
// MapLibre then raises the zoom until the view fits inside them.
export const MAP_CONSTRAINTS = {
  minZoom: 6,
  maxZoom: 18,
  maxBounds: [[-3.0, 41.0], [20.0, 52.5]],
};

// The constraints apply after the camera has stood still for this long.
export const MAP_INTRO_QUIET_MS = 600;

// If no zoom happens (for example a STAC object without a bounding box), the
// constraints apply after this delay.
export const MAP_INTRO_TIMEOUT_MS = 6000;

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
