import { describe, expect, it } from 'vitest'
import { extractNamedRoutePath } from '../src/runtime/utils'

describe('extractNamedRoutePath', () => {
  it('basic', () => {
    expect(extractNamedRoutePath('/@side/foo')).toMatchInlineSnapshot(`
      {
        "name": "side",
        "path": "/foo",
      }
    `)
    expect(extractNamedRoutePath('/@side/foo/bar')).toMatchInlineSnapshot(`
      {
        "name": "side",
        "path": "/foo/bar",
      }
    `)
    expect(extractNamedRoutePath('/foo/@side/bar')).toMatchInlineSnapshot(`
      {
        "name": "side",
        "path": "/foo/bar",
      }
    `)
  })

  it('named file', () => {
    expect(extractNamedRoutePath('/foo@side/bar')).toMatchInlineSnapshot(`
    {
      "name": "side",
      "path": "/foo/bar",
    }
  `)
    expect(extractNamedRoutePath('/foo/bar@side')).toMatchInlineSnapshot(`
      {
        "name": "side",
        "path": "/foo/bar",
      }
    `)
  })

  it('multiple named', () => {
    expect(extractNamedRoutePath('/foo/@side/bar/@main/baz')).toMatchInlineSnapshot(`
      {
        "name": "side/main",
        "path": "/foo/bar/baz",
      }
    `)

    expect(extractNamedRoutePath('/foo/bar@side/baz@main')).toMatchInlineSnapshot(`
      {
        "name": "side/main",
        "path": "/foo/bar/baz",
      }
    `)
  })
})
