<template>
    <div ref="diagramContainer" class="diagram-container">
      <!-- Nodes will be rendered here -->
      <div v-for="component in components" :key="component.name" :id="component.name" class="diagram-node" :style="getNodeStyle(component)">
        {{ component.label }}
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref, Ref } from 'vue';
  import { jsPlumb } from 'jsplumb';
  import jsonData from '@/assets/system_petit.json'; 
  
  interface Component {
    name: string;
    label: string;
    color: string;
    top?: number;
    left?: number;
  }
  
  export default defineComponent({
    name: 'DiagramComponent',
    setup() {
      const diagramContainer: Ref<HTMLElement | null> = ref(null);
      const components: Ref<Component[]> = ref(jsonData.components);
      const flows = ref(jsonData.flows);
      const jsPlumbInstance = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        PaintStyle: {
          stroke: '#666',
          strokeWidth: 3,
          outlineStroke: 'transparent',
          outlineWidth: 2
        },
        HoverPaintStyle: { stroke: '#449999', strokeWidth: 3 },
        EndpointHoverStyle: { fill: '#449999' },
        EndpointStyle: { width: 20, height: 16, stroke: '#666' },
        Endpoint: 'Dot',
        Anchors: ['Bottom', 'Top'],
        Container: 'diagramContainer'
      });
  
      const layoutComponents = (components: Component[]) => {
        let x = 10; // Start position x
        let y = 10; // Start position y
        const stepX = 200; // Step over x
        const stepY = 100; // Step over y
        const perRow = 5; // Components per row
        let count = 0;
  
        components.forEach((component, index) => {
          component.left = x;
          component.top = y;
          count++;
  
          if (count >= perRow) {
            y += stepY;
            x = 10;
            count = 0;
          } else {
            x += stepX;
          }
        });
      };
  
      const getNodeStyle = (component: Component) => {
        return {
          top: `${component.top}px`,
          left: `${component.left}px`,
          backgroundColor: component.color,
        };
      };
  
      onMounted(() => {
        layoutComponents(components.value);
        if (diagramContainer.value) {
          jsPlumbInstance.setContainer(diagramContainer.value);
  
          components.value.forEach(component => {
            jsPlumbInstance.draggable(component.name);
          });
  
          flows.value.forEach(flow => {
            jsPlumbInstance.connect({
              source: flow.source,
              target: flow.target,
              anchors: ["Bottom", "Top"],
              connector: ["Bezier", { curviness: 50 }],
              paintStyle: { stroke: flow.color, strokeWidth: 2 },
              endpoint: ["Dot", { radius: 5 }],
              overlays: [
                ["Arrow", { width: 12, length: 12, location: 1 }]
              ],
            });
          });
        }
      });
  
      return { components, diagramContainer, getNodeStyle };
    }
  });
  </script>
  
  <style scoped>
  .diagram-container {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #f0f0f0;
    overflow: auto;
  }
  
  .diagram-node {
    position: absolute;
    min-width: 120px;
    min-height: 60px;
    padding: 10px;
    border: 2px solid #666;
    background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent nodes */
    color: #333;
    cursor: pointer;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
    border-radius: 5px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
  }
  
  .diagram-node:hover {
    box-shadow: 0px 8px 16px rgba(0,0,0,0.3);
    transform: translateY(-2px);
  }
  
  /* Enhanced styles for connections */
  .jsplumb-connector, .jsplumb-connection {
    transition: opacity 0.5s ease-in-out;
    opacity: 0.7; /* Semi-transparent connections */
  }
  
  .jsplumb-connector:hover, .jsplumb-connection:hover {
    opacity: 1; /* Full opacity on hover for better visibility */
  }
  
  /* Style for endpoint dots */
  .jsplumb-endpoint {
    transition: background-color 0.5s ease-in-out;
  }
  
  .jsplumb-endpoint:hover {
    background-color: #5c96bc;
  }
  </style>
  