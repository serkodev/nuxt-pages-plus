<script setup lang="ts">
definePageMeta({
  parallel: { ignore: true },
})
</script>

<template>
  <ExampleView label="$__PAGES_PATH__">
    <div>
      This is the @right page and it is ignored from parallel pages by <code>definePageMeta</code>.
    </div>
  </ExampleView>
</template>
