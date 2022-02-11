import {
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    PlaneGeometry,
    Scene,
    TextureLoader,
    Vector2,
} from 'three';
import { Injectable } from '../ioc/injector';
import SceneProvider from '../providers/scene.provider';
import ViewportProvider from '../providers/viewport.provider';
import { OnRender, OnViewResize, OnUpdate } from '../util/lifecycle';
import BaseScene from './base-scene';
import splashSrc from '../assets/splash.jpg';
import GameScene from './game.scene';

@Injectable()
export default class SplashScene extends BaseScene implements OnUpdate, OnRender, OnViewResize {
    private camera: OrthographicCamera;
    private plane: Mesh<PlaneGeometry, MeshBasicMaterial>;

    private readonly bounds = 0.6;
    private readonly splashDuration = 500;

    constructor(private viewportProvider: ViewportProvider, private sceneProvider: SceneProvider) {
        super();
        this.scene = new Scene();
        const bounds = this.getViewBounds();
        this.camera = new OrthographicCamera(-bounds.x, bounds.x, bounds.y, -bounds.y, -1, 10);
        this.camera.position.z = 5;

        const planeGeometry = new PlaneGeometry(1.2, 0.859);
        const planeTexture = new TextureLoader().load(splashSrc);
        const planeMaterial = new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide, map: planeTexture });
        this.plane = new Mesh(planeGeometry, planeMaterial);
        this.scene.add(this.plane);

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

    onUpdate() {}

    onRender() {
        this.viewportProvider.Renderer.render(this.scene, this.camera);
    }

    onViewResize() {
        const bounds = this.getViewBounds();
        this.camera.left = -bounds.x;
        this.camera.right = bounds.x;
        this.camera.top = bounds.y;
        this.camera.bottom = -bounds.y;
        this.camera.updateProjectionMatrix();
    }
}
