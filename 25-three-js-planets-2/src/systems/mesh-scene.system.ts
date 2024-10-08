import MeshComponent from '../components/mesh.component';
import SceneComponent from '../components/scene.component';
import { Injectable } from '../decorators/injectable';
import EntityProvider from '../providers/entity.provider';
import { OnSceneInited } from '../util/lifecycle';

@Injectable()
export default class MeshSceneSystem implements OnSceneInited {
    private inited = false;

    constructor(private entityProvider: EntityProvider) {}

    async onSceneInited() {
        const s = this.entityProvider.getFirstComponent(SceneComponent);
        const entities = this.entityProvider.getEntitiesWithComponents(MeshComponent);
        for (const e of entities) {
            const m = e.get(MeshComponent);
            s.scene.add(m.mesh);
        }
        this.inited = true;
    }
}
