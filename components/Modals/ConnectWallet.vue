<template>
  <modal name="connect-wallet" @close="$store.commit('app/CLOSE_MODAL')">
    <div
      class="relative h-full bg-[#1C1C1C] rounded-[8px] min-h-[307px] py-[24px] px-[40px] w-[540px]"
    >
      <button
        class="absolute z-10 right-[12px] top-[12px] bg-ghost-white text-vampire-black hover:text-white hover:bg-candy-apple-red text-[12px] p-0 rounded-full w-[27px] h-[27px] flex items-center justify-center"
        aria-label="Close the modal window"
        @click="$store.commit('app/CLOSE_MODAL')"
      >
        <icon name="mono/close" class="fill-current stroke-current" />
      </button>

      <div class="mb-[18px] text-[14px] leading-none text-center font-medium text-center">
        {{ label }}
      </div>
      <div
        class="bg-dark-charcoal rounded-[10px] min-h-[215px] flex flex-col justify-center items-center"
      >
        <img
          class="w-[80px] h-[80px] object-center object-contain mb-[30px]"
          :src="img"
          :alt="label"
        />
        <btn
          v-show="!connected"
          variant="blood"
          class="w-[150px]"
          @click="onClickConnect(provider)"
        >
          {{ label }}
        </btn>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import Vue from "vue";
import { ChainTypes, WalletProvider } from "~/components/utils";
import { Web3WalletConnector, Web3Invoker } from "~/web3/metamask";
import { isWalletEqual } from "~/store/wallet";
import { availableChains } from "~/web3/evm_chain";
import { WalletBody } from "~/store/types";
import { Chains } from "~/components/constants";
import logger from "~/utils/logger";
import { metamaskBus } from "~/components/metamaskBus";

interface State {
  userConnectOccured: boolean;
  balanceWatchInterval: NodeJS.Timeout;
  userLoggedOnce: Array<boolean>;
}

const providerToChain: { [key in WalletProvider]: ChainTypes } = {
  [WalletProvider.Phantom]: ChainTypes.Solana,
  [WalletProvider.Metamask]: ChainTypes.Evm,
};
const connector = new Web3WalletConnector();
const invoker = new Web3Invoker();
export default Vue.extend({
  data: (): State => ({
    connected: false,
    userConnectOccured: false,
    // @ts-ignore
    balanceWatchInterval: 0,
    WalletProvider,
    userLoggedOnce: [false, false],
    userLoggedOncePhantom: false,
  }),
  computed: {
    modals(): any {
      return this.$store.getters["app/modals"];
    },
    modal(): any {
      return this.modals[this.modals.length - 1];
    },
    data(): any {
      return this.modal?.data;
    },
    label(): string {
      return this.data?.label;
    },
    provider(): string {
      return this.data?.provider;
    },
    img(): String {
      return this.data?.img;
    },
    // импортированный код

    isWalletUpdateAllowed(): boolean {
      return this.userConnectOccured || this.$store.getters["wallet/isWalletAvailable"];
    },
  },
  mounted() {
    this.userLoggedOnce[WalletProvider.Metamask] = Boolean(
      window.localStorage.getItem("logged_once")
    );
    this.userLoggedOnce[WalletProvider.Phantom] = Boolean(
      window.localStorage.getItem("logged_once_phantom")
    );
    if (this.userLoggedOnce[WalletProvider.Metamask]) {
      const connect = this.connectMetamask.bind(this);
      setTimeout(connect, 3000);
    }
    if (this.userLoggedOnce[WalletProvider.Phantom]) {
      const connect = this.connectPhantom.bind(this);
      setTimeout(connect, 3000);
    }
    metamaskBus.$on("logout", (data: WalletProvider) => {
      this.logWalletOut(data);
    });
  },
  created() {
    const fn = () => {
      if (!this.isWalletUpdateAllowed) {
        return;
      }
      this.walletDataUpdate();
    };
    this.balanceWatchInterval = setInterval(fn.bind(this), 4000);
  },
  beforeDestroy() {
    clearInterval(this.balanceWatchInterval);
  },
  methods: {
    async buildWalletBody(provider: WalletProvider): Promise<Array<WalletBody>> {
      const address = await invoker.resolveCurrentAddress(this.$web3.mmWeb3());
      const id: Chains = await invoker.getNetworkVersion(this.$web3.mmWeb3());
      const label: string = availableChains[id]
        ? availableChains[id].chainName
        : "Unknown";

      const oldWalletData = this.$store.getters["wallet/walletByName"](provider); // поменять геттер на получение кошелька по имени
      const updatedWalletBody = {
        isConnected: true,
        address,
        checked: true,
        wallet: { id, label },
        provider,
      };
      return [updatedWalletBody, oldWalletData];
    },
    async walletDataUpdate() {
      if (!this.isWalletUpdateAllowed) return;
      for (const key in WalletProvider) {
        if (!this.$store.getters["wallet/isWalletAvailableByName"](key)) return;
        // @ts-ignore
        await this.checkWalletData(providerToChain[key]);
      }
    },
    async checkWalletData(provider: WalletProvider): Promise<void> {
      const [updatedWalletBody, oldWalletData] = await this.buildWalletBody(provider);
      if (isWalletEqual(oldWalletData, updatedWalletBody)) {
        return;
      }
      this.$store.commit("wallet/updateWalletData", {
        // eslint-disable-next-line
        provider: provider,
        body: updatedWalletBody,
      });
    },
    dispatch(walletName: WalletProvider) {
      const wallet = this.$store.getters["wallet/walletByName"](walletName);
      const provider = wallet.provider;
      this.userConnectOccured = false;
      this.$store.dispatch("wallet/disconnectWallet", { provider }); // передавать кошелек для разлогина
    },
    logWalletOut(walletName: WalletProvider) {
      // добавил строку кошелька который разлогиниваем
      // необходимо передавать какой кошелек мы разлогиниваем
      window.localStorage.removeItem("logged_once");
      window.localStorage.removeItem("logged_once_phantom");
      clearInterval(this.balanceWatchInterval);
      setTimeout(this.dispatch.bind(this, walletName), 1000);
    },
    async connectMetamask() {
      const isConnected = connector.ethEnabled(); // возвращает тру и подлкючает аддресс
      if (!isConnected) {
        return;
      }
      await this.checkWalletData(WalletProvider.Metamask);
      this.userConnectOccured = true;
      window.localStorage.setItem("logged_once", "true"); // change to wallet name logged_once_phantom (DONE)
    },
    async connectPhantom() {
      const isConnected = await connector.solEnabled();
      if (!isConnected) {
        return;
      }
      await this.checkWalletData(WalletProvider.Phantom); // Phantom (DONE)
      this.userConnectOccured = true;
      window.localStorage.setItem("logged_once_phantom", "true"); // change to wallet name logged_once_phantom (DONE)
    },
    async onClickConnect(provider: WalletProvider) {
      return provider === WalletProvider.Metamask
        ? await this.onClickMetamaskConnect()
        : await this.onClickPhantomConnect();
    },
    async onClickMetamaskConnect() {
      try {
        await this.connectMetamask();
      } catch (err) {
        logger({ err });
      } finally {
        this.$store.commit("app/CLOSE_MODAL");
      }
    },
    async onClickPhantomConnect() {
      try {
        await this.connectPhantom();
      } catch (err) {
        logger({ err });
      } finally {
        this.$store.commit("app/CLOSE_MODAL");
      }
    },
  },
});
</script>
