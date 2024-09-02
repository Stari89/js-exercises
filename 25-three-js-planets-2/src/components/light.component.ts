import { Light } from 'three';
import { IBaseComponent } from './base-component';

export default class LightComponent implements IBaseComponent {
    public light: Light;

    constructor(options: { light?: Light } = {}) {
        this.light = options.light || null;
    }
}
