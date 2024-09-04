import { Camera, OrthographicCamera, PerspectiveCamera } from 'three';
import { IBaseComponent } from './base-component';

export default class CameraComponent implements IBaseComponent {
    public readonly camera: Camera;
    public bounds: number; // for orthographic camera
    public near: number;
    public far: number;
    public fov: number; // degrees for perspective camera
    public aspect: number; // for perspective camera
    public cameraType: 'orthographic' | 'perspective';

    constructor(
        options: {
            cameraType: 'orthographic' | 'perspective';
            bounds?: number;
            near?: number;
            far?: number;
            fov?: number;
            aspect?: number;
        } = {
            cameraType: 'orthographic',
            bounds: 1,
            near: -1,
            far: 10,
            fov: 75,
            aspect: 1,
        },
    ) {
        this.cameraType = options.cameraType;
        this.bounds = options.bounds || 1;
        this.near = options.near || -1;
        this.far = options.far || 10;
        this.fov = options.fov || 75;
        this.aspect = options.aspect || 1;
        switch (this.cameraType) {
            case 'orthographic':
                this.camera = new OrthographicCamera(
                    -this.bounds,
                    this.bounds,
                    this.bounds,
                    -this.bounds,
                    this.near,
                    this.far,
                );
                break;
            case 'perspective':
                this.camera = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
                break;
            default:
                throw new Error('Camera type invalid!');
        }
    }
}
