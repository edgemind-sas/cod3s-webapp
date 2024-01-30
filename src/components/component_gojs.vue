<template>
  <div class="filter-container">
    <div ref="myDiagramDiv" class="diagram"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, toRefs, watch } from 'vue';
import * as go from 'gojs';
import modelService from "@/service/modelService"
import { useSimulationStore } from '@/store/simulationStore';


export default defineComponent({
  props: {
    path: String
  },
  setup(props) {
    const { path } = toRefs(props);
    const myDiagramDiv = ref(null);
    const simulationStore = useSimulationStore();
   
    
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

function makePort(portId: string, spot: go.Spot = go.Spot.Top, output: boolean = true, input: boolean = true, color: string = "#ef7b26"): go.GraphObject {
  const $ = go.GraphObject.make;
  return $(go.Shape, "Rectangle", {
    portId: portId,
    fromSpot: spot, toSpot: spot,
    fromLinkable: output, toLinkable: input,
    cursor: "pointer",
    fill: color,
    desiredSize: new go.Size(8, 8)
  });
}


    function initializeDiagram(jsonData: any) {
      const $ = go.GraphObject.make;
      if (myDiagram) {
        updateDiagramModel(jsonData);
        return;
      }


      
      myDiagram = $(go.Diagram, myDiagramDiv.value, {
        "undoManager.isEnabled": true, 
        layout: $(go.ForceDirectedLayout,  
    {
      defaultSpringLength: 50, 
      defaultElectricalCharge: 100 
    }
  ),
      });

myDiagram.nodeTemplate = $(
  go.Node, "Table",
  new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

  $(go.Panel, "Auto",
    { row: 1, column: 1, name: "BODY", stretch: go.GraphObject.Fill },
    $(go.Shape, "Rectangle",
      new go.Binding("fill", "color"),
      { stroke: null, strokeWidth: 0, minSize: new go.Size(60, 60) }
    ),
    $(go.TextBlock,
      { margin: 10, textAlign: "center", font: "bold 14px Segoe UI,sans-serif", stroke: "#484848", editable: true },
      new go.Binding("text", "name").makeTwoWay()
    )
  ),
 
  $(go.Panel, "Horizontal", { row: 1, column: 0 },
    new go.Binding("itemArray", "leftArray"),
    {
      itemTemplate: $(go.Panel,
        { _side: "left" },
        new go.Binding("portId", "portId"),
        makePort("", go.Spot.Left, true, true, "#ef7b26") 
      )
    }
  ),
  
  $(go.Panel, "Horizontal", { row: 0, column: 1 },
    new go.Binding("itemArray", "topArray"),
    {
      itemTemplate: $(go.Panel,
        { _side: "top" },
        new go.Binding("portId", "portId"),
        makePort("", go.Spot.Top, true, true, "#ef7b26") 
      )
    }
  ),
  
  $(go.Panel, "Horizontal", { row: 1, column: 2 },
    new go.Binding("itemArray", "rightArray"),
    {
      itemTemplate: $(go.Panel,
        { _side: "right" },
        new go.Binding("portId", "portId"),
        makePort("", go.Spot.Right, true, true, "#ef7b26") 
      )
    }
  ),

  $(go.Panel, "Horizontal", { row: 2, column: 1 },
    new go.Binding("itemArray", "bottomArray"),
    {
      itemTemplate: $(go.Panel,
        { _side: "bottom" },
        new go.Binding("portId", "portId"),
        makePort("", go.Spot.Bottom, true, true, "#ef7b26") 
      )
    }
  )
);

myDiagram.linkTemplate = $(
  go.Link,
  { routing: go.Link.Orthogonal, corner: 5 },
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



      assignModel(jsonData);
    }

    function updateDiagramModel(jsonData: any) {
     
      assignModel(jsonData);
    }

   
function assignModel(jsonData: any) {
  const componentData = jsonData.components.map((c: any) => {
    
    const portsArray = c.ports.map((port: any) => {
      const portColor = port.color || "#ef7b26"; 
      const portSpot = convertPortPositionToSpot(port.spot); 
      const portPanel = makePort(port.name, portSpot, true, true, portColor);
      return { portId: port.name, panel: portPanel };
    });

    return {
      key: c.name,
      color: c.style.color || "#FFFFFF", 
      loc: go.Point.stringify(new go.Point(0, 0)),
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
      stroke_width: link.style.stroke_width || 2,         
      to_arrow: link.style.to_arrow || "Standard"         
    };

  

    return processedLink;
  });

  myDiagram.model = new go.GraphLinksModel(componentData, linkDataArray);
}



    watch(() => simulationStore.needDiagramRefresh, (newVal) => {
      
      if (newVal) {
        refreshDiagram();
      }
    });

    async function refreshDiagram() {
      try {
        const jsonData = await modelService.loadJsonData();
        if (myDiagram) {
          updateDiagramModel(jsonData);
        } else {
          
          initializeDiagram(jsonData);
        }
        simulationStore.resetRefresh(); 
      } catch (error) {
        console.error('Error refreshing the diagram:', error);
      }
    }


    onMounted(async () => {
    
    refreshDiagram();
    });

    return { myDiagramDiv, refreshDiagram };
  },
});
</script>

<style scoped>
.diagram {
  width: 100%;
  height: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
