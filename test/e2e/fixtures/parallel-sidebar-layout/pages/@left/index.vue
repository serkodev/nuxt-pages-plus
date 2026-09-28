<template>
  <div>
    <h2>left index</h2>

    <NuxtLink v-for="i in 5" :key="i" :to="`/topic/${i}`">
      Topic {{ i }}
    </NuxtLink>
  </div>
</template>
