<template>
  <TheBoundary label="$__PAGES_PATH__" color="gray" class="h-screen flex p-6">
    <div class="flex-1 grid grid-cols-[400px_1fr] gap-6">
      <ParallelPage name="left" />
      <ParallelPage name="main" />
    </div>
  </TheBoundary>
</template>
