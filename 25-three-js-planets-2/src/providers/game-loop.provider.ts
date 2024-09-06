import { Injectable } from '../ioc/injector';
import { ContainerEventEmitter } from '../ioc/event-delegator';
import { LifecycleEvents } from '../util/lifecycle';
import { ILoopInfo } from '../util/loop-info';
import PerformanceProvider from './performance.provider';

@Injectable()
export default class GameLoopProvider extends ContainerEventEmitter {
    private readonly updateTick = 5; // ms
    private loopInfo: ILoopInfo;
    private breakLoop: boolean;

    private renderedLatestUpdate = true;
    private updateInProgress = false;

    constructor(private performanceProvider: PerformanceProvider) {
        super();

        this.loop = this.loop.bind(this);
        this.update = this.update.bind(this);
        this.afterUpdate = this.afterUpdate.bind(this);
        this.render = this.render.bind(this);

        this.loopInfo = {
            dt: NaN,
            t: performance.now(),
        };
    }

    public run(): void {
        this.emit(LifecycleEvents.OnRun);
        setInterval(this.loop, this.updateTick);
        requestAnimationFrame(this.render);
    }

    public stop(): void {
        this.breakLoop = true;
        this.emit(LifecycleEvents.OnStop);
    }

    private loop(): void {
        if (this.breakLoop || this.updateInProgress) {
            return;
        }
        let t = performance.now();
        this.performanceProvider.startUpdate();
        this.updateInProgress = true;
        this.loopInfo.dt = t - this.loopInfo.t;
        this.loopInfo.t = t;
        this.beforeUpdate();
        this.update();
        this.afterUpdate();
        this.performanceProvider.stopUpdate();
        this.updateInProgress = false;
        this.renderedLatestUpdate = false;
    }

    private beforeUpdate(): void {
        this.emit(LifecycleEvents.OnBeforeUpdate, this.loopInfo);
    }

    private update(): void {
        this.emit(LifecycleEvents.OnUpdate, this.loopInfo);
    }

    private afterUpdate(): void {
        this.emit(LifecycleEvents.OnAfterUpdate, this.loopInfo);
    }

    private render(): void {
        if (this.renderedLatestUpdate) {
            requestAnimationFrame(this.render);
            return;
        }
        this.performanceProvider.startRender();
        this.emit(LifecycleEvents.OnRender, this.loopInfo);
        this.renderedLatestUpdate = true;
        this.performanceProvider.stopRender();
        requestAnimationFrame(this.render);
    }
}
