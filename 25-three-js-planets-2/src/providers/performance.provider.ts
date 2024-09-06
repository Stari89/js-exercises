import { Injectable } from '../ioc/injector';
import { OnRun, OnUpdate } from '../util/lifecycle';

@Injectable()
export default class PerformanceProvider {
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

    public startUpdate() {
        this.updateLoopTime = performance.now();
    }

    public stopUpdate() {
        this.updateLoopCount++;
        const time = performance.now() - this.updateLoopTime;

        this.updateCountSpan.innerHTML = this.updateCountText.replace('{x}', this.updateLoopCount.toString());
        this.updateTimeSpan.innerHTML = this.updateTimeText.replace('{x}', time.toString());
    }

    public startRender() {
        this.renderLoopTime = performance.now();
    }

    public stopRender() {
        this.renderLoopCount++;
        const time = performance.now() - this.renderLoopTime;

        this.renderCountSpan.innerHTML = this.renderCountText.replace('{x}', this.renderLoopCount.toString());
        this.renderTimeSpan.innerHTML = this.renderTimeText.replace('{x}', time.toString());
    }
}
