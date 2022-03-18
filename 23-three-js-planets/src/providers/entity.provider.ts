import { IBaseComponent, IBaseComponentType } from '../components/base-component';
import Entity from '../entity/entity';
import { Injectable } from '../ioc/injector';
import { OnSceneInited } from '../util/lifecycle';

@Injectable()
export default class EntityProvider implements OnSceneInited {
    private entities: Array<Entity> = [];
    private nextSceneEntities: Array<Entity> = [];

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
    }

    getEntitiesWithComponents(...componentClasses: IBaseComponentType<IBaseComponent>[]): Array<Entity> {
        return this.entities.filter((e) => e.has(...componentClasses));
    }

    onSceneInited() {
        this.switchToNextScene();
    }
}
