<template>
  <TheBoundary label="$__PAGES_PATH__">
    <div class="divide-y divide-gray-500/25 divide-dashed">
      <ExampleNewsItem v-for="item, i in exampleNews.slice(0, 5)" :key="i" :news="item" :to="`/examples/parallel-routes/news/${i}`" />
    </div>
  </TheBoundary>
</template>
