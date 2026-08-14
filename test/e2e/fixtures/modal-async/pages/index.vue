<template>
  <div>
    <h1>index page</h1>

    <PlusModalLink v-for="i in 9" :key="i" :to="`/gallery/${i}`">
      Open gallery {{ i }}
    </PlusModalLink>

    <NuxtLink to="/gallery/5">
      Go to gallery 5
    </NuxtLink>

    <PlusModalLink to="/fetch-one/1">
      Open fetch-one 1
    </PlusModalLink>

    <PlusModalLink to="/fetch-two/1">
      Open fetch-two 1
    </PlusModalLink>

    <PlusModalPage name="modal" />
  </div>
</template>
