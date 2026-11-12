# Dashboard artwork provenance

The user supplied a GemuKore dashboard PNG on 2026-11-11 and explicitly requested that the application match it. The unedited source is retained at `public/images/dashboard/reference-art.png`. CSS in `src/app/workspace.css` clips its right-hand hero illustration for decorative use in the private dashboard. The sample username, counts, labels and controls are outside the displayed crop. The file is a static visual source, not private collection media or approved public catalog artwork. It is not used by public collection queries.

An attempted built-in image-generation request for a separate retro hero illustration was rejected by the image service; no generated image was retained or referenced. No CLI/API fallback was used.

The miniature controller, cartridge and handheld category symbols are authored SVG UI illustrations in `src/features/dashboard/components/hardware-art.tsx`. Their purpose is category navigation, not hardware identification or collection data.

The self-hosted pixel font and its license are documented in `src/app/fonts/README.md`.
