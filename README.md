# 🧵 Sloper Generator for Pattern Drafting (WIP)



This is a personal and experimental project for algorithmically drafting sewing pattern blocks/slopers.

The goal is to translate traditional flat pattern drafting into pure geometric logic.

With the help of this tool, beginner sewists can start working on their custom patterns without needing to build bodice blocks from scratch.

This project is a work in progress.

# ✨ Why?

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

# Usage example
- Input data:
```ts
export const MOCK_MEASUREMENTS: BodiceMeasurements = {
  bust: 90,
  waist: 72,
  frontWaistHeight: 42,
  backWaistHeight: 39,
  bustHeight: 25,
  centerFrontHeight: 34,
  centerBackHeight: 37,
  shoulderSlope: 3.5,
  shoulderLength: 12,
  apexToApex: 18,
  frontShoulderSpan: 36,
  backShoulderSpan: 39,
  bustFront: 46,
  frontArmscyeToArmscye: 32,
  backArmscyeToArmscye: 35,
};
```

- Output:
<img width="953" height="828" alt="image" src="https://github.com/user-attachments/assets/38ba5847-f77c-44bc-a00f-9e39452fe548" />


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

- Rendering layer
- Improving curves
- Inputting custom measurements
- Outputting A0 PDF file with correctly scaled pattern

### Future Ideas
- Add other slopers (skirt, trouser and sleeve)
- Add mens bodice sloper logic
- Automatically split patterns into Letter/A4 so they can be printed at home
- Allow users to perfect curves using anchor points or sliders
- Add 3d model showing where to take each measurement using Three.js




This is an experiment in combining patternmaking and computational geometry.
