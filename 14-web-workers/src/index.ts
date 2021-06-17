const worker = new Worker(new URL('./test-worker.ts', import.meta.url));

worker.postMessage('stuff');
