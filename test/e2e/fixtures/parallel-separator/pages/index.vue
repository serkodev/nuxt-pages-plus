<template>
  <div>
    <h1>index page</h1>

    <section id="left">
      <PlusParallelPage name="left" />
    </section>
    <section id="main">
      <PlusParallelPage name="main" />
    </section>
    <!-- expected empty: with the `+` separator, index@right.vue is not a parallel route -->
    <section id="right">
      <PlusParallelPage name="right" />
    </section>
  </div>
</template>
