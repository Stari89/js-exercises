import { Injectable } from '../decorators/injectable';
import { OnSceneInit, OnUpdate } from '../util/lifecycle';

type TestType = { x: number; y: number };

@Injectable()
export default class StateProvider implements OnUpdate {
    sab = new SharedArrayBuffer(16);
    float64View = new Float64Array(this.sab);
    int32View = new Int32Array(this.sab);
    int8View = new Int8Array(this.sab);
    word = new String(this.sab);

    constructor() {
        this.int8View[0] = 5;
    }

    async onUpdate() {
        console.log(this.float64View);
        console.log(this.int32View);
        console.log(this.int8View);
        console.log(this.word);
    }
}
