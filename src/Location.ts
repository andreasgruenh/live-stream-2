import { PI, Point } from "./math";
import { WorldObject } from "./WorldObject";

export class WorldLocation implements WorldObject {
  constructor(
    public location: Point,
    public label: string
  ) {}
  update(timeOfDay: number): void {}
  paint(
    timeOfDay: number,
    day: number,
    ctx: CanvasRenderingContext2D
  ): void {
    ctx.arc(
      this.location[0],
      this.location[1],
      10,
      0,
      PI * 2
    );
    ctx.fillStyle = "turquoise";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.label,
      this.location[0],
      this.location[1] + 20
    );
  }
}
