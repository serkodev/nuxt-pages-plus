<!--
  Override of the `docus` layer app.vue: identical shell, but renders pages
  through `PlusModalNuxtPage` instead of `NuxtPage` so the modal routes demo
  (/examples/modal-routes) can present pages as modals.
-->
<script setup lang="ts">
import type { ContentNavigationItem, PageCollections } from '@nuxt/content'
import * as nuxtUiLocales from '@nuxt/ui/locale'

const appConfig = useAppConfig()
const { seo } = appConfig
useDocusShortcuts()
const site = useSiteConfig()
const { locale, isEnabled } = useDocusI18n()
const { isEnabled: isAssistantEnabled } = useAssistant()

const nuxtUiLocale = computed(() => nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales] || nuxtUiLocales.en)
const lang = computed(() => nuxtUiLocale.value.code)
const dir = computed(() => nuxtUiLocale.value.dir)
const collectionName = computed(() => isEnabled.value ? `docs_${locale.value}` : 'docs')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang,
    dir,
  },
})

useSeoMeta({
  titleTemplate: seo.titleTemplate,
  title: seo.title,
  description: seo.description,
  ogSiteName: site.name,
  twitterCard: 'summary_large_image',
})

const { data: navigation } = await useAsyncData(() => `navigation_${collectionName.value}`, () => queryCollectionNavigation(collectionName.value as keyof PageCollections), {
  transform: (data: ContentNavigationItem[]) => transformNavigation(data, isEnabled.value, locale.value),
  watch: [locale],
})

provide('navigation', navigation)

const { subNavigationMode } = useSubNavigation(navigation)
</script>

<template>
  <UApp :locale="nuxtUiLocale">
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <div class="flex">
      <div
        class="flex-1 min-w-0"
        :class="{ 'docus-sub-header': subNavigationMode === 'header' }"
      >
        <AppHeader v-if="$route.meta.header !== false" />
        <NuxtLayout>
          <PlusModalNuxtPage />
        </NuxtLayout>
        <AppFooter v-if="$route.meta.footer !== false" />

        <ClientOnly>
          <AppSearch :navigation="navigation" />
          <LazyAssistantFloatingInput v-if="isAssistantEnabled" />
        </ClientOnly>
      </div>

      <ClientOnly v-if="isAssistantEnabled">
        <LazyAssistantPanel />
      </ClientOnly>
    </div>
  </UApp>
</template>

<style>
@media (min-width: 1024px) {
  .docus-sub-header {
    /* 64px base header + 48px sub-navigation bar */
    --ui-header-height: 112px;
  }
}
</style>
