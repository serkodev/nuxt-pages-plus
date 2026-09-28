<script setup lang="ts">
const router = useRouter()
const id = computed(() => Number.parseInt(router.currentRoute.value.params.id as string) || 1)

function pushNext() {
  useModalRouter().push(`/gallery/${id.value + 1}`)
}

// pushes to a path a global middleware redirects to /gallery/6, so the settled
// route differs from the requested one (exercises stackPaths' redirect sync)
function pushRedirecting() {
  useModalRouter().push('/gallery/99')
}

// a bare vue-router replace that bypasses $modalRouter: the merged history state
// keeps the modal open while the route changes underneath, so the stamped path
// goes stale (exercises stackPaths' sync for a replace outside backgroundNavigate)
function bareReplace() {
  router.replace('/gallery/8')
}
</script>

<template>
  <div class="modal-wrapper">
    <h2>gallery modal {{ id }}</h2>

    <button @click="pushNext">
      Push next
    </button>

    <button @click="pushRedirecting">
      Push redirecting
    </button>

    <button @click="bareReplace">
      Bare replace
    </button>

    <PlusModalLink open :to="`/gallery/${id + 1}`">
      Open next stack
    </PlusModalLink>

    <PlusModalLink replace to="/gallery/9">
      Replace with last
    </PlusModalLink>

    <NuxtLink to="/">
      Go to index page
    </NuxtLink>

    <button @click="$modalRouter.close()">
      Close
    </button>

    <button @click="$modalRouter.close(true)">
      Close all
    </button>
  </div>
</template>
