import { BufferGeometry, Group, Material, Mesh } from 'three';
import { IBaseComponent } from './base-component';

export default class MeshComponent implements IBaseComponent {
    private _currentMeshIndex: number;
    public meshList: Array<Mesh<BufferGeometry, Material> | Group>;

    get mesh() {
        return this.meshList[this._currentMeshIndex];
    }

    set currentMeshIndex(idx: number) {
        if (idx < 0 || idx >= this.meshList.length) {
            throw new Error('Index out of bounds');
        }
        this._currentMeshIndex = idx;
    }

    get currentMeshIndex() {
        return this._currentMeshIndex;
    }

    constructor(
        options: {
            mesh?: Group | Mesh<BufferGeometry, Material>;
            meshList?: Array<Group | Mesh<BufferGeometry, Material>>;
            currentMesh?: number;
        } = {}
    ) {
        this.meshList = options.meshList || [];
        if (options.mesh) {
            this.meshList.push(options.mesh);
        }
        this._currentMeshIndex = options.currentMesh || 0;
    }

    nextMesh() {
        this._currentMeshIndex++;
        if (this._currentMeshIndex >= this.meshList.length) {
            this._currentMeshIndex = 0;
        }
    }
}
