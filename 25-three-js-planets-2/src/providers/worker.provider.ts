import { Injectable } from '../decorators/injectable';
import { WorkerUrl } from 'worker-url';
import { Pool, pool } from 'workerpool';
import StateProvider from './state.provider';

@Injectable()
export default class WorkerProvider {
    private readonly workerUrl: URL;
    public readonly workerPool: Pool;

    constructor(private stateProvider: StateProvider) {
        this.workerUrl = new WorkerUrl(new URL('../workers/gravity.worker.ts', import.meta.url));
        this.workerPool = pool(this.workerUrl.toString());
        this.initWorkers();
    }

    async initWorkers() {
        const promises = [];

        for (let i = 0; i < this.workerPool.maxWorkers; i++) {
            promises.push(this.workerPool.exec('init', [this.stateProvider.sab]));
        }
        await Promise.all(promises);
    }
}
