import { worker } from 'workerpool';
import GravityComponent from '../components/gravity.component';
import TransformComponent from '../components/transform.component';
import { ILoopInfo } from '../util/loop-info';
import { Vector2 } from 'three';

const onUpdate = (
    dividedEntityComponents: Array<[GravityComponent, TransformComponent]>,
    entityComponents: Array<[GravityComponent, TransformComponent]>,
    G: number,
    loopInfo: ILoopInfo,
): Array<[GravityComponent, TransformComponent]> => {
    const tempVector = new Vector2();

    for (const e of dividedEntityComponents) {
        const g = e[0];
        const t = e[1];

        let netAcceleration = new Vector2(0, 0);

        for (const e2 of entityComponents) {
            const g2 = e2[0];
            const t2 = e2[1];
            if (g == g2 || t == t2) {
                continue;
            }

            tempVector.copy(g2.preUpdatedPosition).sub(g.preUpdatedPosition);
            const distanceSq = tempVector.lengthSq();

            // Avoid division by zero
            if (distanceSq === 0) continue;

            const accelerationMagnitude = (g2.mass * G) / distanceSq;
            tempVector.normalize().multiplyScalar(accelerationMagnitude);
            netAcceleration.add(tempVector);
        }
        const scaledV = netAcceleration.multiplyScalar(loopInfo.dt);
        g.velocity.x += scaledV.x;
        g.velocity.y += scaledV.y;

        tempVector.copy(t.position).addScaledVector(g.velocity, loopInfo.dt);
        t.position.x = tempVector.x;
        t.position.y = tempVector.y;
    }

    return dividedEntityComponents;
};

const add = (a: any): number => {
    console.log('worker log', a.length, a[0][0], a[0][1]);
    return 10;
};

worker({ add: add, onUpdate });
