import { Injectable } from './ioc/injector';
import GameLoopProvider from './providers/game-loop.provider';
import InputProvider from './providers/input.provider';
import CanvasProvider from './providers/canvas.provider';
import SceneProvider from './providers/scene.provider';
import EntityContainer from './entity/entity-container';
import EntityProvider from './entity/entity.provider';
import SpriteSystem from './systems/sprite.system';
import GravitySystem from './systems/gravity.system';
import PlanetFactory from './entity/planet-factory';
import ForceVisualizationSystem from './systems/force-visualization.system';
import GridSystem from './systems/grid.system';
import StarfieldFactory from './entity/starfield-factory';
import SceneFactory from './providers/scene.factory';

@Injectable()
export default class CanvasApp {
	constructor(
		private gameLoopProvider: GameLoopProvider,
		private inpurProvider: InputProvider,
		private canvasProvider: CanvasProvider,
		private entityContainer: EntityContainer,
		private entityBuilder: EntityProvider,
		private sceneFactory: SceneFactory,
		private sceneProvider: SceneProvider,
		private planetFactory: PlanetFactory,
		private starfieldFactory: StarfieldFactory,
		private gridSystem: GridSystem,
		private planetSystem: GravitySystem,
		private spriteSystem: SpriteSystem
	) {
		gameLoopProvider.run();
	}
}
