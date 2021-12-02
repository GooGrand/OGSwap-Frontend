<template>
  <div>
    <section class="mb-[45px] lg:mb-[40px]">
      <h1 class="absolute invisible">OG Swap</h1>

      <div class="mb-[38px] lg:mb-0">
        <div class="relative mx-auto max-w-[1440px]">
          <span
            class="
              section-shadow
              absolute
              top-0
              bottom-0
              left-0
              w-[200px]
              bg-section-shadow
            "
          ></span>
          <span
            class="
              section-shadow
              absolute
              top-0
              bottom-0
              right-0
              w-[200px]
              bg-section-shadow
              rotate-180
            "
          ></span>
          <img src="~/assets/img/landing/1.jpg" alt="" class="w-[100%]" />
        </div>

        <div
          class="
            container
            relative
            mt-[-31px]
            lg:mt-[-86px] lg:translate-y-[-45px]
          "
        >
          <p
            class="
              text-[20px]
              leading-[25px]
              font-extralight
              tracking-[1px]
              md:max-w-[715px] md:text-[35px] md:leading-[43px]
            "
          >
            Authentic <b>multichain</b> swaps of native tokens via $GTON as a
            relay
          </p>
        </div>
      </div>

      <div class="container">
        <buttons-group :is-right="true" />
      </div>
    </section>

    <section class="mb-[45px] lg:mb-[55px]">
      <h2 class="absolute invisible">Exceptional</h2>

      <div class="mb-[35px] lg:mb-[47px]">
        <div class="relative mx-auto max-w-[1440px]">
          <span
            class="
              section-shadow
              absolute
              top-0
              bottom-0
              left-0
              w-[200px]
              bg-section-shadow
            "
          ></span>
          <span
            class="
              section-shadow
              absolute
              top-0
              bottom-0
              right-0
              w-[200px]
              bg-section-shadow
              rotate-180
            "
          ></span>
          <img
            src="~/assets/img/landing/2.jpg"
            alt=""
            class="w-[100%] mx-auto max-w-[1440px]"
          />
        </div>

        <div class="container relative mt-[-5px] lg:mt-[-75px]">
          <p
            class="
              text-[20px]
              leading-[25px]
              font-extralight
              tracking-[1px]
              md:max-w-[715px] md:text-[25px] md:leading-[35px]
            "
          >
            <b>OG is solving the problem</b> of over-complicated user experience
            in multichain DeFi. Explore new chains by purchasing native tokens
            in a couple of clicks.
          </p>
        </div>
      </div>

      <div class="container">
        <buttons-group />
      </div>
    </section>

    <section class="mb-[45px] lg:mb-[50px]">
      <h2 class="absolute invisible">Authending</h2>

      <div class="mb-[35px] lg:mb-[30px]">
        <div class="relative mx-auto max-w-[1440px]">
          <span
            class="
              section-shadow
              absolute
              top-0
              bottom-0
              left-0
              w-[200px]
              bg-section-shadow
            "
          ></span>
          <span
            class="
              section-shadow
              absolute
              top-0
              bottom-0
              right-0
              w-[200px]
              bg-section-shadow
              rotate-180
            "
          ></span>
          <img
            src="~/assets/img/landing/3.jpg"
            alt=""
            class="w-[100%] mx-auto max-w-[1440px]"
          />
        </div>

        <div class="container relative mt-[-14px] lg:mt-[-100px]">
          <p
            class="
              text-[20px]
              leading-[25px]
              font-extralight
              tracking-[1px]
              md:max-w-[715px] md:text-[25px] md:leading-[35px]
            "
          >
            Swapping uses $GTON as a <b>token-in-the-middle</b>.<br />Due to the
            constantly maintained liquidity in the pools with GTON & native
            tokens on all integrated chains, almost instant exchange is
            possible.
          </p>
        </div>
      </div>

      <div class="container">
        <buttons-group :is-right="true" />
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ButtonsGroup from '~/components/Landing/ButtonsGroup.vue'

export default Vue.extend({
  components: { ButtonsGroup },
  layout: 'landing',
})
</script>

<style lang="postcss">
.section-shadow {
  display: none;

  @media (min-width: 1441px) {
    display: block;
  }
}
</style>
