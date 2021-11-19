<template>
  <div class="min-h-screen font-sans bg-black relative z-10 flex flex-col text-white">
    <div class="hidden md:block w-full h-full fixed inset-0 z-[-1]">
      <img class="w-full h-full object-center object-cover" src="~/assets/img/layout-bg.jpg" alt="">
    </div>
    <vue-header class="hidden md:block" />
    <mobile-menu />

    <main class="flex-grow hidden md:flex flex-col relative z-[1]">
      <nuxt />
    </main>

    <mobile-stub />

    <vue-footer />
    <message-windows class="md:block" />
    <modals-connect-wallet />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
})
</script>
