import MeshComponent from '../components/mesh.component';
import PlanetComponent from '../components/planet.component';
import { Injectable } from '../ioc/injector';
import EntityProvider from '../providers/entity.provider';
import { OnSceneInited, OnUpdate } from '../util/lifecycle';
import { ILoopInfo } from '../util/loop-info';

@Injectable()
export default class PlanetSystem implements OnSceneInited, OnUpdate {
    private inited = false;

    constructor(private entityProvider: EntityProvider) {}

    onSceneInited() {
        this.inited = true;
    }
    onUpdate(loopInfo: ILoopInfo) {
        if (!this.inited) return;

        this.entityProvider.getComponents(MeshComponent, [PlanetComponent]).forEach((p) => {
            p.mesh.rotation.x += 0.001;
            p.mesh.rotation.y += 0.001;
        });
    }
}
