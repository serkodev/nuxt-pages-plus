<script setup lang="ts">
const { stacks, stackPaths } = useModalRouter()
</script>

<template>
  <div>
    <output id="modal-stacks">{{ JSON.stringify(stacks ?? null) }}</output>
    <output id="modal-stack-paths">{{ JSON.stringify(stackPaths ?? null) }}</output>
    <PlusModalNuxtPage />
  </div>
</template>
