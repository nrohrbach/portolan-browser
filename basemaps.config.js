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
