# Token Catalog

> Auto-generated from build output. Do not edit manually.
> Generated: 2026-02-08

## Primitives

### border (8 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| borderStyle.dashed | strokeStyle | `dashed` | Dashed border style. Use for: drop zones, placeholder elements, 'add new' areas, temporary states, grouping without con… |
| borderStyle.dotted | strokeStyle | `dotted` | Dotted border style. Use for: decorative elements, subtle separators, accessibility focus alternatives, lightweight bou… |
| borderStyle.none | strokeStyle | `none` | No border style. Use for: removing inherited borders, clean/minimal designs, when using other separation methods. CSS k… |
| borderStyle.solid | strokeStyle | `solid` | Solid border style. DEFAULT for all standard borders. Use for: inputs, cards, buttons, tables, containers. Continuous l… |
| borderWidth.medium | borderWidth | `2px` | Medium border (2px). Use for: emphasis, active/selected states, focus indicators, section dividers. More prominent than… |
| borderWidth.none | borderWidth | `0` | No border (0px). Use for: removing inherited borders, borderless variants, flat designs. CSS: border-width: 0; Common i… |
| borderWidth.thick | borderWidth | `4px` | Thick border (4px). Use for: strong emphasis, decorative elements, major section dividers, brand accents. Very prominen… |
| borderWidth.thin | borderWidth | `1px` | Thin border (1px). DEFAULT for most UI borders. Use for: input fields, cards, tables, subtle containment, dividers. Pro… |

### breakpoints (7 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| breakpoints.lg | sizing | `75em` | Large breakpoint (1200px). Use for: large laptops, standard desktop monitors. Generous space available. Typical changes… |
| breakpoints.md | sizing | `62em` | Medium breakpoint (992px). Use for: tablets in landscape, standard laptops, small desktops. Full desktop layouts are co… |
| breakpoints.sm | sizing | `48em` | Small breakpoint (768px). Use for: tablets in portrait, small laptops. Two-column layouts become comfortable. Typical c… |
| breakpoints.xl | sizing | `88em` | Extra large breakpoint (1408px). Use for: large desktop monitors, high-resolution displays. Maximum layouts. Typical ch… |
| breakpoints.xs | sizing | `36em` | Extra small breakpoint (576px). Use for: large phones in landscape, small tablets. Content starts having room to breath… |
| contentWidth.lg | sizing | `80em` | Large content width (1280px). Use for: full application layouts, dashboards, data-heavy interfaces. Maximum comfortable… |
| contentWidth.sm | sizing | `37.5em` | Small content width (600px). Use for: prose content, documentation, blog posts, reading-focused layouts. Optimal line l… |

### color (150 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| color.alpha.error | color | `rgba(207, 39, 32, 0.15)` | Error state semi-transparent background (15% red) |
| color.alpha.info | color | `rgba(9, 116, 235, 0.15)` | Info state semi-transparent background (15% blue) |
| color.alpha.selected | color | `rgba(9, 116, 235, 0.2)` | Selected state semi-transparent background (20% blue) |
| color.alpha.success | color | `rgba(29, 148, 72, 0.15)` | Success state semi-transparent background (15% green) |
| color.alpha.warning | color | `rgba(218, 167, 17, 0.15)` | Warning state semi-transparent background (15% yellow) |
| color.black | color | `#000000` | Pure black. Use for: dark theme text emphasis, high-contrast borders. Contrast ratio with white: 21:1 (WCAG AAA). Rarel… |
| color.blue.0 | color | `#eaf3fe` | Lightest blue - primary light backgrounds, selected row highlights |
| color.blue.1 | color | `#cfe3fc` | Light blue - hover backgrounds, info alert backgrounds |
| color.blue.2 | color | `#9fc8fa` | Mid-light blue - progress bars, decorative |
| color.blue.3 | color | `#6eacf6` | Medium blue - icons on light backgrounds |
| color.blue.4 | color | `#3c90f1` | Mid blue - primary buttons on dark theme, links on dark |
| color.blue.5 | color | `#0974eb` | Base blue - primary buttons, links (light theme) |
| color.blue.6 | color | `#0760c6` | Dark blue - primary brand color, main CTAs, navigation active states |
| color.blue.7 | color | `#064a98` | Darker blue - pressed states, text on light blue backgrounds |
| color.blue.8 | color | `#04356c` | Very dark blue - high contrast text |
| color.blue.9 | color | `#032142` | Darkest blue - maximum emphasis, dark accents |
| color.cyan.0 | color | `#e5f6fa` | Lightest cyan - info backgrounds |
| color.cyan.1 | color | `#c5eaf3` | Light cyan - hover states |
| color.cyan.2 | color | `#8cd6e7` | Mid-light cyan - decorative |
| color.cyan.3 | color | `#52c1da` | Medium cyan - icons |
| color.cyan.4 | color | `#17accc` | Mid cyan - interactive elements |
| color.cyan.5 | color | `#0d95b3` | Base cyan - primary applications |
| color.cyan.6 | color | `#0b7d96` | Dark cyan - text on light backgrounds |
| color.cyan.7 | color | `#086073` | Darker cyan - high contrast |
| color.cyan.8 | color | `#064552` | Very dark cyan - text |
| color.cyan.9 | color | `#042b33` | Darkest cyan - maximum emphasis |
| color.dark.0 | color | `#d5d7d9` | Lightest dark - text color on dark backgrounds, disabled states on dark theme |
| color.dark.1 | color | `#b4b7bb` | Light dark - secondary text on dark theme, subtle borders |
| color.dark.2 | color | `#93979c` | Mid-light dark - placeholder text on dark theme, icons |
| color.dark.3 | color | `#74787e` | Medium dark - dimmed text, decorative elements |
| color.dark.4 | color | `#565b61` | Mid dark - borders on dark theme, dividers |
| color.dark.5 | color | `#3a3f46` | Base dark - elevated surfaces on dark theme, cards |
| color.dark.6 | color | `#21262d` | Dark base - primary dark theme background, app shells |
| color.dark.7 | color | `#181c22` | Darker - alternative dark background, sidebar backgrounds |
| color.dark.8 | color | `#13161b` | Very dark - modal overlays on dark theme, deep shadows |
| color.dark.9 | color | `#0e1014` | Darkest - near-black for maximum contrast elements |
| color.grape.0 | color | `#fbeff9` | Lightest grape - premium feature backgrounds |
| color.grape.1 | color | `#f5d9f1` | Light grape - hover states |
| color.grape.2 | color | `#ebb3e3` | Mid-light grape - decorative elements |
| color.grape.3 | color | `#df8bd3` | Medium grape - icons, illustrations |
| color.grape.4 | color | `#d262c2` | Mid grape - interactive accents |
| color.grape.5 | color | `#c338b0` | Base grape - primary grape applications |
| color.grape.6 | color | `#a22993` | Dark grape - text on light grape backgrounds |
| color.grape.7 | color | `#7c2071` | Darker grape - high contrast |
| color.grape.8 | color | `#581750` | Very dark grape - text applications |
| color.grape.9 | color | `#370e32` | Darkest grape - maximum emphasis |
| color.gray.0 | color | `#f3f4f5` | Lightest gray - subtle backgrounds, hover states on white, zebra striping |
| color.gray.1 | color | `#e4e6e8` | Light gray - input backgrounds, disabled backgrounds, table headers |
| color.gray.2 | color | `#c8cbce` | Mid-light gray - borders, dividers, inactive tabs |
| color.gray.3 | color | `#adb1b5` | Medium gray - placeholder text (use carefully - check contrast), icons |
| color.gray.4 | color | `#92979d` | Mid gray - secondary icons, chart gridlines |
| color.gray.5 | color | `#787e85` | Base gray - dimmed text, help text (4.5:1 on white = AA) |
| color.gray.6 | color | `#5f656d` | Dark gray - secondary text (7:1 on white = AAA), labels |
| color.gray.7 | color | `#474d55` | Darker gray - primary text alternative, emphasis |
| color.gray.8 | color | `#31363d` | Very dark gray - high-emphasis text on light backgrounds |
| color.gray.9 | color | `#1c2026` | Darkest gray - headings, maximum emphasis text |
| color.green.0 | color | `#e7f6ec` | Lightest green - success alert backgrounds, positive feedback areas |
| color.green.1 | color | `#c9ead4` | Light green - hover state for success backgrounds |
| color.green.2 | color | `#94d6aa` | Mid-light green - progress indicators, completion bars |
| color.green.3 | color | `#5fc180` | Medium green - success icons on light backgrounds |
| color.green.4 | color | `#2aab58` | Mid green - success badges, online indicators |
| color.green.5 | color | `#1d9448` | Base green - primary success buttons, checkmarks |
| color.green.6 | color | `#187c3c` | Dark green - success text on white (5:1 contrast = AA) |
| color.green.7 | color | `#125f2e` | Darker green - success text with maximum contrast |
| color.green.8 | color | `#0d4421` | Very dark green - text on light green backgrounds |
| color.green.9 | color | `#082a15` | Darkest green - extreme emphasis |
| color.indigo.0 | color | `#f0f2fe` | Lightest indigo - subtle backgrounds |
| color.indigo.1 | color | `#dce0fc` | Light indigo - hover states |
| color.indigo.2 | color | `#b9c2f9` | Mid-light indigo - decorative |
| color.indigo.3 | color | `#96a3f5` | Medium indigo - icons |
| color.indigo.4 | color | `#7284f0` | Mid indigo - interactive elements |
| color.indigo.5 | color | `#4e65ea` | Base indigo - primary applications |
| color.indigo.6 | color | `#364fd0` | Dark indigo - text on light backgrounds |
| color.indigo.7 | color | `#2a3da0` | Darker indigo - high contrast |
| color.indigo.8 | color | `#1e2c72` | Very dark indigo - text |
| color.indigo.9 | color | `#ff6600` | Darkest indigo - maximum emphasis 131c47 |
| color.lime.0 | color | `#eef6dc` | Lightest lime - subtle backgrounds |
| color.lime.1 | color | `#daedb4` | Light lime - hover states |
| color.lime.2 | color | `#b6db6e` | Mid-light lime - decorative |
| color.lime.3 | color | `#93c82d` | Medium lime - icons, highlights |
| color.lime.4 | color | `#7eb11c` | Mid lime - interactive elements |
| color.lime.5 | color | `#6d9918` | Base lime - primary applications |
| color.lime.6 | color | `#5b8014` | Dark lime - text on light backgrounds |
| color.lime.7 | color | `#466210` | Darker lime - high contrast |
| color.lime.8 | color | `#32460b` | Very dark lime - text |
| color.lime.9 | color | `#1f2b07` | Darkest lime - maximum emphasis |
| color.orange.0 | color | `#fef1e6` | Lightest orange - promotional backgrounds |
| color.orange.1 | color | `#fcddc6` | Light orange - hover states |
| color.orange.2 | color | `#f9bb8f` | Mid-light orange - decorative |
| color.orange.3 | color | `#f49857` | Medium orange - icons, highlights |
| color.orange.4 | color | `#ed7621` | Mid orange - interactive elements |
| color.orange.5 | color | `#d2620f` | Base orange - primary applications |
| color.orange.6 | color | `#af520c` | Dark orange - text on light backgrounds |
| color.orange.7 | color | `#873f0a` | Darker orange - high contrast |
| color.orange.8 | color | `#612d07` | Very dark orange - text |
| color.orange.9 | color | `#3c1c04` | Darkest orange - maximum emphasis |
| color.overlay.dark | color | `rgba(0, 0, 0, 0.75)` | Dark theme overlay (75% opacity). Use for: modal backdrops on dark backgrounds, higher contrast overlays. |
| color.overlay.light | color | `rgba(0, 0, 0, 0.5)` | Light theme overlay (50% opacity). Use for: modal backdrops, drawer overlays on light backgrounds. |
| color.pink.0 | color | `#fdeef5` | Lightest pink - subtle highlights, badge backgrounds |
| color.pink.1 | color | `#fad7e7` | Light pink - hover states, selected rows |
| color.pink.2 | color | `#f5afcf` | Mid-light pink - decorative borders |
| color.pink.3 | color | `#ee85b5` | Medium pink - icons, illustrations |
| color.pink.4 | color | `#e55a9b` | Mid pink - interactive elements |
| color.pink.5 | color | `#da2d80` | Base pink - primary accent applications |
| color.pink.6 | color | `#b91f69` | Dark pink - text on light pink backgrounds (AA compliant) |
| color.pink.7 | color | `#8e1851` | Darker pink - high contrast applications |
| color.pink.8 | color | `#65113a` | Very dark pink - text on light backgrounds |
| color.pink.9 | color | `#3f0b24` | Darkest pink - maximum emphasis |
| color.red.0 | color | `#fef1f0` | Lightest red - error alert backgrounds, validation field backgrounds |
| color.red.1 | color | `#fcdcda` | Light red - hover state for error backgrounds |
| color.red.2 | color | `#f9b8b4` | Mid-light red - progress indicators, decorative |
| color.red.3 | color | `#f4928c` | Medium red - icons on error backgrounds |
| color.red.4 | color | `#ed6a63` | Mid red - error icons on white backgrounds |
| color.red.5 | color | `#e5413a` | Base red - primary destructive buttons, critical alerts |
| color.red.6 | color | `#cf2720` | Dark red - error text on white (6:1 contrast = AA), danger buttons |
| color.red.7 | color | `#a01d18` | Darker red - error text with maximum contrast (8:1 = AAA) |
| color.red.8 | color | `#731511` | Very dark red - text on light red backgrounds |
| color.red.9 | color | `#480d0b` | Darkest red - reserved for extreme emphasis |
| color.teal.0 | color | `#e3f7f3` | Lightest teal - subtle success backgrounds |
| color.teal.1 | color | `#c0ede4` | Light teal - hover states |
| color.teal.2 | color | `#83dcc9` | Mid-light teal - decorative |
| color.teal.3 | color | `#46caae` | Medium teal - icons |
| color.teal.4 | color | `#10b794` | Mid teal - interactive elements |
| color.teal.5 | color | `#0e9e80` | Base teal - primary applications |
| color.teal.6 | color | `#0c846b` | Dark teal - text on light backgrounds |
| color.teal.7 | color | `#096552` | Darker teal - high contrast |
| color.teal.8 | color | `#06483b` | Very dark teal - text |
| color.teal.9 | color | `#042d25` | Darkest teal - maximum emphasis |
| color.transparent | color | `transparent` | Fully transparent. Use for: invisible interactive areas, overlay starting states, clearfix backgrounds. CSS keyword val… |
| color.violet.0 | color | `#f5f1fd` | Lightest violet - feature highlight backgrounds |
| color.violet.1 | color | `#e6dcfa` | Light violet - hover states |
| color.violet.2 | color | `#cdb9f5` | Mid-light violet - decorative |
| color.violet.3 | color | `#b396ef` | Medium violet - icons |
| color.violet.4 | color | `#9872e8` | Mid violet - interactive elements |
| color.violet.5 | color | `#7c4ee0` | Base violet - primary applications |
| color.violet.6 | color | `#6536c7` | Dark violet - text on light backgrounds |
| color.violet.7 | color | `#4e2a99` | Darker violet - high contrast |
| color.violet.8 | color | `#381e6d` | Very dark violet - text |
| color.violet.9 | color | `#231344` | Darkest violet - maximum emphasis |
| color.white | color | `#ffffff` | Pure white. Use for: light theme backgrounds, text on dark backgrounds, card surfaces. Contrast ratio with black: 21:1 … |
| color.yellow.0 | color | `#fef6dc` | Lightest yellow - warning backgrounds (must use dark text) |
| color.yellow.1 | color | `#fceab3` | Light yellow - hover state for warning backgrounds |
| color.yellow.2 | color | `#f9d56a` | Mid-light yellow - caution icons with dark stroke |
| color.yellow.3 | color | `#f5c023` | Medium yellow - warning badges (ensure dark text) |
| color.yellow.4 | color | `#daa711` | Mid yellow - decorative, charts |
| color.yellow.5 | color | `#bc900f` | Base yellow - rarely used for text |
| color.yellow.6 | color | `#9d780c` | Dark yellow - minimum for text (check contrast) |
| color.yellow.7 | color | `#795c0a` | Darker yellow - warning text on light backgrounds (4.5:1) |
| color.yellow.8 | color | `#564207` | Very dark yellow - safe for body text on white |
| color.yellow.9 | color | `#352904` | Darkest yellow - high contrast text |

