import Helpers from '../util/helpers';
import { InjectedType } from './util';

export class Container extends Map {
    private static _instance: Container;

    private constructor() {
        super();
    }

    public static get instance(): Container {
        if (!Container._instance) {
            Container._instance = new Container();
        }
        return this._instance;
    }

    public getClassInstance<T>(target: InjectedType<any>, injections: Array<any>): T {
        if (target.prototype.isInjectedService) {
            const classInstance = this.get(target);
            if (classInstance) {
                return classInstance;
            }
        }

        const newClassInstance = new target(...injections);
        if (target.prototype.isInjectedService) {
            this.set(target, newClassInstance);
        } else {
            this.set(Helpers.generateRandomUniqueId(this), newClassInstance);
        }
        return newClassInstance;
    }

    public dispose(target: InjectedType<any>) {
        // Step 1: loop through all services and check if injectedService is a dependency
        let isDependancy = false;
        for (const value of this.values()) {
            Object.keys(value)
                .map((k) => value[k])
                .filter((v) => v['isInjectedService'])
                .forEach((d) => {
                    if (d.constructor.name === target.name) {
                        isDependancy = true;
                    }
                });
        }
        if (isDependancy) {
            return;
        }
        // Step 2: gather dependencies
        const value = this.get(target);
        const deps = Object.keys(value)
            .map((k) => value[k])
            .filter((v) => v['isInjectedService']);
        // Step 3: release resources and delete target
        if (typeof value['onDispose'] === 'function') {
            value['onDispose']();
        }
        this.delete(target);
        // Step 4: dispose of dependencies
        deps.forEach((d) => {
            this.dispose(d.constructor);
        });
    }

    public release(): void {
        for (const value of this.values()) {
            if (typeof value['onDispose'] === 'function') {
                value['onDispose']();
            }
        }

        this.clear();
    }
}

export interface OnDispose {
    onDispose: () => void;
}
