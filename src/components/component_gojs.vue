<template>
  <div class="filter-container">
   
    <div class="filter">
      <input
        v-model="state.firstFilterValue"
        type="text"
        placeholder="Enter regex for first filter"
        class="filter-input"
      />
      <button @click="applyFirstFilter" class="filter-button">Apply First Filter</button>
    </div>

    
    <div class="filter">
      <input
        v-model="state.secondFilterValue"
        type="text"
        placeholder="Enter regex for second filter"
        class="filter-input"
      />
      <button @click="applySecondFilter" class="filter-button">Apply Second Filter</button>
    </div>

    <div ref="myDiagramDiv" class="diagram"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs } from 'vue';
import * as go from 'gojs';
import modelService from '@/service/modelService'; // Make sure this path is correct

export default defineComponent({
  props: {
    path: String
  },
  setup(props) {
    const { path } = toRefs(props);
    const myDiagramDiv = ref(null);
    const state = reactive({ 
      firstFilterValue: "", 
      secondFilterValue: "" 
    });
    let myDiagram;
    let jsonData; // Store the loaded JSON data

    function makePort(name, spot, output, input) {
      const $ = go.GraphObject.make;
      return $(go.Shape, "Rectangle", {
        fill: "black", 
        stroke: null, 
        desiredSize: new go.Size(8, 8),
        alignment: spot,
        portId: name,
        fromSpot: spot, toSpot: spot,
        fromLinkable: output, toLinkable: input,
        cursor: "pointer"
      });
    }

    function initializeDiagram(jsonData) {
      const $ = go.GraphObject.make;
      myDiagram = $(go.Diagram, myDiagramDiv.value, {
        initialAutoScale: go.Diagram.Uniform,
        layout: $(go.LayeredDigraphLayout, { direction: 90 }),
        "undoManager.isEnabled": true
      });

      myDiagram.nodeTemplate = $(
        go.Node, "Spot",
        {
          click: (e, obj) => createLinksForNode(obj.part.data.key)
        },
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle",
            new go.Binding("fill", "color"),
            { stroke: "black", strokeWidth: 2 }
          ),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("text", "name")
          )
        ),
        makePort("T", go.Spot.Top, true, false),
        makePort("L", go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, false, true),
        makePort("B", go.Spot.Bottom, false, true)
      );

      myDiagram.model = new go.GraphLinksModel(
        jsonData.components.map(c => ({
          ...c,
          key: c.name
        }))
      );
    }

    function createLinksForNode(nodeKey) {
      const relatedLinks = jsonData.flows.filter(f => f.source === nodeKey || f.target === nodeKey);
      myDiagram.startTransaction("addLinks");
      relatedLinks.forEach(link => {
        myDiagram.model.addLinkData({
          from: link.source,
          to: link.target,
          fromPort: link.fromPort,
          toPort: link.toPort,
          color: link.color 
        });
      });
      myDiagram.commitTransaction("addLinks");
    }

    const applyFirstFilter = () => {
      applyFilter(state.firstFilterValue, true);
    };

    const applySecondFilter = () => {
      applyFilter(state.secondFilterValue, false);
    };

    const applyFilter = (filterValue, isFirstFilter) => {
      if (myDiagram) {
        if (filterValue.trim() !== "") {
          try {
            const regex = new RegExp(filterValue);
            myDiagram.startTransaction("filter");
            myDiagram.nodes.each(node => {
              const matches = regex.test(node.data.name);
              node.visible = isFirstFilter ? !matches : matches;
            });
            myDiagram.commitTransaction("filter");
          } catch (e) {
            console.error("Invalid regular expression: ", e);
          }
        } else {
          myDiagram.startTransaction("filter");
          myDiagram.nodes.each(node => {
            node.visible = true;
          });
          myDiagram.commitTransaction("filter");
        }
      }
    };

    onMounted(async () => {
      if (!path.value) {
        console.error("No path provided for JSON data");
        return;
      }

      try {
        jsonData = await modelService.loadJsonData(path.value);
        console.log(jsonData);
        initializeDiagram(jsonData);
      } catch (error) {
        console.error('Error loading JSON data:', error);
        // Handle the error by showing an alert or some other method
      }
    });

    return { myDiagramDiv, state, applyFirstFilter, applySecondFilter };
  },
});
</script>




<style scoped>
.filter-container {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.filter {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filter-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.filter-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-button:hover {
  background-color: #0056b3;
}

.diagram {
  width: 100%;
  height: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
