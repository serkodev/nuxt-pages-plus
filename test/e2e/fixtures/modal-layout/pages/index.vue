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

    <PlusModalLink to="/info">
      Open info modal
    </PlusModalLink>

    <PlusModalPage name="modal" />

    <NuxtLink to="/info">
      Go to info page
    </NuxtLink>

    <PlusModalLink to="/slow">
      Open slow modal
    </PlusModalLink>

    <NuxtLink to="/slow">
      Go to slow page
    </NuxtLink>

    <NuxtLink to="/cached-fetch">
      Go to cached-fetch page
    </NuxtLink>
  </div>
</template>
