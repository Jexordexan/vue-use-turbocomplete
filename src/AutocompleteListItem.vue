<template>
  <div
    :aria-selected="active"
    @click="$emit('click')"
    :class="{ active }"
    class="autocomplete-suggestion"
    role="option"
    tabindex="-1"
    button
  >
    <slot v-bind="{ data: match }">
      <span v-if="match && match.html" v-html="match.html"></span>
      <span v-else-if="match && match.text">{{ match.text }}</span>
    </slot>
  </div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";

export default createComponent({
  props: {
    active: Boolean,
    match: Object
  }
});
</script>
