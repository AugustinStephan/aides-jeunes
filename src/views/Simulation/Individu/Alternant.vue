<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      {{ getLabel("être") | capitalize }} en alternance&nbsp;?
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuAlternant",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [createIndividuMixin("alternant")],
}
</script>
