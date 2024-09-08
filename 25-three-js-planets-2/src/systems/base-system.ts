import { IBaseComponent, IBaseComponentType } from '../components/base-component';
import Entity from '../entity/entity';

export default abstract class BaseSystem {
    abstract readonly componentTypes: Array<IBaseComponentType<IBaseComponent>>;

    protected entities: Array<Entity> = [];
    private nextSceneEntities: Array<Entity> = [];

    pushEntity(entity: Entity) {
        this.entities.push(entity);
    }
    pushEntityNextScene(entity: Entity) {
        this.nextSceneEntities.push(entity);
    }
    switchToNextScene() {
        this.entities = [...this.nextSceneEntities];
        this.nextSceneEntities = [];
    }
    clearEntities() {
        this.entities = [];
    }
}
