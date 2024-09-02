import { BufferGeometry, Mesh, MeshPhongMaterial } from 'three';
import { IBaseComponent } from './base-component';

export default class InvaderComponent implements IBaseComponent {
    public meshList: Mesh<BufferGeometry, MeshPhongMaterial>[];
    public frameSwitch: number;
    public frame: number;
    public lastFrameSwitch: number;
    public rotationSpeed: number;

    constructor(options: { meshList?: Mesh<BufferGeometry, MeshPhongMaterial>[]; frameSwitch?: number } = {}) {
        this.meshList = options.meshList || null;
        this.frameSwitch = options.frameSwitch || 1000;
        this.frame = 0;
        this.lastFrameSwitch = 0;
        this.rotationSpeed = 0.01;
    }
}
