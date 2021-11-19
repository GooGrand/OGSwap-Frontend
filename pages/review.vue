<template>
  <div class="flex-grow flex flex-col justify-center">
    <angle-card
      class="w-full max-w-[645px] mx-auto pt-[20px] pb-[24px] px-[40px]"
    >
      <div class="-mb-7 pt-2">
        <nuxt-link to="/home" class="underline hover:no-underline text-xs"
          ><icon
            name="mono/arrow-back"
            class="fill-current w-[19px] h-[8px] mr-[4px] relative top-[-1px]"
          />Back</nuxt-link
        >
      </div>

      <div class="font-red-rose text-center text-[22px] mb-[19px]">
        Review details and approve swap
      </div>

      <div class="rounded-[4px] bg-[#1C1C1C] pt-[22px] px-[28px] pb-[28px]">
        <div class="mb-[10px] flex justify-center">
          <div class="w-[140px] flex justify-end items-center">
            <img
              class="max-w-full h-auto max-h-[27px]"
              :src="fromLogoUrl"
              alt=""
            />
          </div>
          <div class="w-[70px] flex justify-center items-center">
            <div
              class="
                text-black
                bg-ghost-white
                rounded-full
                w-[33px]
                h-[33px]
                flex
                justify-center
                items-center
              "
            >
              <icon
                name="mono/arrow-back"
                class="
                  fill-current
                  w-[15px]
                  h-[15px]
                  rotate-180
                  mr-[4px]
                  relative
                  left-[1px]
                "
              />
            </div>
          </div>
          <div class="w-[140px] flex justify-start items-center">
            <img
              class="max-w-full h-auto max-h-[27px]"
              :src="toLogoUrl"
              alt=""
            />
          </div>
        </div>

        <div class="mb-[16px]">
          <field-label>Send</field-label>
          <div class="relative">
            <coin-item
              class="absolute left-[12px] top-1/2 -translate-y-1/2"
              :label="fromToken.title"
              :img="fromToken.img"
            />
            <field-input
              readonly
              :value="Number(preview.amountFrom).toFixed(4)"
              class="text-right rounded-[10px] text-[18px]"
            />
          </div>
        </div>

        <div class="mb-[16px]">
          <field-label class="mb-[5px]">From address</field-label>
          {{ preview.fromAddress }}
        </div>

        <div class="mb-[16px]">
          <field-label>Receive</field-label>
          <div class="relative">
            <coin-item
              class="absolute left-[12px] top-1/2 -translate-y-1/2"
              :label="toToken.title"
              :img="toToken.img"
            />
            <field-input
              readonly
              :value="Number(preview.amountTo).toFixed(4)"
              class="text-right rounded-[10px] text-[18px]"
            />
            <!-- <field-input readonly value="10.0000 | $10,00.3469" class="text-right rounded-[10px] text-[18px]" /> -->
          </div>
        </div>

        <div class="mb-[16px]">
          <field-label class="mb-[5px]">To address</field-label>
          {{ preview.toAddress }}
        </div>
      </div>

      <div class="mt-4 text-[11px]">
        <div class="flex justify-between">
          <div class="">Estemated transaction time:</div>
          <div class="">~ 5 minutes</div>
        </div>
        <div class="flex justify-between mt-[8px]">
          <div class="">Estemated transaction fee:</div>
          <div class="">the standard fee of the outbound network</div>
        </div>
      </div>

      <btn class="mt-4" block :disabled="processing" @click="makeSwap">
        Swap
      </btn>
    </angle-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Transaction } from '~/utils/transactions'
import { Chains, chainToName, RelayToken, tokens } from '~/components/constants'
import { RelaySwapData } from '~/web3/metamask'
const logos: { [key in Chains]: string } = {
  [Chains.Ftm]: require('~/assets/img/logotypes/fantom.svg'),
  [Chains.Bsc]: require('~/assets/img/logotypes/binance.svg'),
  [Chains.Eth]: require('~/assets/img/logotypes/ethereum.svg'),
  [Chains.Pol]: require('~/assets/img/logotypes/matic.svg'),
  [Chains.Xdai]: require('~/assets/img/logotypes/xdai.svg'),
  [Chains.Heco]: require('~/assets/img/logotypes/huobi.svg'),
  [Chains.Avax]: require('~/assets/img/logotypes/huobi.svg'),
  // [Chains.Sol]: require('~/assets/img/logotypes/solana.svg'),
  [Chains.Okex]: require('~/assets/img/logotypes/okex.svg'),
}

export default Vue.extend({
  data: () => ({
    address: '',
    amount: '0',
    connected: false,
    processing: false,
  }),
  computed: {
    isError(): boolean {
      return Number(this.amount || 0) > 1000 || Number(this.amount || 0) < 0
    },
    fromToken(): RelayToken {
      return tokens[this.preview.chainFrom]
    },
    toToken(): RelayToken {
      return tokens[this.preview.chainTo]
    },
    preview(): Transaction {
      return this.$store.getters['transactions/getPreview']
    },
    fromLogoUrl(): string {
      return logos[this.preview.chainFrom]
    },
    toLogoUrl(): string {
      return logos[this.preview.chainTo]
    },
  },
  methods: {
    async makeSwap() {
      this.processing = true
      const txnId = await this.$web3
        .makeSwap(this.fromToken.type, {
          destination: this.toToken.chain,
          userAddress: this.preview.fromAddress,
          addressTo: this.preview.toAddress,
          value: this.preview.amountFrom,
          chainId: this.preview.chainFrom,
        } as RelaySwapData)
        .call(this)
    },
  },
})
</script>