### focus (3 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| focus.ring.color | color | `{color.blue.5}` | Focus ring color (primary blue). High-visibility color that works on most backgrounds. Reference to color.blue.5 for co… |
| focus.ring.offset | dimension | `2px` | Focus ring offset from element (2px). Creates gap between element and focus ring for clarity. Use for: outline-offset p… |
| focus.ring.width | dimension | `3px` | Focus ring width (3px). Thick enough to be clearly visible per WCAG 2.4.11 (Focus Appearance). Use for: outline-width p… |

### motion (11 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| motion.duration.fast | duration | `100ms` | Fast transitions (100ms). Use for: micro-interactions, hover states, button presses, checkbox toggles, small element tr… |
| motion.duration.instant | duration | `0ms` | Instant/no duration (0ms). Use for: prefers-reduced-motion fallback, immediate state changes, disabled animations, no-t… |
| motion.duration.normal | duration | `200ms` | Normal transitions (200ms). DEFAULT duration for most UI transitions. Use for: dropdown menus, tooltips, tab switches, … |
| motion.duration.slow | duration | `300ms` | Slow transitions (300ms). Use for: larger element transitions, slide-in panels, accordion expansions, page section reve… |
| motion.duration.slower | duration | `500ms` | Slower transitions (500ms). MAXIMUM recommended duration. Use for: full-page transitions, dramatic reveals, onboarding … |
| motion.easing.ease | cubicBezier | `dropShadow:; dropShadow:; dropShadow:; dropShadow:` | Standard ease curve - CSS default. Quick start, gradual slow-down. Use for: general-purpose transitions when specific e… |
| motion.easing.easeIn | cubicBezier | `dropShadow:; dropShadow:; dropShadow:; dropShadow:` | Ease in - starts slow, accelerates. CSS: ease-in. Use for: elements LEAVING the screen, dismissals, fade-outs, exits. C… |
| motion.easing.easeInOut | cubicBezier | `dropShadow:; dropShadow:; dropShadow:; dropShadow:` | Ease in and out - slow start, fast middle, slow end. CSS: ease-in-out. Use for: elements transforming in place, positio… |
| motion.easing.easeOut | cubicBezier | `dropShadow:; dropShadow:; dropShadow:; dropShadow:` | Ease out - starts fast, decelerates. CSS: ease-out. RECOMMENDED for most UI transitions. Use for: elements ENTERING the… |
| motion.easing.emphasized | cubicBezier | `dropShadow:; dropShadow:; dropShadow:; dropShadow:` | Emphasized deceleration - quick start, strong deceleration. Custom Material-inspired curve. Use for: attention-grabbing… |
| motion.easing.linear | cubicBezier | `dropShadow:; dropShadow:; dropShadow:; dropShadow:` | Linear easing - constant speed, no acceleration. CSS: linear. Use for: progress bars, looping animations, continuous sc… |

### opacity (16 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| opacity.0 | opacity | `0` | Fully transparent (0%). Use for: hidden elements, animation start states, invisible interactive areas. Element is invis… |
| opacity.10 | opacity | `0.1` | 10% opacity - subtle transparency. Use for: light hover backgrounds, subtle shadows, faint overlays. Minimally percepti… |
| opacity.100 | opacity | `1` | Fully opaque (100%). Use for: solid elements, removing inherited transparency, default element state. CSS: opacity: 1; … |
| opacity.20 | opacity | `0.2` | 20% opacity - light transparency. Use for: hover states, light overlays, muted backgrounds. Noticeable but unobtrusive. |
| opacity.25 | opacity | `0.25` | 25% opacity - quarter visible. Use for: skeleton loading states, light dimming, subtle backgrounds. Common for placehol… |
| opacity.30 | opacity | `0.3` | 30% opacity - moderate transparency. Use for: image overlays, text shadows, moderate dimming. Visible but allows conten… |
| opacity.40 | opacity | `0.4` | 40% opacity - semi-transparent. Use for: medium overlays, watermarks, partially hidden content. Balanced visibility. |
| opacity.5 | opacity | `0.05` | 5% opacity - barely visible. Use for: extremely subtle hover states, ghost backgrounds, near-invisible separators. Only… |
| opacity.50 | opacity | `0.5` | 50% opacity - half visible. Use for: disabled elements (semantic alias: 'disabled'), balanced overlays, de-emphasized c… |
| opacity.60 | opacity | `0.6` | 60% opacity - mostly visible. Use for: modal backdrops (semantic alias: 'overlay'), dimmed backgrounds, focus-drawing o… |
| opacity.70 | opacity | `0.7` | 70% opacity - high visibility. Use for: heavy overlays, strong dimming, de-emphasized backgrounds. Most content visible… |
| opacity.75 | opacity | `0.75` | 75% opacity - three-quarters visible. Use for: dark overlays, strong backgrounds, significant dimming. Mostly solid wit… |
| opacity.80 | opacity | `0.8` | 80% opacity - mostly solid. Use for: nearly-opaque overlays, frosted glass effects (with backdrop-filter), heavy backgr… |
| opacity.90 | opacity | `0.9` | 90% opacity - nearly solid. Use for: subtle transparency effects, slight see-through, glass-like surfaces. Almost indis… |
| opacity.disabled | opacity | `0.5` | Disabled element opacity (50%). SEMANTIC alias for opacity.50. Use for: disabled buttons, inactive controls, unavailabl… |
| opacity.overlay | opacity | `0.6` | Modal overlay opacity (60%). SEMANTIC alias for opacity.60. Use for: modal backdrops, lightbox backgrounds, focus-drawi… |

### radius (7 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| radius.default | borderRadius | `{radius.sm}` | Default border radius when no size is specified. References radius.sm (4px) as a safe default for most components. Use … |
| radius.full | borderRadius | `9999px` | Full/pill radius (circular). Use for: avatar circles, round buttons, pill-shaped tags, circular indicators, FABs. Creat… |
| radius.lg | borderRadius | `1rem` | Large radius (16px). Use for: hero cards, featured content, marketing components, prominent UI elements. Noticeably rou… |
| radius.md | borderRadius | `0.5rem` | Medium radius (8px). Use for: cards, modals, dialogs, larger containers, image thumbnails, panels. Creates friendly, ap… |
| radius.sm | borderRadius | `0.25rem` | Small radius (4px). DEFAULT for small components. Use for: buttons, inputs, dropdowns, tooltips, small cards, table cel… |
| radius.xl | borderRadius | `2rem` | Extra large radius (32px). Use for: hero sections, large promotional elements, artistic layouts, very large cards. Sign… |
| radius.xs | borderRadius | `0.125rem` | Extra small radius (2px). Use for: small badges, tags, inline code blocks, tiny indicators, nested elements inside sm-r… |

