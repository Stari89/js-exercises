import { WorkerUrl } from "worker-url";
import { pool } from "workerpool";

const WorkerURL = new WorkerUrl(new URL("./worker.ts", import.meta.url));
const workerPool = pool(WorkerURL.toString(), {
  maxWorkers: 4,
});

window.onload = () => {
  console.log("workers asdfasdf");
  workerPool
    .exec("fibonacci", [10])
    .then((r: any) => {
      console.log(r);
    })
    .catch((e) => {
      console.log(e);
    });
};
