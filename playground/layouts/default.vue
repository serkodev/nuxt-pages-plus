<template>
  <TheBoundary label="Layout: default" color="gray" class="h-screen flex p-6">
    <div class="flex-1 grid grid-cols-[400px_1fr_400px] gap-px">
      <NamedPage name="left" />
      <slot />
      <NamedPage name="right" />
    </div>
  </TheBoundary>
</template>
