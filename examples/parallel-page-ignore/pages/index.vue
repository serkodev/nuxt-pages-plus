<template>
  <TheBoundary label="$__PAGES_PATH__" color="gray" class="h-screen flex p-8">
    <div class="flex-1 grid grid-cols-[400px_1fr_400px] gap-8">
      <ParallelPage name="left" />

      <div>
        <UContainer>
          <h1 class="text-2xl font-semibold my-4">
            Index
          </h1>
          <p>
            This is the index page @main. Expect there is no right sidebar because it is ignored.
          </p>
          <p class="mt-2">
            <NuxtLink to="/@right">
              <UButton>
                Go to /@right
              </UButton>
            </NuxtLink>
          </p>
        </UContainer>
      </div>

      <!-- expecte empty because @right/index is ignored -->
      <ParallelPage name="right" />
    </div>
  </TheBoundary>
</template>
