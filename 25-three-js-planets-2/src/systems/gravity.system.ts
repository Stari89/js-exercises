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
            g.preUpdatedPosition = t.position;
        }
    }

    async onUpdate(loopInfo: ILoopInfo) {
        const entities = this.entityProvider.getEntitiesWithComponents(GravityComponent, TransformComponent);
        for (const e of entities) {
            const g = e.get(GravityComponent);
            const t = e.get(TransformComponent);

            g.netAcceleration = new Vector2(0, 0);
            for (const e2 of entities) {
                if (e == e2) continue;
                const g2 = e2.get(GravityComponent);

                // rewrite this bullshit with threejs tools

                const distance = new Vector2(g2.preUpdatedPosition.x, g2.preUpdatedPosition.y).sub(
                    g.preUpdatedPosition,
                );
                const accelerationMagnitude = (g2.mass * this.G) / distance.lengthSq();
                const acceleration = new Vector2(distance.x, distance.y);
                acceleration.normalize();
                acceleration.multiplyScalar(accelerationMagnitude);
                g.netAcceleration.add(acceleration);
            }

            const deltaVelocity = new Vector2(g.netAcceleration.x, g.netAcceleration.y).multiplyScalar(loopInfo.dt);
            g.velocity.add(deltaVelocity);

            const deltaPosition = new Vector2(g.velocity.x, g.velocity.y).multiplyScalar(loopInfo.dt);
            t.position.add(deltaPosition);
        }
    }
}
