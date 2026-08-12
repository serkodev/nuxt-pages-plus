<template>
  <div>
    <h1>index page</h1>

    <PlusModalLink v-for="i in 9" :key="i" :to="`/gallery/${i}`">
      Open gallery {{ i }}
    </PlusModalLink>

    <PlusModalPage name="modal" />
  </div>
</template>
