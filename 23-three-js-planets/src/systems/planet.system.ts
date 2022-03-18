import PlanetComponent from '../components/planet.component';
import SceneComponent from '../components/scene.component';
import { Injectable } from '../ioc/injector';
import EntityProvider from '../providers/entity.provider';
import { OnSceneInited, OnUpdate } from '../util/lifecycle';
import { ILoopInfo } from '../util/loop-info';

@Injectable()
export default class PlanetSystem implements OnSceneInited, OnUpdate {
    private inited = false;

    constructor(private entityProvider: EntityProvider) {}

    onSceneInited() {
        this.entityProvider.getEntitiesWithComponents(PlanetComponent).forEach((pe) => {
            const pc = pe.get(PlanetComponent);
            this.entityProvider.getEntitiesWithComponents(SceneComponent).forEach((se) => {
                const sc = se.get(SceneComponent);
                sc.scene.add(pc.tGroup);
            });
        });

        this.inited = true;
    }
    onUpdate(loopInfo: ILoopInfo) {
        if (!this.inited) return;

        this.entityProvider.getEntitiesWithComponents(PlanetComponent).forEach((pe) => {
            const pc = pe.get(PlanetComponent);
            pc.tGroup.rotation.x += 0.001;
            pc.tGroup.rotation.y += 0.001;
        });
    }
}
