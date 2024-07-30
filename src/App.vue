<script setup lang="ts">
import GhostElement from "./components/GhostElement.vue";
import Inventory from './components/Inventory.vue'
import SmallGhost from "./components/SmallGhost.vue";
import { useTheme } from './store/useTheme';
import './style/main.scss';

const { toggleTheme } = useTheme();
</script>

<template>
  <div id="app"  @toggle-theme="toggleTheme">
    <div class="layout">
      <div class="sidebar">
        <GhostElement/>
      </div>
      <div class="main-content">
        <Inventory/>
      </div>
    </div>
    <SmallGhost/>
  </div>
</template>

<style scoped>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.layout {
  display: flex;

  .sidebar {
    width: 236px;
    margin-right: 20px;
  }

  .main-content {
    flex: 1;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }
}
</style>