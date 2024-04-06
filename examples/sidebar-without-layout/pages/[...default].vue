<template>
  <TheBoundary label="[...default].vue" color="gray" class="h-screen flex p-8">
    <div class="flex-1 grid grid-cols-[400px_1fr] gap-px">
      <NamedPage name="left" />
      <NamedPage name="main" />
    </div>
  </TheBoundary>
</template>
