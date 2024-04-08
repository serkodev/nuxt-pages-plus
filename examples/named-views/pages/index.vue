<template>
  <TheBoundary label="$__PAGES_PATH__" color="gray" class="h-screen flex p-6">
    <div class="flex-1 grid grid-cols-[400px_1fr_400px] gap-6">
      <NamedPage name="left" />
      <NamedPage name="main" />
      <NamedPage name="right" />
    </div>
  </TheBoundary>
</template>
