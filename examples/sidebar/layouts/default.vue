<template>
  <div class="h-screen grid grid-cols-[400px_1fr_400px] gap-px">
    <NamedPage name="left" />
    <slot />
    <NamedPage name="right" />
  </div>
</template>
