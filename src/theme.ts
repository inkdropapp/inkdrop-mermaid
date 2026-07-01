import type { MermaidConfig } from 'mermaid'

type ThemeVariables = NonNullable<MermaidConfig['themeVariables']>

/**
 * Fixed hex "seeds" for Mermaid's categorical scales (`cScale*` / `git*` /
 * `pie*` / `quadrant*`). These are a designed multi-hue palette, never themed:
 * those scales read better as a stable set than as shades of one themed colour.
 * They are only khroma fuel — never painted directly as a themeable surface.
 */
const seeds: ThemeVariables = {
  primaryColor: '#e2e8f0',
  secondaryColor: '#cbd5e1',
  tertiaryColor: '#f1f5f9',
  primaryTextColor: '#1e293b',
  quadrant1Fill: '#e2e8f0'
}

/**
 * The `surface*` / `surfacePeer*` overrides (block / C4 diagrams). Listed
 * explicitly so each surface is a flat themed colour rather than a khroma
 * derivation of `mainBkg`.
 */
const surfaceTokens = (): Record<string, string> =>
  Object.fromEntries(
    Array.from({ length: 5 }, (_, i) => [
      [`surface${i}`, 'cluster-bg'],
      [`surfacePeer${i}`, 'cluster-border']
    ]).flat()
  )

/**
 * Mermaid `themeVariables` key → Inkdrop `--mermaid-*` token. Every entry is
 * resolved to a concrete colour at render time (see {@link buildInkdropThemeVariables}),
 * so diagrams follow the active theme — including light/dark, which is expressed
 * with `light-dark()` in `@inkdropapp/css/mermaid.css`.
 */
const tokens: Record<string, string> = {
  // --- Canvas / general ---
  background: 'bg',
  textColor: 'text',
  titleColor: 'title',
  lineColor: 'line',
  arrowheadColor: 'line',

  // --- Flowchart / generic nodes ---
  mainBkg: 'node-bg',
  nodeBorder: 'node-border',
  nodeTextColor: 'node-text',
  border2: 'cluster-border',
  clusterBkg: 'cluster-bg',
  clusterBorder: 'cluster-border',
  defaultLinkColor: 'line',
  edgeLabelBackground: 'edge-label-bg',
  labelColor: 'node-text',
  rowOdd: 'node-bg',
  rowEven: 'cluster-bg',
  attributeBackgroundColorOdd: 'node-bg',
  attributeBackgroundColorEven: 'cluster-bg',
  ...surfaceTokens(),

  // --- Sequence ---
  actorBkg: 'node-bg',
  actorBorder: 'node-border',
  actorTextColor: 'node-text',
  actorLineColor: 'line',
  signalColor: 'line',
  signalTextColor: 'text',
  labelBoxBkgColor: 'node-bg',
  labelBoxBorderColor: 'node-border',
  labelTextColor: 'text',
  loopTextColor: 'text',
  activationBkgColor: 'node-bg',
  activationBorderColor: 'node-border',
  noteBkgColor: 'note-bg',
  noteBorderColor: 'note-border',
  noteTextColor: 'note-text',

  // --- Class ---
  classText: 'node-text',

  // --- State ---
  stateBkg: 'node-bg',
  stateBorder: 'node-border',
  stateLabelColor: 'node-text',
  transitionColor: 'line',
  transitionLabelColor: 'text',
  specialStateColor: 'line',
  compositeBackground: 'cluster-bg',
  compositeTitleBackground: 'cluster-bg',
  compositeBorder: 'cluster-border',
  altBackground: 'cluster-bg',
  innerEndBackground: 'node-border',

  // --- Entity-relationship ---
  relationColor: 'line',
  relationLabelColor: 'text',
  relationLabelBackground: 'edge-label-bg',

  // --- Gantt ---
  sectionBkgColor: 'section-bg',
  sectionBkgColor2: 'section-bg-alt',
  altSectionBkgColor: 'section-bg-alt',
  excludeBkgColor: 'section-bg-alt',
  taskBkgColor: 'task-bg',
  taskBorderColor: 'task-border',
  taskTextColor: 'task-text',
  taskTextLightColor: 'task-text',
  taskTextDarkColor: 'task-text',
  taskTextOutsideColor: 'text',
  taskTextClickableColor: 'task-text',
  activeTaskBkgColor: 'task-active-bg',
  activeTaskBorderColor: 'task-active-border',
  doneTaskBkgColor: 'task-done-bg',
  doneTaskBorderColor: 'task-done-border',
  critBkgColor: 'task-crit-bg',
  critBorderColor: 'task-crit-border',
  gridColor: 'grid',
  todayLineColor: 'today'
}

/**
 * Build Mermaid's `themeVariables` for the built-in `inkdrop` theme.
 *
 * Mermaid's `base` theme runs colours through **khroma**, which throws on a raw
 * `var()`. Rather than patch khroma, we hand it concrete colours: every
 * `--mermaid-*` token is resolved to an `rgb(...)` value by `resolve` (see
 * `resolveInkdropThemeVariables` in `utils.ts`) at render time, so the result
 * reflects the active theme (light/dark included) yet is plain colour data
 * Mermaid can derive from safely.
 *
 * @param resolve - Maps a `--mermaid-*` token (without the prefix) to the
 *   concrete colour the active theme paints it, e.g. `'node-bg'` → `'rgb(...)'`.
 * @returns A `themeVariables` map: the fixed hex {@link seeds} plus the resolved
 *   `var()` leaves.
 */
export const buildInkdropThemeVariables = (resolve: (token: string) => string): ThemeVariables => ({
  ...seeds,
  ...Object.fromEntries(Object.entries(tokens).map(([key, token]) => [key, resolve(token)])),
  radius: 3
})
