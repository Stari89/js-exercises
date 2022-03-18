import { BufferGeometry, Material, Mesh } from 'three';
import { IBaseComponent } from './base-component';

export default class MeshComponent implements IBaseComponent {
    public mesh: Mesh<BufferGeometry, Material>;

    constructor(options: { mesh?: Mesh<BufferGeometry, Material> } = {}) {
        this.mesh = options.mesh || null;
    }
}
