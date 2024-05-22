import { Application, Graphics } from "https://cdn.jsdelivr.net/npm/pixi.js/dist/pixi.mjs";
import { SceneManager } from  "/pixi-scenes.mjs";
import MenuScene from "/scenes/menu-scene.js";
import CreditsScene from "/scenes/credits-scene.js";
import GameScene from "/scenes/game-scene.js";

const app = new Application();
await app.init({
  hello: true,
  resizeTo: window,
  preference: "webgl",
  powerPreference: "low-power",
  useBackBuffer: true,
  antialias: true,
  autDensity: true,
  background: 0x000000,
  canvas: document.getElementById("game"),
  resolution: 1,
});

const scenes = new SceneManager(app);
scenes.register("menu", new MenuScene());
scenes.register("credits", new CreditsScene());
scenes.register("game", new GameScene());
scenes.changeSceneTo("menu");
