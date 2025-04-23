<template>
    <v-container>
      <v-slide-group
        show-arrows
        class="pa-4"
      >
        <v-slide-item
          v-for="(item, index) in items"
          :key="index"
        >
          <v-card
            class="mx-2"
            width="200"
          >
            <v-img
              :src="item.image"
              height="150"
            ></v-img>
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
            <v-card-actions>
              <v-btn text>Voir plus</v-btn>
            </v-card-actions>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        items: [
          { image: 'image1.jpg', title: 'Titre 1', subtitle: 'Sous-titre 1' },
          { image: 'image2.jpg', title: 'Titre 2', subtitle: 'Sous-titre 2' },
          // Ajoutez autant d'éléments que nécessaire
        ],
      };
    },
  };
  </script>
  