import InvaderComponent from '../components/invader.component';
import SceneComponent from '../components/scene.component';
import { Injectable } from '../ioc/injector';
import EntityProvider from '../providers/entity.provider';
import { OnSceneInited, OnUpdate } from '../util/lifecycle';
import { ILoopInfo } from '../util/loop-info';

@Injectable()
export default class InvaderSystem implements OnSceneInited, OnUpdate {
    private inited = false;

    constructor(private entityProvider: EntityProvider) {}

    onSceneInited() {
        this.entityProvider.getEntitiesWithComponents(InvaderComponent).forEach((ie) => {
            const ic = ie.get(InvaderComponent);
            this.entityProvider.getEntitiesWithComponents(SceneComponent).forEach((se) => {
                const sc = se.get(SceneComponent);
                sc.scene.add(ic.meshList[0]);
            });
        });

        this.inited = true;
    }

    onUpdate(loopInfo: ILoopInfo) {
        if (!this.inited) return;

        this.entityProvider.getEntitiesWithComponents(InvaderComponent).forEach((ie) => {
            const ic = ie.get(InvaderComponent);

            this.entityProvider.getEntitiesWithComponents(SceneComponent).forEach((se) => {
                const sc = se.get(SceneComponent);
                if (ic.lastFrameSwitch + ic.frameSwitch > loopInfo.t) {
                    return;
                }
                sc.scene.remove(ic.meshList[ic.frame]);
                ic.frame++;
                if (ic.frame === ic.meshList.length) {
                    ic.frame = 0;
                }
                ic.lastFrameSwitch = loopInfo.t;
                sc.scene.add(ic.meshList[ic.frame]);
            });

            ic.meshList.forEach((m) => {
                m.rotation.z += ic.rotationSpeed;
                m.rotation.y += ic.rotationSpeed * 5;
            });
        });
    }
}
