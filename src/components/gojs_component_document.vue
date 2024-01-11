<template>
  <v-container>
      <v-btn color="primary" @click="pickFile">Ajouter un document</v-btn>
      <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />

  
    <v-data-table
      :headers="headers"
      :items="documents"
      class="elevation-1"
      item-key="id"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.name }}</td>
          <td>
            <v-btn color="red" small @click="deleteItem(item)">Supprimer</v-btn>
            <v-btn color="blue" small @click="showItem(item)">Afficher</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>


<script>
import modelService from '@/service/modelService'; 
import config from '@/config/globals.ts'

export default {
data() {
  return {
    headers: [
      { text: 'Title', value: 'name' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    documents: [],
  };
},
created() {
  this.fetchDocuments();
},
methods: {
  async fetchDocuments() {
    try {
      const data = await modelService.fetchDocuments();
      this.documents = data; 
    } catch (error) {
      console.error('There was an error fetching the documents:', error);
    }
  },
  async deleteItem(item) {
    try {
      await modelService.deleteDocument(item.name);
      this.fetchDocuments();
    } catch (error) {
      console.error('There was an error deleting the document:', error);
    }
  },
  async showItem(item) {
    try {
      const filePath = await modelService.fetchDocumentPath(item.name);
      this.$router.push({ name: 'ComponentGojs', params: { path: filePath } });
    } catch (error) {
      console.error('There was an error fetching the file path:', error);
    }
  },
  pickFile() {
    this.$refs.fileInput.click();
  },
  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    this.addDocument(file);
  },
 



async addDocument(file) {
  try {
    const fileName = file.name;
    const filePath = `${config.pathDocument}/${fileName}`;
    
    const response = await modelService.addDocument(fileName, filePath);
    console.log('File added:', response);
    this.fetchDocuments();
  } catch (error) {
    console.error('There was an error posting the document:', error);
    
    if (error.response) {
      console.error('Server response:', error.response.data);
      console.error('Server response status:', error.response.status);
    }
  }
}



},
};
</script>