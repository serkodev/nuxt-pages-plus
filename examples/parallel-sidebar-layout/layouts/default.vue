<template>
  <TheBoundary label="Layout: default" color="gray" class="h-screen flex p-6">
    <div class="flex-1 grid grid-cols-[400px_1fr_400px] gap-6">
      <ParallelPage name="left" />
      <slot />
      <ParallelPage name="right" />
    </div>
  </TheBoundary>
</template>
