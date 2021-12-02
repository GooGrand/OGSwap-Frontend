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
              <field-error-text v-show="isError && !isLimit" class="float-left">
                Insufficient balance
              </field-error-text>
              <field-error-text v-show="isLimit" class="float-left">
                Amount is over the limit
              </field-error-text>
              <span class="font-normal">Balance:</span>
              {{ currentChainTokenBalance }} {{ currentChainTokenName }}
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
                  :label="currentTokenReceive.title"
                  :img="currentTokenReceive.img"
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
import { originTokens, destinationTokens, Chains, limits } from "~/components/constants";
import { WalletBody } from "~/store/types";
import { WalletProvider } from "~/components/utils";
import { Transaction } from "~/utils/transactions";
import { availableChains } from "~/web3/evm_chain";
import { Token } from "~/plugins/api";
import { createEvmInstance } from "~/plugins/web3";

const invoker = new Web3Invoker();

export default Vue.extend({
  data: () => ({
    eventBus,
    prices: {} as { [key: string]: number },
    amount: "0",
    addressTo: "",
    amountReceive: "0",
    connected: false,
    tokens: [] as Token[],
    originTokens,
    destinationTokens,
    sendTokenIndex: 0,
    receiveTokenIndex: 1,
    isSelecting: false,
    balanceTokenFrom: new TokenAmount(0),
    balanceTokenTo: new TokenAmount(0),
    availableChains,
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
      if (!Number(this.amount) || !this.prices[this.currentTokenSend.address]) return "0";
      return (Number(this.amount) * this.prices[this.currentTokenSend.address]).toFixed(
        4
      );
    },
    toTokenPrice(): string {
      if (!Number(this.amountReceive) || !this.prices[this.currentTokenReceive.address])
        return "0";
      return (
        Number(this.amountReceive) * this.prices[this.currentTokenReceive.address]
      ).toFixed(4);
    },
    currentChainTokenName(): string {
      return this.currentTokenSend.title;
    },
    chainIndexName(): string {
      return this.currentTokenSend.chain_meta.chain_name;
    },
    isError(): boolean {
      return (
        Number(this.amount || 0) > Number(this.currentChainTokenBalance) ||
        Number(this.amount || 0) < 0
      );
    },
    isLimit(): boolean {
      return Number(this.amount) > limits[this.sendTokenChain];
    },
    isValidChain(): boolean {
      return this.isMetamaskAvailable && this.sendTokenChain === this.currentChain;
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
      await this.setMMBalances();
    },
  },
  async mounted() {
    this.tokens = await this.$api.getTokens("PLG");
    // await this.$store.dispatch('reserves/setReserves')
    await this.setBalances();
    await this.setChain();
    await this.setPrices();

    // достаем все данные из стора и начинаем проверку данных по последним изменениям баланса
  },
  methods: {
    switchToPreview() {
      const data: Transaction = {
        id: 0,
        firstTxnHash: null,
        secondTxnHash: null,
        lastBalance: Number(this.currentChainTokenBalance),
        fromAddress: this.addressFrom ?? "",
        toAddress: this.addressTo,
        amountFrom: this.amount,
        amountTo: this.amountReceive,
        lastBlock: 0, // might not necessary
        chainFrom: this.sendTokenChain,
        chainTo: this.receiveTokenIndex,
        tokenFrom: this.currentTokenSend,
        tokenTo: this.currentTokenReceive,
      };
      this.$store.commit("transactions/setPreview", data);
      this.$router.push("/review");
    },
    inputChange() {
      if (!this.amount) {
        this.amountReceive = "0.0000";
        return;
      }
      const amount = new TokenAmount(
        this.amount,
        this.tokenFrom.token_meta.decimals,
        false
      ).toPlainString();
      this.amountReceive = invoker.getAmountOut(amount, [
        this.tokenFrom.token_address,
        this.tokenFrom.gton_address,
        this.tokenTo.token_address,
      ]);
    },
    setMax() {
      this.amount = this.balanceTokenFrom.toPlainString();
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
