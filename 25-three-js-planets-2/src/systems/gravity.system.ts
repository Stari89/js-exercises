import { Vector2 } from 'three';
import GravityComponent from '../components/gravity.component';
import TransformComponent from '../components/transform.component';
import { ILoopInfo } from '../util/loop-info';
import { Injectable } from '../decorators/injectable';
import { OnBeforeUpdate, OnUpdate } from '../util/lifecycle';
import EntityProvider from '../providers/entity.provider';
import WorkerProvider from '../providers/worker.provider';
import Helpers from '../util/helpers';

@Injectable()
export default class GravitySystem implements OnBeforeUpdate, OnUpdate {
    private readonly G: number = 0.00000000075;

    constructor(
        private entityProvider: EntityProvider,
        private workerProvider: WorkerProvider,
    ) {}

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
        const entityComponents: Array<[GravityComponent, TransformComponent]> = entities.map((e) => [
            e.get(GravityComponent),
            e.get(TransformComponent),
        ]);

        const size = Math.ceil(entityComponents.length / this.workerProvider.workerPool.maxWorkers);
        const dividedEntityComponentsList = Helpers.divideArray(
            entityComponents,
            this.workerProvider.workerPool.maxWorkers,
        );
        const workerPromise = (dividedEntityComponents: Array<[GravityComponent, TransformComponent]>, idx: number) =>
            this.workerProvider.workerPool
                .exec('onUpdate', [dividedEntityComponents, entityComponents, this.G, loopInfo])
                .then((result: Array<[GravityComponent, TransformComponent]>) => {
                    for (let i = 0; i < result.length; i++) {
                        const j = i + size * idx;
                        const e = entities[j];
                        const g = e.get(GravityComponent);
                        const t = e.get(TransformComponent);

                        const newEntity = result[i];
                        g.velocity = new Vector2(newEntity[0].velocity.x, newEntity[0].velocity.y);
                        t.position = new Vector2(newEntity[1].position.x, newEntity[1].position.y);
                    }
                });
        await Promise.all(dividedEntityComponentsList.map((dce, idx) => workerPromise(dce, idx)));
    }
}
