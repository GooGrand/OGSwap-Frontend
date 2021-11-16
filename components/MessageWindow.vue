<template>
  <div class="message-window">
    <div class="h-[40px] flex items-center px-[20px]">
      <div class="w-[40px] flex items-center justify-start">
        <icon
          v-show="completed"
          name="mono/check-2"
          class="
            fill-current
            stroke-current
            text-[20px] text-medium-spring-green
          "
        />
        <icon
          v-show="!completed"
          name="mono/clock"
          class="fill-current stroke-current text-[18px] relative left-[1px]"
        />
      </div>
      <div
        class="flex-grow text-[13px] font-medium text-center"
        :class="{ 'text-medium-spring-green': completed }"
      >
        {{ statusText }}
      </div>
      <div class="w-[40px] flex items-center justify-end">
        <button
          v-show="!collapsed"
          type="button"
          class="
            flex
            items-center
            justify-center
            bg-transparent
            border-none
            outline-none
            text-white
            hover:text-candy-apple-red
          "
          @click="$emit('collapse')"
        >
          <icon name="mono/line" class="stroke-current text-[15px]" />
        </button>
        <button
          v-show="collapsed"
          type="button"
          class="
            flex
            items-center
            justify-center
            bg-transparent
            border-none
            outline-none
            text-white
            hover:text-candy-apple-red
          "
          @click="$emit('collapse')"
        >
          <icon name="mono/spread" class="fill-current text-[15px]" />
        </button>
        <button
          type="button"
          class="
            flex
            items-center
            justify-center
            bg-transparent
            border-none
            outline-none
            text-white
            ml-[10px]
            hover:text-candy-apple-red
          "
          @click="$emit('close')"
        >
          <icon name="mono/close" class="fill-current text-[15px]" />
        </button>
      </div>
    </div>
    <div
      class="transition-all overflow-hidden"
      :class="{
        'h-[190px]': !collapsed,
        'h-0': collapsed,
      }"
    >
      <div class="px-[20px]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Transaction, emptyPreview } from '~/utils/transactions'
import Vue, { PropType } from 'vue'
import { Chains, chainProviderUrls } from './constants'
import { relayAddresses } from '~/web3/constants'
import { Web3Invoker } from '~/web3/metamask'
import _ from 'lodash'

const invoker = new Web3Invoker()
const serviceUrl = ''
export default Vue.extend({
  data() {
    return {
      watcher: 0 as unknown as NodeJS.Timeout | null,
    }
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    txnindex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    statusText(): string {
      return this.completed
        ? 'Transaction is completed'
        : 'Transaction is processing'
    },
    nodeUrl(): string {
      return chainProviderUrls[this.txn.chainTo]
    },
    fromAddress(): string {
      return relayAddresses[this.txn.chainTo].toLowerCase()
    },
    txn(): Transaction {
      return this.$store.getters['transactions/getTransaction'](this.txnindex)
    }
  },
  methods: {
    async watchEvm() {
      const address = this.txn.toAddress
      const balance = await invoker.getChainBalance(this.nodeUrl, address)
      if (balance <= this.txn.lastBalance) {
        this.$store.commit('transactions/update', {
          txnindex: this.txnindex,
          body: { lastBalance: balance },
        })
        return
      }

      const { hash, block } = await invoker.checkForTransaction(
        this.txn.lastBlock,
        this.nodeUrl,
        address,
        this.fromAddress
      )
      if (_.isNil(hash)) {
        this.$store.commit('transactions/update', {
          txnindex: this.txnindex,
          body: { secondTxnHash: hash },
        })
        if (!_.isNil(this.watcher)) clearInterval(this.watcher)
      } else {
        this.$store.commit('transactions/update', {
          txnindex: this.txnindex,
          body: { lastBlock: block },
        })
      }
    },
    async watchSol() {
      if (!this.txn.gtonAmount) return
      const res = await fetch(serviceUrl + this.txn.gtonAmount)
      //...
    },
  },
  created() {
    if (this.txn.chainTo == Chains.Sol) {
      const fn = async () => {
        await this.watchSol()
      }
      this.watcher = setInterval(fn.bind(this), 4000)
    } else {
      const fn = async () => {
        await this.watchEvm()
      }
      this.watcher = setInterval(fn.bind(this), 4000)
    }
  },
  beforeDestroy() {
    if (!_.isNil(this.watcher)) clearInterval(this.watcher)
  },
})
</script>

<style lang="postcss">
.message-window {
  @apply mt-4 bg-black ring-inset ring-1 ring-white rounded-[10px] w-[330px];
}
</style>
