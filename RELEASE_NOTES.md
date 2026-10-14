# Books and Reviews 1.0.1

Maintenance release: code-quality fixes requested by the Obsidian review.

- Uses CSS classes instead of inline styles for show/hide and static styling.
- Language detection through Obsidian's `getLanguage()`; minimum Obsidian version is now **1.8.0**.
- Safer typing of frontmatter updates, `instanceof TFile` checks and Obsidian DOM helpers.
- Virtual library: faster redraw, sorting and drag-and-drop, lighter background image, bilingual **Guide to sets** and a welcome screen for an empty library.
- Build: `builtin-modules` replaced by Node's `module.builtinModules`.

---

# Books and Reviews 1.0.0

First public release.

## Highlights
- One note per book, with a library list, search, status filter, sortable and configurable columns, sticky header/footer and totals.
- Structured yes/no reviews grouped by weighted themes → **ARL score 0–10** and **stars** from per-set thresholds.
- Editable **evaluation sets** (bundled: Novels, Essays / Romanzi, Saggi), with a computed **difficulty level**.
- **Score colours** per set (five bands, solid or gradient) on theme bars, ARL values and the library list.
- **Reading log**, reading **progress bar** and **pages-per-day chart** with gradient and tooltips.
- Characters, quotes and annotations, awards, price, return dates, covers (vault, computer, link).
- **Virtual library**: a bookshelf of coloured spines (genre colour, page thickness, title/author/code), drag-and-drop arrangement saved between sessions and one-click sorting by code, reading date or pages.
- **Live ARL and stars** while answering, and a configurable highlight of the **current question**.
- **Image gallery** with optional captions, **pages remaining** in the reading progress, **Library information** window and a visible **← Back** button.
- No books are bundled: the library starts empty with a short welcome; a bilingual **Guide to sets** explains how to build your own.
- English and Italian interface, switchable live; fonts, sizes, colours, widths and bar thicknesses configurable.

## Install
Download `main.js`, `manifest.json` and `styles.css` and copy them into
`<vault>/.obsidian/plugins/books-and-reviews/`, then enable the plugin.
