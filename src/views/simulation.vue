<template>
    <div>
         <component_gojs> </component_gojs>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
 
  import component_gojs from '@/components/component_gojs.vue';
  
  
  export default defineComponent({
    components: { component_gojs },
  
    setup() {
      
    
  
      onMounted(async () => {
       
      });
  
      return ;
    },
  });
  </script>
  