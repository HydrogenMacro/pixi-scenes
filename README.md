# pixi-scenes
A lightweight scene library for Pixi.js

Scenes are a high-level method of organization of different "pages" of an application, like for the menus of a game or the different slides of a slideshow.

 > ⚠️ This library is still in heavy development, and many things are subject to drastic change.

Dedicated documentation is coming soon™, but there are JSDoc comments. Overall, this is meant to be a simple and forthright library, so most of the features are shown below: 

## Usage

In main file:
```js
import { SceneManager } from "https://cdn.jsdelivr.net/gh/hydrogenmacro/pixi-scenes@master/pixi-scenes.mjs";
import MenuScene from "./scenes/menu.js";
import GameScene from "./scenes/game.js";
import * as PIXI from "/pixi.mjs";
const app = new PIXI.Application();
await app.init({ /* ... */ });
const scenes = new SceneManager(app);
// register the scenes
scenes.register("menu", new MenuScene());
scenes.register("game", new GameScene());
scenes.changeSceneTo("menu"); // setting the initial scene to be displayed
```
In `scenes/menu.js`:
```js
import { Scene } from "https://cdn.jsdelivr.net/gh/hydrogenmacro/pixi-scenes/pixi-scenes.mjs";
import * as PIXI from "/pixi.mjs";

export default class MenuScene extends Scene {
   init() {
      // filters for a transition fade
      this.fadeFilter = new PIXI.ColorMatrixFilter();
      this.filters = [this.fadeFilter];

      // Changing scenes:
      // this.manager will be a reference to the scene manager holding this scene, and this.manager will only be availible in or after Scene.init is called
      this.manager.changeSceneTo("game");

      // you can also pass in a message of any type that is passed to the next scene's start function
      this.manager.changeSceneTo("game", { hi: "hello" });
      this.manager.changeSceneTo("game", 123456);
   }
   // notice that this is a generator function; this is how scene transitions can be animated
   *start(delta, message = null) {
      if (message)
         console.log("recieved message from previous scene: ", message)
      // a simple fade transition
      const durationSecs = .5;
      for (let t = 0; t < 1; t += delta / (60 * durationSecs)) {
         this.fadeFilter.brightness(t, false);
         // note how every iterator advance passes in a delta, which can be read from the `yield` keyword.
         delta = yield;
      }
      this.fadeFilter.brightness(1, false);
   }
   tick(delta) {
      // this is called every time the ticker that the scene manager uses is called (this.manager.ticker, defaults to Ticker.shared)

      // references to the app and the screen are provided
      let screenWidth = this.manager.screen.width;
      this.manager.app.renderer.background.color = 0xFF00FF; // changes the background color 
   }
   // this is also a generator, but feel free to just return if you want an instant transition
   *end(delta) {
      return;
   }
}
```

## Possible Caveats
 - Resizing
    - Resizing the application or using autoDensity requires you to manually adjust your positionings/sizes
    - Signals from any third party should solve this
 - Verbosity
    - The innate verbosity of Pixi.js along with the extensive use of `this` *might* contribute to large code sizes, but the use of abstractions should help with this.
    
## TODO
 - Layers
    - Dealing with z-index can be cumbersome, so even a simple layer system can help with unnecessary bugs and caveats.
    - Maybe default Pixi layer integration after it gets ported to 8.x
 - Events
    - Events between scenes?
 - Pausing/resuming scenes
 - Saving/resetting scenes
 - Transition improvements
 - Asset management
 - More/better examples