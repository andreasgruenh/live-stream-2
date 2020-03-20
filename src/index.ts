import { GameLoop } from "./GameLoop";
import "./index.css";

const width = 500;
const height = 500;

const canvas = document.createElement("canvas");

canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d")!;
const loop = new GameLoop(ctx, canvas);

loop.renderLoop();
