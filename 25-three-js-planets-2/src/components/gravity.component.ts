import { Vector2 } from 'three';
import { IBaseComponent } from './base-component';

export default class GravityComponent implements IBaseComponent {
    componentName = 'GravityComponent';
    public preUpdatedPosition: Vector2;
    public velocity: Vector2;
    public mass: number;
    public netAcceleration: Vector2;

    constructor(
        options: {
            preUpdatedPosition?: Vector2;
            velocity?: Vector2;
            mass?: number;
        } = {},
    ) {
        this.preUpdatedPosition = options.preUpdatedPosition || new Vector2(0, 0);
        this.velocity = options.velocity || new Vector2(0, 0);
        this.mass = options.mass || 0;
        this.netAcceleration = new Vector2(0, 0);
    }
}
