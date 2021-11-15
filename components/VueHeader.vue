<template>
  <header class="flex-shrink-0 py-[30px]">
    <div class="container-1440 flex flex-row items-center justify-between">
      <div class="lg:w-[350px]">
        <nuxt-link to="/">
          <img
            src="~/assets/img/logo.svg"
            class="w-[63px] h-[38px]"
            alt="OG Swap"
            width="63"
            height="38"
          />
        </nuxt-link>
      </div>

      <div class="lg:flex-grow flex justify-center mr-auto lg:mr-0">
        <component-link
          v-for="(item, key) in navigation"
          :key="key"
          :route="item.route"
          :href="item.href"
          class="
            px-[14px]
            mx-[11px]
            font-poppins
            text-[13px]
            font-light
            whitespace-nowrap
            no-underline
            hover:underline
            relative
          "
        >
          {{ item.label }}
          <div
            v-if="item.label === 'Logs'"
            class="absolute bg-candy-apple-red rounded-lg px-2 bottom-5"
          >
            Soon
          </div>
        </component-link>
      </div>

      <div class="flex lg:w-[350px] justify-end">
        <wallet
          :img="require('~/assets/img/icons/metamask.svg')"
          :val="metamask"
          :wallet="1"
        />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import ConnectWallet from './Modals/ConnectWallet.vue'
import { WalletProvider } from './utils'

export default Vue.extend({
  components: { ConnectWallet },
  data: () => ({
    connected1: false,
    connected2: true,
    signed1: false,
    signed2: false,
  }),
  computed: {
    open() {
      return this.$store.getters['app/menu'].open
    },
    navigation() {
      return this.$store.getters['app/menu'].navigation
    },
    metamask() {
      return WalletProvider.Metamask
    },
    phantom() {
      return WalletProvider.Phantom
    },
  },
  methods: {
    toggleMenu() {
      this.$store.commit('app/TOGGLE_MENU')
    },
  },
})
</script>
