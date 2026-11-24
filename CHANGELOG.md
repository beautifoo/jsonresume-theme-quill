# Changelog

# [3.1.0](https://github.com/beautifoo/jsonresume-theme-quill/compare/v3.0.0...v3.1.0) (2026-11-24)


### Bug Fixes

* **projects:** Separate a project name from its role ([9026a42](https://github.com/beautifoo/jsonresume-theme-quill/commit/9026a42694b261472f57f052a1f2088f7a822b5e))
* **sections:** Place volunteer experience before projects ([5bdbd9c](https://github.com/beautifoo/jsonresume-theme-quill/commit/5bdbd9c09120330481a6df47c0d3c4d0ac8526cd))
* **summary:** Let the about narrative span the full column ([04e521e](https://github.com/beautifoo/jsonresume-theme-quill/commit/04e521e2328a8821604ad09f7be664d24189dd47))


### Features

* **header:** Render the location beside the contact details ([7f4ed4b](https://github.com/beautifoo/jsonresume-theme-quill/commit/7f4ed4bae51ab5e86f8ebf1eddf0d29679fdb515))
* **publications:** Show the authors beside the summary ([604a24a](https://github.com/beautifoo/jsonresume-theme-quill/commit/604a24ad05c8f5fc0893b8194bad68063db71ab8))
* **render:** Read the column layout from the resume document ([e89b805](https://github.com/beautifoo/jsonresume-theme-quill/commit/e89b805ff9b20c41954c80ce71bd3ad80d07cf1e))

# [3.1.0](https://github.com/beautifoo/jsonresume-theme-quill/compare/v3.0.0...v3.1.0) (2026-11-24)


### Bug Fixes

* **projects:** Separate a project name from its role ([9026a42](https://github.com/beautifoo/jsonresume-theme-quill/commit/9026a42694b261472f57f052a1f2088f7a822b5e))
* **sections:** Place volunteer experience before projects ([5bdbd9c](https://github.com/beautifoo/jsonresume-theme-quill/commit/5bdbd9c09120330481a6df47c0d3c4d0ac8526cd))
* **summary:** Let the about narrative span the full column ([04e521e](https://github.com/beautifoo/jsonresume-theme-quill/commit/04e521e2328a8821604ad09f7be664d24189dd47))


### Features

* **header:** Render the location beside the contact details ([7f4ed4b](https://github.com/beautifoo/jsonresume-theme-quill/commit/7f4ed4bae51ab5e86f8ebf1eddf0d29679fdb515))
* **publications:** Show the authors beside the summary ([604a24a](https://github.com/beautifoo/jsonresume-theme-quill/commit/604a24ad05c8f5fc0893b8194bad68063db71ab8))
* **render:** Read the column layout from the resume document ([e89b805](https://github.com/beautifoo/jsonresume-theme-quill/commit/e89b805ff9b20c41954c80ce71bd3ad80d07cf1e))

# [3.0.0](https://github.com/beautifoo/jsonresume-theme-quill/compare/v2.1.0...v3.0.0) (2026-11-19)


* fix!(validate): Enforce the spec's format and pattern constraints ([f10aff9](https://github.com/beautifoo/jsonresume-theme-quill/commit/f10aff95348fa4532afd6b0befe80d72aa2c5f50))


### Bug Fixes

* **metrics:** Bold the whole word for numbers embedded in words ([0c1c437](https://github.com/beautifoo/jsonresume-theme-quill/commit/0c1c437d9849e8cd82bd6127c01a6d0768c2082f))
* **print:** keep section titles with their section ([e796bd3](https://github.com/beautifoo/jsonresume-theme-quill/commit/e796bd3b1ca65ca9f58072fd6b01eb70e390ff67))
* **print:** let timeline entries flow across pages ([c449fdd](https://github.com/beautifoo/jsonresume-theme-quill/commit/c449fdde5af89ac85e5ceb379732373049bc86eb))


### Features

* A4 target on the compare page — the print target as a live 794px preview ([ec9d09e](https://github.com/beautifoo/jsonresume-theme-quill/commit/ec9d09ebaf60981b872996c330877c16c371a69c))


### BREAKING CHANGES

* resume documents with free-text dates or malformed
format-constrained values now fail the build-time gate instead of
passing.

# [2.1.0](https://github.com/beautifoo/jsonresume-theme-quill/compare/v2.0.0...v2.1.0) (2026-11-15)


### Features

* load resume.local.json in local dev, falling back to the demo resume ([6909788](https://github.com/beautifoo/jsonresume-theme-quill/commit/690978873a94df3219e0a6a2a70a572212507be4))

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
