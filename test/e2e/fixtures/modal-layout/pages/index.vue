<script setup lang="ts">
// explicit so the retained background layout is observable as [data-layout="default"]
// (an implicit default resolves to `false` in useModalRouter().layout, rendering no layout)
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div>
    <h1>index page</h1>

    <div data-scroll-spacer style="height: 200vh" />

    <PlusModalLink to="/info">
      Open info modal
    </PlusModalLink>

    <PlusModalPage name="modal" />

    <NuxtLink to="/info">
      Go to info page
    </NuxtLink>
  </div>
</template>
