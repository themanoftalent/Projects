<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated >
      <q-toolbar >
        <q-toolbar-title style="color: white;">
          Youtube Video Downloader
        </q-toolbar-title>
        <div></div>
      </q-toolbar>
    </q-header >
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({  
  name: 'MainLayout',

  setup() {
    return {};
  }
});
</script>
