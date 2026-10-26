<template>
  <div class="bund-bar">
    <a :href="homeUrl" class="bund-bar-link" target="_blank" rel="noopener noreferrer">
      <img :src="logo" :alt="altText" class="bund-bar-logo" height="40">
    </a>
  </div>
</template>

<script>
// Federal bar above the site header. The logo is the unmodified BundLogo.svg
// from https://github.com/swiss/designsystem (MIT). The federal logo may not
// be altered, so this component only sets its size. The coat of arms and the
// four-language name are one unit, see the federal CD manual.
import logo from '../theme/img/BundLogo.svg';

export default {
  name: 'BundBar',
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
@import "../theme/variables";

.bund-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  background: #ffffff;
  border-bottom: 1px solid #acb4bd; // secondary-200

  .bund-bar-link {
    display: inline-flex;
    line-height: 0;
  }

  .bund-bar-logo {
    height: 40px;
    width: auto;
  }

  @media print {
    border-bottom: 0;
  }
}
</style>
