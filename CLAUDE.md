# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Magic Tag is a single-file jQuery plugin (`$.fn.magicTags`) that renders a customizable tag/multi-select dropdown. The repo is a static site: `index.html` is both the demo page and the user-facing documentation (rendered at http://magictag.wolf.ua). User-facing copy and the README are in Russian — preserve the existing language when editing.

Requires jQuery 3.x (loaded from CDN in `index.html`). Bootstrap 5 and Font Awesome 5 are used only by the demo page; the plugin itself depends on Font Awesome for the `×` remove icon (`\f00d`) on selected tag chips.

## Repo layout

- `js/magicTag.js` — the entire plugin. One IIFE that registers `$.fn.magicTags`.
- `css/magicTag.less` — **source of truth for styles**. Edit this, not the compiled CSS.
- `css/magicTag.css` — compiled output of `magicTag.less`. Regenerate after editing the `.less` file (e.g. `lessc css/magicTag.less css/magicTag.css`).
- `css/bootstrap.min.css` — vendored, do not edit.
- `index.html` — demo page; also serves as the parameter reference table.

There is no package manager, build system, test suite, or linter. "Running" the project means opening `index.html` in a browser or serving the directory with any static server (e.g. `python3 -m http.server`).

## Plugin architecture

The plugin mutates the element it is called on (typically an empty `<div>`) rather than wrapping a native `<select>`. All DOM is built imperatively inside the factory function in `js/magicTag.js`.

Key internal structure (class names are part of the public CSS API — changing them breaks `magicTag.less`):

- `.mtags-form-tags` — the root container (added to `$(this)`).
- `.mtags-input-box` — holds the placeholder, chosen chips (`.mtags-input-item`), and the search input when `searchInListBox` is `false`.
- `.mtags-list-box` / `.mtags-list` — the dropdown and its scrollable item list.
- `.mtags-list-item` — one selectable row; gets `.selected` when chosen (CSS hides selected rows) and `.h` when filtered out by search.
- `.active` on the root toggles dropdown visibility; it is added on click and removed by a `$(document).mouseup` outside-click handler.

Options are normalized at the top of the factory with `undefined` checks — follow that pattern when adding new ones, and mirror any new option in the parameters table in `index.html` (and the JSDoc-style comment block at the top of the function).

Data items are either `{id, name, addClass?, selected?}` or `{divider: '...'}`. `name` is inserted with `.html()`, so callers can pass markup — be mindful if the source of `data` is ever untrusted.

Selection state lives **in the DOM only**: chips in `.mtags-input-box` are the source of truth, mirrored by `.selected` on list items. `this.getSelectedID()` reads IDs back from the chips. There is no separate state object, and no change event is fired — consumers must poll `getSelectedID()`.

Known quirks to preserve unless explicitly fixing:
- `clickListItem` has an empty `if (params.multiselect === true) {}` branch; the single-select cleanup lives in the `else`.
- The outside-click handler and the `.mtags-input-item` removal handler are bound to `$(document)` / `$('body')` without namespacing, so multiple instances share them — fine because they scope work via `$box.has(e.target)` and `data-id` lookups.
- `listBoxMaxHeight` defaults to `max(200, window.height/2)` and is only computed once at init (not on resize).

## Workflow notes

- Branch for this task: `claude/add-claude-documentation-K1v5X`. Develop, commit, and push there.
- When changing styles, edit `css/magicTag.less` and recompile to `css/magicTag.css`; `index.html` loads the `.css` with a `?v=` cache-buster — bump it if you want to force reloads in the live demo.
- When changing plugin options, update three places in sync: the options comment block in `js/magicTag.js`, the normalization block directly below it, and the parameters table at the bottom of `index.html`.
