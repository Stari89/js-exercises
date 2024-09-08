import MeshComponent from '../components/mesh.component';
import SceneComponent from '../components/scene.component';
import { Injectable } from '../decorators/injectable';
import EntityProvider from '../providers/entity.provider';
import { OnSceneInited } from '../util/lifecycle';
import BaseSystem from './base-system';

@Injectable()
export default class MeshSceneSystem extends BaseSystem implements OnSceneInited {
    private inited = false;
    readonly componentTypes = [MeshComponent];

    constructor(private entityProvider: EntityProvider) {
        super();
    }

    onSceneInited() {
        const s = this.entityProvider.getFirstComponent(SceneComponent);
        this.entities.forEach((e) => {
            const m = e.get(MeshComponent);
            s.scene.add(m.mesh);
        });
        this.inited = true;
    }
}
