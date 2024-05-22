import {
  Text,
  ColorMatrixFilter,
  Graphics,
  Assets,
  GraphicsContext,
} from "https://cdn.jsdelivr.net/npm/pixi.js/dist/pixi.mjs";
import { Scene } from "/pixi-scenes.mjs";
import Button from "/ui/button.js";

export default class MenuScene extends Scene {
  init() {
    this.text = new Text({
      text: "PONG",
      anchor: 0.5,
      style: {
        fontFamily: "monospace",
        fontSize: 72,
        fill: 0x000000,
      },
    });
    this.text.position.set(
      this.manager.screen.width / 2,
      this.manager.screen.height / 4
    );

    this.background = new Graphics()
      .rect(0, 0, this.manager.screen.width, this.manager.screen.height)
      .fill(0xffffff);

    this.playButton = new Button(
      new Text({
        text: "Play",
        anchor: 0.5,
        style: { fontFamily: "monospace" },
      }),
      new Graphics().rect(0, 0, 180, 60).fill({ color: 0xcccccc })
    );
    this.playButton.position.set(
      this.manager.screen.width / 2,
      this.manager.screen.height / 2
    );
    this.playButton.recenter();
    this.playButton.on("click", () => {
      this.manager.changeSceneTo("game");
    });
    
    this.creditsButton = new Button(
      new Text({
        text: "Credits",
        anchor: 0.5,
        style: { fontFamily: "monospace" },
      }),
      new Graphics().rect(0, 0, 180, 60).fill({ color: 0xcccccc })
    );
    this.creditsButton.position.set(
      this.manager.screen.width / 2,
      this.manager.screen.height / 2 + 80
    );
    this.creditsButton.recenter();
    
    this.creditsButton.on("click", () => {
      this.manager.changeSceneTo("credits");
    });
    this.addChild(this.background, this.text, this.playButton, this.creditsButton);
    
    this.endFadeFilter = new ColorMatrixFilter();
    this.filters = [this.endFadeFilter];
  }
  *start(delta, message) {
    const endDurationSecs = .5;
    for (let t = 0; t < 1; t += delta / (60 * endDurationSecs)) {
      this.endFadeFilter.brightness(t, false);
      delta = yield;
    }
    this.endFadeFilter.brightness(1, false);
  }
  tick(delta) {}
  *end(delta) {
    const endDurationSecs = .5;
    for (let t = 1; t > 0; t -= delta / (60 * endDurationSecs)) {
      this.endFadeFilter.brightness(t, false);
      delta = yield;
    }
    this.endFadeFilter.brightness(1, false);
  }
}
