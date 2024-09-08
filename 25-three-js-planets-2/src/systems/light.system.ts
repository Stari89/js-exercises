import { IBaseComponentType } from '../components/base-component';
import LightComponent from '../components/light.component';
import SceneComponent from '../components/scene.component';
import { Injectable } from '../decorators/injectable';
import EntityProvider from '../providers/entity.provider';
import { OnSceneInited } from '../util/lifecycle';
import BaseSystem from './base-system';

@Injectable()
export default class LightSystem extends BaseSystem implements OnSceneInited {
    readonly componentTypes = [LightComponent];

    constructor(private entityProvider: EntityProvider) {
        super();
    }

    onSceneInited() {
        const s = this.entityProvider.getFirstComponent(SceneComponent);
        this.entities.forEach((e) => {
            const l = e.get(LightComponent);
            s.scene.add(l.light);
        });
    }
}
