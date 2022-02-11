import { BoxGeometry, DirectionalLight, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene } from 'three';
import { Injectable } from '../ioc/injector';
import SceneProvider from '../providers/scene.provider';
import ViewportProvider from '../providers/viewport.provider';
import { OnRender, OnViewResize, OnUpdate } from '../util/lifecycle';
import BaseScene from './base-scene';
import GameScene from './game.scene';

@Injectable()
export default class LoadingScene extends BaseScene implements OnUpdate, OnRender, OnViewResize {
    private camera: PerspectiveCamera;
    private cube: Mesh<BoxGeometry, MeshPhongMaterial>;

    constructor(private viewportProvider: ViewportProvider, private sceneProvider: SceneProvider) {
        super();
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, viewportProvider.Aspect, 0.1, 1000);
        this.camera.position.z = 5;

        const geometry = new BoxGeometry();
        const material2 = new MeshPhongMaterial({ color: 0xffff00 });
        this.cube = new Mesh(geometry, material2);
        this.scene.add(this.cube);

        const light = new DirectionalLight(0xffffff, 1.2);
        light.position.x = 1;
        light.position.y = 1;
        light.position.z = 10;
        this.scene.add(light);

        setTimeout(() => {
            sceneProvider.switchScene(GameScene);
        }, 3000);
    }

    onUpdate() {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
    }

    onRender() {
        this.viewportProvider.Renderer.render(this.scene, this.camera);
    }

    onViewResize() {
        this.camera.aspect = this.viewportProvider.Aspect;
        this.camera.updateProjectionMatrix();
    }
}
