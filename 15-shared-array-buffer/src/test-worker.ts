self.onmessage = (e: MessageEvent) => {
    if (e.data instanceof SharedArrayBuffer) {
        initSharedArrayBuffer(e.data);
    }
};

const initSharedArrayBuffer = (sharedArrayBuffer: SharedArrayBuffer) => {
    const ia = new Int32Array(sharedArrayBuffer);
    for (let i = 0; i < 100; i++) {
        ia[i] = ia[i] * 2;
    }
    console.log('data manipulated');
    self.postMessage(true);
};
