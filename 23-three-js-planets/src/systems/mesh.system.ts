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
        this.entityProvider.getEntitiesWithComponents(MeshComponent).forEach((me) => {
            const mc = me.get(MeshComponent);
            this.entityProvider.getEntitiesWithComponents(SceneComponent).forEach((se) => {
                const sc = se.get(SceneComponent);
                sc.scene.add(mc.mesh);
            });
        });

        this.inited = true;
    }
}
