/**
 * The stylesheet placeholder marker, shared by both sides of the build
 * protocol: `theme.tsx` renders it into the published document and
 * `build.ts` replaces it with the compiled stylesheet. Defined once so
 * a rename cannot drift between the two.
 */
export const STYLESHEET_MARKER = '__quill-stylesheet__'
