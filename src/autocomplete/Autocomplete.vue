<template>
  <div class="autocomplete" v-bind="wrapperAttrs">
    <slot name="label">
      <label v-if="label" :for="id">{{ label }}</label>
    </slot>
    <input
      v-model="rawInput"
      v-on="inputEvents"
      v-bind="inputAttrs"
      :placeholder="placeholder"
      type="text"
      class="autocomplete-input"
    />
    <AutocompleteList
      v-bind="listAttrs"
      v-show="showSuggestions"
      :loading="loading"
      :optionId="optionId"
      :query="query"
      :matches="matches"
      :highlightIndex="highlightIndex"
      @select="onSelect"
    >
      <!-- pass down all scoped slots -->
      <template
        v-for="(slot, slotName) in $scopedSlots"
        v-slot:[slotName]="context"
      >
        <slot :name="slotName" v-bind="context"></slot>
      </template>
    </AutocompleteList>
  </div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";
import AutocompleteList from "./AutocompleteList.vue";
import {
  useAutocomplete,
  AutocompleteProps,
  autocompleteProps
} from "./use-autocomplete";
import { useAutocompleteAria } from "./use-autocomplete-aria";

interface Props extends AutocompleteProps<any> {
  id: string;
  inputClass?: string;
  placeholder?: string;
  label?: string;
}

export default createComponent({
  components: {
    AutocompleteList
  },
  props: {
    id: { type: String, required: true },
    ...autocompleteProps,
    // Optional
    inputClass: String,
    placeholder: String,
    label: String
  },
  setup(props: Props, context) {
    const datalist = props.datalist;
    const autocomplete = useAutocomplete(
      {
        datalist,
        format: props.format,
        search: props.search,
        async: props.async
      },
      context
    );
    const aria = useAutocompleteAria(props.id, autocomplete);

    return { ...autocomplete, ...aria };
  }
});
</script>

<style lang="scss" scoped>
.autocomplete {
  position: relative;
}
</style>
