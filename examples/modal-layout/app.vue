<template>
  <PlusModalNuxtPage v-slot="{ route, layout }">
    <NuxtLayout :name="layout">
      <NuxtPage :route="route" />
    </NuxtLayout>
  </PlusModalNuxtPage>
</template>
