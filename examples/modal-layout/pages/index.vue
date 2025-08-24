<template>
  <TheBoundary label="$__PAGES_PATH__" class="h-screen flex flex-col gap-2 items-center justify-center">
    <PlusModalLink to="/info">
      <UButton>
        Open info modal
      </UButton>
    </PlusModalLink>

    <PlusModalPage name="modal" />

    <NuxtLink to="/info">
      <UButton>
        Go to info page
      </UButton>
    </NuxtLink>
  </TheBoundary>
</template>
