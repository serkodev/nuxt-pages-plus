<template>
  <TheBoundary label="$__PAGES_PATH__" color="purple">
    <div class="px-4">
      <h3 class="text-lg font-semibold my-4">
        Right Sidebar of Topic {{ $route.params.id }}
      </h3>
      <p>
        Put this file in <code>topic/@right/[id].vue</code> is same as <code>@right/topic/[id].vue</code>.
      </p>
    </div>
  </TheBoundary>
</template>
