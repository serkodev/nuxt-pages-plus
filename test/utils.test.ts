import { describe, expect, it } from 'vitest'
import { extractParallelRoutePath } from '../src/runtime/utils'

describe('extractParallelRoutePath', () => {
  it('basic', () => {
    expect(extractParallelRoutePath('/@side/foo')).toMatchInlineSnapshot(`
      {
        "name": "side",
        "path": "/foo",
      }
    `)
    expect(extractParallelRoutePath('/@side/foo/bar')).toMatchInlineSnapshot(`
      {
        "name": "side",
        "path": "/foo/bar",
      }
    `)
    expect(extractParallelRoutePath('/foo/@side/bar')).toMatchInlineSnapshot(`
      {
        "name": "side",
        "path": "/foo/bar",
      }
    `)
  })

  it('parallel name on file name', () => {
    expect(extractParallelRoutePath('/foo@side/bar')).toMatchInlineSnapshot(`
    {
      "name": "side",
      "path": "/foo/bar",
    }
  `)
    expect(extractParallelRoutePath('/foo/bar@side')).toMatchInlineSnapshot(`
      {
        "name": "side",
        "path": "/foo/bar",
      }
    `)
  })

  it('nested', () => {
    expect(extractParallelRoutePath('/foo/@side/bar/@main/baz')).toMatchInlineSnapshot(`
      {
        "name": "side/main",
        "path": "/foo/bar/baz",
      }
    `)

    expect(extractParallelRoutePath('/foo/bar@side/baz@main')).toMatchInlineSnapshot(`
      {
        "name": "side/main",
        "path": "/foo/bar/baz",
      }
    `)

    expect(extractParallelRoutePath('/foo/bar/baz@side@main')).toMatchInlineSnapshot(`
      {
        "name": "side/main",
        "path": "/foo/bar/baz",
      }
    `)
  })
})
