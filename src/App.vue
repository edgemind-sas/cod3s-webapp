<template>
 <v-app>
  <v-navigation-drawer
        image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        permanent
        theme="dark"
      >
        <v-list nav>
          <v-list-item  title="MODELISATION" value="inbox" to="/modelisation"></v-list-item>
          <v-list-item  title="SIMULATION" value="supervisors" to="/simulation"></v-list-item>
          <v-list-item  title="Resultats" value="clockin" to="/resultats"></v-list-item>
        </v-list>
      </v-navigation-drawer>
  <v-main>
    <RouterView />
  </v-main>
</v-app>
</template>


