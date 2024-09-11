import { Vector2 } from 'three';
import GravityComponent from '../components/gravity.component';
import TransformComponent from '../components/transform.component';
import { ILoopInfo } from '../util/loop-info';
import { Injectable } from '../decorators/injectable';
import { OnBeforeUpdate, OnUpdate } from '../util/lifecycle';
import EntityProvider from '../providers/entity.provider';

@Injectable()
export default class GravitySystem implements OnBeforeUpdate, OnUpdate {
    private readonly G: number = 0.00000000075;

    constructor(private entityProvider: EntityProvider) {}

    async onBeforeUpdate(loopInfo: ILoopInfo) {
        const entities = this.entityProvider.getEntitiesWithComponents(GravityComponent, TransformComponent);
        for (const e of entities) {
            const g = e.get(GravityComponent);
            const t = e.get(TransformComponent);
            g.preUpdatedPosition = t.position.clone();
        }
    }

    async onUpdate(loopInfo: ILoopInfo) {
        const entities = this.entityProvider.getEntitiesWithComponents(GravityComponent, TransformComponent);
        const tempVector = new Vector2();

        for (const e of entities) {
            const g = e.get(GravityComponent);
            const t = e.get(TransformComponent);

            g.netAcceleration.set(0, 0);

            for (const e2 of entities) {
                if (e == e2) continue;
                const g2 = e2.get(GravityComponent);

                tempVector.copy(g2.preUpdatedPosition).sub(g.preUpdatedPosition);
                const distanceSq = tempVector.lengthSq();

                // Avoid division by zero
                if (distanceSq === 0) continue;

                const accelerationMagnitude = (g2.mass * this.G) / distanceSq;
                tempVector.normalize().multiplyScalar(accelerationMagnitude);
                g.netAcceleration.add(tempVector);
            }
            g.velocity.addScaledVector(g.netAcceleration, loopInfo.dt);
            t.position.addScaledVector(g.velocity, loopInfo.dt);
        }
    }
}
