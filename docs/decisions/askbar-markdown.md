# Rendering the assistant's markdown

Concerns `portfolio-frontend/src/components/AskBar/`.

## The problem

The chat panel printed `**word**` literally and ran every answer onto one line.

The answers were always markdown. Nothing asks the model for it — the system
prompt in `functions/persona.js` is itself written in markdown (`###` headings,
`- ` bullets), so the model mirrors the format it was handed. `AskBar.jsx` put
that string straight into a `<span>`, which shows the asterisks and folds the
newlines away, because HTML collapses whitespace and a span is inline.

## Why react-markdown and not a hand-rolled parser

A custom renderer was written first, on the argument that the library's ~43 kB
gzipped was too much for a landing page. Two things killed it:

1. **The bundle argument doesn't hold.** The panel is collapsed until opened
   (`AskBar.jsx`, the `isOpen` early return), so the renderer can be a lazy
   chunk and cost the landing page nothing.
2. **The parser's edge cases are real work.** Within minutes it hit `snake_case`
   being italicised by the `_em_` rule, and the "fix" was to drop valid markdown
   from what it supported. Every future edge case would have been ours.

react-markdown also refuses raw HTML unless `rehype-raw` is added, and runs
hrefs through a URL transform — so model output cannot inject markup without
hand-rolling an allowlist.

## Bundle shape

The parser loads in its own chunk, warmed when the panel opens, well before the
first answer returns over the network.

```
75.54 kB (+1.49 kB)  main.js         ← lazy/Suspense wiring only
42.78 kB             753.…chunk.js   ← react-markdown, deferred
   519 B             817.…chunk.js   ← the Markdown component
```

## Choices worth revisiting

- **Only assistant turns are parsed.** Visitor text echoes verbatim, so someone
  asking about `**kwargs` sees the asterisks they typed.
- **Headings clamp to h4–h6.** A model opening with `# Projects` should not
  outrank the page's own headings in the document outline.
- **No `remark-gfm`.** No tables, no strikethrough, and bare URLs and emails are
  not autolinked. The prompt hands out an email address, so autolinking may be
  worth the extra ~20 kB gzip.
- **Single newlines stay soft breaks**, per CommonMark — only blank-line
  separated text becomes a new paragraph. If answers still run together,
  `remark-breaks` turns every newline into a `<br>`.

## Not verified

The build compiles and splits correctly. Nobody has confirmed how it *looks* —
`/api/chat` is a Firebase rewrite that doesn't exist on the dev server, so
checking locally needs a stubbed assistant message.
