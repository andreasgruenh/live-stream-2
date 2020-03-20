import { WorldObject } from "./WorldObject";
import { random, PI, Point, clamp, distance } from "./math";
import { WorldLocation } from "./Location";
import { ScaleLinear, scaleLinear } from "d3";

export class Person implements WorldObject {
  homeX: number;
  homeY: number;
  x: number;
  y: number;

  contactPersons: Set<Person> = new Set();

  state:
    | "going-to-work"
    | "working"
    | "going-home"
    | "at-home" = "at-home";
  scalesByState: Record<
    Person["state"],
    ScaleLinear<number, Point>
  >;

  constructor(
    canvas: HTMLCanvasElement,
    office: WorldLocation,
    public allPersons: Person[],
    public remainingInfectionDays = 0
  ) {
    this.homeX = random(0, canvas.width);
    this.homeY = random(0, canvas.height);
    this.x = this.homeX;
    this.y = this.homeY;

    const home: Point = [this.homeX, this.homeY];
    const work: Point = [office.x, office.y];

    this.scalesByState = {
      "at-home": scaleLinear<number, Point>()
        .domain([0, 24])
        .range([home, home] as any),
      working: scaleLinear<number, Point>()
        .domain([0, 24])
        .range([work, work] as any),
      "going-home": scaleLinear<number, Point>()
        .domain([16, 19])
        .range([work, home] as any),
      "going-to-work": scaleLinear<number, Point>()
        .domain([6, 9])
        .range([home, work] as any)
    };
  }

  lastDay = 0;
  update(timeOfDay: number, day: number): void {
    if (day !== this.lastDay) {
      this.remainingInfectionDays = clamp(
        this.remainingInfectionDays - 1,
        0,
        Infinity
      );
      this.lastDay = day;
    }
    const state = this.getState(timeOfDay, day);
    const scale = this.scalesByState[state];
    [this.x, this.y] = scale(timeOfDay);

    this.spreadMaybe();
  }

  spreadMaybe() {
    if (this.remainingInfectionDays === 0) return;
    for (let i = 0; i < this.allPersons.length; i++) {
      const other = this.allPersons[i];
      if (other === this) continue;

      if (
        distance([this.x, this.y], [other.x, other.y]) < 20
      ) {
        this.contactPersons.add(other);
      }
    }

    for (const other of this.contactPersons) {
      if (other.remainingInfectionDays !== 0) continue;

      if (
        distance([this.x, this.y], [other.x, other.y]) > 20
      ) {
        this.contactPersons.delete(other);

        other.remainingInfectionDays = 20;
      }
    }
  }
  paint(
    timeOfDay: number,
    day: number,
    ctx: CanvasRenderingContext2D
  ): void {
    ctx.arc(
      this.x + random(-2, 2),
      this.y + random(-2, 2),
      10,
      0,
      PI * 2
    );
    ctx.fillStyle =
      this.remainingInfectionDays > 0 ? "purple" : "orange";
    ctx.fill();
  }

  getState(timeOfDay: number, day: number) {
    if (timeOfDay < 6) return "at-home";

    if (timeOfDay < 9) return "going-to-work";

    if (timeOfDay < 16) return "working";

    if (timeOfDay < 19) return "going-home";

    return "at-home";
  }
}
