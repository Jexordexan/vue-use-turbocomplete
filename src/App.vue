<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <Autocomplete
      id="transit-search"
      label="Transit search"
      :datalist="transit"
      :format="format"
      :search="search"
      @select="lastHit = $event"
    >
      <template v-slot:append="{ highlightIndex, select, query }">
        <AutocompleteListItem
          v-if="query"
          :active="highlightIndex === -1"
          @click="select(-1)"
        >
          Add custom: "{{ query }}"
        </AutocompleteListItem>
      </template>
    </Autocomplete>
    <label for="movie-search">Movie search</label>
    <Autocomplete
      id="movie-search"
      :datalist="[]"
      :format="movieFormat"
      :search="movieSearch"
      async
      @select="lastHit = $event"
    />

    <div>
      Last hit:
      <pre>{{ lastHit }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Autocomplete from "./autocomplete/Autocomplete.vue";
import AutocompleteListItem from "./autocomplete/AutocompleteListItem.vue";
import { search } from "./autocomplete/fuse-search";

export interface Route {
  attributes: Attributes;
  id: string;
  type: string;
}

export interface Attributes {
  color: string;
  description: string;
  direction_destinations: string[];
  direction_names: string[];
  fare_class: string;
  long_name: string;
  short_name: string;
  sort_order: number;
  text_color: string;
  type: number;
}

export default Vue.extend({
  name: "app",
  components: {
    Autocomplete,
    AutocompleteListItem
  },
  data() {
    return {
      lastHit: null,
      apiKey: "71f1ee97",
      search: search(["text"], true, 10),
      format: (f: any) => f.attributes.long_name,
      transit: require("@/assets/t-data.json").data
    };
  },
  methods: {
    movieFormat(movie: any) {
      return movie.Title;
    },
    async movieSearch(query: string) {
      if (!query) return [];
      const url = `http://www.omdbapi.com/?apikey=${this.apiKey}&s=${query}`;
      const response = await fetch(url);
      const json = await response.json();
      if (json.Response === "True") return json.Search;
      return [];
    }
  }
});
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: auto;
  width: 800px;
  margin-top: 60px;
}
</style>
