import {
  BitmapText,
  Text,
  ColorMatrixFilter,
  Graphics,
  Assets,
  GraphicsContext,
  Rectangle,
} from "https://cdn.jsdelivr.net/npm/pixi.js/dist/pixi.mjs";
import { Scene } from "/pixi-scenes.mjs";
import Button from "/ui/button.js";

export default class GameScene extends Scene {
  init() {
    // settings button
    this.settingsButton = new Button(
      new Text({
        text: "Exit",
        anchor: 0.5,
        style: { fontFamily: "monospace" },
      }),
      new Graphics().rect(0, 0, 120, 50).fill({ color: 0xcccccc, alpha: .5 })
    );
    this.settingsButton.position.set(15, 15);
    this.settingsButton.on("click", () => {
      this.manager.changeSceneTo("menu");
    });
    
    this.addChild(this.settingsButton);
    
    
    // The rest of this file will describe the actual game
    // It may be quite verbose; the code may be simplified in
    // future versions
    
    // the paddles, paddleA and paddleB
    this.paddleA = new Graphics().rect(0, 0, 10, 80).fill(0xffffff);
    this.paddleA.position.x = (1 * this.manager.screen.width) / 8;
    // center the paddle vertically
    this.paddleA.position.y =
      this.manager.screen.height / 2 - this.paddleA.bounds.height / 2;

    this.paddleB = new Graphics().rect(0, 0, 10, 80).fill({ color: 0xffffff });
    this.paddleB.position.y =
      this.manager.screen.height / 2 - this.paddleB.bounds.height / 2;
    this.paddleB.position.x = (7 * this.manager.screen.width) / 8;

    // the pixels that a paddle will travel within 1/60th of a second
    this.paddleSpeed = 8;

    // this will be multiplied by the paddle speed,
    // so 0 means the paddle isn't moving,
    // 1 means the paddle is moving down,
    // and -1 means the paddle is moving up
    this.paddleAMoveDir = 0;
    this.paddleBMoveDir = 0;
    // listening to native keyboard events
    window.addEventListener("keydown", ({ key }) => {
      // `KeyboardEvent.key` reference: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
      switch (key) {
        case "w":
          // `this` keyword works because we are inside an arrow function
          this.paddleAMoveDir = -1;
          break;
        case "s":
          this.paddleAMoveDir = 1;
          break;
        case "ArrowUp":
          this.paddleBMoveDir = -1;
          break;
        case "ArrowDown":
          this.paddleBMoveDir = 1;
          break;
      }
    });
    window.addEventListener("keyup", ({ key }) => {
      switch (key) {
        case "w":
          if ((this.paddleAMoveDir === -1)) this.paddleAMoveDir = 0;
          break;

        case "s":
          if ((this.paddleAMoveDir === 1)) this.paddleAMoveDir = 0;
          break;

        case "ArrowUp":
          if ((this.paddleBMoveDir === -1)) this.paddleBMoveDir = 0;
          break;

        case "ArrowDown":
          if ((this.paddleBMoveDir === 1)) this.paddleBMoveDir = 0;
          break;
      }
    });

    this.ballRadius = 7;
    this.ball = new Graphics().circle(0, 0, this.ballRadius * 2).fill(0xffffff);
    this.ball.position.set(
      this.manager.screen.width / 2,
      this.manager.screen.height / 2 + Math.random() - .5 * this.manager.screen.height / 6
    );
    this.ballDx = Math.random() > 0.5 ? 1 : -1;
    this.ballDy = Math.random() > 0.5 ? 1 : -1;
    this.ballSpeed = 4;
    this.ballMoveCd = 120;

    this.score = [0, 0];
    this.scoreText = new BitmapText({
      text: "0 - 0",
      anchor: 0.5,
      style: {
        fontFamily: "monospace",
        fill: 0xffffff,
        align: "center",
      },
    });
    this.scoreText.position.set(this.manager.screen.width / 2, 30);

    this.addChild(this.scoreText, this.paddleA, this.paddleB, this.ball);

    this.endFadeFilter = new ColorMatrixFilter();
    this.filters = [this.endFadeFilter];
  }
  *start(delta, message) {
    const endDurationSecs = 0.5;
    for (let t = 0; t < 1; t += delta / (60 * endDurationSecs)) {
      this.endFadeFilter.brightness(t, false);
      delta = yield;
    }
    this.endFadeFilter.brightness(1, false);
  }
  tick(delta) {
    if (this.paddleAMoveDir) {
      this.paddleA.position.y += this.paddleAMoveDir * this.paddleSpeed * delta;
      // keep the paddle in bounds
      if (this.paddleA.position.y < 0) this.paddleA.position.y = 0;
      if (
        this.paddleA.position.y >
        this.manager.screen.height - this.paddleA.bounds.height
      )
        this.paddleA.position.y =
          this.manager.screen.height - this.paddleA.bounds.height;
    }
    if (this.paddleBMoveDir) {
      this.paddleB.position.y += this.paddleBMoveDir * this.paddleSpeed * delta;
      if (this.paddleB.position.y < 0) this.paddleB.position.y = 0;
      if (
        this.paddleB.position.y >
        this.manager.screen.height - this.paddleB.bounds.height
      )
        this.paddleB.position.y =
          this.manager.screen.height - this.paddleB.bounds.height;
    }

    if (this.ballMoveCd > 0) {
      this.ballMoveCd -= delta;
    } else {
      this.ball.position.x += this.ballDx * this.ballSpeed * delta;
      this.ball.position.y += this.ballDy * this.ballSpeed * delta;
    }
    // keep ball in bounds
    if (this.ball.position.y - this.ballRadius < 0) {
      this.ball.position.y = this.ballRadius;
      this.ballDy *= -1;
    }
    if (this.ball.position.y + this.ballRadius > this.manager.screen.height) {
      this.ball.position.y = this.manager.screen.height - this.ballRadius;
      this.ballDy *= -1;
    }
    
    if (
      new Rectangle(
        this.ball.position.x - this.ballRadius,
        this.ball.position.y - this.ballRadius,
        this.ballRadius * 2,
        this.ballRadius * 2
      ).intersects(
        new Rectangle(
          this.paddleA.position.x,
          this.paddleA.position.y,
          this.paddleA.bounds.width,
          this.paddleA.bounds.height
        )
      )
    ) {
      // this.ball.position.x = this.paddleA.position.x + this.paddleA.bounds.width + this.ballRadius;
      this.ballDx = 1;
    }
    if (
      new Rectangle(
        this.ball.position.x - this.ballRadius,
        this.ball.position.y - this.ballRadius,
        this.ballRadius * 2,
        this.ballRadius * 2
      ).intersects(
        new Rectangle(
          this.paddleB.position.x,
          this.paddleB.position.y,
          this.paddleB.bounds.width,
          this.paddleB.bounds.height
        )
      )
    ) {
      //this.ball.position.x = this.paddleB.position.x - this.ballRadius;
      this.ballDx = -1;
    }

    if (this.ball.position.x + this.ballRadius < 0) {
      this.score[1] += 1;
      this.newRound();
    }
    if (this.ball.position.x - this.ballRadius > this.manager.screen.width) {
      this.score[0] += 1;
      this.newRound();
    }
  }
  newRound() {
    this.scoreText.text = this.score[0] + " - " + this.score[1];
    this.ball.position.set(
      this.manager.screen.width / 2,
      this.manager.screen.height / 2 + Math.random() - .5 * this.manager.screen.height / 6
    );
    this.ballDx = Math.random() > 0.5 ? 1 : -1;
    this.ballDy = Math.random() > 0.5 ? 1 : -1;
    this.ballMoveCd = 120;
  }
  *end(delta) {
    const endDurationSecs = 0.5;
    for (let t = 1; t > 0; t -= delta / (60 * endDurationSecs)) {
      this.endFadeFilter.brightness(t, false);
      delta = yield;
    }
    this.endFadeFilter.brightness(1, false);
  }
}
