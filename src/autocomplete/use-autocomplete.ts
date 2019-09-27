import { ref, computed, SetupContext, watch } from '@vue/composition-api';

export type SearchFn<T> = {
  (query: string): Promise<T[]>;
  (query: string, datalist: FormattedData<T>[]): FormattedData<T>[];
};

export interface AutocompleteProps<T> {
  datalist: T[];
  format: (data: T) => string;
  search: SearchFn<T>;
  async: boolean;
}

export interface FormattedData<T> {
  id: number;
  data: T;
  text: string;
  html?: string;
}

export const autocompleteProps = {
  search: { type: Function, required: true },
  format: { type: Function, default: (d: string) => d },
  datalist: { type: Array, default: () => [] },
  async: { type: Boolean, default: false },
};

export function useAutocomplete<T = any>(props: AutocompleteProps<T>, { emit }: SetupContext) {
  const rawInput = ref('');
  const query = computed(() => rawInput.value.trim());
  const highlightIndex = ref(-1);
  const matches = ref<FormattedData<T>[]>([]);
  const isFocused = ref(false);
  const fetching = ref(0);
  const formatData = (d: T, i: number) => ({
    id: i,
    data: d,
    text: props.format(d),
  });
  const dataFormatted = computed(() => props.datalist.map(formatData));

  const showSuggestions = computed(
    // () => !!rawInput.value && (props.datalist.length || matches.value.length) > 0 && isFocused.value
    () => isFocused.value
  );

  function reset() {
    rawInput.value = '';
    highlightIndex.value = -1;
    matches.value = [];
  }

  function increaseIndex() {
    highlightIndex.value += 1;
    if (highlightIndex.value >= matches.value.length) {
      highlightIndex.value = -1;
    }
  }

  function decreaseIndex() {
    if (highlightIndex.value < 0) {
      highlightIndex.value = matches.value.length;
    }
    highlightIndex.value -= 1;
  }

  watch(query, async (newQuery: string) => {
    if (props.async) {
      fetching.value++;
      try {
        const response = await props.search(newQuery);
        matches.value = (response || []).map(formatData);
      } finally {
        fetching.value--;
      }
    } else {
      matches.value = props.search(newQuery, dataFormatted.value);
    }
    if (newQuery.length && matches.value.length) {
      highlightIndex.value = 0;
    } else {
      highlightIndex.value = -1;
    }
  });

  // Events
  function onFocus() {
    isFocused.value = true;
  }

  function onBlur(event: MouseEvent) {
    const target = event.relatedTarget as HTMLElement;
    if (!target || !target.classList.contains('autocomplete-suggestion')) {
      isFocused.value = false;
    }
  }

  function onSelect(index: number) {
    if (index < 0) {
      emit('custom', query.value);
    } else if (index < matches.value.length) {
      const match = matches.value[index];
      emit('select', match.data);
    }
    reset();
  }

  function onBackspace(event: KeyboardEvent) {
    if (!rawInput.value.length) emit('backspace', event);
  }

  function onKeydown(event: KeyboardEvent) {
    // we want to use event.key here, not event.code, because sometimes users remap keys to different positions
    // fallbacks for browser compatibility
    const select = () => onSelect(highlightIndex.value);
    switch (event.key) {
      case 'ArrowDown':
      case 'Down':
        // Move one down the list of suggestions
        event.preventDefault();
        increaseIndex();
        break;
      case 'ArrowUp':
      case 'Up':
        // Move one up the list of suggestions
        event.preventDefault();
        decreaseIndex();
        break;
      case 'Escape':
      case 'Esc':
        // send focus back to the input and reset highlight index
        // setFocus()
        highlightIndex.value = -1;
        break;
      case 'Tab':
        // reset the form if the user moves focus
        // Note: event is not being captured if a @blur listener is set on the input
        // reset()
        break;
      case 'Backspace':
        // If there's nothing in the input, trigger the onBackspace callback
        // can be used to do things like remove the last item in the array that we are building
        if (rawInput.value.length === 0) {
          reset();
          onBackspace(event);
        }
        break;
      case 'Enter':
        // select what's in the input
        event.preventDefault();
        event.stopPropagation();
        select();
        break;
      case ',':
        // select what's in the input except the typed comma
        event.preventDefault();
        select();
        break;
      default:
        break;
    }
  }

  return {
    loading: computed(() => fetching.value > 0),
    rawInput,
    query,
    matches,
    highlightIndex,
    showSuggestions,
    onSelect,
    inputEvents: {
      blur: onBlur,
      focus: onFocus,
      keydown: onKeydown,
    },
  };
}
