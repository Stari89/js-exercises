import {
    BoxGeometry,
    DirectionalLight,
    Group,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    Vector3,
} from 'three';
import { Injectable } from '../ioc/injector';
import ViewportProvider from '../providers/viewport.provider';
import { OnRender, OnViewResize, OnUpdate } from '../util/lifecycle';
import BaseScene from './base-scene';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import sceneSrc from '../assets/planet/scene.glb';

@Injectable()
export default class GameScene extends BaseScene implements OnUpdate, OnRender, OnViewResize {
    private camera: PerspectiveCamera;
    private planet: Group;

    constructor(private viewportProvider: ViewportProvider) {
        super();
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, viewportProvider.Aspect, 0.1, 1000);
        this.camera.position.z = 5;

        const loader = new GLTFLoader();
        loader.load(sceneSrc, (gltf) => {
            this.planet = gltf.scene;
            this.planet.scale.x = 15;
            this.planet.scale.y = 15;
            this.planet.scale.z = 15;
            this.scene.add(this.planet);

            const light = new DirectionalLight(0xffffff, 3);
            light.position.x = 1;
            light.position.y = 1;
            light.position.z = 10;
            this.scene.add(light);
            this.viewportProvider.Renderer.setClearColor(0x8888ff);
        });
    }

    onUpdate() {
        if (!this.planet) {
            return;
        }
        // this.planet.rotation.x += 0.01;
        this.planet.rotation.y += 0.001;
    }

    onRender() {
        this.viewportProvider.Renderer.render(this.scene, this.camera);
    }

    onViewResize() {
        this.camera.aspect = this.viewportProvider.Aspect;
        this.camera.updateProjectionMatrix();
    }
}
