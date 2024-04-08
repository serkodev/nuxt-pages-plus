<template>
  <TheBoundary label="$__PAGES_PATH__" color="gray" class="h-screen flex p-8">
    <div class="flex-1 grid grid-cols-[400px_1fr_400px] gap-8">
      <ParallelPage name="left" />

      <ParallelPage name="main" />

      <!-- expecte empty because @right/index is ignored -->
      <ParallelPage name="right" />
    </div>
  </TheBoundary>
</template>
