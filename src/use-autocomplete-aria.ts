import { computed, Ref, reactive } from '@vue/composition-api';

// Accessibility
export function useAutocompleteAria(
  id: string,
  {
    highlightIndex,
    showSuggestions,
  }: {
    highlightIndex: Ref<number>;
    showSuggestions: Ref<boolean>;
  }
) {
  const optionId = (index: number) => computed(() => `autocomplete-${id}-option-${index}`);
  const inputId = id;
  const wrapperId = computed(() => `autocomplete-${id}-wrapper`);
  const listId = computed(() => `autocomplete-${id}-listbox`);
  const activeId = computed(() => optionId(highlightIndex.value).value);

  const inputAttrs = reactive({
    id: inputId,
    'aria-controls': listId,
    'aria-activedescendant': activeId,
    'aria-autocomplete': 'list',
    autocomplete: 'off',
  });

  const wrapperAttrs = reactive({
    id: wrapperId,
    'aria-expanded': showSuggestions,
    'aria-owns': listId,
    role: 'combobox',
    'aria-haspopup': 'listbox',
  });

  const listAttrs = reactive({
    id: listId,
    role: 'listbox',
  });

  return reactive({
    inputAttrs,
    wrapperAttrs,
    listAttrs,
    optionId,
  });
}
