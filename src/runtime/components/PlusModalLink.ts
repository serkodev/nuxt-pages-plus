import { NuxtLink } from '#components'
import { computed, defineComponent, h, useModalRouter } from '#imports'

export default defineComponent({
  name: 'PlusModalLink',
  props: {
    ...NuxtLink.props,
    newGroup: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const url = computed(() => props.to || props.href)

    function onClick(e: MouseEvent) {
      if (!url || e.ctrlKey || e.shiftKey || e.metaKey || e.altKey)
        return

      e.preventDefault()

      const modalRouter = useModalRouter()
      if (props.replace) {
        modalRouter.replace(url.value)
      } else {
        modalRouter.push(url.value, props.newGroup)
      }
    }

    return () => h(NuxtLink, { ...props, onClick }, slots)
  },
})
