import { IBaseComponent, IBaseComponentType } from '../components/base-component';
import { Injectable } from '../decorators/injectable';
import Entity from '../entity/entity';
import { OnSceneInited } from '../util/lifecycle';
import SystemsProvider from './systems.provider';

@Injectable()
export default class EntityProvider implements OnSceneInited {
    public entities: Array<Entity> = [];
    private nextSceneEntities: Array<Entity> = [];

    constructor(private systemsProvider: SystemsProvider) {}

    push(entity: Entity) {
        this.entities.push(entity);
        this.systemsProvider.pushEntity(entity);
    }

    pushNextScene(entity: Entity) {
        this.nextSceneEntities.push(entity);
        this.systemsProvider.pushEntityNextScene(entity);
    }

    switchToNextScene() {
        this.entities = [...this.nextSceneEntities];
        this.nextSceneEntities = [];
        this.systemsProvider.switchToNextScene();
    }

    clear() {
        this.entities = [];
        this.systemsProvider.clearEntities();
    }

    getEntitiesWithComponents(...componentClasses: IBaseComponentType<IBaseComponent>[]): Array<Entity> {
        return this.entities.filter((e) => e.has(...componentClasses));
    }

    getComponents<T extends IBaseComponent>(
        componentClass: IBaseComponentType<T>,
        filter?: IBaseComponentType<IBaseComponent>[],
    ): T[] {
        const componentClasses = filter || [];
        componentClasses.push(componentClass);
        return this.getEntitiesWithComponents(...componentClasses).map((e) => e.get(componentClass));
    }

    getFirstComponent<T extends IBaseComponent>(
        componentClass: IBaseComponentType<T>,
        filter?: IBaseComponentType<IBaseComponent>[],
    ): T {
        const components = this.getComponents(componentClass, filter);
        if (components.length === 0) {
            throw new Error('No entity with ' + componentClass.name);
        }
        return components[0];
    }

    onSceneInited() {
        this.switchToNextScene();
    }
}
