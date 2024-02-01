<template>
  <v-container>
    <v-toolbar class="simulationInteractive" flat dense>
      <v-btn
        icon
        color="green"
        @click="startSimulation"
        :disabled="isSimulationRunning"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <v-btn
        icon
        color="red"
        @click="stopSimulation"
        :disabled="!isSimulationRunning"
      >
        <v-icon>mdi-stop</v-icon>
      </v-btn>
      <v-btn
        icon
        color="orange"
        @click="goBackward"
        :disabled="!isSimulationRunning"
      >
        <v-icon>mdi-skip-previous</v-icon>
      </v-btn>
      <v-btn
        icon
        color="blue"
        @click="goForward"
        :disabled="!isSimulationRunning"
      >
        <v-icon>mdi-skip-next</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="separator"></div>
    <v-data-table-virtual
      :headers="headers"
      :items="transitions"
      item-value="trans_id"
      class="full-width scrollable-table"
      height="400"
      @click:row="handleRowClick"
    >
      <template v-slot:item.occ_law="{ value }">
        {{ formatOccLaw(value) }}
      </template>
    </v-data-table-virtual>
    <div class="separator"></div>
    <div>current time: {{ currentTime }}</div>
    <div class="separator"></div>
    <div></div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import { useSimulationStore } from "@/store/simulationStore";
import modelService from "@/service/modelService";

export default defineComponent({
  setup() {
    const simulationStore = useSimulationStore();
    const transitions = ref([]);
    const currentTime = ref(0);
    const isSimulationRunning = computed(
      () => simulationStore.simulationStatus === "started"
    );

    const headers = [
      { title: "Name", key: "comp_name" },
      { title: "Target", key: "target" },
      { title: "Date", key: "end_time" },
      { title: "Law", key: "occ_law" },
    ];

    watch(
      () => simulationStore.needDiagramRefresh,
      (newVal) => {
        if (newVal) {
          refreshTable();
        }
      }
    );

    async function refreshTable() {
      try {
        const response = await modelService.fetchTransitions();
        transitions.value = response.transitions;
        currentTime.value = response.current_time;
      } catch (error) {
        console.log("An error occurred while fetching the transitions:", error);
      }
    }

    onMounted(async () => {
      refreshTable();
    });

    const handleRowClick = (click: any, row: any) => {
      try {
        simulationStore.goForwardID(row.item.trans_id);
      } catch (error) {
        console.error("Error in forwarding with ID:", error);
      }
    };

    const formatOccLaw = (occLaw: any) => {
      if (!occLaw || typeof occLaw !== "object") {
        return "";
      }
      let result = occLaw.cls.replace("OccDistribution", "");
      const additionalAttributes = Object.keys(occLaw)
        .filter((key) => key !== "cls" && occLaw[key] !== undefined)
        .map((key) => `${key}=${occLaw[key]}`)
        .join(", ");
      if (additionalAttributes) {
        result += `(${additionalAttributes})`;
      }
      return result;
    };

    return {
      startSimulation: simulationStore.startSimulation,
      goBackward: simulationStore.goBackward,
      goForward: simulationStore.goForward,
      stopSimulation: simulationStore.stopSimulation,
      transitions,
      headers,
      handleRowClick,
      currentTime,
      refreshTable,
      isSimulationRunning,
      formatOccLaw,
    };
  },
});
</script>

<style scoped>
.simulationInteractive {
  background-color: #c9d4e6ff;
  font-family: "Open Sans", sans-serif;
}

.separator {
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #0a0a0a;
}

.full-width {
  width: 100%;
  margin-left: -30;
  background-color: #c9d4e6ff;
}
.v-data-table {
  margin-left: -10;
}
.v-container {
  padding-left: 0;
  padding-right: 0;
}
.scrollable-table {
  max-height: 400px;
  overflow-y: auto;
}
</style>