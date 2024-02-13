<template>
  <v-card class="edge-mind-theme" style="height: 100vh;"> 
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="one">Diagram</v-tab>
      <v-tab value="three">JSON</v-tab>
    </v-tabs>

    <v-card-text style="height: 100%;"> 
      <v-window v-model="tab" style="height: 100%;"> 
        <v-window-item value="one">
          <div style="height: 100%;">
            <component_gojs ></component_gojs>
          </div> 
        </v-window-item>
        <v-window-item value="three">
          <pre style="height: 100%;">{{ formattedJsonData }}</pre> 
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import modelService from "@/service/modelService";
import component_gojs from '@/components/component_gojs.vue';
import GojsComponentDocument from '@/components/gojs_component_document.vue';

export default defineComponent({
  components: { component_gojs, GojsComponentDocument },

  setup() {
    const tab = ref('one');
    const jsonData = ref(null);
    const formattedJsonData = ref(null);

    onMounted(async () => {
      jsonData.value = await modelService.loadJsonData();
      formattedJsonData.value = JSON.stringify(jsonData.value, null, 2);
    });

    return { tab, formattedJsonData };
  },
});
</script>

<style>
.v-tab{
  color: #1f416dff !important; 
  font-family: 'Open Sans', sans-serif;
}
</style>
