import type { MermaidConfig } from 'mermaid'

type ThemeVariables = NonNullable<MermaidConfig['themeVariables']>

/**
 * The `surface*` / `surfacePeer*` overrides (block / C4 diagrams). All five
 * depth levels share the cluster surface/border tokens.
 */
const surfaceTokens = (): Record<string, string> =>
  Object.fromEntries(
    Array.from({ length: 5 }, (_, i) => [
      [`surface${i}`, 'surface-background-color'],
      [`surfacePeer${i}`, 'surface-border-color']
    ]).flat()
  )

/**
 * Mermaid `themeVariables` key → Inkdrop `--mermaid-*` token (the suffix after
 * `--mermaid-`). Every Mermaid colour we drive has its own explicit token; the
 * tokens themselves cascade from a handful of base ones in
 * `@inkdropapp/css/mermaid.css` (e.g. `--mermaid-actor-background-color`
 * defaults to `var(--mermaid-node-background-color)`), so a theme can override
 * one surface or a whole family.
 *
 * Each token is resolved to a concrete colour at render time (see
 * {@link buildInkdropThemeVariables}), so diagrams follow the active theme —
 * light/dark via `light-dark()` in `mermaid.css`.
 */
const tokens: Record<string, string> = {
  // --- Canvas / general ---
  background: 'background-color',
  textColor: 'text-color',
  titleColor: 'title-color',
  lineColor: 'line-color',
  arrowheadColor: 'arrowhead-color',
  defaultLinkColor: 'default-link-color',

  // --- Flowchart / generic nodes ---
  mainBkg: 'node-background-color',
  nodeBorder: 'node-border-color',
  nodeTextColor: 'node-text-color',
  labelColor: 'label-color',
  border2: 'secondary-border-color',
  clusterBkg: 'cluster-background-color',
  clusterBorder: 'cluster-border-color',
  edgeLabelBackground: 'edge-label-background-color',
  ...surfaceTokens(),

  // --- Entity-relationship rows / attributes / relations ---
  rowOdd: 'row-odd-background-color',
  rowEven: 'row-even-background-color',
  attributeBackgroundColorOdd: 'attribute-odd-background-color',
  attributeBackgroundColorEven: 'attribute-even-background-color',
  relationColor: 'relation-color',
  relationLabelColor: 'relation-label-color',
  relationLabelBackground: 'relation-label-background-color',

  // --- Sequence ---
  actorBkg: 'actor-background-color',
  actorBorder: 'actor-border-color',
  actorTextColor: 'actor-text-color',
  actorLineColor: 'actor-line-color',
  signalColor: 'signal-color',
  signalTextColor: 'signal-text-color',
  labelBoxBkgColor: 'label-box-background-color',
  labelBoxBorderColor: 'label-box-border-color',
  labelTextColor: 'label-text-color',
  loopTextColor: 'loop-text-color',
  activationBkgColor: 'activation-background-color',
  activationBorderColor: 'activation-border-color',
  sequenceNumberColor: 'sequence-number-color',
  noteBkgColor: 'note-background-color',
  noteBorderColor: 'note-border-color',
  noteTextColor: 'note-text-color',

  // --- Class ---
  classText: 'class-text-color',

  // --- State ---
  stateBkg: 'state-background-color',
  stateBorder: 'state-border-color',
  stateLabelColor: 'state-label-color',
  transitionColor: 'transition-color',
  transitionLabelColor: 'transition-label-color',
  specialStateColor: 'special-state-color',
  compositeBackground: 'composite-background-color',
  compositeTitleBackground: 'composite-title-background-color',
  compositeBorder: 'composite-border-color',
  altBackground: 'alt-background-color',
  innerEndBackground: 'inner-end-background-color',

  // --- Gantt ---
  sectionBkgColor: 'section-background-color',
  sectionBkgColor2: 'alt-section-background-color',
  altSectionBkgColor: 'alt-section-background-color',
  excludeBkgColor: 'exclude-background-color',
  taskBkgColor: 'task-background-color',
  taskBorderColor: 'task-border-color',
  taskTextColor: 'task-text-color',
  taskTextLightColor: 'task-text-light-color',
  taskTextDarkColor: 'task-text-dark-color',
  taskTextOutsideColor: 'task-text-outside-color',
  taskTextClickableColor: 'task-text-clickable-color',
  activeTaskBkgColor: 'active-task-background-color',
  activeTaskBorderColor: 'active-task-border-color',
  doneTaskBkgColor: 'done-task-background-color',
  doneTaskBorderColor: 'done-task-border-color',
  critBkgColor: 'crit-task-background-color',
  critBorderColor: 'crit-task-border-color',
  gridColor: 'grid-color',
  todayLineColor: 'today-line-color',

  // --- Seed palette: drives Mermaid's categorical scales (pie / git / quadrant) ---
  primaryColor: 'primary-color',
  secondaryColor: 'secondary-color',
  tertiaryColor: 'tertiary-color',
  primaryTextColor: 'primary-text-color',
  quadrant1Fill: 'quadrant-1-background-color'
}

/**
 * Build Mermaid's `themeVariables` for the built-in `inkdrop` theme.
 *
 * Mermaid's `base` theme runs colours through **khroma**, which throws on a raw
 * `var()`. Rather than patch khroma, we hand it concrete colours: every
 * `--mermaid-*` token is resolved to an `rgb(...)` value by `resolve` (see
 * `resolveInkdropThemeVariables` in `utils.ts`) at render time. That includes
 * the seed palette, so even the categorical scales (pie / git / quadrant) that
 * Mermaid derives from `primaryColor`/`secondaryColor`/`tertiaryColor` follow
 * the active theme.
 *
 * @param resolve - Maps a `--mermaid-*` token (the suffix after `--mermaid-`) to
 *   the concrete colour the active theme paints it, e.g.
 *   `'node-background-color'` → `'rgb(...)'`.
 * @returns A `themeVariables` map of resolved colours.
 */
export const buildInkdropThemeVariables = (resolve: (token: string) => string): ThemeVariables =>
  Object.fromEntries(Object.entries(tokens).map(([key, token]) => [key, resolve(token)]))
