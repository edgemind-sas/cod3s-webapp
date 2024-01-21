<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab value="one">GOJS</v-tab>
      <v-tab value="two">PLUMP</v-tab>
      <v-tab value="three">JSON</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
         
          <component_gojs ></component_gojs>
        </v-window-item>

        <v-window-item value="two">
          <component_jsplumb> </component_jsplumb>
        </v-window-item>

        <v-window-item value="three">
          <!-- JSON Content -->
          <pre>{{ formattedJsonData }}</pre>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import * as go from 'gojs';
import jsonData from '@/assets/system_petit.json'; 
import component_gojs from '@/components/component_gojs.vue'
import component_jsplumb from '@/components/component_jsplumb.vue'
import gojs_component_document from '@/components/gojs_component_document.vue'
export default defineComponent({
  data: () => ({
    tab: 'one', 
  }),
    components : {component_gojs, gojs_component_document, component_jsplumb}, 
  setup() {
    const formattedJsonData = computed(() => JSON.stringify(jsonData, null, 2));

    return { formattedJsonData };
  },
});
</script>