### shadow (8 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| boxShadow.footer | boxShadow | `dropShadow: 0 -0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 -0.625r…` | Footer shadow - upward-casting shadow for fixed footers. Use for: sticky footers, bottom navigation bars, action bars a… |
| boxShadow.inset | boxShadow | `innerShadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.1)` | Inset shadow - pressed/recessed appearance. Use for: pressed button states, input:focus, toggle switches (off state), e… |
| boxShadow.lg | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 1.75rem …` | Large shadow - high elevation (16-24dp). Use for: dialogs, modals, drawers, notification toasts, temporary UI surfaces.… |
| boxShadow.md | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 1.25rem …` | Medium shadow - moderate elevation (8-12dp). DEFAULT for floating elements. Use for: dropdown menus, popovers, tooltips… |
| boxShadow.none | boxShadow | `none` | No shadow - flat appearance. Use for: flat design elements, removing inherited shadows, elements that should appear flu… |
| boxShadow.sm | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 0.625rem…` | Small shadow - low elevation (4-6dp). Use for: card hover states, raised buttons, navigation elements, slightly promine… |
| boxShadow.xl | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 2.25rem …` | Extra large shadow - maximum elevation (24dp+). Use for: critical modals, full-screen overlays, maximum prominence elem… |
| boxShadow.xs | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 0.0625re…` | Extra small shadow - minimal elevation (1-2dp). Use for: subtle depth on cards at rest, input fields, low-emphasis cont… |

### sizing (76 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| sizing.alert.closeButtonSize | sizing | `1.125rem` | Close button size |
| sizing.alert.iconSize | sizing | `1.25rem` | Alert icon size |
| sizing.badge.fontSize.lg | sizing | `0.75rem` | Large badge font size (12px) |
| sizing.badge.fontSize.md | sizing | `0.6875rem` | Medium badge font size (11px). DEFAULT. |
| sizing.badge.fontSize.sm | sizing | `0.5625rem` | Small badge font size (9px) |
| sizing.badge.fontSize.xl | sizing | `0.875rem` | Extra large badge font size (14px) |
| sizing.badge.fontSize.xs | sizing | `0.5rem` | Extra small badge font size (8px) |
| sizing.badge.height.lg | sizing | `1.625rem` | Large badge height (26px) |
| sizing.badge.height.md | sizing | `1.25rem` | Medium badge height (20px). DEFAULT. |
| sizing.badge.height.sm | sizing | `1.125rem` | Small badge height (18px) |
| sizing.badge.height.xl | sizing | `2rem` | Extra large badge height (32px) |
| sizing.badge.height.xs | sizing | `1rem` | Extra small badge height (16px) |
| sizing.badge.paddingX.lg | sizing | `0.75rem` | Large horizontal badge padding |
| sizing.badge.paddingX.md | sizing | `0.625rem` | Medium horizontal badge padding. DEFAULT. |
| sizing.badge.paddingX.sm | sizing | `0.5rem` | Small horizontal badge padding |
| sizing.badge.paddingX.xl | sizing | `1rem` | Extra large horizontal badge padding |
| sizing.badge.paddingX.xs | sizing | `0.375rem` | Extra small horizontal badge padding |
| sizing.button.lg | sizing | `3rem` | Large button height (48px). Use for: prominent CTAs, hero sections, touch-optimized UIs. |
| sizing.button.md | sizing | `2.625rem` | Medium button height (42px). DEFAULT size for most buttons. Use for: primary actions, form submits. |
| sizing.button.sm | sizing | `2.25rem` | Small button height (36px). Use for: secondary actions, compact layouts, less prominent CTAs. |
| sizing.button.xl | sizing | `3.75rem` | Extra large button height (60px). Use for: marketing CTAs, high-emphasis actions. |
| sizing.button.xs | sizing | `1.875rem` | Extra small button height (30px). Use for: inline actions, compact toolbars, icon-only buttons. |
| sizing.checkbox.iconSize.lg | sizing | `0.875rem` | Large checkmark size |
| sizing.checkbox.iconSize.md | sizing | `0.625rem` | Medium checkmark size |
| sizing.checkbox.iconSize.sm | sizing | `0.5625rem` | Small checkmark size |
| sizing.checkbox.iconSize.xl | sizing | `1rem` | Extra large checkmark size |
| sizing.checkbox.iconSize.xs | sizing | `0.5rem` | Extra small checkmark size |
| sizing.checkbox.size.lg | sizing | `1.5rem` | Large checkbox size (24px) |
| sizing.checkbox.size.md | sizing | `1.25rem` | Medium checkbox size (20px). DEFAULT. |
| sizing.checkbox.size.sm | sizing | `1rem` | Small checkbox size (16px) |
| sizing.checkbox.size.xl | sizing | `1.75rem` | Extra large checkbox size (28px) |
| sizing.checkbox.size.xs | sizing | `0.875rem` | Extra small checkbox size (14px) |
| sizing.icon.lg | sizing | `1.5rem` | Large icon size (24px). Use for: prominent icons, action icons, toolbar icons. |
| sizing.icon.md | sizing | `1.25rem` | Medium icon size (20px). DEFAULT for most icons. Use for: standalone icons, navigation icons. |
| sizing.icon.sm | sizing | `1rem` | Small icon size (16px). Use for: inline icons, button icons with text, input icons. |
| sizing.icon.xl | sizing | `2rem` | Extra large icon size (32px). Use for: feature icons, empty state illustrations, marketing icons. |
| sizing.icon.xs | sizing | `0.75rem` | Extra small icon size (12px). Use for: inline indicators, badge icons, compact UIs. |
| sizing.input.lg | sizing | `3rem` | Large input height (48px). Use for: prominent inputs, touch-optimized UIs, hero forms. |
| sizing.input.md | sizing | `2.625rem` | Medium input height (42px). DEFAULT size for most inputs. Use for: standard forms, primary data entry. |
| sizing.input.sm | sizing | `2.25rem` | Small input height (36px). Use for: secondary inputs, compact layouts, mobile-optimized forms. |
| sizing.input.xl | sizing | `3.75rem` | Extra large input height (60px). Use for: marketing forms, high-emphasis inputs, accessibility focus. |
| sizing.input.xs | sizing | `1.875rem` | Extra small input height (30px). Use for: compact forms, inline editing, space-constrained UIs. |
| sizing.modal.width.lg | sizing | `45rem` | Large modal width (720px). Use for: complex forms, detail views. |
| sizing.modal.width.md | sizing | `32.5rem` | Medium modal width (520px). DEFAULT for most modals. |
| sizing.modal.width.sm | sizing | `25rem` | Small modal width (400px). Use for: simple dialogs, prompts. |
| sizing.modal.width.xl | sizing | `60rem` | Extra large modal width (960px). Use for: data-heavy content, galleries. |
| sizing.modal.width.xs | sizing | `20rem` | Extra small modal width (320px). Use for: confirmations, alerts. |
| sizing.select.dropdownMaxHeight | sizing | `18.75rem` | Dropdown menu maximum height (300px) |
| sizing.select.iconSize | sizing | `1rem` | Select chevron icon size |
| sizing.switch.thumb.offset | sizing | `0.125rem` | Thumb offset from track edge |
| sizing.switch.thumb.size.lg | sizing | `1.375rem` | Large thumb size (22px) |
| sizing.switch.thumb.size.md | sizing | `1.125rem` | Medium thumb size (18px). DEFAULT. |
| sizing.switch.thumb.size.sm | sizing | `0.875rem` | Small thumb size (14px) |
| sizing.switch.thumb.size.xl | sizing | `1.75rem` | Extra large thumb size (28px) |
| sizing.switch.thumb.size.xs | sizing | `0.75rem` | Extra small thumb size (12px) |
| sizing.switch.track.height.lg | sizing | `1.875rem` | Large track height (30px) |
| sizing.switch.track.height.md | sizing | `1.5rem` | Medium track height (24px). DEFAULT. |
| sizing.switch.track.height.sm | sizing | `1.25rem` | Small track height (20px) |
| sizing.switch.track.height.xl | sizing | `2.25rem` | Extra large track height (36px) |
| sizing.switch.track.height.xs | sizing | `1rem` | Extra small track height (16px) |
| sizing.switch.track.width.lg | sizing | `3.25rem` | Large track width (52px) |
| sizing.switch.track.width.md | sizing | `2.75rem` | Medium track width (44px). DEFAULT. |
| sizing.switch.track.width.sm | sizing | `2.25rem` | Small track width (36px) |
| sizing.switch.track.width.xl | sizing | `3.75rem` | Extra large track width (60px) |
| sizing.switch.track.width.xs | sizing | `1.75rem` | Extra small track width (28px) |
| sizing.table.cellPaddingY.lg | sizing | `0.75rem` | Large vertical cell padding |
| sizing.table.cellPaddingY.md | sizing | `0.5rem` | Medium vertical cell padding. DEFAULT. |
| sizing.table.cellPaddingY.sm | sizing | `0.375rem` | Small vertical cell padding |
| sizing.table.cellPaddingY.xl | sizing | `1rem` | Extra large vertical cell padding |
| sizing.table.cellPaddingY.xs | sizing | `0.25rem` | Extra small vertical cell padding |
| sizing.tabs.height.lg | sizing | `2.5rem` | Large tab height |
| sizing.tabs.height.md | sizing | `2.25rem` | Medium tab height. DEFAULT. |
| sizing.tabs.height.sm | sizing | `2rem` | Small tab height |
| sizing.tabs.height.xl | sizing | `3rem` | Extra large tab height |
| sizing.tabs.height.xs | sizing | `1.75rem` | Extra small tab height |
| sizing.tabs.indicatorHeight | sizing | `0.125rem` | Active tab indicator height (2px) |

### spacing (17 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| gridSpacing.lg | spacing | `32px` | Large grid gap (32px). Use for: spacious card layouts, content grids, marketing pages. Good for layouts with larger car… |
| gridSpacing.md | spacing | `24px` | Medium grid gap (24px). Use for: default content grids, spacious card layouts, comfortable dashboard grids. Balances de… |
| gridSpacing.sm | spacing | `16px` | Small grid gap (16px). Use for: standard card grids, form layouts, compact dashboard grids. Good default for most grid … |
| gridSpacing.xl | spacing | `40px` | Extra large grid gap (40px). Use for: hero grids, feature showcases, landing page layouts. Creates clear separation bet… |
| gridSpacing.xs | spacing | `8px` | Extra small grid gap (8px). Use for: compact card grids, dense dashboard layouts, mobile-optimized grids, icon grids. M… |
| gridSpacing.xxl | spacing | `48px` | Double extra large grid gap (48px). Use for: maximum separation in grids, presentation layouts, sparse artistic layouts… |
| spacing.lg | spacing | `1.25rem` | Large spacing (20px). Use for: generous padding, separation between related groups, dialog/modal padding, card spacing.… |
| spacing.md | spacing | `1rem` | Medium spacing (16px). DEFAULT spacing value. Use for: standard gaps between elements, modal padding, card padding, sec… |
| spacing.sm | spacing | `0.75rem` | Small spacing (12px). Use for: standard component internal padding, form field padding, list item padding, card content… |
| spacing.xl | spacing | `2rem` | Extra large spacing (32px). Use for: major section separation, page-level margins, large component padding, hero sectio… |
| spacing.xs | spacing | `0.625rem` | Extra small spacing (10px). Use for: tight padding in compact components, icon-to-text gaps, inline element spacing, de… |
| verticalRhythm.2xl | spacing | `4.8rem` | Triple baseline (76.8px). Use for: page section breaks, major content area separations, hero-to-content transitions. Ma… |
| verticalRhythm.lg | spacing | `2.4rem` | 1.5 baselines (38.4px). Use for: heading top margins, spacing before new sections within content, emphasis breaks. Crea… |
| verticalRhythm.md | spacing | `1.6rem` | Single baseline (25.6px). DEFAULT prose spacing. Use for: paragraph margins, standard content block spacing, default ve… |
| verticalRhythm.sm | spacing | `0.8rem` | Half baseline (12.8px). Use for: heading bottom margins, spacing after inline elements, paragraph-adjacent element spac… |
| verticalRhythm.xl | spacing | `3.2rem` | Double baseline (51.2px). Use for: major section breaks in prose, chapter-level separations, significant content divisi… |
| verticalRhythm.xs | spacing | `0.4rem` | Quarter baseline (6.4px). Use for: list item spacing within tight lists, line spacing adjustments, micro-spacing in pro… |

### system (7 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| cursor.default |  | `default` | Standard cursor for non-interactive content. Use for text, containers, and static elements. |
| cursor.interactive |  | `pointer` | Cursor for clickable/interactive elements. Use 'pointer' for buttons, links, and actionable items. |
| fontSmoothing.moz |  | `grayscale` | Mozilla font smoothing for Firefox. Use for crisp text rendering in heading and body content. Apply to -moz-osx-font-sm… |
| fontSmoothing.webkit |  | `antialiased` | WebKit font smoothing for macOS/iOS. Use for crisp, thin text in heading and body text. Apply to -webkit-font-smoothing… |
| heading.fontWeight | number | `700` | Default font weight for all headings (h1-h6). Bold (700) provides strong visual hierarchy. |
| heading.textWrap |  | `wrap` | Text wrapping behavior for headings. 'wrap' allows natural line breaks, 'balance' distributes text more evenly. |
| scale | number | `1` | Global scale factor for UI components. 1 = default size, 0.8 = 80% size, 1.2 = 120% size. Affects computed dimensions w… |

### typography (55 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| fontSizes.2xl | fontSizes | `1.375rem` | 2x large font size (22px). Use for: medium headings (h4), component titles, feature headings. Clearly heading-sized but… |
| fontSizes.3xl | fontSizes | `1.625rem` | 3x large font size (26px). Use for: prominent headings (h3), page section titles. Commands attention without overwhelmi… |
| fontSizes.4xl | fontSizes | `2.125rem` | 4x large font size (34px). Use for: major headings (h1-h2), page titles, hero text. Primary visual hierarchy anchor. Co… |
| fontSizes.lg | fontSizes | `1.125rem` | Large font size (18px). Use for: lead paragraphs, emphasized body text, large UI elements, card titles. Slightly larger… |
| fontSizes.md | fontSizes | `1rem` | Medium font size (16px). DEFAULT body text size. Use for: primary body text, paragraphs, form inputs, buttons, main con… |
| fontSizes.sm | fontSizes | `0.875rem` | Small font size (14px). Use for: secondary text, table content, form labels, captions, sidebar content. Comfortable for… |
| fontSizes.xl | fontSizes | `1.25rem` | Extra large font size (20px). Use for: small headings (h5-h6), subtitle text, section labels, prominent UI elements. Br… |
| fontSizes.xs | fontSizes | `0.75rem` | Extra small font size (12px). MINIMUM readable size. Use for: helper text, timestamps, metadata, legal text, footnotes,… |
| fontWeights.bold | fontWeights | `700` | Bold font weight (700). Use for: headings (h1-h3), strong emphasis, critical information, maximum text prominence. Rese… |
| fontWeights.light | fontWeights | `300` | Light font weight (300). Use sparingly for: large display text, hero headlines, artistic/elegant contexts, stylized mar… |
| fontWeights.medium | fontWeights | `500` | Medium font weight (500). Use for: subtle emphasis, navigation items, form labels, table headers, slightly prominent UI… |
| fontWeights.regular | fontWeights | `400` | Regular font weight (400). DEFAULT weight for all body text. Use for: paragraphs, descriptions, general content, form i… |
| fontWeights.semibold | fontWeights | `600` | Semibold font weight (600). Use for: buttons, important labels, card titles, moderate emphasis headings. Strong emphasi… |
| letterSpacing.normal | letterSpacing | `0` | Default letter spacing (0). DEFAULT for all body text and most headings. Let the typeface's natural spacing work. Optim… |
| letterSpacing.tight | letterSpacing | `-0.025em` | Slightly tight tracking (-0.025em). Use for: large headings (h1-h2), medium display text. Subtle tightening that improv… |
| letterSpacing.tighter | letterSpacing | `-0.05em` | Tighter tracking (-0.05em). Use for: very large display text (48px+), hero headlines, logos. Brings characters closer f… |
| letterSpacing.wide | letterSpacing | `0.025em` | Slightly wide tracking (0.025em). Use for: small text (12px or less), captions that need more breathing room. Improves … |
| letterSpacing.wider | letterSpacing | `0.05em` | Wide tracking (0.05em). Use for: small caps, labels, overlines, all-caps text. Prevents all-caps text from feeling cram… |
| letterSpacing.widest | letterSpacing | `0.1em` | Maximum tracking (0.1em). Use for: stylistic emphasis, spaced-out headings, decorative typography. Very pronounced spac… |
| lineHeights.lg | lineHeights | `165%` | Relaxed line height (165%). Use for: longer paragraphs, improved readability, wide content areas, users who need more v… |
| lineHeights.md | lineHeights | `150%` | Normal line height (150%). WCAG MINIMUM for body text. Use for: standard body text, paragraphs, UI descriptions, form i… |
| lineHeights.sm | lineHeights | `135%` | Snug line height (135%). Use for: smaller headings (h3-h6), subheadings, short multi-line text, compact interfaces. Tig… |
| lineHeights.xl | lineHeights | `180%` | Loose line height (180%). Use for: long-form prose, documentation, maximum readability, accessibility accommodations. V… |
| lineHeights.xs | lineHeights | `120%` | Tight line height (120%). Use for: large display headings, hero text, single-line elements, buttons, badges. Text appea… |
| paragraphIndent.none | dimension | `0` | No paragraph indentation. Default for UI text. |
| paragraphSpacing.none | dimension | `0` | No paragraph spacing. Default for UI text. |
| textCase.capitalize | textCase | `capitalize` | Capitalize first letter of each word. Use for: titles, headings. |
| textCase.lowercase | textCase | `lowercase` | All lowercase. Use rarely in UI. |
| textCase.none | textCase | `none` | No text transformation. Default for most text. |
| textCase.uppercase | textCase | `uppercase` | All uppercase. Use for: overlines, labels, buttons (sparingly). |
| textDecoration.none | textDecoration | `none` | No text decoration. Default for most text. |
| textDecoration.strikethrough | textDecoration | `line-through` | Strikethrough text. Use for: deleted/removed content, completed tasks. |
| textDecoration.underline | textDecoration | `underline` | Underlined text. Use for: links, emphasized content. |
| typography.blockquote | typography | `fontFamily: {fontFamilies.heading}, fontSize: {fontSizes.xl}, fontWeight: {font…` | Blockquote text (20px light). Use for: prominent quotes, feature testimonials, highlighted citations. |
| typography.body.lg | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.lg}, fontWeight: {fontWei…` | Large body text (18px). Use for: lead paragraphs, emphasized content, feature descriptions. |
| typography.body.md | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.md}, fontWeight: {fontWei…` | Medium body text (16px). DEFAULT for paragraphs, descriptions, and primary content. |
| typography.body.sm | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.sm}, fontWeight: {fontWei…` | Small body text (14px). Use for: secondary content, captions in dense layouts, table cells, sidebar text. |
| typography.body.xl | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.xl}, fontWeight: {fontWei…` | Extra large body text (20px). Use for: intro paragraphs, prominent content, marketing copy. |
| typography.button | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.sm}, fontWeight: {fontWei…` | Button text (14px semibold). Use for: all button variants, CTAs, action triggers. |
| typography.caption | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.xs}, fontWeight: {fontWei…` | Caption text (12px regular). Use for: image captions, helper text, timestamps, metadata. |
| typography.code | typography | `fontFamily: {fontFamilies.mono}, fontSize: {fontSizes.sm}, fontWeight: {fontWei…` | Code text (14px regular monospace). Use for: inline code, code blocks, technical content, API references. |
| typography.display.lg | typography | `fontFamily: {fontFamilies.heading}, fontSize: {fontSizes.4xl}, fontWeight: {fon…` | Large display text (34px light). Use for: hero headlines, marketing banners, splash screens. |
| typography.display.md | typography | `fontFamily: {fontFamilies.heading}, fontSize: {fontSizes.3xl}, fontWeight: {fon…` | Medium display text (26px light). Use for: secondary hero text, feature highlights, callouts. |
| typography.heading.h1 | typography | `fontFamily: {fontFamilies.heading}, fontSize: {fontSizes.4xl}, fontWeight: {fon…` | Page title (34px bold). Use for: main page headings, hero titles, primary page headers. |
| typography.heading.h2 | typography | `fontFamily: {fontFamilies.heading}, fontSize: {fontSizes.3xl}, fontWeight: {fon…` | Section heading (26px bold). Use for: major sections, content dividers, feature headers. |
| typography.heading.h3 | typography | `fontFamily: {fontFamilies.heading}, fontSize: {fontSizes.2xl}, fontWeight: {fon…` | Subsection heading (22px semibold). Use for: subsections, panel headers, grouped content titles. |
| typography.heading.h4 | typography | `fontFamily: {fontFamilies.heading}, fontSize: {fontSizes.xl}, fontWeight: {font…` | Card heading (20px semibold). Use for: card titles, modal headers, component titles. |
| typography.heading.h5 | typography | `fontFamily: {fontFamilies.heading}, fontSize: {fontSizes.lg}, fontWeight: {font…` | Small heading (18px semibold). Use for: minor sections, list group titles, compact headers. |
| typography.heading.h6 | typography | `fontFamily: {fontFamilies.heading}, fontSize: {fontSizes.md}, fontWeight: {font…` | Label heading (16px semibold). Use for: label-like headings, form section titles, metadata headers. |
| typography.input | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.md}, fontWeight: {fontWei…` | Input text (16px regular). Use for: form input values, textarea content, select values. |
| typography.label.lg | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.md}, fontWeight: {fontWei…` | Large label (16px medium). Use for: prominent labels, section labels, emphasized form fields. |
| typography.label.md | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.sm}, fontWeight: {fontWei…` | Medium label (14px medium). DEFAULT for form labels, field labels, control labels. |
| typography.label.sm | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.xs}, fontWeight: {fontWei…` | Small label (12px medium). Use for: compact form labels, helper text labels, dense UI. |
| typography.overline | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.xs}, fontWeight: {fontWei…` | Overline text (12px medium, wide tracking). Use for: category labels, eyebrow text, section markers. Typically uppercas… |
| typography.quote | typography | `fontFamily: {fontFamilies.body}, fontSize: {fontSizes.lg}, fontWeight: {fontWei…` | Quote text (18px regular italic-style). Use for: inline quotes, testimonials, pull quotes. |

### z-index (9 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| zIndex.app | number | `100` | Application layer (z-index: 100). Use for: app-level UI chrome, sidebars, persistent navigation. First elevated layer a… |
| zIndex.base | number | `0` | Base layer (z-index: 0). DEFAULT for all standard content. Use for: page content, cards, sections, anything in normal d… |
| zIndex.dropdown | number | `150` | Dropdown layer (z-index: 150). Use for: dropdown menus, select options, autocomplete lists, combobox panels. Above app … |
| zIndex.max | number | `9999` | Maximum layer (z-index: 9999). HIGHEST layer - use sparingly. Use for: critical system overlays, loading states that mu… |
| zIndex.modal | number | `400` | Modal layer (z-index: 400). Use for: modal dialogs, side drawers, full-screen overlays, dialog content. Primary overlay… |
| zIndex.overlay | number | `300` | Overlay layer (z-index: 300). Use for: modal backdrops, drawer overlays, lightbox backgrounds, focus-trap containers. D… |
| zIndex.popover | number | `500` | Popover layer (z-index: 500). Use for: popovers triggered from within modals, nested floating elements, color pickers, … |
| zIndex.sticky | number | `200` | Sticky layer (z-index: 200). Use for: sticky headers, fixed navigation, persistent UI elements, scroll-aware banners. S… |
| zIndex.tooltip | number | `600` | Tooltip layer (z-index: 600). Use for: tooltips, toasts, notifications, snackbars. Near top of standard layers. Common … |

---

## Components

### alert (19 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| alert.borderRadius | dimension | `{radius.sm}` | Alert border radius (4px). Slight rounding softens the alert container. Matches other form/content containers for visua… |
| alert.borderWidth | dimension | `{borderWidth.thin}` | Alert border width (1px). Thin border provides subtle container definition. Border color varies by alert variant (error… |
| alert.closeButton.offset | dimension | `{spacing.sm}` | Close button offset from edge (12px). Positions close button away from container edge for comfortable interaction and v… |
| alert.closeButton.size | dimension | `{sizing.alert.closeButtonSize}` | Close button size (18px). Clickable/tappable close icon. Sized for adequate touch target while not competing with alert… |
| alert.icon.gap | dimension | `{spacing.sm}` | Gap between icon and content (12px). Provides clear separation between status icon and alert text. Maintains visual ass… |
| alert.icon.size | dimension | `{sizing.alert.iconSize}` | Alert icon size (20px). Sized to be clearly visible alongside title/message text without dominating. Proportional to ty… |
| alert.message.fontSize | dimension | `{fontSizes.sm}` | Alert message font size (14px). Standard body text size for readability. Matches title size but lighter weight. |
| alert.message.lineHeight | dimension | `{lineHeights.md}` | Alert message line height (1.5). More generous line height for multi-line messages. Improves readability of longer aler… |
| alert.padding.lg | dimension | `{spacing.lg}` | Large alert padding (20px). Use for: important system alerts, featured notifications, alerts with more content. More br… |
| alert.padding.md | dimension | `{spacing.md}` | Medium alert padding (16px). DEFAULT. Use for: most alerts, system notifications, prominent user feedback. Good balance… |
| alert.padding.sm | dimension | `{spacing.sm}` | Small alert padding (12px). Use for: standard form validation, secondary notifications, space-efficient layouts. |
| alert.padding.xl | dimension | `{spacing.xl}` | Extra large alert padding (32px). Use for: high-emphasis critical alerts, full-width banners, alerts with rich content … |
| alert.padding.xs | dimension | `{spacing.xs}` | Extra small alert padding (10px). Use for: compact inline alerts, form field errors, dense notification lists. Minimal … |
| alert.title.fontSize | dimension | `{fontSizes.sm}` | Alert title font size (14px). Same as body text but distinguished by weight. Keeps alerts compact while remaining reada… |
| alert.title.fontWeight | fontWeights | `{fontWeights.semibold}` | Alert title font weight (600). Semibold provides clear hierarchy between title and message without being overly heavy. |
| alert.title.lineHeight | dimension | `{lineHeights.sm}` | Alert title line height (1.25). Tighter line height for single-line titles. Keeps alert compact vertically. |
| alert.transition.duration | duration | `{motion.duration.normal}` | Alert transition duration (200ms). Moderate duration allows the animation to be perceived without feeling slow. Balance… |
| alert.transition.easing.enter |  | `{motion.easing.easeOut}` | Alert entrance easing (ease-out). Decelerating motion - alert arrives quickly and settles into place. Feels like it's s… |
| alert.transition.easing.exit |  | `{motion.easing.easeIn}` | Alert exit easing (ease-in). Accelerating motion - alert starts slow and speeds up as it leaves. Feels like it's slidin… |

### badge (19 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| badge.borderRadius.default | dimension | `{radius.xl}` | Default badge border radius - pill shape (32px). Fully rounded ends create friendly, approachable appearance. Standard … |
| badge.borderRadius.square | dimension | `{radius.sm}` | Square badge border radius (4px). Slightly rounded corners for a more formal, technical appearance. Use for: code versi… |
| badge.fontSize.lg | dimension | `{sizing.badge.fontSize.lg}` | Large badge font size (12px). Use for: lg badges, better readability for longer text, accessibility-focused implementat… |
| badge.fontSize.md | dimension | `{sizing.badge.fontSize.md}` | Medium badge font size (11px). DEFAULT. Use for: standard badges, most status and category labels. Optimal balance of c… |
| badge.fontSize.sm | dimension | `{sizing.badge.fontSize.sm}` | Small badge font size (9px). Use for: sm badges, short labels in tight spaces. Compact but still readable. |
| badge.fontSize.xl | dimension | `{sizing.badge.fontSize.xl}` | Extra large badge font size (14px). Use for: xl badges, maximum readability, prominent promotional badges. |
| badge.fontSize.xs | dimension | `{sizing.badge.fontSize.xs}` | Extra small badge font size (8px). Use for: xs badges, minimal count indicators. Very compact, may have reduced readabi… |
| badge.fontWeight | fontWeights | `{fontWeights.semibold}` | Badge font weight (600). Semibold ensures badges stand out from surrounding body text. Provides emphasis without overwh… |
| badge.height.lg | dimension | `{sizing.badge.height.lg}` | Large badge height (26px). Use for: prominent status indicators, hero section badges, featured tags, marketing callouts… |
| badge.height.md | dimension | `{sizing.badge.height.md}` | Medium badge height (20px). DEFAULT size. Use for: most status badges, category tags, standard notification counts. Bal… |
| badge.height.sm | dimension | `{sizing.badge.height.sm}` | Small badge height (18px). Use for: tight layouts, dense data tables, secondary status indicators. Subtle but readable. |
| badge.height.xl | dimension | `{sizing.badge.height.xl}` | Extra large badge height (32px). Use for: high-emphasis badges, promotional tags, standalone status indicators, onboard… |
| badge.height.xs | dimension | `{sizing.badge.height.xs}` | Extra small badge height (16px). Use for: inline status dots, minimal notification counts, compact table status indicat… |
| badge.letterSpacing | dimension | `{letterSpacing.wide}` | Badge letter spacing (0.025em). Slightly wide tracking improves readability at small sizes, especially for uppercase te… |
| badge.padding.horizontal.lg | dimension | `{sizing.badge.paddingX.lg}` | Large horizontal badge padding (12px). Use for: lg badges, longer text, more generous spacing for readability. |
| badge.padding.horizontal.md | dimension | `{sizing.badge.paddingX.md}` | Medium horizontal badge padding (10px). DEFAULT. Use for: standard text badges, status labels, category tags. Comfortab… |
| badge.padding.horizontal.sm | dimension | `{sizing.badge.paddingX.sm}` | Small horizontal badge padding (8px). Use for: sm badges, short labels (2-4 characters). Minimal breathing room. |
| badge.padding.horizontal.xl | dimension | `{sizing.badge.paddingX.xl}` | Extra large horizontal badge padding (16px). Use for: xl badges, prominent labels, maximum text breathing room. |
| badge.padding.horizontal.xs | dimension | `{sizing.badge.paddingX.xs}` | Extra small horizontal badge padding (6px). Tight padding for xs badges. Keeps badge compact for short text like counts… |

### button (19 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| button.borderRadius | dimension | `{radius.sm}` | Default button border radius (4px). Use for consistent alignment with inputs. |
| button.fontSize.lg | dimension | `{fontSizes.md}` | Large button font size. |
| button.fontSize.md | dimension | `{fontSizes.sm}` | Medium button font size. Uses sm for better proportions. |
| button.fontSize.sm | dimension | `{fontSizes.sm}` | Small button font size. |
| button.fontSize.xl | dimension | `{fontSizes.md}` | Extra large button font size. |
| button.fontSize.xs | dimension | `{fontSizes.xs}` | Extra small button font size. |
| button.fontWeight | fontWeights | `{fontWeights.semibold}` | Button font weight. Semibold for clear affordance. |
| button.height.lg | dimension | `{sizing.button.lg}` | Large button height. Use for prominent CTAs. |
| button.height.md | dimension | `{sizing.button.md}` | Medium button height. DEFAULT for most buttons. |
| button.height.sm | dimension | `{sizing.button.sm}` | Small button height. Use for secondary actions, compact layouts. |
| button.height.xl | dimension | `{sizing.button.xl}` | Extra large button height. Use for marketing CTAs. |
| button.height.xs | dimension | `{sizing.button.xs}` | Extra small button height. Use for inline actions, compact toolbars. |
| button.padding.horizontal.lg | dimension | `{spacing.lg}` | Large horizontal padding (24px). Use for prominent CTA buttons. |
| button.padding.horizontal.md | dimension | `{spacing.md}` | Medium horizontal padding (16px). Use for standard buttons. DEFAULT. |
| button.padding.horizontal.sm | dimension | `{spacing.sm}` | Small horizontal padding (12px). Use for secondary action buttons. |
| button.padding.horizontal.xl | dimension | `{spacing.xl}` | Extra large horizontal padding (32px). Use for marketing buttons. |
| button.padding.horizontal.xs | dimension | `{spacing.xs}` | Extra small horizontal padding (8px). Use for compact icon buttons. |
| button.transition.duration | duration | `{motion.duration.fast}` | Button transition duration for hover/active states. |
| button.transition.easing |  | `{motion.easing.easeOut}` | Button transition easing curve. |

### card (15 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| card.borderRadius | dimension | `{radius.md}` | Card border radius |
| card.borderWidth | dimension | `{borderWidth.thin}` | Card border width |
| card.padding.lg | dimension | `{spacing.lg}` | Large card padding |
| card.padding.md | dimension | `{spacing.md}` | Medium card padding. DEFAULT. |
| card.padding.sm | dimension | `{spacing.sm}` | Small card padding |
| card.padding.xl | dimension | `{spacing.xl}` | Extra large card padding |
| card.padding.xs | dimension | `{spacing.xs}` | Extra small card padding |
| card.section.gap | dimension | `{spacing.md}` | Gap between card sections |
| card.section.padding | dimension | `{spacing.md}` | Card section padding |
| card.shadow.lg |  | `{boxShadow.lg}` | Large card shadow for prominent elevation |
| card.shadow.md |  | `{boxShadow.md}` | Medium card shadow. DEFAULT. |
| card.shadow.none |  | `none` | No shadow. Use for flat card variants or on dark backgrounds. |
| card.shadow.sm |  | `{boxShadow.sm}` | Small card shadow for subtle elevation |
| card.transition.duration | duration | `{motion.duration.normal}` | Card hover/interaction transition duration |
| card.transition.easing |  | `{motion.easing.easeOut}` | Card transition easing |

### checkbox (19 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| checkbox.borderRadius | dimension | `{radius.xs}` | Checkbox border radius (2px). Minimal rounding maintains the traditional square checkbox shape while softening hard cor… |
| checkbox.borderWidth | dimension | `{borderWidth.thin}` | Checkbox border width (1px). Thin border provides clear boundary without visual heaviness. Thickens visually when check… |
| checkbox.focus.ringOffset | dimension | `{focus.ring.offset}` | Focus ring offset (2px). Space between checkbox border and focus ring. Prevents ring from overlapping checkbox border. |
| checkbox.focus.ringWidth | dimension | `{focus.ring.width}` | Focus ring width (2px). Clearly visible ring around checkbox when focused via keyboard. Essential for accessibility com… |
| checkbox.icon.size.lg | dimension | `{sizing.checkbox.iconSize.lg}` | Large checkmark size (14px). Proportional to lg checkbox. More prominent check for better visibility. |
| checkbox.icon.size.md | dimension | `{sizing.checkbox.iconSize.md}` | Medium checkmark size (10px). DEFAULT. Proportional to md checkbox. Clear visual feedback for checked state. |
| checkbox.icon.size.sm | dimension | `{sizing.checkbox.iconSize.sm}` | Small checkmark size (9px). Proportional to sm checkbox. Slightly larger than xs for better recognition. |
| checkbox.icon.size.xl | dimension | `{sizing.checkbox.iconSize.xl}` | Extra large checkmark size (16px). Proportional to xl checkbox. Maximum visibility checkmark. |
| checkbox.icon.size.xs | dimension | `{sizing.checkbox.iconSize.xs}` | Extra small checkmark size (8px). Proportional to xs checkbox. Keep stroke weight consistent for visibility at small si… |
| checkbox.icon.strokeWidth |  | `2.5` | Checkmark stroke width (2.5px). Bold enough to be clearly visible at all sizes. Consistent thickness ensures recognitio… |
| checkbox.label.fontSize | dimension | `{fontSizes.sm}` | Label font size (14px). Standard body text size for form labels. Readable alongside checkbox without overwhelming. |
| checkbox.label.gap | dimension | `{spacing.sm}` | Gap between checkbox and label (12px). Provides clear visual separation while maintaining association. Label click shou… |
| checkbox.size.lg | dimension | `{sizing.checkbox.size.lg}` | Large checkbox size (24px). Use for: touch-optimized interfaces, accessibility-focused forms, prominent single options.… |
| checkbox.size.md | dimension | `{sizing.checkbox.size.md}` | Medium checkbox size (20px). DEFAULT size. Use for: most forms, settings panels, standalone checkboxes. Good balance of… |
| checkbox.size.sm | dimension | `{sizing.checkbox.size.sm}` | Small checkbox size (16px). Use for: standard form density, inline options, filter panels. Common in desktop applicatio… |
| checkbox.size.xl | dimension | `{sizing.checkbox.size.xl}` | Extra large checkbox size (28px). Use for: high-emphasis standalone toggles, large touch targets, accessibility require… |
| checkbox.size.xs | dimension | `{sizing.checkbox.size.xs}` | Extra small checkbox size (14px). Use for: compact data tables, dense lists, space-constrained UIs. May not meet touch … |
| checkbox.transition.duration | duration | `{motion.duration.fast}` | Checkbox transition duration (100ms). Fast transition for snappy feedback when toggling. Should feel instant but smooth. |
| checkbox.transition.easing |  | `{motion.easing.easeOut}` | Checkbox transition easing (ease-out). Decelerating motion feels natural for check/uncheck toggle actions. |

### input (22 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| input.borderRadius | dimension | `{radius.sm}` | Default input border radius (4px). Use for consistent alignment with buttons. |
| input.borderWidth | dimension | `{borderWidth.thin}` | Input border width (1px). Use for subtle borders; focus ring provides emphasis. |
| input.focus.ringOffset | dimension | `{focus.ring.offset}` | Focus ring offset from input border. |
| input.focus.ringWidth | dimension | `{focus.ring.width}` | Focus ring width for inputs. |
| input.fontSize.lg | dimension | `{fontSizes.md}` | Large input font size. |
| input.fontSize.md | dimension | `{fontSizes.md}` | Medium input font size. DEFAULT. |
| input.fontSize.sm | dimension | `{fontSizes.sm}` | Small input font size. |
| input.fontSize.xl | dimension | `{fontSizes.lg}` | Extra large input font size. |
| input.fontSize.xs | dimension | `{fontSizes.xs}` | Extra small input font size. |
| input.height.lg | dimension | `{sizing.input.lg}` | Large input height. Use for prominent inputs. |
| input.height.md | dimension | `{sizing.input.md}` | Medium input height. DEFAULT for most inputs. |
| input.height.sm | dimension | `{sizing.input.sm}` | Small input height. Use for secondary inputs. |
| input.height.xl | dimension | `{sizing.input.xl}` | Extra large input height. Use for marketing forms. |
| input.height.xs | dimension | `{sizing.input.xs}` | Extra small input height. Use for compact forms. |
| input.lineHeight | dimension | `{lineHeights.md}` | Input line height for proper text alignment. |
| input.padding.horizontal.lg | dimension | `{spacing.md}` | Large horizontal padding (16px). Use for prominent form fields. |
| input.padding.horizontal.md | dimension | `{spacing.sm}` | Medium horizontal padding (12px). Use for standard inputs. DEFAULT. |
| input.padding.horizontal.sm | dimension | `{spacing.sm}` | Small horizontal padding (12px). Use for secondary form fields. |
| input.padding.horizontal.xl | dimension | `{spacing.md}` | Extra large horizontal padding (16px). Use for marketing forms. |
| input.padding.horizontal.xs | dimension | `{spacing.xs}` | Extra small horizontal padding (8px). Use for compact form inputs. |
| input.transition.duration | duration | `{motion.duration.fast}` | Input transition duration for focus/hover states. |
| input.transition.easing |  | `{motion.easing.easeOut}` | Input transition easing curve. |

### modal (18 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| modal.borderRadius | dimension | `{radius.lg}` | Modal container border radius (16px). Large radius creates a friendly, approachable feel for elevated floating elements… |
| modal.overlay.opacity | number | `{opacity.overlay}` | Modal backdrop opacity (60%). Semi-transparent to dim background while keeping it visible for context. Helps users unde… |
| modal.padding.body | dimension | `{spacing.lg}` | Modal body content padding (20px). Use for: main dialog content area. Matches header padding for visual consistency. |
| modal.padding.footer | dimension | `{spacing.md}` | Modal footer padding (16px). Use for: action button container. Slightly tighter than body to visually separate actions … |
| modal.padding.header | dimension | `{spacing.lg}` | Modal header padding (20px). Use for: title area containing heading and close button. Provides generous spacing for the… |
| modal.shadow |  | `{boxShadow.xl}` | Modal elevation shadow. Extra large shadow creates strong depth separation from the page content, reinforcing the modal… |
| modal.title.fontSize | dimension | `{fontSizes.lg}` | Modal title font size (18px). Large enough to be clearly visible as the primary heading, but not overwhelming in the co… |
| modal.title.fontWeight | number | `{fontWeights.semibold}` | Modal title font weight (600). Semibold provides strong visual hierarchy without the heaviness of bold, appropriate for… |
| modal.title.lineHeight | dimension | `{lineHeights.sm}` | Modal title line height (1.25). Tight line height for single-line titles. If titles wrap, this keeps them compact withi… |
| modal.transition.duration | duration | `{motion.duration.normal}` | Modal open/close transition duration (200ms). Normal duration provides smooth animation without feeling slow. Fast enou… |
| modal.transition.easing.enter |  | `{motion.easing.easeOut}` | Modal entrance easing (ease-out). Decelerates into view - starts fast, slows at end. Creates feeling of the modal 'sett… |
| modal.transition.easing.exit |  | `{motion.easing.easeIn}` | Modal exit easing (ease-in). Accelerates out - starts slow, speeds up at end. Creates feeling of the modal being 'dismi… |
| modal.width.lg | dimension | `{sizing.modal.width.lg}` | Large modal width (720px). Use for: complex multi-section forms, comparison views, detailed information display, wizard… |
| modal.width.md | dimension | `{sizing.modal.width.md}` | Medium modal width (520px). DEFAULT for most modals. Use for: standard forms, settings panels, detail views, most CRUD … |
| modal.width.sm | dimension | `{sizing.modal.width.sm}` | Small modal width (400px). Use for: simple forms (1-3 fields), prompts with brief input, login dialogs, share dialogs. … |
| modal.width.xl | dimension | `{sizing.modal.width.xl}` | Extra large modal width (960px). Use for: data-heavy content like tables/grids, image galleries, full document previews… |
| modal.width.xs | dimension | `{sizing.modal.width.xs}` | Extra small modal width (320px). Use for: simple confirmations, yes/no dialogs, brief alerts, delete confirmations. Min… |
| modal.zIndex | number | `{zIndex.modal}` | Modal z-index stacking level (400). Higher than most UI elements to ensure modal appears above page content, dropdowns,… |

### select (29 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| select.borderRadius | dimension | `{radius.sm}` | Select input border radius (4px). Matches standard input field radius for form consistency. |
| select.borderWidth | dimension | `{borderWidth.thin}` | Select input border width (1px). Standard form control border. Clear boundary without visual heaviness. |
| select.dropdown.borderRadius | dimension | `{radius.sm}` | Dropdown menu border radius (4px). Matches select input radius. Creates consistent, connected feel when open. |
| select.dropdown.maxHeight | dimension | `{sizing.select.dropdownMaxHeight}` | Dropdown menu maximum height (300px). Limits dropdown size for long option lists. Enables scrolling when exceeded. |
| select.dropdown.padding | dimension | `{spacing.xs}` | Dropdown menu inner padding (10px). Small padding around the options list. Options have their own padding. |
| select.dropdown.shadow |  | `{boxShadow.md}` | Dropdown menu shadow. Medium shadow provides elevation and separation from page content. Indicates floating layer. |
| select.dropdown.zIndex | number | `{zIndex.popover}` | Dropdown z-index stacking level (200). Above most page content but below modals. Standard popover layer. |
| select.fontSize.lg | dimension | `{fontSizes.md}` | Large select font size (16px). Same as md - maintains readability without growing too large. |
| select.fontSize.md | dimension | `{fontSizes.md}` | Medium select font size (16px). DEFAULT. Body text size for comfortable reading. Most common for primary forms. |
| select.fontSize.sm | dimension | `{fontSizes.sm}` | Small select font size (14px). Standard text for most select inputs. Readable and space-efficient. |
| select.fontSize.xl | dimension | `{fontSizes.lg}` | Extra large select font size (18px). Larger text for prominent selects or accessibility focus. |
| select.fontSize.xs | dimension | `{fontSizes.xs}` | Extra small select font size (12px). Compact text for xs selects. Use for dense forms or secondary controls. |
| select.height.lg | dimension | `{sizing.input.lg}` | Large select height (48px). Use for: touch-optimized forms, prominent selects, hero sections. Matches lg input height. |
| select.height.md | dimension | `{sizing.input.md}` | Medium select height (42px). DEFAULT. Use for: most form selects, settings, primary data entry. Matches md input height. |
| select.height.sm | dimension | `{sizing.input.sm}` | Small select height (36px). Use for: standard density forms, filter bars, secondary selects. Matches sm input height. |
| select.height.xl | dimension | `{sizing.input.xl}` | Extra large select height (60px). Use for: high-emphasis selects, marketing forms, maximum touch targets. Matches xl in… |
| select.height.xs | dimension | `{sizing.input.xs}` | Extra small select height (30px). Use for: compact forms, inline selects, space-constrained UIs. Matches xs input heigh… |
| select.icon.size | dimension | `{sizing.select.iconSize}` | Select chevron icon size (16px). Dropdown indicator arrow. Sized to be visible but not dominant. |
| select.icon.spacing | dimension | `{spacing.xs}` | Spacing between text and icon (10px). Separates selected text from chevron indicator. |
| select.option.borderRadius | dimension | `{radius.xs}` | Option border radius (2px). Subtle rounding for hover/selected state backgrounds. Creates soft highlight effect. |
| select.option.padding.horizontal | dimension | `{spacing.sm}` | Option horizontal padding (12px). Comfortable padding for option text. Wider click/tap target than text alone. |
| select.option.padding.vertical | dimension | `{spacing.xs}` | Option vertical padding (10px). Creates comfortable row height for options. Good for keyboard navigation and touch. |
| select.padding.horizontal.lg | dimension | `{spacing.md}` | Large horizontal select padding (16px). More generous padding for lg selects with better text breathing room. |
| select.padding.horizontal.md | dimension | `{spacing.sm}` | Medium horizontal select padding (12px). DEFAULT. Same as sm - compact but comfortable for most use cases. |
| select.padding.horizontal.sm | dimension | `{spacing.sm}` | Small horizontal select padding (12px). Standard padding for sm selects and efficient layouts. |
| select.padding.horizontal.xl | dimension | `{spacing.md}` | Extra large horizontal select padding (16px). Same as lg - comfortable padding for xl selects. |
| select.padding.horizontal.xs | dimension | `{spacing.xs}` | Extra small horizontal select padding (10px). Compact padding for xs selects. Leaves room for dropdown icon. |
| select.transition.duration | duration | `{motion.duration.fast}` | Select transition duration (100ms). Fast transitions for dropdown open/close and option hover states. |
| select.transition.easing |  | `{motion.easing.easeOut}` | Select transition easing (ease-out). Smooth deceleration for dropdown appearance and state changes. |

### switch (24 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| switch.focus.ringOffset | dimension | `{focus.ring.offset}` | Focus ring offset (2px). Space between switch track and focus ring for clear visual separation. |
| switch.focus.ringWidth | dimension | `{focus.ring.width}` | Focus ring width (2px). Clearly visible ring around switch when focused via keyboard navigation. |
| switch.label.fontSize | dimension | `{fontSizes.sm}` | Label font size (14px). Standard form label size. Readable without overwhelming the switch control itself. |
| switch.label.gap | dimension | `{spacing.sm}` | Gap between switch and label (12px). Clear separation between control and label while maintaining visual association. |
| switch.thumb.borderRadius | dimension | `{radius.full}` | Thumb border radius (fully rounded/circular). Creates perfect circle for the sliding handle. Essential for the switch v… |
| switch.thumb.offset | dimension | `{sizing.switch.thumb.offset}` | Thumb offset from track edge (2px). Small gap between thumb and track edge creates visual breathing room and indicates … |
| switch.thumb.size.lg | dimension | `{sizing.switch.thumb.size.lg}` | Large thumb size (22px). Larger handle for better visibility and touch interaction. |
| switch.thumb.size.md | dimension | `{sizing.switch.thumb.size.md}` | Medium thumb size (18px). DEFAULT. Standard thumb for md track. Clear visual indicator of toggle position. |
| switch.thumb.size.sm | dimension | `{sizing.switch.thumb.size.sm}` | Small thumb size (14px). Proportional to sm track. Maintains visual balance within track. |
| switch.thumb.size.xl | dimension | `{sizing.switch.thumb.size.xl}` | Extra large thumb size (28px). Maximum handle size for high-visibility, touch-optimized toggles. |
| switch.thumb.size.xs | dimension | `{sizing.switch.thumb.size.xs}` | Extra small thumb size (12px). Circular handle for xs track. Sized to fit comfortably within track with offset padding. |
| switch.track.borderRadius | dimension | `{radius.full}` | Track border radius (fully rounded/pill shape). Creates the characteristic pill shape of toggle switches. Value 9999px … |
| switch.track.height.lg | dimension | `{sizing.switch.track.height.lg}` | Large track height (30px). Taller track for better visibility and touch targets. |
| switch.track.height.md | dimension | `{sizing.switch.track.height.md}` | Medium track height (24px). DEFAULT. Comfortable height for most use cases. Good thumb-to-track proportion. |
| switch.track.height.sm | dimension | `{sizing.switch.track.height.sm}` | Small track height (20px). Standard density track height for desktop applications. |
| switch.track.height.xl | dimension | `{sizing.switch.track.height.xl}` | Extra large track height (36px). Maximum height for high-visibility toggles and accessibility. |
| switch.track.height.xs | dimension | `{sizing.switch.track.height.xs}` | Extra small track height (16px). Slim track for compact layouts. Thumb will be proportionally smaller. |
| switch.track.width.lg | dimension | `{sizing.switch.track.width.lg}` | Large track width (52px). Use for: touch-optimized interfaces, prominent feature toggles, accessibility-focused UIs. Be… |
| switch.track.width.md | dimension | `{sizing.switch.track.width.md}` | Medium track width (44px). DEFAULT size. Use for: most settings toggles, preferences panels, feature controls. Comforta… |
| switch.track.width.sm | dimension | `{sizing.switch.track.width.sm}` | Small track width (36px). Use for: standard density settings, secondary controls. Good for desktop interfaces. |
| switch.track.width.xl | dimension | `{sizing.switch.track.width.xl}` | Extra large track width (60px). Use for: high-emphasis standalone toggles, large touch targets, maximum accessibility. … |
| switch.track.width.xs | dimension | `{sizing.switch.track.width.xs}` | Extra small track width (28px). Use for: compact settings lists, inline toggles, space-constrained UIs. Maintains appro… |
| switch.transition.duration | duration | `{motion.duration.fast}` | Switch transition duration (100ms). Fast, snappy animation for immediate feedback feel. Sliding motion should feel resp… |
| switch.transition.easing |  | `{motion.easing.easeOut}` | Switch transition easing (ease-out). Thumb decelerates into final position for natural, satisfying toggle motion. |

### table (20 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| table.borderRadius | dimension | `{radius.sm}` | Table container border radius (4px). Slight rounding softens the table container. Only applies to outer border, not ind… |
| table.borderWidth | dimension | `{borderWidth.thin}` | Table border width (1px). Thin borders define cells without visual heaviness. Used for outer border and cell dividers. |
| table.cell.fontSize.lg | dimension | `{fontSizes.md}` | Large table font size (16px). Larger text for improved readability. Good for simple tables or accessibility needs. |
| table.cell.fontSize.md | dimension | `{fontSizes.sm}` | Medium table font size (14px). DEFAULT. Same as sm - keeps data compact while maintaining readability. |
| table.cell.fontSize.sm | dimension | `{fontSizes.sm}` | Small table font size (14px). Standard data table text. Readable and space-efficient for most use cases. |
| table.cell.fontSize.xl | dimension | `{fontSizes.md}` | Extra large table font size (16px). Same as lg - body text size for maximum readability in spacious tables. |
| table.cell.fontSize.xs | dimension | `{fontSizes.xs}` | Extra small table font size (12px). Compact text for dense data tables. Use for admin panels or data-heavy views. |
| table.cell.padding.horizontal.lg | dimension | `{spacing.lg}` | Large horizontal cell padding (20px). Spacious tables with generous breathing room. Good for simple data with few colum… |
| table.cell.padding.horizontal.md | dimension | `{spacing.md}` | Medium horizontal cell padding (16px). DEFAULT. Comfortable spacing for readable data. Recommended for most use cases. |
| table.cell.padding.horizontal.sm | dimension | `{spacing.sm}` | Small horizontal cell padding (12px). Standard density for most data tables. Good balance of data and whitespace. |
| table.cell.padding.horizontal.xl | dimension | `{spacing.xl}` | Extra large horizontal cell padding (32px). Very spacious tables for presentation or limited data. Maximum readability. |
| table.cell.padding.horizontal.xs | dimension | `{spacing.xs}` | Extra small horizontal cell padding (10px). Dense tables for compact data display. Use when horizontal space is limited. |
| table.cell.padding.vertical.lg | dimension | `{sizing.table.cellPaddingY.lg}` | Large vertical cell padding (12px). Taller rows for better touch targets and readability. Good for mobile or complex ce… |
| table.cell.padding.vertical.md | dimension | `{sizing.table.cellPaddingY.md}` | Medium vertical cell padding (8px). DEFAULT. Comfortable row height for general use. Good for scanning and selecting ro… |
| table.cell.padding.vertical.sm | dimension | `{sizing.table.cellPaddingY.sm}` | Small vertical cell padding (6px). Standard density rows for most data tables. Efficient use of vertical space. |
| table.cell.padding.vertical.xl | dimension | `{sizing.table.cellPaddingY.xl}` | Extra large vertical cell padding (16px). Maximum row height for spacious tables. Use for rich cell content or presenta… |
| table.cell.padding.vertical.xs | dimension | `{sizing.table.cellPaddingY.xs}` | Extra small vertical cell padding (4px). Compact rows for dense data display like logs or detailed admin views. |
| table.header.fontSize | dimension | `{fontSizes.sm}` | Table header font size (14px). Same as cell text but distinguished by weight and color. Consistent sizing aids alignmen… |
| table.header.fontWeight | fontWeights | `{fontWeights.semibold}` | Table header font weight (600). Semibold headers clearly distinguish column labels from data. Important for scanability. |
| table.transition.duration | duration | `{motion.duration.fast}` | Table row hover transition duration (100ms). Fast transition for responsive hover feedback on rows. |

### tabs (25 tokens)

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| tabs.indicator.borderRadius | dimension | `{radius.xs}` | Indicator border radius (2px). Slightly rounded ends soften the indicator line. Barely perceptible but adds polish. |
| tabs.indicator.height | dimension | `{sizing.tabs.indicatorHeight}` | Indicator height (2px). Thin underline below active tab. Visible enough to clearly indicate selection without being hea… |
| tabs.list.borderWidth | dimension | `{borderWidth.thin}` | Tab list bottom border width (1px). Subtle line separating tabs from content. The active indicator overlays this border. |
| tabs.list.gap |  | `0` | Gap between tabs (0px). Zero gap creates connected tabs that appear as a unified navigation bar. Individual tabs handle… |
| tabs.panel.padding.top | dimension | `{spacing.md}` | Panel top padding (16px). Space between tab bar and panel content. Provides visual separation without excessive gap. |
| tabs.tab.borderRadius | dimension | `{radius.sm}` | Tab border radius (4px). Used for 'pills' variant tabs where each tab has a rounded background. Not visible in default … |
| tabs.tab.fontSize.lg | dimension | `{fontSizes.md}` | Large tab font size (16px). Larger text for prominent tabs. Good for hero navigation or limited tab count. |
| tabs.tab.fontSize.md | dimension | `{fontSizes.sm}` | Medium tab font size (14px). DEFAULT. Same as sm - keeps tabs subordinate to main content while remaining readable. |
| tabs.tab.fontSize.sm | dimension | `{fontSizes.sm}` | Small tab font size (14px). Standard text size for most tab navigation. Readable and space-efficient. |
| tabs.tab.fontSize.xl | dimension | `{fontSizes.md}` | Extra large tab font size (16px). Same as lg - maintains readability without becoming oversized headers. |
| tabs.tab.fontSize.xs | dimension | `{fontSizes.xs}` | Extra small tab font size (12px). Compact text for xs tabs. Use for secondary or crowded navigation. |
| tabs.tab.fontWeight.active | fontWeights | `{fontWeights.medium}` | Active tab font weight (500). Medium weight provides subtle emphasis for the selected tab without being too heavy. |
| tabs.tab.fontWeight.default | fontWeights | `{fontWeights.regular}` | Default (inactive) tab font weight (400). Regular weight for inactive tabs keeps them visually subordinate. |
| tabs.tab.height.lg | dimension | `{sizing.tabs.height.lg}` | Large tab height (40px). Use for: prominent navigation tabs, touch-optimized interfaces, hero section tabs. |
| tabs.tab.height.md | dimension | `{sizing.tabs.height.md}` | Medium tab height (36px). DEFAULT. Use for: most tab navigation, main content tabs, settings panels. Comfortable click/… |
| tabs.tab.height.sm | dimension | `{sizing.tabs.height.sm}` | Small tab height (32px). Use for: standard-density navigation, sidebar tabs, space-efficient layouts. |
| tabs.tab.height.xl | dimension | `{sizing.tabs.height.xl}` | Extra large tab height (48px). Use for: high-emphasis navigation, full-width primary tabs, maximum touch target size. |
| tabs.tab.height.xs | dimension | `{sizing.tabs.height.xs}` | Extra small tab height (28px). Use for: compact navigation, secondary tab sets, dense admin interfaces. Minimal vertica… |
| tabs.tab.padding.horizontal.lg | dimension | `{spacing.lg}` | Large horizontal tab padding (20px). Generous padding for prominent tabs with breathing room. |
| tabs.tab.padding.horizontal.md | dimension | `{spacing.md}` | Medium horizontal tab padding (16px). DEFAULT. Comfortable padding for most tab navigation. |
| tabs.tab.padding.horizontal.sm | dimension | `{spacing.sm}` | Small horizontal tab padding (12px). Standard padding for sm tabs and efficient layouts. |
| tabs.tab.padding.horizontal.xl | dimension | `{spacing.xl}` | Extra large horizontal tab padding (32px). Maximum padding for high-emphasis, spacious tabs. |
| tabs.tab.padding.horizontal.xs | dimension | `{spacing.xs}` | Extra small horizontal tab padding (10px). Compact spacing for xs tabs and dense navigation. |
| tabs.transition.duration | duration | `{motion.duration.fast}` | Tab transition duration (100ms). Fast transitions for snappy tab switching. Indicator animation and hover states. |
| tabs.transition.easing |  | `{motion.easing.easeOut}` | Tab transition easing (ease-out). Smooth deceleration for indicator movement and state changes. |

---

## Semantic Themes

### ccui-21-light (339 tokens)

_Same structure as mantine-light. See reference theme above for full token list._

### ccui-30-dark (342 tokens)

_Same structure as mantine-light. See reference theme above for full token list._

### ccui-30-light (342 tokens)

_Same structure as mantine-light. See reference theme above for full token list._

### mantine-dark (339 tokens)

_Same structure as mantine-light. See reference theme above for full token list._

### mantine-light (339 tokens) — reference theme

| Token | Type | Value | Description |
|-------|------|-------|-------------|
| boxShadow.footer | boxShadow | `dropShadow: 0 -0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 -0.625r…` | Footer shadow - upward-casting shadow for fixed footers. Use for: sticky footers, bottom navigation bars, action bars a… |
| boxShadow.inset | boxShadow | `innerShadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.1)` | Inset shadow - pressed/recessed appearance. Use for: pressed button states, input:focus, toggle switches (off state), e… |
| boxShadow.lg | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 1.75rem …` | Default Mantine large shadow |
| boxShadow.md | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 1.25rem …` | Default Mantine medium shadow |
| boxShadow.none | boxShadow | `none` | No shadow - flat appearance. Use for: flat design elements, removing inherited shadows, elements that should appear flu… |
| boxShadow.sm | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 0.625rem…` | Default Mantine small shadow |
| boxShadow.xl | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 2.25rem …` | Default Mantine extra large shadow |
| boxShadow.xs | boxShadow | `dropShadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.05); dropShadow: 0 0.0625re…` | Default Mantine extra small shadow |
| color.action.bg.primary | color | `{colorPalette.blue.filled}` | Primary action background. |
| color.action.bg.primary-active | color | `{color.blue.8}` | Primary action active/pressed state. |
| color.action.bg.primary-disabled | color | `{color.bg.interactive.disabled}` | Primary action disabled state. |
| color.action.bg.primary-hover | color | `{colorPalette.blue.filled-hover}` | Primary action hover state. |
| color.action.bg.primary-light | color | `{colorPalette.blue.light}` | Primary light variant background. |
| color.action.bg.primary-light-hover | color | `{colorPalette.blue.light-hover}` | Primary light variant hover. |
| color.action.border.primary | color | `{colorPalette.blue.filled}` | Primary action border color. |
| color.action.border.primary-hover | color | `{colorPalette.blue.filled-hover}` | Primary action hover border color. |
| color.action.text.primary | color | `{color.white}` | Text on primary action backgrounds. |
| color.action.text.primary-light | color | `{colorPalette.blue.light-color}` | Text on primary light backgrounds. |
| color.alpha.error | color | `rgba(207, 39, 32, 0.15)` | Error state semi-transparent background (15% red) |
| color.alpha.info | color | `rgba(9, 116, 235, 0.15)` | Info state semi-transparent background (15% blue) |
| color.alpha.selected | color | `rgba(9, 116, 235, 0.2)` | Selected state semi-transparent background (20% blue) |
| color.alpha.success | color | `rgba(29, 148, 72, 0.15)` | Success state semi-transparent background (15% green) |
| color.alpha.warning | color | `rgba(218, 167, 17, 0.15)` | Warning state semi-transparent background (15% yellow) |
| color.bg.interactive.disabled | color | `{color.gray.2}` | Disabled element background. |
| color.bg.interactive.selected | color | `{color.blue.0}` | Selected element background. |
| color.bg.surface.canvas | color | `{color.white}` | Page canvas/body background. |
| color.bg.surface.default | color | `{color.white}` | Default component background. |
| color.bg.surface.elevated | color | `{color.gray.0}` | Elevated surface background (hover states, raised panels). |
| color.bg.surface.muted | color | `{color.gray.1}` | Muted/subdued surface background. |
| color.border.interactive.disabled | color | `{color.gray.3}` | Disabled border color. |
| color.border.interactive.focus | color | `{color.blue.5}` | Focus state border color. |
| color.border.interactive.hover | color | `{color.gray.5}` | Hover state border color. |
| color.border.interactive.selected | color | `{color.blue.5}` | Selected state border color. |
| color.border.surface.default | color | `{color.gray.4}` | Default border color. |
| color.border.surface.strong | color | `{color.gray.6}` | Strong/emphasized border color. |
| color.border.surface.subtle | color | `{color.gray.3}` | Subtle/light border color. |
| color.feedback.bg.error | color | `{color.red.0}` | Error feedback background. |
| color.feedback.bg.info | color | `{color.blue.0}` | Info feedback background. |
| color.feedback.bg.success | color | `{color.green.0}` | Success feedback background. |
| color.feedback.bg.warning | color | `{color.yellow.0}` | Warning feedback background. |
| color.feedback.border.error | color | `{color.red.5}` | Error feedback border. |
| color.feedback.border.info | color | `{color.blue.5}` | Info feedback border. |
| color.feedback.border.success | color | `{color.green.5}` | Success feedback border. |
| color.feedback.border.warning | color | `{color.yellow.5}` | Warning feedback border. |
| color.feedback.icon.error | color | `{color.red.6}` | Error feedback icon. |
| color.feedback.icon.info | color | `{color.blue.6}` | Info feedback icon. |
| color.feedback.icon.success | color | `{color.green.6}` | Success feedback icon. |
| color.feedback.icon.warning | color | `{color.yellow.6}` | Warning feedback icon. |
| color.feedback.text.error | color | `{color.red.6}` | Error feedback text. |
| color.feedback.text.info | color | `{color.blue.7}` | Info feedback text. |
| color.feedback.text.success | color | `{color.green.7}` | Success feedback text. |
| color.feedback.text.warning | color | `{color.yellow.8}` | Warning feedback text. |
| color.focus.ring | color | `{color.blue.5}` | Focus ring color. |
| color.overlay.dark | color | `rgba(0, 0, 0, 0.75)` | Dark theme overlay (75% opacity). Use for: modal backdrops on dark backgrounds, higher contrast overlays. |
| color.overlay.default | color | `{color.overlay.light}` | Default overlay/backdrop color. |
| color.overlay.light | color | `rgba(0, 0, 0, 0.5)` | Light theme overlay (50% opacity). Use for: modal backdrops, drawer overlays on light backgrounds. |
| color.primary.0 | color | `{color.blue.0}` |  |
| color.primary.1 | color | `{color.blue.1}` |  |
| color.primary.2 | color | `{color.blue.2}` |  |
| color.primary.3 | color | `{color.blue.3}` |  |
| color.primary.4 | color | `{color.blue.4}` |  |
| color.primary.5 | color | `{color.blue.5}` |  |
| color.primary.6 | color | `{color.blue.6}` |  |
| color.primary.7 | color | `{color.blue.7}` |  |
| color.primary.8 | color | `{color.blue.8}` |  |
| color.primary.9 | color | `{color.blue.9}` |  |
| color.primary.contrast | color | `{color.white}` | Text on primary filled. |
| color.primary.filled | color | `{colorPalette.blue.filled}` | Primary filled background. |
| color.primary.filled-hover | color | `{colorPalette.blue.filled-hover}` | Primary filled hover. |
| color.primary.light | color | `{colorPalette.blue.light}` | Primary light background. |
| color.primary.light-color | color | `{colorPalette.blue.light-color}` | Text on primary light. |
| color.primary.light-hover | color | `{colorPalette.blue.light-hover}` | Primary light hover. |
| color.text.bright | color | `{color.black}` | Maximum contrast text. |
| color.text.default | color | `{color.black}` | Primary text color. Use for: headings, body text, labels. |
| color.text.disabled | color | `{color.gray.5}` | Text color for disabled elements. |
| color.text.error | color | `{color.red.6}` | Error text color. |
| color.text.info | color | `{color.blue.7}` | Informational text color. |
| color.text.inverse | color | `{color.white}` | Inverse text for dark backgrounds. |
| color.text.link | color | `{color.blue.6}` | Link/anchor text color. |
| color.text.on-default | color | `{color.black}` | Text on default component backgrounds. |
| color.text.placeholder | color | `{color.gray.5}` | Placeholder text in form inputs. |
| color.text.secondary | color | `{color.gray.6}` | Secondary/muted text. Use for: helper text, captions, descriptions. |
| color.text.success | color | `{color.green.7}` | Success text color. |
| color.text.warning | color | `{color.yellow.8}` | Warning text color. |
| colorPalette.blue.filled | color | `{color.blue.6}` | Filled background for blue elements (default Mantine primary) |
| colorPalette.blue.filled-hover | color | `{color.blue.7}` | Hover state for blue filled elements |
| colorPalette.blue.light | color | `rgba(34, 139, 230, 0.1)` | Light variant of blue color |
| colorPalette.blue.light-color | color | `{color.blue.6}` | Text color for blue light elements |
| colorPalette.blue.light-hover | color | `rgba(34, 139, 230, 0.12)` | Hover state for blue light elements |
| colorPalette.blue.outline | color | `{color.blue.6}` | Outline color for blue elements |
| colorPalette.blue.outline-hover | color | `rgba(34, 139, 230, 0.05)` | Hover state for blue outline elements |
| colorPalette.blue.text | color | `{color.blue.6}` | Text color for blue elements |
| colorPalette.cyan.filled | color | `{color.cyan.6}` | Filled background for cyan elements |
| colorPalette.cyan.filled-hover | color | `{color.cyan.7}` | Hover state for cyan filled elements |
| colorPalette.cyan.light | color | `rgba(21, 170, 191, 0.1)` | Light variant of cyan color |
| colorPalette.cyan.light-color | color | `{color.cyan.6}` | Text color for cyan light elements |
| colorPalette.cyan.light-hover | color | `rgba(21, 170, 191, 0.12)` | Hover state for cyan light elements |
| colorPalette.cyan.outline | color | `{color.cyan.6}` | Outline color for cyan elements |
| colorPalette.cyan.outline-hover | color | `rgba(21, 170, 191, 0.05)` | Hover state for cyan outline elements |
| colorPalette.cyan.text | color | `{color.cyan.6}` | Text color for cyan elements |
| colorPalette.dark.filled | color | `{color.dark.6}` | Filled background for dark elements |
| colorPalette.dark.filled-hover | color | `{color.dark.7}` | Hover state for dark filled elements |
| colorPalette.dark.light | color | `rgba(46, 46, 46, 0.1)` | Light variant of dark color |
| colorPalette.dark.light-color | color | `{color.dark.6}` | Text color for dark light elements |
| colorPalette.dark.light-hover | color | `rgba(46, 46, 46, 0.12)` | Hover state for dark light elements |
| colorPalette.dark.outline | color | `{color.dark.6}` | Outline color for dark elements |
| colorPalette.dark.outline-hover | color | `rgba(46, 46, 46, 0.05)` | Hover state for dark outline elements |
| colorPalette.dark.text | color | `{color.dark.6}` | Text color for dark elements |
| colorPalette.grape.filled | color | `{color.grape.6}` | Filled background for grape elements |
| colorPalette.grape.filled-hover | color | `{color.grape.7}` | Hover state for grape filled elements |
| colorPalette.grape.light | color | `rgba(190, 75, 219, 0.1)` | Light variant of grape color |
| colorPalette.grape.light-color | color | `{color.grape.6}` | Text color for grape light elements |
| colorPalette.grape.light-hover | color | `rgba(190, 75, 219, 0.12)` | Hover state for grape light elements |
| colorPalette.grape.outline | color | `{color.grape.6}` | Outline color for grape elements |
| colorPalette.grape.outline-hover | color | `rgba(190, 75, 219, 0.05)` | Hover state for grape outline elements |
| colorPalette.grape.text | color | `{color.grape.6}` | Text color for grape elements |
| colorPalette.gray.filled | color | `{color.gray.6}` | Filled background for gray elements |
| colorPalette.gray.filled-hover | color | `{color.gray.7}` | Hover state for gray filled elements |
| colorPalette.gray.light | color | `rgba(134, 142, 150, 0.1)` | Light variant of gray color |
| colorPalette.gray.light-color | color | `{color.gray.6}` | Text color for gray light elements |
| colorPalette.gray.light-hover | color | `rgba(134, 142, 150, 0.12)` | Hover state for gray light elements |
| colorPalette.gray.outline | color | `{color.gray.6}` | Outline color for gray elements |
| colorPalette.gray.outline-hover | color | `rgba(134, 142, 150, 0.05)` | Hover state for gray outline elements |
| colorPalette.gray.text | color | `{color.gray.6}` | Text color for gray elements |
| colorPalette.green.filled | color | `{color.green.6}` | Filled background for green elements |
| colorPalette.green.filled-hover | color | `{color.green.7}` | Hover state for green filled elements |
| colorPalette.green.light | color | `rgba(64, 192, 87, 0.1)` | Light variant of green color |
| colorPalette.green.light-color | color | `{color.green.6}` | Text color for green light elements |
| colorPalette.green.light-hover | color | `rgba(64, 192, 87, 0.12)` | Hover state for green light elements |
| colorPalette.green.outline | color | `{color.green.6}` | Outline color for green elements |
| colorPalette.green.outline-hover | color | `rgba(64, 192, 87, 0.05)` | Hover state for green outline elements |
| colorPalette.green.text | color | `{color.green.6}` | Text color for green elements |
| colorPalette.indigo.filled | color | `{color.indigo.6}` | Filled background for indigo elements |
| colorPalette.indigo.filled-hover | color | `{color.indigo.7}` | Hover state for indigo filled elements |
| colorPalette.indigo.light | color | `rgba(76, 110, 245, 0.1)` | Light variant of indigo color |
| colorPalette.indigo.light-color | color | `{color.indigo.6}` | Text color for indigo light elements |
| colorPalette.indigo.light-hover | color | `rgba(76, 110, 245, 0.12)` | Hover state for indigo light elements |
| colorPalette.indigo.outline | color | `{color.indigo.6}` | Outline color for indigo elements |
| colorPalette.indigo.outline-hover | color | `rgba(76, 110, 245, 0.05)` | Hover state for indigo outline elements |
| colorPalette.indigo.text | color | `{color.indigo.6}` | Text color for indigo elements |
| colorPalette.lime.filled | color | `{color.lime.6}` | Filled background for lime elements |
| colorPalette.lime.filled-hover | color | `{color.lime.7}` | Hover state for lime filled elements |
| colorPalette.lime.light | color | `rgba(130, 201, 30, 0.1)` | Light variant of lime color |
| colorPalette.lime.light-color | color | `{color.lime.6}` | Text color for lime light elements |
| colorPalette.lime.light-hover | color | `rgba(130, 201, 30, 0.12)` | Hover state for lime light elements |
| colorPalette.lime.outline | color | `{color.lime.6}` | Outline color for lime elements |
| colorPalette.lime.outline-hover | color | `rgba(130, 201, 30, 0.05)` | Hover state for lime outline elements |
| colorPalette.lime.text | color | `{color.lime.6}` | Text color for lime elements |
| colorPalette.orange.filled | color | `{color.orange.6}` | Filled background for orange elements |
| colorPalette.orange.filled-hover | color | `{color.orange.7}` | Hover state for orange filled elements |
| colorPalette.orange.light | color | `rgba(253, 126, 20, 0.1)` | Light variant of orange color |
| colorPalette.orange.light-color | color | `{color.orange.6}` | Text color for orange light elements |
| colorPalette.orange.light-hover | color | `rgba(253, 126, 20, 0.12)` | Hover state for orange light elements |
| colorPalette.orange.outline | color | `{color.orange.6}` | Outline color for orange elements |
| colorPalette.orange.outline-hover | color | `rgba(253, 126, 20, 0.05)` | Hover state for orange outline elements |
| colorPalette.orange.text | color | `{color.orange.6}` | Text color for orange elements |
| colorPalette.pink.filled | color | `{color.pink.6}` | Filled background for pink elements |
| colorPalette.pink.filled-hover | color | `{color.pink.7}` | Hover state for pink filled elements |
| colorPalette.pink.light | color | `rgba(230, 73, 128, 0.1)` | Light variant of pink color |
| colorPalette.pink.light-color | color | `{color.pink.6}` | Text color for pink light elements |
| colorPalette.pink.light-hover | color | `rgba(230, 73, 128, 0.12)` | Hover state for pink light elements |
| colorPalette.pink.outline | color | `{color.pink.6}` | Outline color for pink elements |
| colorPalette.pink.outline-hover | color | `rgba(230, 73, 128, 0.05)` | Hover state for pink outline elements |
| colorPalette.pink.text | color | `{color.pink.6}` | Text color for pink elements |
| colorPalette.red.filled | color | `{color.red.6}` | Filled background for red elements |
| colorPalette.red.filled-hover | color | `{color.red.7}` | Hover state for red filled elements |
| colorPalette.red.light | color | `rgba(250, 82, 82, 0.1)` | Light variant of red color |
| colorPalette.red.light-color | color | `{color.red.6}` | Text color for red light elements |
| colorPalette.red.light-hover | color | `rgba(250, 82, 82, 0.12)` | Hover state for red light elements |
| colorPalette.red.outline | color | `{color.red.6}` | Outline color for red elements |
| colorPalette.red.outline-hover | color | `rgba(250, 82, 82, 0.05)` | Hover state for red outline elements |
| colorPalette.red.text | color | `{color.red.6}` | Text color for red elements |
| colorPalette.teal.filled | color | `{color.teal.6}` | Filled background for teal elements |
| colorPalette.teal.filled-hover | color | `{color.teal.7}` | Hover state for teal filled elements |
| colorPalette.teal.light | color | `rgba(18, 184, 134, 0.1)` | Light variant of teal color |
| colorPalette.teal.light-color | color | `{color.teal.6}` | Text color for teal light elements |
| colorPalette.teal.light-hover | color | `rgba(18, 184, 134, 0.12)` | Hover state for teal light elements |
| colorPalette.teal.outline | color | `{color.teal.6}` | Outline color for teal elements |
| colorPalette.teal.outline-hover | color | `rgba(18, 184, 134, 0.05)` | Hover state for teal outline elements |
| colorPalette.teal.text | color | `{color.teal.6}` | Text color for teal elements |
| colorPalette.violet.filled | color | `{color.violet.6}` | Filled background for violet elements |
| colorPalette.violet.filled-hover | color | `{color.violet.7}` | Hover state for violet filled elements |
| colorPalette.violet.light | color | `rgba(121, 80, 242, 0.1)` | Light variant of violet color |
| colorPalette.violet.light-color | color | `{color.violet.6}` | Text color for violet light elements |
| colorPalette.violet.light-hover | color | `rgba(121, 80, 242, 0.12)` | Hover state for violet light elements |
| colorPalette.violet.outline | color | `{color.violet.6}` | Outline color for violet elements |
| colorPalette.violet.outline-hover | color | `rgba(121, 80, 242, 0.05)` | Hover state for violet outline elements |
| colorPalette.violet.text | color | `{color.violet.6}` | Text color for violet elements |
| colorPalette.yellow.filled | color | `{color.yellow.6}` | Filled background for yellow elements |
| colorPalette.yellow.filled-hover | color | `{color.yellow.7}` | Hover state for yellow filled elements |
| colorPalette.yellow.light | color | `rgba(250, 176, 5, 0.1)` | Light variant of yellow color |
| colorPalette.yellow.light-color | color | `{color.yellow.6}` | Text color for yellow light elements |
| colorPalette.yellow.light-hover | color | `rgba(250, 176, 5, 0.12)` | Hover state for yellow light elements |
| colorPalette.yellow.outline | color | `{color.yellow.6}` | Outline color for yellow elements |
| colorPalette.yellow.outline-hover | color | `rgba(250, 176, 5, 0.05)` | Hover state for yellow outline elements |
| colorPalette.yellow.text | color | `{color.yellow.6}` | Text color for yellow elements |
| component.active.background | color | `{color.gray.1}` | Active/pressed state background color |
| component.active.border | color | `{color.gray.6}` | Active/pressed state border color |
| component.default.background | color | `{color.white}` | Default component background color |
| component.default.border | color | `{color.gray.4}` | Default component border color |
| component.default.text | color | `{color.black}` | Default component text color |
| component.disabled.background | color | `{color.gray.1}` | Disabled state background color |
| component.disabled.border | color | `{color.gray.3}` | Disabled state border color |
| component.disabled.text | color | `{color.gray.5}` | Disabled state text color |
| component.error.background | color | `{color.red.0}` | Error state background color |
| component.error.border | color | `{color.red.5}` | Error state border color |
| component.error.text | color | `{color.red.7}` | Error state text color |
| component.focus.border | color | `{color.blue.5}` | Focus state border color |
| component.focus.ring | color | `{color.blue.5}` | Focus ring color |
| component.hover.background | color | `{color.gray.0}` | Hover state background color |
| component.hover.border | color | `{color.gray.5}` | Hover state border color |
| component.info.background | color | `{color.blue.0}` | Info state background color |
| component.info.border | color | `{color.blue.5}` | Info state border color |
| component.info.text | color | `{color.blue.7}` | Info state text color |
| component.selected.background | color | `{color.blue.0}` | Selected state background color |
| component.selected.border | color | `{color.blue.5}` | Selected state border color |
| component.selected.text | color | `{color.blue.7}` | Selected state text color |
| component.success.background | color | `{color.green.0}` | Success state background color |
| component.success.border | color | `{color.green.5}` | Success state border color |
| component.success.text | color | `{color.green.7}` | Success state text color |
| component.warning.background | color | `{color.yellow.0}` | Warning state background color |
| component.warning.border | color | `{color.yellow.5}` | Warning state border color |
| component.warning.text | color | `{color.yellow.8}` | Warning state text color (darker for contrast) |
| componentColors.alert.error.background-color | color | `{component.error.background}` | Error alert background color. |
| componentColors.alert.error.border-color | color | `{component.error.border}` | Error alert border color. |
| componentColors.alert.error.text-color | color | `{component.error.text}` | Error alert text color. |
| componentColors.alert.info.background-color | color | `{component.info.background}` | Info alert background color. |
| componentColors.alert.info.border-color | color | `{component.info.border}` | Info alert border color. |
| componentColors.alert.info.text-color | color | `{component.info.text}` | Info alert text color. |
| componentColors.alert.success.background-color | color | `{component.success.background}` | Success alert background color. |
| componentColors.alert.success.border-color | color | `{component.success.border}` | Success alert border color. |
| componentColors.alert.success.text-color | color | `{component.success.text}` | Success alert text color. |
| componentColors.alert.warning.background-color | color | `{component.warning.background}` | Warning alert background color. |
| componentColors.alert.warning.border-color | color | `{component.warning.border}` | Warning alert border color. |
| componentColors.alert.warning.text-color | color | `{component.warning.text}` | Warning alert text color. |
| componentColors.badge.filled.background-color | color | `{color.primary.filled}` | Filled badge background color. |
| componentColors.badge.filled.text-color | color | `{color.primary.contrast}` | Filled badge text color. |
| componentColors.badge.light.background-color | color | `{color.primary.light}` | Light badge background color. |
| componentColors.badge.light.text-color | color | `{color.primary.light-color}` | Light badge text color. |
| componentColors.badge.outline.border-color | color | `{color.primary.filled}` | Outline badge border color. |
| componentColors.badge.outline.text-color | color | `{color.primary.filled}` | Outline badge text color. |
| componentColors.button.default.background-color | color | `{color.bg.surface.default}` | Default button background color. |
| componentColors.button.default.border-color | color | `{color.border.surface.default}` | Default button border color. |
| componentColors.button.default.hover-background-color | color | `{color.bg.surface.elevated}` | Default button hover background color. |
| componentColors.button.default.text-color | color | `{color.text.on-default}` | Default button text color. |
| componentColors.button.disabled.background-color | color | `{color.bg.interactive.disabled}` | Disabled button background color. |
| componentColors.button.disabled.border-color | color | `{color.border.interactive.disabled}` | Disabled button border color. |
| componentColors.button.disabled.text-color | color | `{color.text.disabled}` | Disabled button text color. |
| componentColors.button.filled.background-color | color | `{color.primary.filled}` | Filled button background color. Uses primary color. |
| componentColors.button.filled.hover-background-color | color | `{color.primary.filled-hover}` | Filled button hover background color. |
| componentColors.button.filled.text-color | color | `{color.primary.contrast}` | Filled button text color. White for contrast on primary. |
| componentColors.button.light.background-color | color | `{color.primary.light}` | Light button background color. |
| componentColors.button.light.hover-background-color | color | `{color.primary.light-hover}` | Light button hover background color. |
| componentColors.button.light.text-color | color | `{color.primary.light-color}` | Light button text color. |
| componentColors.button.outline.border-color | color | `{color.primary.filled}` | Outline button border color. Uses primary color. |
| componentColors.button.outline.hover-background-color | color | `{color.primary.light}` | Outline button hover background color. |
| componentColors.button.outline.text-color | color | `{color.primary.filled}` | Outline button text color. Uses primary color. |
| componentColors.button.subtle.background-color | color | `transparent` | Subtle button background color. Transparent by default. |
| componentColors.button.subtle.hover-background-color | color | `{color.primary.light}` | Subtle button hover background color. |
| componentColors.button.subtle.text-color | color | `{color.primary.filled}` | Subtle button text color. |
| componentColors.card.background-color | color | `{color.bg.surface.default}` | Card background color. |
| componentColors.card.border-color | color | `{color.border.surface.default}` | Card border color. |
| componentColors.checkbox.checked.background-color | color | `{color.primary.filled}` | Checked checkbox background color. |
| componentColors.checkbox.checked.border-color | color | `{color.primary.filled}` | Checked checkbox border color. |
| componentColors.checkbox.checked.checkmark-color | color | `{color.primary.contrast}` | Checkmark icon color. |
| componentColors.checkbox.disabled.background-color | color | `{color.bg.interactive.disabled}` | Disabled checkbox background color. |
| componentColors.checkbox.disabled.border-color | color | `{color.border.interactive.disabled}` | Disabled checkbox border color. |
| componentColors.checkbox.unchecked.background-color | color | `{color.bg.surface.default}` | Unchecked checkbox background color. |
| componentColors.checkbox.unchecked.border-color | color | `{color.border.surface.default}` | Unchecked checkbox border color. |
| componentColors.input.default.background-color | color | `{color.bg.surface.default}` | Default input background color. |
| componentColors.input.default.border-color | color | `{color.border.surface.default}` | Default input border color. |
| componentColors.input.default.placeholder-color | color | `{color.text.placeholder}` | Input placeholder text color. |
| componentColors.input.default.text-color | color | `{color.text.default}` | Input text color. |
| componentColors.input.disabled.background-color | color | `{color.bg.interactive.disabled}` | Disabled input background color. |
| componentColors.input.disabled.border-color | color | `{color.border.interactive.disabled}` | Disabled input border color. |
| componentColors.input.disabled.text-color | color | `{color.text.disabled}` | Disabled input text color. |
| componentColors.input.error.border-color | color | `{color.feedback.text.error}` | Error state input border color. |
| componentColors.input.error.text-color | color | `{color.feedback.text.error}` | Error message text color. |
| componentColors.input.focus.border-color | color | `{color.primary.filled}` | Focused input border color. |
| componentColors.input.focus.ring-color | color | `{color.primary.light}` | Focus ring color around input. |
| componentColors.modal.background-color | color | `{color.bg.surface.default}` | Modal background color. |
| componentColors.modal.footer-border-color | color | `{color.border.surface.default}` | Modal footer top border color. |
| componentColors.modal.header-border-color | color | `{color.border.surface.default}` | Modal header bottom border color. |
| componentColors.modal.overlay-color | color | `{color.overlay.default}` | Modal overlay/backdrop color. |
| componentColors.select.background-color | color | `{color.bg.surface.default}` | Select input background color. |
| componentColors.select.border-color | color | `{color.border.surface.default}` | Select input border color. |
| componentColors.select.dropdown.background-color | color | `{color.bg.surface.default}` | Dropdown menu background color. |
| componentColors.select.dropdown.border-color | color | `{color.border.surface.default}` | Dropdown menu border color. |
| componentColors.select.option.hover-background-color | color | `{color.bg.surface.elevated}` | Option hover background color. |
| componentColors.select.option.selected-background-color | color | `{color.primary.light}` | Selected option background color. |
| componentColors.select.option.selected-text-color | color | `{color.primary.light-color}` | Selected option text color. |
| componentColors.select.text-color | color | `{color.text.default}` | Select input text color. |
| componentColors.switch.disabled.thumb-color | color | `{color.gray.3}` | Disabled switch thumb color. |
| componentColors.switch.disabled.track-color | color | `{color.bg.interactive.disabled}` | Disabled switch track color. |
| componentColors.switch.off.thumb-color | color | `{color.white}` | Switch thumb color. |
| componentColors.switch.off.track-color | color | `{color.gray.2}` | Off state track background color. |
| componentColors.switch.on.thumb-color | color | `{color.white}` | Switch thumb color when on. |
| componentColors.switch.on.track-color | color | `{color.primary.filled}` | On state track background color. |
| componentColors.table.border-color | color | `{color.border.surface.default}` | Table border color. |
| componentColors.table.header-background-color | color | `{color.gray.0}` | Table header background color. |
| componentColors.table.hover-background-color | color | `{color.bg.surface.elevated}` | Row hover background color. |
| componentColors.table.selected-background-color | color | `{component.selected.background}` | Selected row background color. |
| componentColors.table.striped-background-color | color | `{color.gray.0}` | Alternating row background color. |
| componentColors.tabs.active.indicator-color | color | `{color.primary.filled}` | Active tab indicator color. |
| componentColors.tabs.active.text-color | color | `{color.primary.filled}` | Active tab text color. |
| componentColors.tabs.border-color | color | `{color.border.surface.default}` | Tab list border color. |
| componentColors.tabs.default.hover-text-color | color | `{color.text.default}` | Tab hover text color. |
| componentColors.tabs.default.text-color | color | `{color.text.secondary}` | Inactive tab text color. |
| fontFamilies.body | fontFamilies | `Roboto, Helvetica Neue, Helvetica, Arial, sans-serif` | Body font stack for Mantine theme. Roboto is Google's signature typeface, optimized for readability on screens. |
| fontFamilies.heading | fontFamilies | `LobsterTwo, Helvetica Neue, Helvetica, Arial, sans-serif` | Heading font stack for Mantine theme. Uses Roboto for consistent typography across headings and body. |
| fontFamilies.mono | fontFamilies | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Cour…` | Monospace font stack for code and technical content. Use for: code blocks, inline code, terminal output, data tables wi… |
| mantine.cursorType |  | `pointer` | Cursor style for interactive elements. 'pointer' for clickable, 'default' for standard. |
| mantine.headingFontWeight | number | `700` | Default font weight for all headings (h1-h6). |
| mantine.headingTextWrap |  | `wrap` | Text wrapping behavior for headings. 'wrap' allows line breaks, 'balance' balances lines. |
| mantine.mozFontSmoothing |  | `grayscale` | Mozilla font smoothing. 'grayscale' for crisp text on Firefox. |
| mantine.radiusDefault | dimension | `{radius.sm}` | Default border radius when no size is specified. References radius.sm token. |
| mantine.scale | number | `1` | Global scale factor for Mantine components. 1 = default size, 0.8 = 80% size, 1.2 = 120% size. |
| mantine.webkitFontSmoothing |  | `antialiased` | WebKit font smoothing. 'antialiased' for crisp text on macOS/iOS. |
| mantine.zIndex.app | number | `100` | Base app layer z-index |
| mantine.zIndex.max | number | `9999` | Maximum z-index for critical elements |
| mantine.zIndex.modal | number | `200` | Modal dialog z-index |
| mantine.zIndex.overlay | number | `400` | Overlay/backdrop z-index |
| mantine.zIndex.popover | number | `300` | Popover/dropdown z-index |
| opacity.0 | opacity | `0` | Fully transparent (0%). Use for: hidden elements, animation start states, invisible interactive areas. Element is invis… |
| opacity.10 | opacity | `0.1` | 10% opacity - subtle transparency. Use for: light hover backgrounds, subtle shadows, faint overlays. Minimally percepti… |
| opacity.100 | opacity | `1` | Fully opaque (100%). Use for: solid elements, removing inherited transparency, default element state. CSS: opacity: 1; … |
| opacity.20 | opacity | `0.2` | 20% opacity - light transparency. Use for: hover states, light overlays, muted backgrounds. Noticeable but unobtrusive. |
| opacity.25 | opacity | `0.25` | 25% opacity - quarter visible. Use for: skeleton loading states, light dimming, subtle backgrounds. Common for placehol… |
| opacity.30 | opacity | `0.3` | 30% opacity - moderate transparency. Use for: image overlays, text shadows, moderate dimming. Visible but allows conten… |
| opacity.40 | opacity | `0.4` | 40% opacity - semi-transparent. Use for: medium overlays, watermarks, partially hidden content. Balanced visibility. |
| opacity.5 | opacity | `0.05` | 5% opacity - barely visible. Use for: extremely subtle hover states, ghost backgrounds, near-invisible separators. Only… |
| opacity.50 | opacity | `0.5` | 50% opacity - half visible. Use for: disabled elements (semantic alias: 'disabled'), balanced overlays, de-emphasized c… |
| opacity.60 | opacity | `0.6` | 60% opacity - mostly visible. Use for: modal backdrops (semantic alias: 'overlay'), dimmed backgrounds, focus-drawing o… |
| opacity.70 | opacity | `0.7` | 70% opacity - high visibility. Use for: heavy overlays, strong dimming, de-emphasized backgrounds. Most content visible… |
| opacity.75 | opacity | `0.75` | 75% opacity - three-quarters visible. Use for: dark overlays, strong backgrounds, significant dimming. Mostly solid wit… |
| opacity.80 | opacity | `0.8` | 80% opacity - mostly solid. Use for: nearly-opaque overlays, frosted glass effects (with backdrop-filter), heavy backgr… |
| opacity.90 | opacity | `0.9` | 90% opacity - nearly solid. Use for: subtle transparency effects, slight see-through, glass-like surfaces. Almost indis… |
| opacity.disabled | opacity | `0.5` | Disabled element opacity (50%). SEMANTIC alias for opacity.50. Use for: disabled buttons, inactive controls, unavailabl… |
| opacity.overlay | opacity | `0.6` | Modal overlay opacity (60%). SEMANTIC alias for opacity.60. Use for: modal backdrops, lightbox backgrounds, focus-drawi… |
