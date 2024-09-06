import { Injectable } from './decorators/injectable';
import GameLoopProvider from './providers/game-loop.provider';
import PerformanceProvider from './providers/performance.provider';
import SceneProvider from './providers/scene.provider';
import SplashScene from './scenes/splash.scene';

@Injectable()
export default class App {
    constructor(
        private gameLoopProvider: GameLoopProvider,
        private performanceProvider: PerformanceProvider,
        private sceneProvider: SceneProvider,
    ) {
        gameLoopProvider.run();
        sceneProvider.switchScene(SplashScene);
    }
}
