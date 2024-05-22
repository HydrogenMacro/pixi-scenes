import {
  Container
} from "https://cdn.jsdelivr.net/npm/pixi.js/dist/pixi.mjs";
export default class Button extends Container {
  constructor(label, background) {
    super();
    this.label = label;
    this.background = background;
    this.eventMode = "static";
    this.addChild(background, label);
    label.position.x += background.bounds.width / 2;
    label.position.y += background.bounds.height / 2;
  }
  
  recenter() {
    this.position.x -= this.background.bounds.width / 2;
    this.position.y -= this.background.bounds.height / 2;
  }
}