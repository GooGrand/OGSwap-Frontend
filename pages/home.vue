<template>
  <div class="flex-grow flex flex-col justify-center">
    <angle-card class="w-full max-w-[645px] mx-auto pt-[20px] pb-[24px] px-[40px]">
      <div class="font-red-rose text-center text-[22px] mb-[19px]">Swap</div>

      <div class="bg-[#1C1C1C] py-4 px-[28px] rounded-[4px]">
        <div class="-mx-[6px] flex mb-[14px]">
          <div class="px-[6px] w-[154px]">
            <field-label>Send</field-label>
            <field-dropdown size="large" block :error="isError">
              <template #default>
                <coin-item :label="currentTokenSend.title" :img="currentTokenSend.img" />
              </template>
              <template #list>
                <coin-item
                  v-for="(token, index) of tokens"
                  :key="token.pool_meta.token_pair_name"
                  :label="token.pool_meta.token_pair_name"
                  :img="token.token_meta.img"
                  :index="index"
                  :chain="token.chain"
                  :blocking="false"
                  :selected="receiveTokenIndex"
                  class="hover:font-bold"
                  @select="chooseCurrentChainSend"
                />
              </template>
            </field-dropdown>
          </div>
          <div class="px-[6px] flex-grow">
            <field-label class="text-right">
              <field-error-text v-show="isError" class="float-left">
                Insufficient balance
              </field-error-text>
              <span class="font-normal">Balance:</span>
              {{ balanceTokenFrom }} {{ currentChainTokenName }}
            </field-label>
            <div class="relative">
              <label class="block">
                <field-input
                  v-model="amount"
                  placeholder="0"
                  :error="isError"
                  size="large"
                  class="font-medium pb-[22px]"
                  type="number"
                  @input="inputChange"
                />
              </label>
              <div class="absolute left-[12px] top-[31px] text-xs">
                ${{ fromTokenPrice }}
              </div>
              <btn
                square
                variant="black"
                class="absolute right-[12px] top-[8px] font-red-rose underline hover:no-underline"
                @click="setMax()"
              >
                MAX
              </btn>
            </div>
          </div>
        </div>

        <div class="-mx-[6px] flex">
          <div class="px-[6px] flex-grow">
            <field-label>From address</field-label>
            <label class="relative block">
              <img
                class="w-[24px] h-[24px] left-[12px] top-[9px] absolute"
                src="~/assets/img/icons/metamask.svg"
                alt=""
              />
              <field-input
                v-model="addressFrom"
                readonly
                placeholder="Address"
                class="pl-[42px]"
              />
            </label>
          </div>
          <div v-if="!isMetamaskAvailable" class="px-[6px] w-[162px] flex items-end">
            <btn
              :variant="connected ? 'dark-charcoal' : 'blood'"
              block
              @click="connected ? false : handleConnectWallet()"
            >
              <span> Connect Metamask </span>
            </btn>
          </div>
          <div
            v-else-if="currentTokenSend.chain != currentChain"
            class="px-[6px] w-[162px] flex items-end"
          >
            <btn
              block
              :variant="connected ? 'dark-charcoal' : 'blood'"
              @click="switchChain()"
            >
              <span class="font-medium"> Switch to {{ chainIndexName }} </span>
            </btn>
          </div>
          <div v-else class="px-[6px] w-[162px] flex items-end">
            <btn
              block
              :readonly="connected"
              :variant="connected ? 'dark-charcoal' : 'blood'"
            >
              <icon
                name="mono/check"
                class="fill-current text-medium-spring-green ring-1 ring-inset ring-current text-[24px] rounded-full mr-[6px] relative top-[5px]"
              />
              Connected
            </btn>
          </div>
        </div>
      </div>

      <div class="h-[18px] w-full text-[18px] text-[#8D9EB5] text-center">
        <icon name="mono/arrow-wide-2" class="fill-current" />
      </div>

      <div class="bg-[#1C1C1C] py-4 px-[28px] rounded-[4px]">
        <div class="-mx-[6px] flex mb-[14px]">
          <div class="px-[6px] w-[154px]">
            <field-label>Receive</field-label>
            <field-dropdown size="large" block>
              <template #default>
                <coin-item
                  :label="currentTokenReceive.pool_meta.token_pair_name"
                  :img="currentTokenReceive.token_meta.img"
                  class="hover:font-bold"
                />
              </template>
              <template #list>
                <coin-item
                  v-for="(token, index) of tokens"
                  :key="token.pool_meta.token_pair_name"
                  :label="token.pool_meta.token_pair_name"
                  :img="token.token_meta.img"
                  :index="index"
                  :chain="token.chain"
                  :blocking="true"
                  class="hover:font-bold"
                  @select="chooseCurrentChainReceive"
                />
              </template>
            </field-dropdown>
          </div>
          <div class="px-[6px] flex-grow flex flex-col justify-end">
            <div class="relative">
              <label class="block">
                <field-input
                  v-model="amountReceive"
                  placeholder="0"
                  size="large"
                  class="font-medium pb-[22px]"
                  type="number"
                  readonly
                />
              </label>
              <div class="absolute left-[12px] top-[31px] text-xs">
                ~ ${{ toTokenPrice }}
              </div>
            </div>
          </div>
        </div>

        <div class="-mx-[6px] flex">
          <div class="px-[6px] flex-grow">
            <field-label>To address</field-label>
            <label class="relative block">
              <img
                class="w-[24px] h-[24px] left-[12px] top-[9px] absolute"
                src="~/assets/img/icons/metamask.svg"
                alt=""
              />
              <field-input
                v-model="addressTo"
                placeholder="Enter address"
                class="pl-[42px]"
              />
            </label>
          </div>
          <div class="px-[6px] w-[162px] flex items-end">
            <btn variant="blood" block @click="addressTo = addressFrom">
              Use the same address
            </btn>
          </div>
        </div>
      </div>

      <btn
        class="mt-4"
        block
        :disabled="isError || Number(amount || 0) === 0 || !isValidChain"
        @click="switchToPreview()"
      >
        Next
      </btn>
    </angle-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Web3Invoker } from "~/web3/metamask";
