<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-combobox
        label="Combobox"
        v-model="selectedComponent"
        :items="componentNames"
        variant="outlined"
      ></v-combobox>
    </v-col>
    <v-col cols="12" sm="3">
      <v-text-field
        v-model="level"
        label="Enter Level"
        type="number"
        outlined
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="3">
      <v-btn color="primary" @click="apply">Apply</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import modelService from "@/service/modelService" 

export default defineComponent({
  setup(_, { emit }) {
    const route = useRoute();
    const componentNames = ref<string[]>([]);
    const selectedComponent = ref('');
    const level = ref(1); 

    const fetchComponentNames = async () => {
      const path = route.params.path as string;
      componentNames.value = await modelService.fetchComponentNames(path);
    };

    const apply = () => {
      emit('apply-filter', {
        componentName: selectedComponent.value,
        level: level.value
      });
    };

    onMounted(fetchComponentNames);

    return { componentNames, selectedComponent, level, apply };
  },
});
</script>
