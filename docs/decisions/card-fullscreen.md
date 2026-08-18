# Fullscreen and scale-to-fit for the embedded Card game

Concerns `portfolio-frontend/src/Screens/Projects/Projects.{jsx,css}`.

## The problem

On a phone, the game's bottom action row — PLAY HAND, DISCARD, the sort control —
was cut off. It predates the embed: the same thing happens playing the game
directly, and fullscreen mode on its own did not fix it.

## Why the game cannot fit itself

From the game's own web shell (`public/card/index.html`):

> THE DESKTOP FRAME. The app is a portrait phone layout and nothing in it reads
> window dimensions (there is no `useWindowDimensions` in the source) […] Below
> this breakpoint — real phones — the game is full-bleed and none of this applies.

Two consequences:

- **Desktop is fine by accident of that frame.** Above `min-width: 680px` the
  shell wraps the game in a 430-wide box at `height: min(932px, 100dvh - 56px)`,
  so a short window shrinks the frame.
- **Phones get nothing.** Below that breakpoint the game renders full-bleed at its
  natural height. Its layout is fixed — nothing reads window dimensions, and
  React Native's `flexShrink` defaults to `0`, so the vertical stack never
  compresses. Anything taller than the viewport is clipped, and the action row is
  last, so it goes first.

Fullscreen helped only where the browser allowed. Android's Fullscreen API hides
the chrome; **iOS Safari has no Fullscreen API for non-video elements**, so the
address bar stays and takes ~90 px that no web page can reclaim.

## The fix

In fullscreen **on compact viewports only** (`max-width: 700px`), the iframe is
laid out at the game's own design size — 430 × 932 — and CSS-transformed down to
fit:

```js
setScale(Math.min(width / GAME_W, height / GAME_H, 1));
```

A `ResizeObserver` on the stage re-fits on rotation and on address-bar collapse.
Because the game's box is fixed, scaling is the only fit that **cannot** clip
anything.

Desktop is deliberately excluded. The game already frames itself above 680 px,
and forcing a 430 px-wide iframe there would suppress that media query and make a
laptop render the phone layout.

**The trade-off:** on a short phone everything is ~15 % smaller, and the game's
labels are already 8–10 px. Accepted because a small action row beats an invisible
one.

## What this is not

Brendan's portfolio was the reference, and it does something different from what
it appears to. His `/card/` page is byte-identical to ours — same game build — and
his bundle contains **no `requestFullscreen`**. His version fits because the iframe
is sized `height: min(844px, 100dvh - 130px)`. Useful, but it does not solve the
clipping; it only avoids making it worse.

## The real fix lives in Card

Scaling is compensation, not a cure. The root fix is in the game: let the Table
layout compress on short viewports (flexShrink on the fan, tighter paddings, or
reading `useWindowDimensions`). That fixes the standalone game and both owners'
portfolios at once, and it is a game-design decision for the Card repo rather than
something the portfolio should keep papering over.
