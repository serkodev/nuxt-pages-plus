<template>
  <div>
    <section id="left">
      <PlusParallelPage name="left" />
    </section>
    <section id="global">
      <slot />
    </section>
    <section id="right">
      <PlusParallelPage name="right" />
    </section>
  </div>
</template>
