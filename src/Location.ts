import { WorldObject } from "./WorldObject";
import { PI } from "./math";

export class WorldLocation implements WorldObject {
  constructor(
    public x: number,
    public y: number,
    public label: string
  ) {}
  update(timeOfDay: number): void {}
  paint(
    timeOfDay: number,
    day: number,
    ctx: CanvasRenderingContext2D
  ): void {
    ctx.arc(this.x, this.y, 10, 0, PI * 2);
    ctx.fillStyle = "turquoise";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, this.x, this.y + 20);
  }
}
