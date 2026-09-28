<template>
  <div>
    <h2>left bookmark</h2>

    <NuxtLink v-for="i in [6, 7, 8]" :key="i" :to="`/topic/${i}`">
      Topic {{ i }}
    </NuxtLink>
  </div>
</template>
