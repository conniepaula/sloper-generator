# 🧵 Sloper Generator for Pattern Drafting (WIP)

This is a personal and experimental project for algorithmically drafting sewing pattern blocks/slopers.

The goal is to translate traditional flat pattern drafting into pure geometric logic.

With the help of this tool, beginner sewists can start working on their custom patterns without needing to build bodice blocks from scratch.

This project is a work in progress.

# ✨ Why???

Since I started sewing my own clothes, many of my friends have asked me: "Can you **please** help me make something?"

However, the starting point for bespoke clothes is a paper sloper, and making those requires time, materials and multiple iterations, the first of which takes the longest.

This project makes it easy for people to _just start_: input your measurements, print out your sloper and begin fitting it immediately.

# 👩🏼‍💻 Tech Stuff
### Tools
 - TypeScript
- React with Vite
- Tailwind
- SVG
- Vitest

### How?

To draft the patterns, I transformed my own real world pattern-making experience into code, using:

  - Pure mathematical helpers to construct points, lines and vectors and perform explicit geometric transformations

  - Pattern drafting helpers separated by drafting domain (bodice, skirt, sleeve, etc...) 

  - SVG-based rendering

### Running locally

🚧 Keep in mind this project is very much under construction 🚧

After cloning the repository, 

```
pnpm install
pnpm dev
```

Then open:

`http://localhost:5173`

Run tests with:

`pnpm test`

# ⌨️ Status

### Currently working on:

- Bodice sloper (female)
- Dart folding / unfolding logic
- Inputting custom measurements
- Outputting A0 PDF file with correctly scaled pattern

### Future Ideas
- Add other slopers (skirt, trouser and sleeve)
- Automatically split patterns into Letter/A4 so they can be printed at home
- Allow users to perfect curves using anchor points or sliders
- Add 3d model showing where to take each measurement using Three.js




This is an experiment in combining patternmaking and computational geometry.
