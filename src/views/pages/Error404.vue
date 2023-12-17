<template>
  <div class="h-screen flex w-full bg-img">
    <div
      class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center"
    >
      <img
        src="@/assets/images/logo/logo.png"
        alt="graphic-404"
        class="mx-auto mb-4 max-w-full"
      />
      <h1 class="sm:mx-0 mx-4 mb-12 text-5xl d-theme-heading-color">
        Ups, dogodio se lapsus!
      </h1>
      <p class="sm:mx-0 mx-4">
        Ili nemate prava pristupa ovoj stranici ili je se dogodila greška.
      </p>
      <p class="sm:mx-0 mx-4">
        Ukoliko smatrate da ova stranica treba postojati i da ju trebate imati
        dopuštenje vidjeti, molimo kontaktirajte administratora
      </p>
      <vs-button size="large" to="/" class="mt-10">Natrag</vs-button>
    </div>
  </div>
</template>
