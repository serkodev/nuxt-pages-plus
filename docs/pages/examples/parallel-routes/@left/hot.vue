<template>
  <TheBoundary label="$__PAGES_PATH__">
    <div class="divide-y divide-gray-500/25 divide-dashed">
      <ExampleNewsItem v-for="item, i in exampleNews.slice(5, 10)" :key="i" :news="item" :to="`/examples/parallel-routes/news/${i + 5}`" />
    </div>
  </TheBoundary>
</template>
