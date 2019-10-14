<template>
  <div class="autocomplete-list" role="listbox">
    <slot name="prepend" v-bind="slotContext" />
    <slot v-if="loading" name="loading" v-bind="slotContext">Loading…</slot>
    <slot
      v-else-if="matches.length === 0"
      name="empty"
      v-bind="slotContext"
    ></slot>
    <template v-else>
      <AutocompleteListItem
        v-for="(match, index) in matches"
        :id="optionId(index).value"
        :key="match.id"
        :match="match"
        :active="isHighlighted(index)"
        @click="select(index)"
      >
        <template v-if="$scopedSlots.suggestion" v-slot="{ data }">
          <slot name="suggestion" v-bind="{ data, query }" />
        </template>
      </AutocompleteListItem>
    </template>
    <slot name="append" v-bind="slotContext" />
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from "@vue/composition-api";

import AutocompleteListItem from "./AutocompleteListItem.vue";

export default createComponent({
  components: {
    AutocompleteListItem
  },
  props: {
    id: String,
    highlightIndex: Number,
    matches: Array,
    query: String,
    optionId: Function,
    loading: Boolean
  },
  setup(props, { emit }) {
    const select = (index: number) => emit("select", index);
    return {
      select,
      isHighlighted: (index: number) => index === props.highlightIndex,
      slotContext: computed(() => {
        return {
          query: props.query,
          highlightIndex: props.highlightIndex,
          loading: props.loading,
          select
        };
      })
    };
  }
});
</script>
