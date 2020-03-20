export interface WorldObject {
  update(timeOfDay: number, day: number): void;

  paint(
    timeOfDay: number,
    day: number,
    ctx: CanvasRenderingContext2D
  ): void;
}
