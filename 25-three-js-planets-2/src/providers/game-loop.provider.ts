import { Injectable } from '../decorators/injectable';
import { ContainerEventEmitter } from '../ioc/event-delegator';
import { LifecycleEvents } from '../util/lifecycle';
import { ILoopInfo } from '../util/loop-info';

@Injectable()
export default class GameLoopProvider extends ContainerEventEmitter {
    private readonly updateTick = 5; // ms
    private loopInfo: ILoopInfo;
    private breakLoop: boolean;

    private renderedLatestUpdate = true;
    private updateInProgress = false;

    constructor() {
        super();

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);

        this.loopInfo = {
            dt: NaN,
            t: performance.now(),
        };
    }

    public run(): void {
        this.emit(LifecycleEvents.OnRun);
        setInterval(this.update, this.updateTick);
        requestAnimationFrame(this.render);
    }

    public stop(): void {
        this.breakLoop = true;
        this.emit(LifecycleEvents.OnStop);
    }

    private update(): void {
        if (this.breakLoop || this.updateInProgress) {
            return;
        }
        let t = performance.now();
        this.updateInProgress = true;
        this.loopInfo.dt = t - this.loopInfo.t;
        this.loopInfo.t = t;
        this.emit(LifecycleEvents.OnBeforeUpdate, this.loopInfo);
        this.emit(LifecycleEvents.OnUpdate, this.loopInfo);
        this.updateInProgress = false;
        this.renderedLatestUpdate = false;
        this.emit(LifecycleEvents.OnAfterUpdate, this.loopInfo);
    }

    private render(): void {
        if (this.renderedLatestUpdate) {
            requestAnimationFrame(this.render);
            return;
        }
        this.emit(LifecycleEvents.OnBeforeRender, this.loopInfo);
        this.emit(LifecycleEvents.OnRender, this.loopInfo);
        this.renderedLatestUpdate = true;
        this.emit(LifecycleEvents.OnAfterRender, this.loopInfo);
        requestAnimationFrame(this.render);
    }
}
