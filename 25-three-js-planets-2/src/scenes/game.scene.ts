import { DirectionalLight, Scene, Vector2 } from 'three';
import ViewportProvider from '../providers/viewport.provider';
import BaseScene from './base-scene';
import EntityProvider from '../providers/entity.provider';
import Entity from '../entity/entity';
import SceneComponent from '../components/scene.component';
import CameraComponent from '../components/camera.component';
import CameraSystem from '../systems/camera.system';
import LightComponent from '../components/light.component';
import LightSystem from '../systems/light.system';
import MeshSceneSystem from '../systems/mesh-scene.system';
import CelestialBodyFactory from '../factories/celestial-body.factory';
import MeshTransformSystem from '../systems/mesh-transform.system';
import GravitySystem from '../systems/gravity.system';
import { Injectable } from '../decorators/injectable';

@Injectable()
export default class GameScene extends BaseScene {
    constructor(
        private viewportProvider: ViewportProvider,
        private entityProvider: EntityProvider,
        private celestialBodyFactory: CelestialBodyFactory,
        private cameraSystem: CameraSystem,
        private lightSystem: LightSystem,
        private meshSceneSystem: MeshSceneSystem,
        private gravitySystem: GravitySystem,
        private meshTransformSystem: MeshTransformSystem,
    ) {
        super();
    }

    async init() {
        const sceneEntity = new Entity();
        const sceneComponent = new SceneComponent({ scene: new Scene() });
        sceneEntity.push(sceneComponent);

        const cameraComponent = new CameraComponent({
            bounds: 500,
            cameraType: 'orthographic',
            near: -10000,
            far: 10000,
        });
        sceneEntity.push(cameraComponent);
        this.entityProvider.pushNextScene(sceneEntity);

        const sunEntity = this.celestialBodyFactory.generateCelestialBody(
            new Vector2(0, 0),
            new Vector2(0, 0),
            1200,
            0xffff00,
        );
        this.entityProvider.pushNextScene(sunEntity);

        const planetEntity1 = this.celestialBodyFactory.generateCelestialBody(
            new Vector2(400, 0),
            new Vector2(0, 0.0575),
            24,
            0x00ffff,
        );
        this.entityProvider.pushNextScene(planetEntity1);

        const planetEntity2 = this.celestialBodyFactory.generateCelestialBody(
            new Vector2(-400, 0),
            new Vector2(0, -0.0575),
            24,
            0xff00ff,
        );
        this.entityProvider.pushNextScene(planetEntity2);

        // 200: ~11ms => ~6ms
        // 500: ~70ms => ~36ms
        // 1000: ??ms => ~137ms
        for (let i = 0; i < 200; i++) {
            const peble = this.celestialBodyFactory.generateCelestialBody(
                new Vector2(Math.random() * 1000 - 500, Math.random() * 1000 - 500),
                new Vector2(Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1),
                Math.random() * 100,
                Math.random() * 0xffffff,
            );
            this.entityProvider.pushNextScene(peble);
        }

        const light = new DirectionalLight(0xffffff, 3);
        light.position.x = 1;
        light.position.y = 1;
        light.position.z = 10;

        const lightComponent = new LightComponent({ light });
        const lightEntity = new Entity();
        lightEntity.push(lightComponent);
        this.entityProvider.pushNextScene(lightEntity);

        this.viewportProvider.Renderer.setClearColor(0x8888ff);
    }
}
