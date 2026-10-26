<template>
  <div class="bafu-footer">
    <div class="bafu-footer-columns">
      <section>
        <h2>{{ text.contact }}</h2>
        <ul>
          <li>
            <a :href="text.officeUrl" target="_blank" rel="noopener noreferrer">{{ text.office }}<b-icon-box-arrow-up-right /></a>
          </li>
          <li>
            <a :href="addressUrl" target="_blank" rel="noopener noreferrer">Mühlestrasse 2, 3063 Ittigen<b-icon-box-arrow-up-right /></a>
          </li>
          <li>
            <a :href="`mailto:${email}`">{{ email }}<b-icon-box-arrow-up-right /></a>
          </li>
        </ul>
      </section>
      <section>
        <h2>{{ text.legal }}</h2>
        <ul>
          <li>
            <a :href="text.legalUrl" target="_blank" rel="noopener noreferrer">{{ text.legalLink }}<b-icon-box-arrow-up-right /></a>
          </li>
        </ul>
      </section>
    </div>
    <p class="bafu-footer-build">
      {{ text.version }} {{ commit }} · {{ text.build }} {{ buildTime }}
    </p>
    <i18n-t tag="small" keypath="poweredBy" class="bafu-footer-powered" scope="global">
      <template #link>
        <a href="https://github.com/portolan-sdi/portolan-browser" target="_blank" rel="noopener noreferrer">Portolan Browser</a> {{ browserVersion }},
        {{ $t('builtOn', 'built on') }}
        <a href="https://github.com/radiantearth/stac-browser" target="_blank" rel="noopener noreferrer">STAC Browser</a>
      </template>
    </i18n-t>
  </div>
</template>

<script>
import { mapState } from 'vuex';

// The legal URLs are the language versions of the admin.ch legal page.
const TEXTS = {
  de: {
    contact: 'Kontakt und Standort',
    office: 'Bundesamt für Umwelt BAFU',
    officeUrl: 'https://www.bafu.admin.ch/bafu/de/home.html',
    legal: 'Rechtliches',
    legalLink: 'admin.ch Rechtliches',
    legalUrl: 'https://www.admin.ch/gov/de/start/rechtliches.html',
    version: 'Version',
    build: 'Build'
  },
  fr: {
    contact: 'Contact et adresse',
    office: 'Office fédéral de l\'environnement OFEV',
    officeUrl: 'https://www.bafu.admin.ch/bafu/fr/home.html',
    legal: 'Informations juridiques',
    legalLink: 'admin.ch Conditions d\'utilisation',
    legalUrl: 'https://www.admin.ch/gov/fr/accueil/conditions-utilisation.html',
    version: 'Version',
    build: 'Build'
  },
  it: {
    contact: 'Contatto e indirizzo',
    office: 'Ufficio federale dell\'ambiente UFAM',
    officeUrl: 'https://www.bafu.admin.ch/bafu/it/home.html',
    legal: 'Basi legali',
    legalLink: 'admin.ch Basi legali',
    legalUrl: 'https://www.admin.ch/gov/it/pagina-iniziale/basi-legali.html',
    version: 'Versione',
    build: 'Build'
  },
  en: {
    contact: 'Contact and location',
    office: 'Federal Office for the Environment FOEN',
    officeUrl: 'https://www.bafu.admin.ch/bafu/en/home.html',
    legal: 'Legal information',
    legalLink: 'admin.ch Terms and conditions',
    legalUrl: 'https://www.admin.ch/gov/en/start/terms-and-conditions.html',
    version: 'Version',
    build: 'Build'
  }
};

export default {
  name: 'BafuFooter',
  props: {
    browserVersion: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      email: 'data@bafu.admin.ch',
      addressUrl: 'https://www.openstreetmap.org/search?query=' + encodeURIComponent('Mühlestrasse 2, 3063 Ittigen'),
      // Set at build time in vite.config.js.
      commit: typeof BAFU_BUILD_COMMIT !== 'undefined' ? BAFU_BUILD_COMMIT : 'dev',
      buildTime: typeof BAFU_BUILD_TIME !== 'undefined' ? BAFU_BUILD_TIME : ''
    };
  },
  computed: {
    ...mapState(['uiLanguage']),
    text() {
      const lang = String(this.uiLanguage || 'de').slice(0, 2);
      return TEXTS[lang] || TEXTS.en;
    }
  }
};
</script>

<style lang="scss">
@import "../theme/variables";

.bafu-footer {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem var(--sb-block-gap) 1.5rem;
  color: #ffffff;
  text-align: left;

  .bafu-footer-columns {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  // The theme colors every h2 inside #stac-browser, so this rule needs the
  // same weight to turn the headings white.
  #stac-browser & h2 {
    margin: 0 0 1rem;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: #ffffff;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      color: #ffffff;
      text-decoration: underline;
    }

    svg {
      margin-left: 0.35rem;
      width: 0.8em;
      height: 0.8em;
    }
  }

  .bafu-footer-build {
    margin: 1.5rem 0 0.25rem;
    text-align: center;
  }

  .bafu-footer-powered {
    display: block;
    text-align: center;
    color: #acb4bd; // secondary-200

    a {
      color: #ffffff;
    }
  }
}
</style>
