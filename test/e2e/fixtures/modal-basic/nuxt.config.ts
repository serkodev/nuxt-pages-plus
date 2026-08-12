// minimal fixture referencing examples/modal-basic, without ui/styling
export default defineNuxtConfig({
  modules: ['../../../../src/module'],
  pagesPlus: {
    parallelPages: {
      modal: {
        sync: 'post',
      },
    },
  },
})
