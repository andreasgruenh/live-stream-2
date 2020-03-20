import { WorldObject } from "./WorldObject";
import { Clock } from "./Clock";
import { scaleLinear } from "d3";
import { Person } from "./Person";
import { WorldLocation } from "./Location";
import { floor, sample } from "./math";

const speedFactor = 4;

export class GameLoop {
  private frameIndex = 0;
  private worldObjects: WorldObject[] = [];
  private persons: Person[] = [];

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvas: HTMLCanvasElement
  ) {
    this.worldObjects.push(
      new Clock(0, 0, canvas.width - 10, 50)
    );

    const superMarket = new WorldLocation(
      400,
      400,
      "Netto"
    );
    const office1 = new WorldLocation(40, 300, "Office 1");
    const office2 = new WorldLocation(200, 200, "Office 2");
    const office3 = new WorldLocation(400, 30, "Office 3");
    this.worldObjects.push(office1);
    this.worldObjects.push(office2);
    this.worldObjects.push(office3);

    this.worldObjects.push(superMarket);

    for (let i = 0; i < 10; i++) {
      this.persons.push(
        new Person(
          canvas,
          sample([office1, office2, office3]),
          this.persons,
          i === 0 ? 20 : 0
        )
      );
    }

    this.worldObjects.push(...this.persons);
  }

  renderLoop = () => {
    const ctx = this.ctx;
    ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const time = this.getTime();
    const day = this.getDay();

    this.update(time, day);
    this.paint(time, day);

    this.frameIndex++;
    requestAnimationFrame(this.renderLoop);
  };

  update(time: number, day: number) {
    for (let i = 0; i < this.worldObjects.length; i++) {
      this.worldObjects[i].update(time, day);
    }
  }

  paint(time: number, day: number) {
    for (let i = 0; i < this.worldObjects.length; i++) {
      this.ctx.beginPath();
      this.worldObjects[i].paint(time, day, this.ctx);
      this.ctx.closePath();
    }
  }

  getTime() {
    const realWorldSeconds = (this.frameIndex * 16) / 1000;
    const virtualHours = realWorldSeconds * speedFactor;

    const looped = virtualHours % 24;
    return looped;
  }

  getDay() {
    const realWorldSeconds = (this.frameIndex * 16) / 1000;
    const virtualHours = realWorldSeconds * speedFactor;

    const day = floor((virtualHours % (24 * 7)) / 24);
    return day;
  }
}
