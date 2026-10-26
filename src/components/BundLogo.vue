<template>
  <div class="bund-logo">
    <a :href="homeUrl" class="bund-logo-link" target="_blank" rel="noopener noreferrer">
      <img :src="logo" :alt="altText" class="bund-logo-img">
    </a>
    <span class="bund-logo-divider" aria-hidden="true" />
  </div>
</template>

<script>
// Federal logo at the start of the site bar, followed by a divider and the
// catalog title. The logo is the unmodified BundLogo.svg from
// https://github.com/swiss/designsystem (MIT). The federal logo may not be
// altered, so this component only sets its size. The coat of arms and the
// four-language name are one unit, see the federal CD manual.
import logo from '../theme/img/BundLogo.svg';

export default {
  name: 'BundLogo',
  data() {
    return {
      logo,
      homeUrl: 'https://www.admin.ch/',
      altText: 'Schweizerische Eidgenossenschaft, Confédération suisse, Confederazione Svizzera, Confederaziun svizra'
    };
  }
};
</script>

<style lang="scss">
.bund-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .bund-logo-link {
    display: inline-flex;
    line-height: 0;
  }

  .bund-logo-img {
    height: 40px;
    width: auto;
  }

  .bund-logo-divider {
    align-self: stretch;
    width: 1px;
    margin: 0 1rem 0 1.25rem;
    background: #acb4bd; // secondary-200 in swiss/designsystem
  }

  @media (min-width: 992px) {
    .bund-logo-img {
      height: 48px;
    }
  }
}
</style>
