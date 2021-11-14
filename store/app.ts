import { Provider } from '@project-serum/anchor'
import { WalletProvider } from '~/components/utils'

export const state = () => ({
  modalData: {
    // [WalletProvider.Phantom]: {
    //   index: '1', // Индекс для перерисовки одного и того же модального окна
    //   name: 'connect-wallet', // Уникальное название модального окна
    //   data: {
    //     label: 'Connect to Phantom',
    //     img: require('~/assets/img/icons/phantom.svg'),
    //     provider: WalletProvider.Phantom,
    //     connected: false,
    //   },
    // },
    [WalletProvider.Metamask]: {
      index: '2', // Индекс для перерисовки одного и того же модального окна
      name: 'connect-wallet', // Уникальное название модального окна
      data: {
        label: 'Connect to MetaMask',
        img: require('~/assets/img/icons/metamask.svg'),
        provider: WalletProvider.Metamask,
        connected: false,
      }, // Данные помещаемые в модальное окно
    },
  },
  modals: [],
  menu: {
    open: false,
    landingNavigation: [
      {
        route: 'home',
        label: 'Launch APP',
      },
      {
        href: 'https://medium.com/ogswaps/og-swap-enter-the-multichain-world-c6c25c2cab7a',
        label: 'About',
      },
      {
        href: '/',
        label: 'Docs',
      },
      {
        href: '/',
        label: 'Blog',
      },
    ],
    navigation: [
      {
        href: 'https://medium.com/ogswaps/og-swap-enter-the-multichain-world-c6c25c2cab7a',
        label: 'About',
      },
      {
        href: '/home',
        label: 'Swap',
      },
      {
        href: '/home',
        label: 'Logs',
      },
    ],
    socials: [
      {
        href: 'https://twitter.com/OGmultiswap',
        icon: 'mono/twitter',
      },
      // {
      //   href: '/',
      //   icon: 'mono/medium',
      // },
      {
        href: '/',
        icon: 'mono/github',
      },
      {
        href: 'https://t.me/OGmultiswap',
        icon: 'mono/telegram',
      },
    ],
  },
})

export const mutations = {
  TOGGLE_MENU(state: any) {
    state.menu.open = !state.menu.open
  },
  PUSH_MODAL(state: any, modal: string) {
    state.modals.push(modal)
  },
  PUSH_MODALS(state: any, modals: string) {
    state.modals = [...state.modals, ...modals]
  },
  CLOSE_ALL_MODALS(state: any) {
    state.modals = []
  },
  CLOSE_MODAL(state: any) {
    state.modals.pop()
  },
  SET_DATA_MODAL(state: any, { name, index, data }: any) {
    const modals = state.modals
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i]
      if (modal.name === name && modal.index === index) {
        modal.data = data
      }
    }
  },
  // SET_CONNECT(state: any, provider: WalletProvider) {
  //   const modals = state.modals
  //   modals[provider].data.connected = true
  // },
}

export const getters = {
  getModal: (state: any) => (provider: number) => state.modalData[provider],
  modals: (state: any) => state.modals,
  menu: (state: any) => state.menu,
  // isConnect: (state: any) => (provider: number) =>
  //   state.modalData[provider].data.connected,
}

// export const setters = {
//   setConnect: (state: any) => (provider: number) =>
//     (state.modalData[provider].data.connected = true),
// }
