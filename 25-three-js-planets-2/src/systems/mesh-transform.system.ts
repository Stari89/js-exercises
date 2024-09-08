import MeshComponent from '../components/mesh.component';
import TransformComponent from '../components/transform.component';
import { Injectable } from '../decorators/injectable';
import { OnUpdate } from '../util/lifecycle';
import { ILoopInfo } from '../util/loop-info';
import BaseSystem from './base-system';

@Injectable()
export default class MeshTransformSystem extends BaseSystem implements OnUpdate {
    readonly componentTypes = [MeshComponent, TransformComponent];

    constructor() {
        super();
    }

    onUpdate(loopInfo: ILoopInfo) {
        this.entities.forEach((e) => {
            const m = e.get(MeshComponent);
            const t = e.get(TransformComponent);

            m.mesh.position.x = t.position.x;
            m.mesh.position.y = t.position.y;
            m.mesh.scale.x = t.scale.x;
            m.mesh.scale.y = t.scale.y;
            m.mesh.rotation.z = t.rotation;
        });
    }
}
