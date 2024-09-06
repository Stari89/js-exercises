import { Injectable } from '../ioc/injector';

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

    public startUpdate() {
        this.updateLoopTime = performance.now();
    }

    public stopUpdate() {
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

    public startRender() {
        this.renderLoopTime = performance.now();
    }

    public stopRender() {
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
