<template>
  <div>
    <div
      class="aj-help-modal"
      :class="{ open: open }"
      @click="window && window.history.back()"
    >
      <div class="aj-help-modal-container" @click.stop>
        <span class="aj-help-modal-header">
          <h4>En savoir plus</h4>
          <svg
            class="aj-help-modal-back-icon"
            @click="window && window.history.back()"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.925 1.08919C18.3725 0.536687 17.48 0.536687 16.9275 1.08919L10 8.00252L3.07252 1.07502C2.52002 0.52252 1.62752 0.52252 1.07502 1.07502C0.52252 1.62752 0.52252 2.52002 1.07502 3.07252L8.00252 10L1.07502 16.9275C0.52252 17.48 0.52252 18.3725 1.07502 18.925C1.62752 19.4775 2.52002 19.4775 3.07252 18.925L10 11.9975L16.9275 18.925C17.48 19.4775 18.3725 19.4775 18.925 18.925C19.4775 18.3725 19.4775 17.48 18.925 16.9275L11.9975 10L18.925 3.07252C19.4634 2.53419 19.4634 1.62752 18.925 1.08919Z"
              fill="#030F8F"
            />
          </svg>
        </span>
        <div class="aj-help-modal-content">
          {{ text }}
        </div>
        <button
          class="aj-help-modal-back-button button outline small with-icon"
          type="button"
          @click="window && window.history.back()"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.25 5.24998H2.87249L6.53249 1.58998C6.82499 1.29748 6.82499 0.817478 6.53249 0.524978C6.23999 0.232478 5.76749 0.232478 5.47499 0.524978L0.532485 5.46748C0.239985 5.75998 0.239985 6.23248 0.532485 6.52498L5.47499 11.4675C5.76749 11.76 6.23999 11.76 6.53249 11.4675C6.82499 11.175 6.82499 10.7025 6.53249 10.41L2.87249 6.74998H11.25C11.6625 6.74998 12 6.41248 12 5.99998C12 5.58748 11.6625 5.24998 11.25 5.24998Z"
              fill="#030F8F"
            />
          </svg>
          Retour
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Hint from "@/lib/Hint"

export default {
  name: "EnSavoirPlusContent",
  data() {
    return {
      open: false,
      window,
    }
  },
  computed: {
    attribute: function () {
      return this.$route.params.parent.split("/").pop()
    },
    source: function () {
      return this.$route.params.parent
    },
    text: function () {
      return Hint.get(this.attribute, this.source)
    },
  },
  mounted() {
    this.open = true
  },
}
</script>
