<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <h2 class="aj-question">Depuis combien de temps vivez-vous seul·e ?</h2>
      <div class="aj-selection-wrapper">
        <input
          id="moins18"
          type="radio"
          v-bind:value="false"
          name="rsa_isolement_recent"
          v-model="value"
        />
        <label for="moins18">Moins de 18 mois</label>
      </div>
      <div class="aj-selection-wrapper">
        <input
          id="plus18"
          type="radio"
          v-bind:value="true"
          name="rsa_isolement_recent"
          v-model="value"
        />
        <label for="plus18">Plus de 18 mois</label>
      </div>
    </fieldset>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import { createFamilleMixin } from "@/mixins/FamilleMixin"

export default {
  name: "SimulationFamilleRsaIsolementRecent",
  components: {
    Actions,
  },
  mixins: [createFamilleMixin("rsa_isolement_recent")],
}
</script>
