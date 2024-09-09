import { Injectable } from '../decorators/injectable';
import { OnAfterRender, OnAfterUpdate, OnBeforeRender, OnBeforeUpdate } from '../util/lifecycle';
import { ILoopInfo } from '../util/loop-info';

@Injectable()
export default class PerformanceProvider implements OnBeforeUpdate, OnAfterUpdate, OnBeforeRender, OnAfterRender {
    private updateLoopCount = 0;
    private renderLoopCount = 0;

    private updateLoopTime = 0;
    private renderLoopTime = 0;

    private updateCountText = 'Update count: {x}';
    private updateTimeText = 'Update time: {x}ms';
    private renderCountText = 'Render count: {x}';
    private renderTimeText = 'Render time: {x}ms';

    private updateCountSpan = document.createElement('span');
    private updateTimeSpan = document.createElement('span');
    private renderCountSpan = document.createElement('span');
    private renderTimeSpan = document.createElement('span');

    private performanceBox = document.createElement('div');

    private readonly warnTime = 10; // ms
    private readonly stutterTime = 20; // ms

    constructor() {
        this.performanceBox.style.position = 'absolute';
        this.performanceBox.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        this.performanceBox.style.color = 'white';
        this.performanceBox.style.fontFamily = 'sans-serif';
        this.performanceBox.style.fontSize = '10px';
        this.performanceBox.style.padding = '5px';
        this.performanceBox.style.display = 'flex';
        this.performanceBox.style.flexDirection = 'column';
        this.performanceBox.appendChild(this.updateCountSpan);
        this.performanceBox.appendChild(this.updateTimeSpan);
        this.performanceBox.appendChild(this.renderCountSpan);
        this.performanceBox.appendChild(this.renderTimeSpan);
        document.body.appendChild(this.performanceBox);
    }

    async onBeforeUpdate(loopInfo: ILoopInfo) {
        this.updateLoopTime = performance.now();
    }

    async onAfterUpdate(loopInfo: ILoopInfo) {
        this.updateLoopCount++;
        const dt = performance.now() - this.updateLoopTime;

        this.updateCountSpan.innerHTML = this.updateCountText.replace('{x}', this.updateLoopCount.toString());
        this.updateTimeSpan.innerHTML = this.updateTimeText.replace('{x}', dt.toString());
        if (dt < this.warnTime) {
            this.updateTimeSpan.style.color = 'inherit';
        } else if (dt < this.stutterTime) {
            this.updateTimeSpan.style.color = 'orange';
        } else {
            this.updateTimeSpan.style.color = 'red';
        }
    }

    async onBeforeRender() {
        this.renderLoopTime = performance.now();
    }

    async onAfterRender() {
        this.renderLoopCount++;
        const dt = performance.now() - this.renderLoopTime;

        this.renderCountSpan.innerHTML = this.renderCountText.replace('{x}', this.renderLoopCount.toString());
        this.renderTimeSpan.innerHTML = this.renderTimeText.replace('{x}', dt.toString());

        if (dt < this.warnTime) {
            this.renderTimeSpan.style.color = 'inherit';
        } else if (dt < this.stutterTime) {
            this.renderTimeSpan.style.color = 'orange';
        } else {
            this.renderTimeSpan.style.color = 'red';
        }
    }
}
