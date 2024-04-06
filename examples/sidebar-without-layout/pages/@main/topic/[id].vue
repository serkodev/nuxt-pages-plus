<template>
  <TheBoundary label="@main/topic/[id].vue" color="green">
    <UContainer>
      <h1 class="text-2xl font-semibold my-4">
        Topic {{ useParentRoute().params.id }}
      </h1>
      <p>
        This is the topic page.
      </p>
    </UContainer>
  </TheBoundary>
</template>
