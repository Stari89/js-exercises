import { IBaseComponent, IBaseComponentType } from '../components/base-component';
import { Injectable } from '../decorators/injectable';
import Entity from '../entity/entity';
import { OnSceneInited } from '../util/lifecycle';

@Injectable()
export default class EntityProvider implements OnSceneInited {
    public entities: Array<Entity> = [];
    private nextSceneEntities: Array<Entity> = [];

    public filteredEntities: Record<string, Array<Entity>> = {};

    push(entity: Entity) {
        this.entities.push(entity);
    }

    pushNextScene(entity: Entity) {
        this.nextSceneEntities.push(entity);
    }

    switchToNextScene() {
        this.entities = [...this.nextSceneEntities];
        this.nextSceneEntities = [];
    }

    clear() {
        this.entities = [];
        this.filteredEntities = {};
    }

    getEntitiesWithComponents(...componentClasses: IBaseComponentType<IBaseComponent>[]): Array<Entity> {
        const componentFilterName = this.getComponentFilterName(...componentClasses);
        if (!this.filteredEntities[componentFilterName]) {
            this.filteredEntities[componentFilterName] = this.entities.filter((e) => e.has(...componentClasses));
        }
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

    private getComponentFilterName(...componentClasses: IBaseComponentType<IBaseComponent>[]): string {
        return [...componentClasses]
            .map((c) => c.name)
            .sort()
            .join();
    }
}
