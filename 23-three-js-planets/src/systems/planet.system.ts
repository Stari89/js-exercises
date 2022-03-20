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
        const s = this.entityProvider.getFirstComponent(SceneComponent);
        this.entityProvider.getComponents(PlanetComponent).forEach((p) => {
            s.scene.add(p.tGroup);
        });
        this.inited = true;
    }
    onUpdate(loopInfo: ILoopInfo) {
        if (!this.inited) return;

        this.entityProvider.getComponents(PlanetComponent).forEach((p) => {
            p.tGroup.rotation.x += 0.001;
            p.tGroup.rotation.y += 0.001;
        });
    }
}
