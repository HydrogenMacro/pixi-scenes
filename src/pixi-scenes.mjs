import {
  Container,
  Ticker,
} from "./deps/pixi.mjs";

/**
 * An abstract scene to be extended. This is intended to be
 * only type of direct children of the Application, and these
 * are managed by {@link SceneManager}.
 * @abstract
 */
export class Scene extends Container {
  /**
   * A reference to the scene manager.
   * This can only be accessed within and after {@link Scene#init}
   */
  manager = null;
  /**
   * This is basically just a constructor that is called directly after
   * the scene is registered. The purpose of this is 
   * so that {@link Scene#manager} would be valid when the scene is being
   * initialized in case you need access to, for example, 
   * {@link SceneManager#screen}.
   */
  init() {}
  /**
   * Called when the scene becomes active, and returns an iterator for animation.
   * The generator is advanced every frame until it returns, so
   * you can animate the enter animation for as long as you need to.
   * The delta is also passed into the generator every tick, which you can access with
   * the {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next#sending_values_to_the_generator|yield}
   * keyword — check out the examples.
   * This will play after the previous scene's {@link SceneManager#end}
   * and before this scene's {@link SceneManager#tick}.
   * @param {number} delta -
   *   see {@linkcode https://pixijs.download/release/docs/ticker.Ticker.html#deltaTime|Ticker.deltaTime}
   * @param {*} [message=null] - This contains anything that the previous scene wanted to send
   * @returns {Generator<undefined, undefined, number>}
   */
  *start(delta, message) {}
  /**
   * This gets called every time {@link https://pixijs.download/release/docs/ticker.Ticker.html|Pixi's Ticker}
   * gets ticked. This runs after the generator from {@link Scene#init} terminates.
   * @param {number} delta - 
   *   see {@linkcode https://pixijs.download/release/docs/ticker.Ticker.html#deltaTime|Ticker.deltaTime}
   */
  tick(delta) {}
  /**
   * Similar to {@link SceneManager#start}, but this will be called when this scene will be ending.
   * The generator is advanced every frame until it returns, so
   * you can animate the exit animation for as long as you need to.
   * This will play before the next scene's {@link SceneManager#start}.
   * Delta is passed into the generator, which can be accessed with 
   * {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next#sending_values_to_the_generator|yield}.
   * @param {number} delta - 
   *   see {@linkcode https://pixijs.download/release/docs/ticker.Ticker.html#deltaTime|Ticker.deltaTime}
   * @returns {Generator<undefined, undefined, number>}
   */
  *end(delta) {}
}

/** 
 A scene manager that can hold scenes.
 */
export class SceneManager {
  /**
   The scene being displayed currently.
   @type {Scene}
   */
  currentScene = null;
  _endAnimIter = null;
  _queuedScene = null;
  _queuedSceneMessage = null;
  _startAnimIter = null;
  _scenes = new Map();
  /**
   * The ticker that this manager uses.
   * @type {PIXI.Ticker}
   */
  ticker = Ticker.shared;
  /**
   * A reference to the Application of the manager
   * @type {PIXI.Application}
   */
  app;
  /**
   * A reference to the screen of the app.
   * This is implemented because getting the app's 
   * width and height is a common action.
   * @type {PIXI.Screen}
   */
  screen;
  /**
   * Creates a new SceneManager over an application.
   * @param {PIXI.Application} application
   */
  constructor(application) {
    this.app = application;
    this.screen = application.screen;
    this.ticker.add(
      function ({ deltaTime }) {
        if (this._endAnimIter) {
          if (this._endAnimIter.next(deltaTime).done) {
            this._endAnimIter = null;
            this.app.stage.removeChild(this.currentScene);
            this.currentScene = this._queuedScene;
            this.app.stage.addChild(this._queuedScene);
            this._startAnimIter = this.currentScene.start(
              deltaTime,
              this._queuedSceneMessage
            );
            this._queuedScene = this._queuedSceneMessage = null;
          }
        }
        if (this._startAnimIter) {
          if (this._startAnimIter.next(deltaTime).done) {
            this._startAnimIter = null;
          }
        }
        if (this.currentScene) {
          this.currentScene.tick(deltaTime);
        }
      }.bind(this)
    );
  }
  /**
   * Registers a scene with a specified sceneName, and calls the scene's {@link Scene#init} function
   * @type {string} sceneName
   * @type {Scene} scene
   */
  register(sceneName, scene) {
    scene.manager = this;
    this._scenes.set(sceneName, scene);
    scene.init();
  }
  /**
   * Changes the scene and optionally sends a message to the new scene
   * @type {string?} sceneName - scene must be registered first. If null, there will be no scene displayed.
   * @type {*} message - optional message sent to the next scene's {@link SceneManager#start}
   */
  changeSceneTo(sceneName = null, message = null) {
    if (this.currentScene) {
      this._endAnimIter = this.currentScene.end();

      this._queuedSceneMessage = message;
      if (sceneName !== null) {
        const queuedScene = this._scenes.get(sceneName);
        if (!queuedScene) {
          throw new Error(`Scene ${sceneName} not found.`);
        }
        this._queuedScene = queuedScene;
      }
    } else {
      if (sceneName !== null) {
        const currentScene = this._scenes.get(sceneName);
        if (!currentScene) {
          throw new Error(`Scene ${sceneName} not found.`);
        }
        this.currentScene = currentScene;
        this.app.stage.addChild(currentScene);
      }
    }
  }
}
