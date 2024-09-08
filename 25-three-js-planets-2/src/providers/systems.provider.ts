import { Injectable } from '../decorators/injectable';
import Entity from '../entity/entity';
import BaseSystem from '../systems/base-system';

@Injectable()
export default class SystemsProvider {
    private systems: Array<BaseSystem> = [];

    pushSystem(system: BaseSystem) {
        this.systems.push(system);
    }

    pushEntity(entity: Entity) {
        this.systems.forEach((s) => {
            if (s.componentTypes.length == 0) {
                return;
            }
            if (entity.has(...s.componentTypes)) {
                s.pushEntity(entity);
            }
        });
    }

    pushEntityNextScene(entity: Entity) {
        this.systems.forEach((s) => {
            if (s.componentTypes.length == 0) {
                return;
            }
            if (entity.has(...s.componentTypes)) {
                s.pushEntityNextScene(entity);
            }
        });
    }

    switchToNextScene() {
        this.systems.forEach((s) => {
            s.switchToNextScene();
        });
    }

    clearEntities() {
        this.systems.forEach((s) => {
            s.clearEntities();
        });
    }

    clear() {
        this.systems = [];
    }
}
