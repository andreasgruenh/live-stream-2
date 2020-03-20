import { WorldLocation } from "./Location";
import {
  add,
  clamp,
  difference,
  distance,
  multiply,
  normalize,
  PI,
  Point,
  random,
  round
} from "./math";
import { WorldObject } from "./WorldObject";

export class Person implements WorldObject {
  home: Point;
  currentLocation: Point;

  currentTarget: Point;

  contactPersons: Set<Person> = new Set();
  speed: number;

  constructor(
    canvas: HTMLCanvasElement,
    public office: WorldLocation,
    public allPersons: Person[],
    public remainingInfectionDays = 0
  ) {
    this.speed = random(3, 20);
    this.home = [
      random(0, canvas.width),
      random(0, canvas.height)
    ];
    this.currentLocation = [...this.home] as Point;
    this.currentTarget = [...this.home] as Point;
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

    this.updateTarget(timeOfDay, day);

    const movementVector = difference(
      this.currentTarget,
      this.currentLocation
    );
    const normalized = normalize(movementVector);

    const delta = multiply(normalized, this.speed);
    this.currentLocation = add(this.currentLocation, delta);

    if (
      distance(this.currentLocation, this.currentTarget) <
      this.speed
    ) {
      this.currentLocation = this.currentTarget;
    }

    this.spreadMaybe();
  }

  updateTarget(timeOfDay: number, day: number) {
    if (round(timeOfDay) === 7) {
      this.currentTarget = this.office.location;
    }
    if (round(timeOfDay) === 16) {
      this.currentTarget = this.home;
    }
  }

  spreadMaybe() {
    if (this.remainingInfectionDays === 0) return;
    for (let i = 0; i < this.allPersons.length; i++) {
      const other = this.allPersons[i];
      if (other === this) continue;

      if (
        distance(
          this.currentLocation,
          other.currentLocation
        ) < 20
      ) {
        this.contactPersons.add(other);
      }
    }

    for (const other of this.contactPersons) {
      if (other.remainingInfectionDays !== 0) continue;

      if (
        distance(
          this.currentLocation,
          other.currentLocation
        ) > 20
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
      this.currentLocation[0] + random(-2, 2),
      this.currentLocation[1] + random(-2, 2),
      10,
      0,
      PI * 2
    );
    ctx.fillStyle =
      this.remainingInfectionDays > 0 ? "purple" : "orange";
    ctx.fill();
  }
}
