<template>
  <div class="app-layout">
    <TopMenu />

    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <NavigationMenu />

          <main class="main-area col-md-9 col-lg-10">
            <div class="content-wrapper py-4">
              <slot />
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopMenu from '~/components/layouts/TopMenu.vue'
import NavigationMenu from '~/components/layouts/NavigationMenu.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.main-content {
  margin-top: 70px;
}

.main-area {
  background-color: #f8f9fa;
  min-height: calc(100vh - 70px);
}

.content-wrapper {
  padding: 0 2rem;
}
</style>