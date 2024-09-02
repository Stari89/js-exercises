import { Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, Vector2 } from 'three';
import { Injectable } from '../ioc/injector';
import SceneProvider from '../providers/scene.provider';
import ViewportProvider from '../providers/viewport.provider';
import BaseScene from './base-scene';
import Entity from '../entity/entity';
import SceneComponent from '../components/scene.component';
import CameraComponent from '../components/camera.component';
import PlaneFactory from '../factories/plane.factory';
import EntityProvider from '../providers/entity.provider';
import CameraSystem from '../systems/camera.system';
import MeshSystem from '../systems/mesh.system';
import GameScene from './game.scene';

@Injectable()
export default class SplashScene extends BaseScene {
    private readonly bounds = 0.6;
    private readonly splashDuration = 50;

    constructor(
        private viewportProvider: ViewportProvider,
        private sceneProvider: SceneProvider,
        private entityProvider: EntityProvider,
        private planeFactory: PlaneFactory,
        private cameraSystem: CameraSystem,
        private meshSystem: MeshSystem,
    ) {
        super();
    }

    async init() {
        const sceneEntity = new Entity();
        const sceneComponent = new SceneComponent({ scene: new Scene() });

        const bounds = this.getViewBounds();
        const camera = new OrthographicCamera(-bounds.x, bounds.x, bounds.y, -bounds.y, -1, 10);
        camera.position.z = 5;
        const cameraComponent = new CameraComponent({ camera });

        const planeEntity = await this.planeFactory.generateSplashPlane();

        sceneEntity.push(sceneComponent);
        sceneEntity.push(cameraComponent);
        this.entityProvider.pushNextScene(sceneEntity);
        this.entityProvider.pushNextScene(planeEntity);

        setTimeout(() => this.sceneProvider.switchScene(GameScene), this.splashDuration);
    }

    private getViewBounds() {
        const { Aspect: aspect } = this.viewportProvider;
        const xAspect = aspect > 1 ? aspect : 1;
        const yAspect = aspect < 1 ? 1 / aspect : 1;
        const xBound = this.bounds * xAspect;
        const yBound = this.bounds * yAspect;
        return new Vector2(xBound, yBound);
    }
}
