import {
  Text,
  Graphics
} from "https://cdn.jsdelivr.net/npm/pixi.js/dist/pixi.mjs";
import { Scene } from "/pixi-scenes.mjs";
import Button from "/ui/button.js";

export default class CreditsScene extends Scene {
  init() {
    this.background = new Graphics()
      .rect(0, 0, this.manager.screen.width, this.manager.screen.height)
      .fill(0xffffff);
    
    this.creditsTitleText = new Text({
      text: "Credits",
      anchor: 0.5,
      style: {
        fontFamily: "monospace",
        fontSize: 72,
        fill: 0x000000,
      },
    });
    this.creditsTitleText.position.set(
      this.manager.screen.width / 2,
      this.manager.screen.height / 4
    );
    this.creditsText = new Text({
      text: "HydrogenMacro",
      anchor: 0.5,
      style: {
        fontFamily: "monospace",
        fontSize: 24,
        fill: 0x000000,
      },
    });
    this.creditsText.position.set(
      this.manager.screen.width / 2,
      this.manager.screen.height / 2
    );
    
    this.backButton = new Button(
      new Text({
        text: "Back",
        anchor: 0.5,
        style: { fontFamily: "monospace" },
      }),
      new Graphics().rect(0, 0, 180, 60).fill({ color: 0xcccccc })
    );
    this.backButton.position.set(
      this.manager.screen.width / 2,
      this.manager.screen.height / 2 + 80
    );
    this.backButton.recenter();
    
    this.backButton.on("click", () => {
      this.manager.changeSceneTo("menu");
    });
    
    this.addChild(this.background, this.creditsTitleText, this.creditsText, this.backButton)
  }
}