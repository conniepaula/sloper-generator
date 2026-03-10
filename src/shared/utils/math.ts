export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

export const areFloatsEqual = (
  float1: number,
  float2: number,
  epsilon: number = 0.001,
): boolean => {
  return Math.abs(float1 - float2) < epsilon;
};
