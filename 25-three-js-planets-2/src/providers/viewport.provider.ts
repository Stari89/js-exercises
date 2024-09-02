import { Vector2, WebGLRenderer } from 'three';
import { ContainerEventEmitter } from '../ioc/event-delegator';
import { Injectable } from '../ioc/injector';
import { LifecycleEvents, OnUpdate } from '../util/lifecycle';

@Injectable()
export default class ViewportProvider extends ContainerEventEmitter implements OnUpdate {
    private root: HTMLElement;
    private renderer: WebGLRenderer;

    private renderSize: Vector2;
    private viewSize: Vector2;
    private devicePixelRatio: number;

    get RenderSize() {
        return this.renderSize;
    }
    get ViewSize() {
        return this.viewSize;
    }
    get Scale() {
        return window.devicePixelRatio || 1;
    }
    get Renderer() {
        return this.renderer;
    }
    get Aspect() {
        return this.viewSize.x / this.viewSize.y;
    }

    constructor() {
        super();

        this.root = document.body;
        this.renderer = new WebGLRenderer({ antialias: true });
        this.setDimensions();
        this.root.appendChild(this.renderer.domElement);
    }

    onUpdate() {
        if (
            this.devicePixelRatio !== this.Scale ||
            this.viewSize.x !== window.innerWidth ||
            this.viewSize.y !== window.innerHeight
        ) {
            this.setDimensions();
        }
    }

    private setDimensions() {
        this.renderSize = new Vector2(window.innerWidth * this.Scale, window.innerHeight * this.Scale);
        this.viewSize = new Vector2(window.innerWidth, window.innerHeight);
        this.devicePixelRatio = this.Scale;

        this.renderer.setSize(this.viewSize.x, this.viewSize.y);
        this.emit(LifecycleEvents.OnViewResize);
    }
}
