# Viewer component provenance

The components in `src/components/ui` were retrieved from the official shadcn/ui New York registry on 2026-10-02 (https://ui.shadcn.com/r/styles/new-york/). Local changes resolve registry imports, remove unused server-component directives for the static build, and format the sources. shadcn/ui is MIT licensed; the upstream license is included in `SHADCN-LICENSE`.

`workbench-toolbar.tsx` is an original implementation informed by the grouped toggle toolbar preview by Preet Suthar / HextaUI on 21st.dev: https://21st.dev/@preetsuthar17/components/toolbar. The source required account access and was not downloaded or copied. No 21st.dev service, account, telemetry, or runtime dependency is included.

React, Radix primitives, cmdk, react-resizable-panels, TanStack Table, Lucide, and d3-force are installed through npm, with versions pinned in package-lock.json. 3Dmol remains the repository's existing locally bundled renderer and license.

Newsreader Variable and DM Sans Variable are bundled locally via Fontsource npm packages under the SIL Open Font License 1.1. Their licenses are preserved in `licenses/`. No external font requests are needed.
