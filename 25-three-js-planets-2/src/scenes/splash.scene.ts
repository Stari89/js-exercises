import { Scene } from 'three';
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
import MeshSceneSystem from '../systems/mesh-scene.system';
import GameScene from './game.scene';

@Injectable()
export default class SplashScene extends BaseScene {
    private readonly splashDuration = 500;

    constructor(
        private viewportProvider: ViewportProvider,
        private sceneProvider: SceneProvider,
        private entityProvider: EntityProvider,
        private planeFactory: PlaneFactory,
        private cameraSystem: CameraSystem,
        private meshSystem: MeshSceneSystem,
    ) {
        super();
    }

    async init() {
        const sceneEntity = new Entity();
        const sceneComponent = new SceneComponent({ scene: new Scene() });
        const cameraComponent = new CameraComponent({ cameraType: 'orthographic', bounds: 0.6 });

        const planeEntity = await this.planeFactory.generateSplashPlane();

        sceneEntity.push(sceneComponent);
        sceneEntity.push(cameraComponent);
        this.entityProvider.pushNextScene(sceneEntity);
        this.entityProvider.pushNextScene(planeEntity);

        setTimeout(() => this.sceneProvider.switchScene(GameScene), this.splashDuration);
    }
}
