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
        const s = this.entityProvider.getFirstComponent(SceneComponent);
        this.entityProvider.getComponents(InvaderComponent).forEach((i) => {
            s.scene.add(i.meshList[0]);
        });

        this.inited = true;
    }

    onUpdate(loopInfo: ILoopInfo) {
        if (!this.inited) return;

        const s = this.entityProvider.getFirstComponent(SceneComponent);
        this.entityProvider.getComponents(InvaderComponent).forEach((i) => {
            // rotation
            i.meshList.forEach((m) => {
                m.rotation.z += i.rotationSpeed;
                m.rotation.y += i.rotationSpeed * 5;
            });

            // keyframe switch after elapsed time
            if (i.lastFrameSwitch + i.frameSwitch < loopInfo.t) {
                s.scene.remove(i.meshList[i.frame]);
                i.frame++;
                if (i.frame === i.meshList.length) {
                    i.frame = 0;
                }
                i.lastFrameSwitch = loopInfo.t;
                s.scene.add(i.meshList[i.frame]);
            }
        });
    }
}
