<script setup lang="ts">
const router = useRouter()
const id = computed(() => Number.parseInt(router.currentRoute.value.params.id as string) || 1)

function pushNext() {
  useModalRouter().push(`/gallery/${id.value + 1}`)
}
</script>

<template>
  <div class="modal-wrapper">
    <h2>gallery modal {{ id }}</h2>

    <button @click="pushNext">
      Push next
    </button>

    <button @click="$modalRouter.close()">
      Close
    </button>
  </div>
</template>
