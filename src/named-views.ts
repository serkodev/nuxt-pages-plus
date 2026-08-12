import type { NuxtPage } from '@nuxt/schema'
import type { PagesPlusOptions } from './runtime/types'
import { encodePath, joinURL } from 'ufo'

// Nuxt >= 4.5 (unrouting) parses `name@view.vue` page files as vue-router
// named views: the view name is matched with NAMED_VIEW_RE against the
// extension-less file path, and the first `@chunk` in the path is stripped
// (NAMED_VIEW_STRIP_RE) before route paths are derived. The matched file is
// then merged into the base route's `components` map instead of emitting a
// standalone `/name@view` route, which is what this module's runtime extracts
// parallel routes from.
const NAMED_VIEW_RE = /(?<=[\w\]])@[\w-]+(?:\.|$)/
const NAMED_VIEW_STRIP_RE = /(?<=[\w\]])@[\w-]+/

// route groups like `(group)` do not contribute a path segment
const GROUP_SEGMENT_RE = /^\(.*\)$/

// `file.vue` -> `file`, also stripping a `.client`/`.server` mode suffix
function stripExtension(segment: string) {
  return segment
    .replace(/\.[^./]+$/, '')
    .replace(/\.(?:client|server)$/, '')
}

function fileStem(file: string) {
  return stripExtension(file.split('/').pop() ?? '')
}

function fileMode(file: string): NuxtPage['mode'] {
  const mode = (file.split('/').pop() ?? '')
    .replace(/\.[^./]+$/, '')
    .match(/\.(client|server)$/)
  return mode?.[1] as NuxtPage['mode']
}

// convert one page file segment to its vue-router path segment the way Nuxt
// generates it (e.g. `[id]@modal` -> `:id()@modal`), keeping the parallel `@`
// suffix literal
function segmentToRoutePath(segment: string) {
  if (!segment.includes('['))
    return encodePath(segment)

  return segment
    .replace(/\[\.{3}([^\]]+)\]/g, ':$1(.*)*')
    .replace(/\[\[([^\]]+)\]\]/g, ':$1?')
    .replace(/\[([^\]]+)\]/g, ':$1()')
}

// rebuild the standalone route path of a named view file as Nuxt < 4.5 emitted
// it. The merged route path cannot be trusted: the named-view parser stripped
// the first `@chunk` from the whole file path (possibly inside a directory
// segment, e.g. `about@foo/us@bar.vue` -> `/about/us@bar`), and an `index`
// stem collapses into the directory path. Only the merged path's segment
// count is used; the segments themselves are rebuilt from the file path.
function restoredPagePath(file: string, mergedPath: string) {
  const stem = fileStem(file)

  // emulate the named-view parser to learn whether the stem collapsed into
  // the directory path: strip the first `@chunk` from the whole extension-less
  // path, then check if the file's own segment became a plain `index`
  const dirSegments = file.split('/').slice(0, -1)
  const strippedPath = [...dirSegments, stem].join('/').replace(NAMED_VIEW_STRIP_RE, '')
  const stemCollapsed = strippedPath.split('/').pop() === 'index'

  const mergedSegmentCount = mergedPath.split('/').filter(Boolean).length
  let dirCount = stemCollapsed ? mergedSegmentCount : Math.max(0, mergedSegmentCount - 1)

  const segments = [segmentToRoutePath(stem)]
  for (let i = dirSegments.length - 1; i >= 0 && dirCount > 0; i--) {
    if (GROUP_SEGMENT_RE.test(dirSegments[i]!))
      continue
    segments.unshift(segmentToRoutePath(dirSegments[i]!))
    dirCount--
  }

  return `/${segments.join('/')}`
}

function restorePages(pages: NuxtPage[], rootPages: NuxtPage[], parentPath: string) {
  for (const page of [...pages]) {
    const absolutePath = page.path.startsWith('/') ? page.path : joinURL(parentPath, page.path)

    const namedViews = Object.entries(page.components ?? {}).filter(([name]) => name !== 'default')
    if (namedViews.length) {
      const restored: Record<string, NuxtPage> = {}
      for (const [name, file] of namedViews) {
        restored[file] = {
          path: restoredPagePath(file, absolutePath),
          file,
          mode: fileMode(file),
        }
        rootPages.push(restored[file])
        delete page.components![name]
      }

      if (Object.keys(page.components!).length <= 1)
        delete page.components

      // the named-view merge unions the view files' modes onto the route,
      // so recompute the mode from the route's own file
      if (page.mode && page.file)
        page.mode = fileMode(page.file)

      // a route whose own file carries the `@view` suffix only exists because
      // of the named-view merge (it has no plain sibling page), so drop it and
      // hoist its children back to standalone routes as Nuxt used to emit them
      if (page.file && NAMED_VIEW_RE.test(fileStem(page.file))) {
        // keep fields Nuxt may have attached for the page file before this
        // hook (e.g. meta extracted with `experimental.scanPageMeta: true`)
        const { path: _path, name: _name, file: _file, children: _children, components: _components, mode: _mode, ...rest } = page
        Object.assign(restored[page.file] ?? {}, rest)

        if (page.children?.length) {
          restorePages(page.children, rootPages, absolutePath)
          for (const child of page.children) {
            child.path = child.path.startsWith('/') ? child.path : joinURL(absolutePath, child.path)
            rootPages.push(child)
          }
        }

        pages.splice(pages.indexOf(page), 1)
        continue
      }
    }

    if (page.children?.length)
      restorePages(page.children, rootPages, absolutePath)
  }
}

function hasNamedViewPages(pages: NuxtPage[]): boolean {
  return pages.some(page =>
    Object.keys(page.components ?? {}).some(name => name !== 'default')
    || (page.children?.length && hasNamedViewPages(page.children)),
  )
}

/**
 * Reclaim `name@view.vue` page files that Nuxt >= 4.5 merged into base routes
 * as vue-router named views, restoring them as the standalone literal-`@`-path
 * routes that older Nuxt emitted and that the runtime plugin extracts into
 * parallel routes.
 *
 * Only runs when `namedViewsAsParallelRoutes` is enabled and the separator is
 * `@`. On Nuxt < 4.5 pages never carry named-view `components` maps, so this
 * is always a no-op there regardless of options. When the option is left unset
 * and merged named views are detected, `onIgnoredNamedViews` is called so the
 * module can hint at the migration.
 */
export function restoreParallelPages(
  pages: NuxtPage[],
  options: Pick<PagesPlusOptions, 'separator' | 'namedViewsAsParallelRoutes'>,
  onIgnoredNamedViews?: () => void,
) {
  if (options.separator !== '@')
    return

  if (!options.namedViewsAsParallelRoutes) {
    if (options.namedViewsAsParallelRoutes === undefined && hasNamedViewPages(pages))
      onIgnoredNamedViews?.()
    return
  }

  restorePages(pages, pages, '')
}
