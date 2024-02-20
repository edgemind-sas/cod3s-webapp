<template>
  <div class="filter-container">
    <!-- Conteneur pour le diagramme GoJS -->
    <div ref="myDiagramDiv" class="diagram"></div>
    <!-- Tooltip personnalisé pour afficher les informations sur les éléments du diagramme -->
    <v-tooltip v-model="showTooltip" :position-x="tooltipX" :position-y="tooltipY">
      <template v-slot:activator="{ props }">
        <!-- Slot activateur pour le tooltip, utilisé pour contrôler son affichage -->
      </template>
      <v-card v-if="tooltipData">
        <!-- Contenu du tooltip, affiche le nom et les variables de l'élément survolé -->
        <v-card-title>{{ tooltipData.name }}</v-card-title>
        <v-card-text>
          <div v-for="variable in tooltipData.variables" :key="variable.id" class="my-2">
            <!-- Affiche chaque variable de l'élément sous forme de chip -->
            <v-chip color="blue" small>{{ variable.name }}</v-chip>
            <span>: {{ variable.value_current }}</span>
          </div>
          <div v-for="state in activeStates" :key="state.id" class="my-2">
            <!-- Affiche l'état actif de l'élément, s'il y en a -->
            <v-chip v-if="state.is_active" color="orange" small>{{ state.aut_name }}</v-chip>
            <span v-if="state.is_active">: {{ state.name }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-tooltip>
  </div>
</template>



<script lang="ts">
// Importations nécessaires depuis Vue, GoJS et autres services
import { defineComponent, ref, onMounted, toRefs, watch, computed, nextTick } from 'vue';
import * as go from 'gojs';
import modelService from "@/service/modelService"
import { useSimulationStore } from '@/store/simulationStore';
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  props: {
    path: String  // Prop pour le chemin, utilisée pour configurer le composant
  },
  setup(props) {
    // Déclarations réactives et références
    const { path } = toRefs(props); // Référence réactive au prop `path`
    const myDiagramDiv = ref(null); // Référence au conteneur du diagramme
    const simulationStore = useSimulationStore(); // Store VueX pour la simulation
    const tooltipData = ref({}); // Données pour le tooltip
    const showTooltip = ref(false); // Contrôle l'affichage du tooltip
    const tooltipX = ref(0); // Position X pour le tooltip
    const tooltipY = ref(0); // Position Y pour le tooltip
    const route = useRoute(); // Route actuelle pour la navigation


    // Calcul pour filtrer les états actifs à afficher dans le tooltip
    const activeStates = computed(() => {
      return tooltipData.value?.states?.filter(state => state.is_active) || [];
    });

    
    // Vérifie si la route actuelle est celle de la modélisation
    const isModelisationRoute = computed(() => route.path === '');

    let myDiagram: go.Diagram; // Déclaration de la variable pour le diagramme GoJS


    // Fonction pour convertir une position de port en un spot GoJS
    function convertPortPositionToSpot(position: string): go.Spot {
      switch (position) {
        case 'left': return go.Spot.Left;
        case 'right': return go.Spot.Right;
        case 'top': return go.Spot.Top;
        case 'bottom': return go.Spot.Bottom;
        default: return go.Spot.Top; // Valeur par défaut si aucune correspondance
      }
    }

    // Fonction pour créer un port dans le diagramme
    function makePort(portId: string, spot: go.Spot = go.Spot.Top, output: boolean = true, input: boolean = false, color: string = "#ef7b26"): go.GraphObject {
      const $ = go.GraphObject.make; // Raccourci pour créer des objets GoJS
      
      return $(go.Shape, "Rectangle", { // Crée un rectangle comme représentation du port
        portId: portId, // Identifiant unique pour le port
        fromSpot: output ? spot : go.Spot.None, // Définit où les liens peuvent sortir
        toSpot: input ? spot : go.Spot.None, // Définit où les liens peuvent entrer
        fromLinkable: output, // Autorise ou non la création de liens à partir de ce port
        toLinkable: input, // Autorise ou non la création de liens vers ce port
        cursor: "pointer", // Change le curseur lors du survol
        fill: color, // Couleur du port
        desiredSize: new go.Size(8, 8) // Taille souhaitée pour le port
      });
    }


    // Initialisation du diagramme avec des données JSON
    function initializeDiagram(jsonData: any) {
      const $ = go.GraphObject.make; // Raccourci pour créer des objets GoJS
      myDiagram = $(go.Diagram, myDiagramDiv.value, { // Initialisation du diagramme
        "undoManager.isEnabled": true, // Active le gestionnaire d'annulation
        "animationManager.isEnabled": false, // Désactive les animations
        layout: $(go.ForceDirectedLayout, { // Utilise un layout dirigé par des forces
          defaultSpringLength: 50,
          defaultElectricalCharge: 100
        }),
      });

      myDiagram.layout = $(go.ForceDirectedLayout, { // Configuration supplémentaire du layout pour la simulation du graphe 
        isInitial: false,  
        isOngoing: false, 
      });

      // Template pour les noeuds du diagramme
      myDiagram.nodeTemplate = $(
        go.Node, "Table", { // Utilise une table pour la disposition des composants du noe
          mouseEnter: async (e, node) => {
            // Gestionnaire d'événements pour l'entrée de la souris sur un noeud
            if (isModelisationRoute.value) return; // Ignore si sur la route de modélisation
            const data = node.part.data; // Récupère les données du noeud
            const nodeLocation = node.location; // Emplacement du noeud
            const mousePt = myDiagram.lastInput.viewPoint; // Position de la souris
            tooltipX.value = mousePt.x; // Mise à jour de la position X pour le tooltip
            tooltipY.value = mousePt.y; // Mise à jour de la position Y pour le tooltip

            try {
              const details = await modelService.getComponentDetails(data.key); // Récupère les détails du composant
              tooltipData.value = details; // Met à jour les données du tooltip
              showTooltip.value = true; // Affiche le tooltip
            } catch (error) {
              console.error('Error fetching component details:', error); // Gestion des erreurs
              showTooltip.value = false; // Masque le tooltip en cas d'erreur
            }
          },
          mouseLeave: (e, obj) => {
            showTooltip.value = false; // Masque le tooltip lorsque la souris quitte le noeud
          },
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), // Liaison bidirectionnelle pour l'emplacement du noeud

        // La fonction pour les panneaux des ports

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
          

      // Template pour les liens du diagramme
      myDiagram.linkTemplate = $(
        go.Link, // Définition d'un lien
        { // Configuration du lien
          routing: go.Link.AvoidsNodes, // Évite les noeuds
          corner: 5, // Arrondit les coins
          curve: go.Link.JumpGap, // Saute les écarts
          fromEndSegmentLength: 20, // Longueur du segment de départ
          toEndSegmentLength: 20, // Longueur du segment d'arrivée
          reshapable: true, // Peut être redimensionné
          toShortLength: 4, // Longueur de raccourcissement vers le noeud de destination
          relinkableFrom: false, // Non relinkable depuis le départ
          resegmentable: true, // Peut être resegmenté
          relinkableTo: false, // Non relinkable vers l'arrivée
        },
        $(go.Shape, // Forme du lien
          { strokeWidth: 2 }, // Épaisseur du trait
          new go.Binding("stroke", "stroke_color"), // Liaison pour la couleur du trait
          new go.Binding("strokeWidth", "stroke_width") // Liaison pour l'épaisseur du trait
        ),

        $(go.Shape, // Forme de la flèche
          { toArrow: "Standard" }, // Type de flèche
          new go.Binding("toArrow", "to_arrow"), // Liaison pour le type de flèche
          new go.Binding("fill", "stroke_color") // Liaison pour la couleur de remplissage de la flèche
        )
      );

    // Ajoute un écouteur d'événements sur 'myDiagram' pour réagir à l'événement 'SelectionMoved'.
      myDiagram.addDiagramListener("SelectionMoved", function(e) {
          // Initialise un objet pour stocker les nouvelles positions des composants déplacés.
          const positions: any = { components: [] };

          // Parcourt chaque élément de la sélection actuelle dans le diagramme.
          e.diagram.selection.each(function(part) {
              // Vérifie si l'élément est un noeud (go.Node).
              if (part instanceof go.Node) { 
                  // Obtient la position actuelle du noeud.
                  const loc = part.location;
                  // Affiche dans la console la nouvelle position du noeud.
                  console.log(`Le composant ${part.data.key} a été déplacé à la position: ${loc.x.toFixed(2)}, ${loc.y.toFixed(2)}`);

                  // Ajoute les informations du noeud déplacé à l'objet 'positions'.
                  positions.components.push({
                      comp_name: part.data.key, // Clé unique du composant
                      x: loc.x.toFixed(2), // Position X, arrondie à deux décimales
                      y: loc.y.toFixed(2), // Position Y, arrondie à deux décimales
                  });
              }
          });

          // Envoie les positions mises à jour à l'API via le service 'modelService'.
          modelService.updatePositions(positions)
              .then(response => {
                  // Affiche le message de réponse de l'API dans la console.
                  console.log(response.message);
              })
              .catch(error => {
                  // En cas d'erreur lors de l'appel à l'API, affiche le message d'erreur dans la console.
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

    //fonction pour les updates de diagram

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




//fonction pour construire le diagram
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
      await nextTick(); // Attend le prochain tick du cycle de vie de Vue

      refreshDiagram(); // Rafraîchit le diagramme à l'initialisation du composant
    });


    return {  // Retourne les propriétés et méthodes exposées par le composant
      myDiagramDiv, 
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
  width: 100%; /* Largeur du conteneur du diagramme */
  height: 600px; /* Hauteur du conteneur du diagramme */
  background-color: white; /* Couleur de fond du conteneur */
  border-radius: 8px; /* Arrondi des coins du conteneur */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre portée pour le conteneur */
}
</style>
