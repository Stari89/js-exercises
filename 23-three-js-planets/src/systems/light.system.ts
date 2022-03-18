import LightComponent from '../components/light.component';
import SceneComponent from '../components/scene.component';
import { Injectable } from '../ioc/injector';
import EntityProvider from '../providers/entity.provider';
import { OnSceneInited } from '../util/lifecycle';

@Injectable()
export default class LightSystem implements OnSceneInited {
    constructor(private entityProvider: EntityProvider) {}

    onSceneInited() {
        this.entityProvider.getEntitiesWithComponents(LightComponent).forEach((le) => {
            const l = le.get(LightComponent);
            this.entityProvider.getEntitiesWithComponents(SceneComponent).forEach((se) => {
                const s = se.get(SceneComponent);
                s.scene.add(l.light);
            });
        });
    }
}
