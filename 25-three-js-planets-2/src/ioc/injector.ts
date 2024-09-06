import 'reflect-metadata';
import { Container } from './container';
import { InjectedType } from './util';

export class Injector {
    private static _instance: Injector;

    private constructor() {}

    public static get instance(): Injector {
        if (!Injector._instance) {
            Injector._instance = new Injector();
        }
        return this._instance;
    }

    public resolve<T>(target: InjectedType<any>): T {
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections: Array<any> = tokens.map((token: InjectedType<any>) => this.resolve<any>(token));
        return Container.instance.getClassInstance(target, injections);
    }
}
