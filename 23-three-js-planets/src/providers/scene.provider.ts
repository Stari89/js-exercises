import { Injectable, Injector } from '../ioc/injector';
import BaseScene from '../scenes/base-scene';
import { Container } from '../ioc/container';
import { InjectedType } from '../ioc/util';
import { ContainerEventEmitter } from '../ioc/event-delegator';
import { LifecycleEvents } from '../util/lifecycle';

@Injectable()
export default class SceneProvider extends ContainerEventEmitter {
    private currentScene?: InjectedType<BaseScene>;

    constructor() {
        super();
        this.switchScene = this.switchScene.bind(this);
    }

    async switchScene<T extends BaseScene>(target: InjectedType<T>) {
        this.emit(LifecycleEvents.OnSceneInit);
        const nextScene = Injector.instance.resolve<T>(target);
        await nextScene.init();
        this.currentScene && Container.instance.dispose(this.currentScene);
        this.currentScene = target;
        this.emit(LifecycleEvents.OnSceneInited);
    }
}
