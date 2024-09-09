import LightComponent from '../components/light.component';
import SceneComponent from '../components/scene.component';
import { Injectable } from '../decorators/injectable';
import EntityProvider from '../providers/entity.provider';
import { OnSceneInited } from '../util/lifecycle';

@Injectable()
export default class LightSystem implements OnSceneInited {
    constructor(private entityProvider: EntityProvider) {}

    async onSceneInited() {
        const s = this.entityProvider.getFirstComponent(SceneComponent);
        const entities = this.entityProvider.getEntitiesWithComponents(LightComponent);
        entities.forEach((e) => {
            const l = e.get(LightComponent);
            s.scene.add(l.light);
        });
    }
}
