import { scaleLinear, ScaleLinear } from "d3";
import { WorldObject } from "./WorldObject";

export class Clock implements WorldObject {
  scaleX: ScaleLinear<number, number>;
  scaleY: ScaleLinear<number, number>;
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    this.scaleY = scaleLinear()
      .domain([0, 100])
      .range([y, y + height]);
    this.scaleX = scaleLinear()
      .domain([0, 24])
      .range([
        x + this.scaleY(50),
        x + width - this.scaleY(50)
      ]);
  }

  backgroundScale = scaleLinear<number, string>()
    .domain([1, 12, 23])
    .range([
      "rgba(28, 28, 70, 1)",
      "rgba(28, 28, 70, 0)",
      "rgba(28, 28, 70, 1)"
    ] as any);

  update(timeOfDay: number): void {}
  paint(
    timeOfDay: number,
    day: number,
    ctx: CanvasRenderingContext2D
  ): void {
    const x = this.scaleX(timeOfDay);
    const y = this.scaleY(50);

    ctx.arc(x, y, this.scaleY(50), 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.closePath();
    ctx.beginPath();

    ctx.arc(
      x - this.scaleY(30),
      y,
      this.scaleY(50),
      0,
      Math.PI * 2
    );
    ctx.fillStyle = this.backgroundScale(timeOfDay);
    ctx.fill();
  }
}
