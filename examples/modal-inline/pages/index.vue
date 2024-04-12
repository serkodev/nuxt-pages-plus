<script setup lang="ts">
const { push, close } = useNuxtApp().$modalRouter

const contactsId = computed(() => useRouter().currentRoute.value.params?.id)

const isContactsRoute = computed(() => {
  return useRouter().currentRoute.value.name === 'contacts-id'
})
</script>

<template>
  <div>
    <div class="h-screen flex items-center justify-center">
      <UButton class="px-16 py-10" @click="push('/contacts/10')">
        Open
      </UButton>
    </div>

    <Teleport v-if="isContactsRoute" to="body">
      <div class="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
        <div class="border border-gray-800 p-6 rounded-lg space-y-3 backdrop-blur dark:bg-black/75 bg-white/75">
          <div>After you refresh this page, the contacts id page will show up in full page.</div>
          <ExampleView label="$__PAGES_PATH__">
            contacts id: {{ contactsId }}
          </ExampleView>
          <UButton @click="close">
            Close
          </UButton>
        </div>
      </div>
    </Teleport>
  </div>
</template>
