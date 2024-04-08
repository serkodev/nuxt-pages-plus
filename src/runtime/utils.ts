import { encodePath } from 'ufo'

function splitNamedPath(path: string, separator: string): [string[], string[]] {
  return path.split('/').reduce<[string[], string[]]>(
    (acc, p) => {
      const [namedPaths, paths] = acc

      // split x@y to ['x', 'y'], @y to ['', 'y']
      const sPath = p.split(separator)
      if (sPath.length === 2) {
        const [spath, sname] = sPath

        // when input x@y get x as path, if only @y, do nothing
        if (spath.length > 0 && spath !== 'index')
          paths.push(spath)

        namedPaths.push(sname)
      } else if (p !== 'index') {
        // more then 2 separator or no separator
        paths.push(p)
      }

      return [namedPaths, paths]
    },
    [[], []],
  )
}

// when /@side/index.vue and /@side.vue both exist, the there will be two /@side, one of them without name and with children
// when /@side.vue only, the there will be one /@side with name and children
// when no /@side.vue, there will be not any route with children
export function extractNamedRoutePath(path: string, separator: string = '@') {
  // ref: nuxt/src/pages/utils.ts getRoutePath, replace some symbol (e.g '+') with url encoding
  separator = encodePath(separator)

  const [namedPaths, paths] = splitNamedPath(path, separator)
  if (namedPaths.length === 0) {
    return
  }

  return {
    name: namedPaths.join('/'),
    path: paths.join('/'),
  }
}