import { eventBus } from "~/global/main.js";
import { TokenAmount } from "~/utils/safe-math";
import { Chains } from "~/components/constants";
import { WalletBody } from "~/store/types";
import { WalletProvider } from "~/components/utils";
import { Transaction, token } from "~/utils/transactions";
import { availableChains } from "~/web3/evm_chain";
import { Token } from "~/plugins/api";
import { createEvmInstance } from "~/plugins/web3";
const invoker = new Web3Invoker();

function calculateTokenPairPrice(tokenData: Token, gtonPrice: number): string {
      // token reserve / gton reserve * gton price
    const tokenReserve = tokenData.token_a_address === tokenData.gton_address ? tokenData.reserve_b : tokenData.reserve_a
    const token = new TokenAmount(tokenReserve, tokenData.token_meta.decimals)

    const gtonReserve = tokenData.token_a_address === tokenData.gton_address ? tokenData.reserve_a : tokenData.reserve_b
    const gton = new TokenAmount(gtonReserve, 18)

    const res =  token.wei.dividedBy(gton.wei)
    return new TokenAmount(res, tokenData.token_meta.decimals).toEther().multipliedBy(gtonPrice).toFixed(2)
}

export default Vue.extend({
  data: () => ({
    eventBus,
    prices: {} as { [key: string]: number },
    amount: "0",
    addressTo: "",
    amountReceive: "0",
    connected: false,
    tokens: [token] as Token[],
    sendTokenIndex: 0,
    receiveTokenIndex: 0,
    isSelecting: false,
    balanceTokenFrom: new TokenAmount(0),
    balanceTokenTo: new TokenAmount(0),
    availableChains,
    gtonPrice: 0,
    currentChain: null as Chains | null,
  }),
  computed: {
    currentTokenSend(): Token {
      return this.tokens[this.sendTokenIndex];
    },
    currentTokenReceive(): Token {
      return this.tokens[this.receiveTokenIndex];
    },
    fromTokenPrice(): string {
      if (!Number(this.amount)) return "0";
      return calculateTokenPairPrice(this.currentTokenSend, this.gtonPrice)
    },
    toTokenPrice(): string {
      if (!Number(this.amountReceive))
        return "0";
      return calculateTokenPairPrice(this.currentTokenReceive, this.gtonPrice)
    },
    currentChainTokenName(): string {
      return this.currentTokenSend.pool_meta.token_pair_name;
    },
    chainIndexName(): string {
      return this.currentTokenSend.chain_meta.chain_name;
    },
    isError(): boolean {
      return (
        Number(this.amount || 0) > Number(this.balanceTokenFrom.fixed(4)) ||
        Number(this.amount || 0) < 0
      );
    },
    isValidChain(): boolean {
      return this.isMetamaskAvailable && (String(this.currentTokenSend.chain_meta.chain_id) as Chains) === this.currentChain;
    },
    currentWallet(): WalletBody {
      return this.$store.getters["wallet/walletByName"](WalletProvider.Metamask);
    },
    phantomWallet(): WalletBody {
      return this.$store.getters["wallet/walletByName"](WalletProvider.Phantom);
    },
    addressFrom(): string | null {
      if (!this.currentWallet) return null;
      return this.currentWallet.address;
    },
    isPhantomAvailable(): boolean {
      return this.$store.getters["wallet/isWalletAvailableByName"](
        WalletProvider.Phantom
      );
    },
    isMetamaskAvailable(): boolean {
      return this.$store.getters["wallet/isWalletAvailableByName"](
        WalletProvider.Metamask
      );
    },
  },
  watch: {
    async currentWallet() {
      await this.setChain();
    },
  },
  async mounted() {
    this.tokens = await this.$api.getTokens("PLG");
    this.gtonPrice = await this.$api.gtonPrice()
    await this.setChain();
  },
  methods: {
    switchToPreview() {
      const data: Transaction = {
        id: 0,
        firstTxnHash: null,
        secondTxnHash: null,
        lastBalance: Number(this.balanceTokenTo),
        fromAddress: this.addressFrom ?? "",
        toAddress: this.addressTo,
        amountFrom: this.amount,
        amountTo: this.amountReceive,
        lastBlock: 0, // might not necessary
        chainFrom: String(this.currentTokenSend.chain_meta.chain_id) as Chains,
        chainTo: String(this.currentTokenReceive.chain_meta.chain_id) as Chains,
        tokenFrom: this.currentTokenSend,
        tokenTo: this.currentTokenReceive,
      };
      this.$store.commit("transactions/setPreview", data);
      this.$router.push("/review");
    },
    async inputChange() {
      if (!this.amount) {
        this.amountReceive = "0.0000";
        return;
      }
      const amount = new TokenAmount(
        this.amount,
        this.currentTokenSend.token_meta.decimals,
        false
      ).toPlainString();
      const amountOut = await invoker.getAmountOut(
        createEvmInstance(this.currentTokenSend.rpc_url),
        amount, [
        this.currentTokenSend.token_address,
        this.currentTokenSend.gton_address,
        this.currentTokenReceive.token_address,
      ]);
      this.amountReceive = new TokenAmount(amountOut, this.currentTokenReceive.token_meta.decimals).fixed(4)
    },
    setMax() {
      this.amount = this.balanceTokenFrom.fixed(4);
    },
    handleConnectWallet() {
      const provider = WalletProvider.Metamask;
      // Deep copy object
      const modal = JSON.parse(
        JSON.stringify(this.$store.getters["app/getModal"](provider))
      );

      modal.data.callbackConnect = () => {
        this.connected = this.$store.getters["wallet/isWalletAvailableByName"](provider);
        this.$store.commit("app/CLOSE_MODAL");
      };
      this.$store.commit("app/PUSH_MODAL", modal);
    },
    async getTokenBalance(token: Token): Promise<TokenAmount> {
      if (!this.isMetamaskAvailable) return new TokenAmount(0);
      if (token.token_meta.native) {
        return new TokenAmount(
          await invoker.getChainBalance(token.rpc_url, this.currentWallet.address),
          18
        );
      } else {
        const web3 = createEvmInstance(token.rpc_url);

        return new TokenAmount(
          await invoker.getErc20TokenBalance(
            web3,
            token.token_address,
            this.currentWallet.address
          ),
          token.token_meta.decimals
        );
      }
    },
    async chooseCurrentChainSend(index: number) {
      this.sendTokenIndex = index;
      this.balanceTokenFrom = await this.getTokenBalance(this.currentTokenSend);
    },
    async chooseCurrentChainReceive(index: number) {
      this.receiveTokenIndex = index;
      if (this.sendTokenIndex === index) {
        this.receiveTokenIndex = this.sendTokenIndex;
        await this.chooseCurrentChainSend(index);
      }
      this.balanceTokenTo = await this.getTokenBalance(this.currentTokenReceive);
    },
    async setChain() {
      this.currentChain = await invoker.getNetworkVersion(this.$web3.mmWeb3());
    },
    async switchChain() {
      const chain =
        availableChains[String(this.currentTokenSend.chain_meta.chain_id) as Chains];
      await invoker.switchNetwork(this.$web3.mmProvider(), chain);
      await this.setChain();
    },
  },
});
</script>
