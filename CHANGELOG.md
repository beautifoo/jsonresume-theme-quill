# Changelog

# [2.0.0](https://github.com/beautifoo/jsonresume-theme-quill/compare/v1.0.1...v2.0.0) (2026-11-14)


### Documentation

* warn that breaking changes require a BREAKING CHANGE footer ([6cee4f7](https://github.com/beautifoo/jsonresume-theme-quill/commit/6cee4f7211a2a7901f70686302fa7f1bfe4b02f2))


### BREAKING CHANGES

* publications with a talk-like type (talk, presentation,
speech) render in a new Conferences section instead of Publications.
This behavior shipped in 1.0.1, which was cut from a feat! commit that
the commit parser could not read as breaking; 2.0.0 supersedes 1.0.1
and is the version to depend on.

## [1.0.1](https://github.com/beautifoo/jsonresume-theme-quill/compare/v1.0.0...v1.0.1) (2026-11-14)


### Bug Fixes

* publish the theme as a node module that static-renders ([fb4850b](https://github.com/beautifoo/jsonresume-theme-quill/commit/fb4850b94d7df8939a43105726f4610f92f65391))
