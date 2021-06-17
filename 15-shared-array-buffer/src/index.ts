const worker = new Worker(new URL('./test-worker.ts', import.meta.url));

const sharedArrayBuffer = new SharedArrayBuffer(400);
const ia = new Int32Array(sharedArrayBuffer);
for (let i = 0; i < 100; i++) {
    ia[i] = i * 2;
}
console.log('initial data', ia);

worker.onmessage = (e: MessageEvent) => {
    if (typeof e.data === 'boolean') {
        console.log('done', ia);
    }
};

worker.postMessage(sharedArrayBuffer);
