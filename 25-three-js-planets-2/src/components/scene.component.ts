import { Scene } from 'three';
import { IBaseComponent } from './base-component';

export default class SceneComponent implements IBaseComponent {
    componentName = 'SceneComponent';
    public scene: Scene;

    constructor(options: { scene?: Scene } = {}) {
        this.scene = options.scene || new Scene();
    }
}
