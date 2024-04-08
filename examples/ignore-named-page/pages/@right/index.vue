<script setup lang="ts">
definePageMeta({
  namedPages: { ignore: true },
})
</script>

<template>
  <ExampleView label="$__PAGES_PATH__">
    <div>
      This is the @right page and it is ignored from named pages by <code>definePageMeta</code>.
    </div>
  </ExampleView>
</template>
