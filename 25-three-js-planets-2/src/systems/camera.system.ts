import { OrthographicCamera, PerspectiveCamera, Vector2 } from 'three';
import CameraComponent from '../components/camera.component';
import SceneComponent from '../components/scene.component';
import { Injectable } from '../ioc/injector';
import EntityProvider from '../providers/entity.provider';
import ViewportProvider from '../providers/viewport.provider';
import { OnRender, OnSceneInited, OnUpdate, OnViewResize } from '../util/lifecycle';
import { ILoopInfo } from '../util/loop-info';

@Injectable()
export default class CameraSystem implements OnSceneInited, OnRender, OnViewResize {
    private inited = false;
    private readonly orthographicBounds = 0.6;

    constructor(
        private viewportProvider: ViewportProvider,
        private entityProvider: EntityProvider,
    ) {}

    private getViewBounds() {
        const { Aspect: aspect } = this.viewportProvider;
        const xAspect = aspect > 1 ? aspect : 1;
        const yAspect = aspect < 1 ? 1 / aspect : 1;
        const xBound = this.orthographicBounds * xAspect;
        const yBound = this.orthographicBounds * yAspect;
        return new Vector2(xBound, yBound);
    }

    onSceneInited() {
        this.inited = true;
    }

    onRender(loopInfo: ILoopInfo) {
        if (!this.inited) return;

        const c = this.entityProvider.getFirstComponent(CameraComponent);
        const s = this.entityProvider.getFirstComponent(SceneComponent);
        this.viewportProvider.Renderer.render(s.scene, c.camera);
    }
    onViewResize() {
        if (!this.inited) return;

        const c = this.entityProvider.getFirstComponent(CameraComponent);

        if (c.camera instanceof PerspectiveCamera) {
            c.camera.aspect = this.viewportProvider.Aspect;
            c.camera.updateProjectionMatrix();
        }
        if (c.camera instanceof OrthographicCamera) {
            const bounds = this.getViewBounds();
            c.camera.left = -bounds.x;
            c.camera.right = bounds.x;
            c.camera.top = bounds.y;
            c.camera.bottom = -bounds.y;
            c.camera.updateProjectionMatrix();
        }
    }
}
