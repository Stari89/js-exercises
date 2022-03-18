import { Camera } from 'three';
import { IBaseComponent } from './base-component';

export default class CameraComponent implements IBaseComponent {
    public camera: Camera;

    constructor(options: { camera?: Camera } = {}) {
        this.camera = options.camera || null;
    }
}
