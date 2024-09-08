import { Vector2 } from 'three';
import GravityComponent from '../components/gravity.component';
import TransformComponent from '../components/transform.component';
import { ILoopInfo } from '../util/loop-info';
import { Injectable } from '../decorators/injectable';
import BaseSystem from './base-system';
import { OnBeforeUpdate, OnUpdate } from '../util/lifecycle';

@Injectable()
export default class GravitySystem extends BaseSystem implements OnBeforeUpdate, OnUpdate {
    private readonly G: number = 0.00000000075;
    readonly componentTypes = [GravityComponent, TransformComponent];

    constructor() {
        super();
    }

    public onBeforeUpdate(loopInfo: ILoopInfo) {
        this.entities.forEach((e) => {
            const g = e.get(GravityComponent);
            const t = e.get(TransformComponent);
            g.preUpdatedPosition = t.position;
        });
    }

    public onUpdate(loopInfo: ILoopInfo) {
        this.entities.forEach((e) => {
            const g = e.get(GravityComponent);
            const t = e.get(TransformComponent);

            g.netAcceleration = new Vector2(0, 0);
            this.entities.forEach((e2) => {
                if (e == e2) return;
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
            });

            const deltaVelocity = new Vector2(g.netAcceleration.x, g.netAcceleration.y).multiplyScalar(loopInfo.dt);
            g.velocity.add(deltaVelocity);

            const deltaPosition = new Vector2(g.velocity.x, g.velocity.y).multiplyScalar(loopInfo.dt);
            t.position.add(deltaPosition);
        });
    }
}
