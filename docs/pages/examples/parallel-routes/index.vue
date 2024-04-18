<template>
  <TheBoundary label="$__PAGES_PATH__">
    <div class="p-6">
      <h1 class="font-semibold mb-4">
        Home
      </h1>

      <p class="my-2">
        With parallel routes, you can render the left side menu and change the URL.
      </p>
      <p class="my-2">
        When you click <code class="text-nuxt">Hot</code> category, the URL changes to <code class="text-nuxt">/hot</code> and the left side menu changes to hot news.
      </p>
      <p class="my-2">
        If you click any news topic on the left side menu, the URL will changes but the left side menu will remain the same.
      </p>
    </div>
  </TheBoundary>
</template>
