import MeshComponent from '../components/mesh.component';
import SceneComponent from '../components/scene.component';
import { Injectable } from '../ioc/injector';
import EntityProvider from '../providers/entity.provider';
import { OnSceneInited } from '../util/lifecycle';

@Injectable()
export default class MeshSystem implements OnSceneInited {
    private inited = false;

    constructor(private entityProvider: EntityProvider) {}

    onSceneInited() {
        const s = this.entityProvider.getFirstComponent(SceneComponent);
        this.entityProvider.getComponents(MeshComponent).forEach((m) => {
            s.scene.add(m.mesh);
        });
        this.inited = true;
    }
}
