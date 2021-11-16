<template>
  <div class="message-windows">
    <message-window
      v-for="(item, index) in messages"
      :key="index"
      :txnindex="index"
      :txn="item"
      :collapsed="index !== indexOpen"
      @collapse="handleCollapse(index)"
      :completed="item.firstTxnHash && secondTxnHash"
      @close="deleteTxn(index)"
    >
      <div class="mb-[18px] flex justify-center pt-[5px]">
        <div class="w-[140px] flex justify-end items-center">
          <img class="max-w-full h-auto max-h-[20px]" :src="logos[item.chainFrom]" alt="">
        </div>
        <div class="w-[70px] flex justify-center items-center">
          <div class="text-black bg-ghost-white rounded-full w-[18px] h-[18px] flex justify-center items-center">
            <icon name="mono/arrow-back" class="fill-current w-[10px] h-[10px] rotate-180 mr-[4px] relative left-[1px]" />
          </div>
        </div>
        <div class="w-[140px] flex justify-start items-center">
          <img class="max-w-full h-auto max-h-[20px]" :src="logos[item.chainTo]" alt="">
        </div>
      </div>

      <div class="bg-dark-charcoal rounded-[10px] mb-[13px] flex py-[9px]">
        <div class="flex flex-col justify-center items-end flex-grow">

          <div class="flex flex-col justify-center items-center">
            <coin-item :label="tokens[item.chainFrom].title" :img="tokens[item.chainFrom].img" size="small" />
            <div class="text-sm whitespace-nowrap">
              {{item.amountFrom}}
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-center items-center w-[57px]">
          <icon name="mono/arrow-wide-3" class="fill-current w-[29px] h-[8px]" />
        </div>
        <div class="flex flex-col justify-center items-start flex-grow">

          <div class="flex flex-col justify-center items-center">
            <coin-item :label="tokens[item.chainTo].title" :img="tokens[item.chainTo].img" size="small" />
            <div class="text-sm whitespace-nowrap">
              ~{{item.amountTo}}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-dark-charcoal rounded-[10px] text-center text-[10px] min-h-[24px] mb-[10px] flex flex-col justify-center px-[42px] py-[4px] relative">
        <icon :name="item.firstTxnHash ? 'mono/check-2' : 'mono/clock'" class="absolute top-[3px] left-[18px] fill-current stroke-current text-[20px]" :class="{'text-medium-spring-green': item.firstTxnHash}" />

        Deposit transaction is {{ item.firstTxnHash ? "completed" : "processing"}}

        <a v-if="item.firstTxnHash" :href="explorers[item.chainFrom] + item.firstTxnHash" target="_blank" class="absolute top-[1px] p-1 right-[10px] text-xs text-white hover:text-candy-apple-red">
          <icon name="mono/link" class="fill-current" />
        </a>
      </div>

      <div class="bg-dark-charcoal rounded-[10px] text-center text-[10px] min-h-[24px] flex flex-col justify-center px-[42px] py-[4px] relative">
        <icon :name="item.secondTxnHash ? 'mono/check-2' : 'mono/clock'" class="absolute top-[3px] left-[19px]  fill-current stroke-current text-[18px]" />

        Swap transaction is {{ item.secondTxnHash ? "complete" : "pending"}}
        <a v-if="item.secondTxnHash" :href="explorers[item.chainTo] + item.firstTxnHash" target="_blank" class="absolute top-[1px] p-1 right-[10px] text-xs text-white hover:text-candy-apple-red">
          <icon name="mono/link" class="fill-current" />
        </a>
      </div>

    </message-window>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Transaction } from "~/utils/transactions"
import {logos, tokens, explorers} from "~/components/constants"

export default Vue.extend({
  data: () => ({
    indexOpen: 0 as number | null,
    logos,
    tokens,
    explorers
  }),
  computed: {
    messages(): Transaction[] {
      return this.$store.getters['transactions/getTransactionHistory']
    },
  },
  methods: {
    handleCollapse(i: number) {
      this.indexOpen = i === this.indexOpen ? null : i;
    },
    deleteTxn(txnIndex: number) {
      this.$store.commit('transactions/delete', {txnIndex})
    }
  },

})
</script>

<style lang="postcss">
.message-windows {
  @apply fixed right-0 pr-[20px] top-[90px] bottom-[90px] z-20 overflow-y-auto overflow-x-hidden;
}

@media (hover: hover) {
  .message-windows::-webkit-scrollbar-track {
    border-radius: 0;

    @apply bg-dark-charcoal bg-opacity-0;
  }

  .message-windows::-webkit-scrollbar-thumb {
    border-radius: 0;

    @apply bg-dark-charcoal bg-opacity-0;
  }

  .message-windows::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
