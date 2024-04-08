import { encodePath } from 'ufo'

function splitParallelPath(path: string, separator: string): [string[], string[]] {
  return path.split('/').reduce<[string[], string[]]>(
    (acc, p) => {
      const [names, paths] = acc

      // split x@y to ['x', 'y'], @y to ['', 'y']
      const sPath = p.split(separator)
      if (sPath.length >= 2) {
        const [spath, ...sname] = sPath

        // when input x@y get x as path, if only @y, do nothing
        if (spath.length > 0 && spath !== 'index')
          paths.push(spath)

        // TODO: use reverse or not?
        names.push(...sname.reverse())
      } else if (p !== 'index') {
        // more then 2 separator or no separator
        paths.push(p)
      }

      return [names, paths]
    },
    [[], []],
  )
}

// when /@side/index.vue and /@side.vue both exist, the there will be two /@side, one of them without name and with children
// when /@side.vue only, the there will be one /@side with name and children
// when no /@side.vue, there will be not any route with children
export function extractParallelRoutePath(path: string, separator: string = '@') {
  // ref: nuxt/src/pages/utils.ts getRoutePath, replace some symbol (e.g '+') with url encoding
  separator = encodePath(separator)

  const [names, paths] = splitParallelPath(path, separator)
  if (names.length === 0) {
    return
  }

  return {
    name: names.join('/'),
    path: paths.join('/'),
  }
}
