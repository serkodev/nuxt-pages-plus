<template>
  <div>
    <nav>
      <NuxtLink to="/">
        Home
      </NuxtLink>
      <NuxtLink to="/bookmark">
        Bookmark
      </NuxtLink>
      <NuxtLink to="/about">
        About
      </NuxtLink>
    </nav>

    <section id="left">
      <PlusParallelPage name="left">
        <template #index>
          <p>left index slot</p>
        </template>
      </PlusParallelPage>
    </section>
    <section id="global">
      <slot />
    </section>
    <section id="right">
      <PlusParallelPage name="right" />
    </section>
  </div>
</template>
