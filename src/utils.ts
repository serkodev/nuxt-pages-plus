function splitNamedPath(path: string, namedPrefix: string): [string[], string[]] {
  return path.split('/').reduce<[string[], string[]]>(
    (acc, p) => {
      const [namedPaths, paths] = acc

      // split x@y to ['x', 'y'], @y to ['', 'y']
      const sPath = p.split(namedPrefix)
      if (sPath.length === 2) {
        const [spath, sname] = sPath

        // when input x@y get x as path, if only @y, do nothing
        if (spath.length > 0 && spath !== 'index')
          paths.push(spath)

        namedPaths.push(sname)
      } else if (p !== 'index') {
        // more then 2 namedPrefix or no namedPrefix
        paths.push(p)
      }

      return [namedPaths, paths]
    },
    [[], []],
  )
}

export function extractNamedRoutePath(path: string, namedPrefix = '@') {
  const [namedPaths, paths] = splitNamedPath(path, namedPrefix)
  if (namedPaths.length === 0) {
    return
  }

  return {
    name: namedPaths.join('/'),
    path: paths.join('/'),
  }
}
