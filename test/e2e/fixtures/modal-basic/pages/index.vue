<template>
  <div>
    <h1>index page</h1>

    <PlusModalLink to="/info">
      Open info modal
    </PlusModalLink>

    <PlusModalPage name="modal" />

    <NuxtLink to="/info">
      Go to info page
    </NuxtLink>
  </div>
</template>
