export const cloneSvg = (
  svg: SVGSVGElement,
  height: number,
  width: number,
  minX: number,
  minY: number,
) => {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const g = clone.querySelector("g");
  if (g) {
    g.removeAttribute("transform");
  }

  clone.removeAttribute("class");
  clone.setAttribute("width", `${width}`);
  clone.setAttribute("height", `${height}`);
  clone.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);

  return clone;
};
