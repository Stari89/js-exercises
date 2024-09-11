import { Injectable } from '../decorators/injectable';
import { WorkerUrl } from 'worker-url';
import { pool } from 'workerpool';

@Injectable()
export default class WorkerProvider {
    readonly maxWorkers = 4;
    private readonly workerUrl = new WorkerUrl(new URL('../workers/gravity.worker.ts', import.meta.url));
    readonly workerPool = pool(this.workerUrl.toString(), { maxWorkers: this.maxWorkers });
}
