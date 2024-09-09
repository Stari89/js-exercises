import { Injectable } from '../decorators/injectable';
import { ContainerEventEmitter } from '../ioc/event-delegator';
import { LifecycleEvents } from '../util/lifecycle';
import { ILoopInfo } from '../util/loop-info';

@Injectable()
export default class GameLoopProvider extends ContainerEventEmitter {
    private readonly updateTick = 10; // ms
    private loopInfo: ILoopInfo;
    private breakLoop: boolean;

    private renderedLatestUpdate = true;
    private updateInProgress = false;

    constructor() {
        super();

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);

        this.loopInfo = {
            dt: this.updateTick,
            t: 0,
        };
    }

    async run() {
        await this.emit(LifecycleEvents.OnRun);
        setInterval(this.update, this.updateTick);
        requestAnimationFrame(this.render);
    }

    async stop() {
        this.breakLoop = true;
        await this.emit(LifecycleEvents.OnStop);
    }

    private async update() {
        if (this.breakLoop || this.updateInProgress) {
            return;
        }
        this.updateInProgress = true;
        await this.emit(LifecycleEvents.OnBeforeUpdate, this.loopInfo);
        await this.emit(LifecycleEvents.OnUpdate, this.loopInfo);
        this.updateInProgress = false;
        this.renderedLatestUpdate = false;
        await this.emit(LifecycleEvents.OnAfterUpdate, this.loopInfo);
        this.loopInfo.t += this.updateTick;
    }

    private async render() {
        if (this.renderedLatestUpdate) {
            requestAnimationFrame(this.render);
            return;
        }
        await this.emit(LifecycleEvents.OnBeforeRender, this.loopInfo);
        await this.emit(LifecycleEvents.OnRender, this.loopInfo);
        this.renderedLatestUpdate = true;
        await this.emit(LifecycleEvents.OnAfterRender, this.loopInfo);
        requestAnimationFrame(this.render);
    }
}
