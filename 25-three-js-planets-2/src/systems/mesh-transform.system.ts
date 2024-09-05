import MeshComponent from '../components/mesh.component';
import TransformComponent from '../components/transform.component';
import { Injectable } from '../ioc/injector';
import EntityProvider from '../providers/entity.provider';
import { OnUpdate } from '../util/lifecycle';

@Injectable()
export default class MeshTransformSystem implements OnUpdate {
    constructor(private entityProvider: EntityProvider) {}

    onUpdate() {
        this.entityProvider.getEntitiesWithComponents(MeshComponent, TransformComponent).forEach((c) => {
            const m = c.get(MeshComponent);
            const t = c.get(TransformComponent);

            m.mesh.position.x = t.position.x;
            m.mesh.position.y = t.position.y;
            m.mesh.scale.x = t.scale.x;
            m.mesh.scale.y = t.scale.y;
            m.mesh.rotation.z = t.rotation;
        });
    }
}
