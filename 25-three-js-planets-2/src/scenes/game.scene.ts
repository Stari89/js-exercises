import { DirectionalLight, Group, OrthographicCamera, PerspectiveCamera, Scene, Vector2 } from 'three';
import { Injectable } from '../ioc/injector';
import ViewportProvider from '../providers/viewport.provider';
import BaseScene from './base-scene';
import PlanetFactoryDeprecated from '../factories/planet.factory-deprecated';
import EntityProvider from '../providers/entity.provider';
import InvaderFactory from '../factories/invader.factory';
import InvaderComponent from '../components/invader.component';
import InvaderSystem from '../systems/invader.system';
import Entity from '../entity/entity';
import SceneComponent from '../components/scene.component';
import CameraComponent from '../components/camera.component';
import CameraSystem from '../systems/camera.system';
import LightComponent from '../components/light.component';
import LightSystem from '../systems/light.system';
import PlanetSystemDeprecated from '../systems/planet.system-deprecated';
import MeshSystem from '../systems/mesh.system';
import CelestialBodyFactory from '../factories/celestial-body.factory';

@Injectable()
export default class GameScene extends BaseScene {
    constructor(
        private viewportProvider: ViewportProvider,
        private entityProvider: EntityProvider,
        private celestialBodyFactory: CelestialBodyFactory,
        private planetFactory: PlanetFactoryDeprecated,
        private invaderFactory: InvaderFactory,
        private cameraSystem: CameraSystem,
        private lightSystem: LightSystem,
        private planetSystem: PlanetSystemDeprecated,
        private meshSystem: MeshSystem,
        private invaderSystem: InvaderSystem,
    ) {
        super();
    }

    async init() {
        const sceneEntity = new Entity();
        const sceneComponent = new SceneComponent({ scene: new Scene() });
        sceneEntity.push(sceneComponent);
        const cameraComponent = new CameraComponent({
            camera: new PerspectiveCamera(75, this.viewportProvider.Aspect, 0.1, 1000),
        });
        cameraComponent.camera.position.z = 5;
        sceneEntity.push(cameraComponent);
        this.entityProvider.pushNextScene(sceneEntity);

        // const planetEntity = await this.planetFactory.generatePlanet();
        // this.entityProvider.pushNextScene(planetEntity);

        const sunEntity = this.celestialBodyFactory.generateCelestialBody(
            new Vector2(0, 0),
            new Vector2(0, 0),
            1.2,
            0xffff00,
        );
        this.entityProvider.pushNextScene(sunEntity);

        const planetEntity = this.celestialBodyFactory.generateCelestialBody(
            new Vector2(3, 0),
            new Vector2(0, 0),
            0.2,
            0x00ffff,
        );
        this.entityProvider.pushNextScene(planetEntity);

        for (let i = 0; i < 50; i++) {
            const iType = Math.floor(Math.random() * 4);

            const invaderEntity = await this.invaderFactory.generateInvader(iType);
            const invaderComponent = invaderEntity.get(InvaderComponent);

            invaderComponent.frameSwitch = 300 + Math.random() * 1000 * 2;
            invaderComponent.rotationSpeed = Math.random() * 0.01;
            const x = (Math.random() - 0.5) * 15;
            const y = (Math.random() - 0.5) * 15;

            invaderComponent.meshList.forEach((m) => {
                m.position.x = x;
                m.position.y = y;
            });
            this.entityProvider.pushNextScene(invaderEntity);
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
