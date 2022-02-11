import { Injectable, Injector } from '../ioc/injector';
import BaseScene from '../scenes/base-scene';
import { Container } from '../ioc/container';
import { InjectedType } from '../ioc/util';

@Injectable()
export default class SceneProvider {
    private currentScene?: InjectedType<BaseScene>;

    constructor() {
        this.switchScene = this.switchScene.bind(this);
    }

    switchScene<T extends BaseScene>(target: InjectedType<T>) {
        Injector.instance.resolve<T>(target);
        this.currentScene && Container.instance.dispose(this.currentScene);
        this.currentScene = target;
    }
}
