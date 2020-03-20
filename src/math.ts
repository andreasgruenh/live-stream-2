export function random(from = 0, to = 1, decimals = 0) {
  const result = Math.random() * (to - from) + from;
  return round(result, decimals);
}

export function round(num: number, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}

export function sample<TValue>(arr: TValue[]) {
  return arr[random(0, arr.length - 1)];
}

export const PI = Math.PI;

export const floor = Math.floor;
export const ceil = Math.ceil;
export function clamp(
  num: number,
  lower: number,
  upper: number
) {
  return Math.max(Math.min(num, upper), lower);
}

export function difference(
  minuend: Point,
  subtrahend: Point
): Point {
  return [
    minuend[0] - subtrahend[0],
    minuend[1] - subtrahend[1]
  ];
}

export function add(a: Point, b: Point): Point {
  return [a[0] + b[0], a[1] + b[1]];
}

export function multiply(p: Point, factor: number): Point {
  return [p[0] * factor, p[1] * factor];
}

export const nullVector = [0, 0] as Point;

export function length(p: Point): number {
  return distance(nullVector, p);
}

export function normalize(p: Point): Point {
  const l = length(p);
  if (l === 0) return p;
  return multiply(p, 1 / l);
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export type Point = [number, number];
