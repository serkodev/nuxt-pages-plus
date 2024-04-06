# nuxt-subrouter-demo

## Guide

- Files in `pages/_side/...` should parellel with `pages/...`
- `pages/[...all].vue` is use for fallback main routes that only for side, that means the default view of main
- If need to add a parent view for `_side`, add a `pages/_side.vue` with following code:
```html
<template>
    <div>
        out side
        <RouterView />
    </div>
</template>
```
