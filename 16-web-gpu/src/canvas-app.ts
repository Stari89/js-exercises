import { Injectable } from './ioc/injector';
import { CanvasProvider } from './providers/canvas.provider';
import { GameLoopProvider } from './providers/game-loop.provider';
import { RenderProvider } from './providers/render.provider';

@Injectable()
export class CanvasApp {
    constructor(
        private gameLoopProvider: GameLoopProvider,
        private canvasProvider: CanvasProvider,
        private renderProvider: RenderProvider
    ) {
        gameLoopProvider.run();
    }
}
