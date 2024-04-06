<script setup lang="ts">
definePageMeta({
  namedPages: { ignore: true },
})
</script>

<template>
  <TheBoundary label="@right/index" color="purple">
    <div class="px-4">
      <h3 class="text-lg font-semibold my-4">
        @Right page
      </h3>
      <div>
        <p>
          This is the @right page and it is ignored from named pages by <code>definePageMeta</code>.
        </p>
      </div>
    </div>
  </TheBoundary>
</template>
