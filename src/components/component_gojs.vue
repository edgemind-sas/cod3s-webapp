<template>
  <div class="filter-container">
    <div ref="myDiagramDiv" class="diagram"></div>
    <v-tooltip v-model="showTooltip" :position-x="tooltipX" :position-y="tooltipY">
      <template v-slot:activator="{ props }">
       
      </template>
      <v-card v-if="tooltipData">
        <v-card-title>{{ tooltipData.name }}</v-card-title>
        <v-card-text>
          <div v-for="variable in tooltipData.variables" :key="variable.id" class="my-2">
            <v-chip color="blue" small>{{ variable.name }}</v-chip>
            <span>: {{ variable.value_current }}</span>
          </div>
          <div v-for="state in activeStates" :key="state.id" class="my-2">
            <v-chip v-if="state.is_active" color="orange" small>{{ state.aut_name }}</v-chip>
            <span v-if="state.is_active">: {{ state.name }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-tooltip>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, toRefs, watch, computed, nextTick } from 'vue';
import * as go from 'gojs';
import modelService from "@/service/modelService"
import { useSimulationStore } from '@/store/simulationStore';
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  props: {
    path: String
  },
  setup(props) {
    const { path } = toRefs(props);
    const myDiagramDiv = ref(null);
    const simulationStore = useSimulationStore();
    const tooltipData = ref({});
    const showTooltip = ref(false);
    const tooltipX = ref(0);
    const tooltipY = ref(0);
    const route = useRoute();


    const activeStates = computed(() => {
      return tooltipData.value?.states?.filter(state => state.is_active) || [];
    });
    
    const isModelisationRoute = computed(() => route.path === '');

    let myDiagram: go.Diagram;





    function convertPortPositionToSpot(position: string): go.Spot {
      switch (position) {
        case 'left': return go.Spot.Left;
        case 'right': return go.Spot.Right;
        case 'top': return go.Spot.Top;
        case 'bottom': return go.Spot.Bottom;
        default: return go.Spot.Top;
      }
    }

  function makePort(portId: string, spot: go.Spot = go.Spot.Top, output: boolean = true, input: boolean = false, color: string = "#ef7b26"): go.GraphObject {
  const $ = go.GraphObject.make;
  
  return $(go.Shape, "Rectangle", {
    portId: portId,
    fromSpot: output ? spot : go.Spot.None,
    toSpot: input ? spot : go.Spot.None,
    fromLinkable: false,
    toLinkable: false,
    cursor: "pointer",
    fill: color,
    desiredSize: new go.Size(8, 8)
  });
}




    function initializeDiagram(jsonData: any) {
      const $ = go.GraphObject.make;
      /*if (myDiagram) {
        updateDiagramModel(jsonData);
        return;
      }*/



      myDiagram = $(go.Diagram, myDiagramDiv.value, {
        "undoManager.isEnabled": true,
        "animationManager.isEnabled":false,
        layout: $(go.ForceDirectedLayout,
          {
            defaultSpringLength: 50,
            defaultElectricalCharge: 100
          }
        ),
      });

    myDiagram.layout = $(go.ForceDirectedLayout, {
    isInitial: false,  
    isOngoing: false, 
  });

      myDiagram.nodeTemplate = $(
        go.Node, "Table",
        
        {
          mouseEnter: async (e, node) => {
            if (isModelisationRoute.value) return;
            const data = node.part.data;
            // Set the position for the tooltip
            const nodeLocation = node.location;
            const mousePt = myDiagram.lastInput.viewPoint;
            tooltipX.value = mousePt.x;
            tooltipY.value = mousePt.y;

            try {
              const details = await modelService.getComponentDetails(data.key);
              tooltipData.value = details;
              showTooltip.value = true;
            } catch (error) {
              console.error('Error fetching component details:', error);
              showTooltip.value = false;
            }
          },
          mouseLeave: (e, obj) => {
            showTooltip.value = false;
          },
        },

        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

        $(go.Panel, "Auto",
          { row: 1, column: 1, name: "BODY", stretch: go.GraphObject.Fill },
          $(go.Shape, "Rectangle",
            new go.Binding("fill", "color"),
            { stroke: null, strokeWidth: 0, minSize: new go.Size(80, 80) }
          ),
          $(go.TextBlock,
            { margin: 10, textAlign: "center", font: "bold 14px Segoe UI,sans-serif", stroke: "#484848", editable: false 
          },
            new go.Binding("text", "name").makeTwoWay()
          )
        ),

      makePortPanel('left', new go.Binding("itemArray", "leftArray"), go.Spot.Left),
      makePortPanel('top', new go.Binding("itemArray", "topArray"), go.Spot.Top),
      makePortPanel('right', new go.Binding("itemArray", "rightArray"), go.Spot.Right),
      makePortPanel('bottom', new go.Binding("itemArray", "bottomArray"), go.Spot.Bottom)
    
      );
        
      function makePortPanel(side: string, portArrayBinding: any, spot: go.Spot): go.Panel {
      const $ = go.GraphObject.make;
      return $(go.Panel, "Horizontal", { row: side === 'top' ? 0 : side === 'bottom' ? 2 : 1, column: side === 'left' ? 0 : side === 'right' ? 2 : 1 },
        portArrayBinding,
        {
          itemTemplate: $(go.Panel,
            { _side: side },
            new go.Binding("portId", "portId"),
            makePort("", spot, true, true, "#ef7b26")
          )
        }
      );
    }
          

      myDiagram.linkTemplate = $(
        go.Link,
        { routing: go.Link.AvoidsNodes, 
          corner: 5,  
          curve: go.Link.JumpGap,
          fromEndSegmentLength: 20,
          toEndSegmentLength: 20,
          reshapable: true,
          toShortLength: 4,
          relinkableFrom: false, 
          resegmentable: true,
          relinkableTo: false },
        $(go.Shape,
          { strokeWidth: 2 },
          new go.Binding("stroke", "stroke_color"),
          new go.Binding("strokeWidth", "stroke_width")
        ),
        $(go.Shape,
          { toArrow: "Standard" },
          new go.Binding("toArrow", "to_arrow"),
          new go.Binding("fill", "stroke_color")
        )
      );

      myDiagram.addDiagramListener("SelectionMoved", function(e) {
    const positions: any = { components: [] };

    e.diagram.selection.each(function(part) {
        if (part instanceof go.Node) { 
            const loc = part.location;
            console.log(`Le composant ${part.data.key} a été déplacé à la position: ${loc.x.toFixed(2)}, ${loc.y.toFixed(2)}`);

            positions.components.push({
                comp_name: part.data.key,
                x: loc.x.toFixed(2),
                y: loc.y.toFixed(2),
            });
        }
    });

    // Envoyez les positions mises à jour à l'API
    modelService.updatePositions(positions)
        .then(response => {
            console.log(response.message);
        })
        .catch(error => {
            console.error("Il y a eu une erreur lors de la mise à jour des positions: ", error);
        });
});


myDiagram.addDiagramListener("LinkReshaped", function(e) {
  const link = e.subject;
  const points = link.points.toArray().map(p => ({ x: p.x, y: p.y }));
  console.log(`Le link ${link.data.key} a été redimensionné. Points:`, points);
  
});




      assignModel(jsonData);
    }

    async function updateDiagramModel() {
  try {
    const updatedComponents = await modelService.fetchUpdatedComponents();

    if (updatedComponents.components && updatedComponents.components.length > 0) {
      myDiagram.startTransaction("updateModel");

      updatedComponents.components.forEach(updatedComponent => {
        const node = myDiagram.findNodeForKey(updatedComponent.name);
        if (node && updatedComponent.style) {
          Object.keys(updatedComponent.style).forEach(styleKey => {
            myDiagram.model.setDataProperty(node.data, styleKey, updatedComponent.style[styleKey]);
          });
          node.updateTargetBindings();
        }
      });

      if (updatedComponents.connections && updatedComponents.connections.length > 0) {
        updatedComponents.connections.forEach(updatedConnection => {
          
          const linkData = myDiagram.model.linkDataArray.find(ld => ld.from === updatedConnection.comp_source && ld.to === updatedConnection.comp_target);
          if (linkData && updatedConnection.style) {
            Object.keys(updatedConnection.style).forEach(styleKey => {
             
              myDiagram.model.setDataProperty(linkData, styleKey, updatedConnection.style[styleKey]);
            });
          }
        });
      }

      myDiagram.commitTransaction("updateModel");
    } else {
      console.log("Aucun composant à mettre à jour.");
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du diagramme:', error);
  }
}





    function assignModel(jsonData: any) {
      const componentData = jsonData.components.map((c: any) => {
        const posX = c.position && c.position.x ? parseFloat(c.position.x) : 0;
        const posY = c.position && c.position.y ? parseFloat(c.position.y) : 0;

        const portsArray = c.ports.map((port: any) => {
          const portColor = port.color || "#ef7b26";
          const portSpot = convertPortPositionToSpot(port.spot);
          const portPanel = makePort(port.name, portSpot, true, true, portColor);
          return { portId: port.name, panel: portPanel };
        });

        return {
          key: c.name,
          color: c.style.color || "#FFFFFF",
          loc: go.Point.stringify(new go.Point(posX, posY)),
          //loc: go.Point.stringify(new go.Point(0, 0)),
          leftArray: portsArray.filter((p: any) => p.panel.fromSpot.equals(go.Spot.Left)),
          topArray: portsArray.filter((p: any) => p.panel.fromSpot.equals(go.Spot.Top)),
          rightArray: portsArray.filter((p: any) => p.panel.fromSpot.equals(go.Spot.Right)),
          bottomArray: portsArray.filter((p: any) => p.panel.fromSpot.equals(go.Spot.Bottom)),
          name: c.name
        };
      });

      const linkDataArray = jsonData.connections.map((link: any) => {
        const processedLink = {
          from: link.comp_source,
          to: link.comp_target,
          fromPort: link.port_source,
          toPort: link.port_target,
          stroke_color: link.style.stroke_color || "#1f416d",
          stroke_width: link.style.stroke_width || 1,
          to_arrow: link.style.to_arrow || "Standard"
        };



        return processedLink;
      });

      myDiagram.model = new go.GraphLinksModel({
        linkFromPortIdProperty: "fromPort", 
        linkToPortIdProperty: "toPort", 
        nodeDataArray: componentData,
        linkDataArray: linkDataArray,
      });
    }



    watch([() => simulationStore.needDiagramRefresh, () => simulationStore.needModelRefresh], async ([needDiagramRefresh, needModelRefresh]) => {
  if (needModelRefresh) {
    
    if (myDiagram) {
     
      myDiagram.div = null;
      if (myDiagramDiv.value) {
        myDiagramDiv.value.innerHTML = '';
      }
      myDiagram = null;
    }

    const jsonData = await modelService.loadJsonData();
    initializeDiagram(jsonData);
    simulationStore.needModelRefresh = false;
  } else if (needDiagramRefresh) {
    
    refreshDiagram();
    //simulationStore.resetRefresh();
  }
}, { immediate: true });

    async function refreshDiagram() {
      try {
        const jsonData = await modelService.loadJsonData();
        if (myDiagram) {
          updateDiagramModel();
        } else {

          initializeDiagram(jsonData);
        }
        simulationStore.resetRefresh();
      } catch (error) {
        console.error('Error refreshing the diagram:', error);
      }
    }


    onMounted(async () => {
      await nextTick();

      refreshDiagram();
    });

    return { myDiagramDiv, 
      refreshDiagram,  
      tooltipData,
      showTooltip,
      tooltipX,
      tooltipY,
      activeStates};
  },
});
</script>

<style scoped>
.diagram {
  width: 100%;
  height: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>