import { Injectable } from './ioc/injector';
import GameLoopProvider from './providers/game-loop.provider';
import SceneProvider from './providers/scene.provider';
import GameScene from './scenes/game.scene';
import SplashScene from './scenes/splash.scene';

@Injectable()
export default class App {
    constructor(
        private gameLoopProvider: GameLoopProvider,
        private sceneProvider: SceneProvider,
    ) {
        gameLoopProvider.run();
        sceneProvider.switchScene(SplashScene);
    }
}
