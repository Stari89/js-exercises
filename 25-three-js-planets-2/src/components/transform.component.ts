import { Vector2 } from 'three';
import { IBaseComponent } from './base-component';

export default class TransformComponent implements IBaseComponent {
    componentName = 'TransformComponent';
    public position: Vector2;
    public scale: Vector2;
    public rotation: number;

    constructor(options: { position?: Vector2; scale?: Vector2; rotation?: number } = {}) {
        this.position = options.position || new Vector2(0, 0);
        this.scale = options.scale || new Vector2(1, 1);
        this.rotation = options.rotation || 0;
    }
}

// new stuff
export class TransformComponentNew {
    entityId: number;
    position: { x: number; y: number };
    scale: { x: number; y: number };
    rotation: number;

    constructor(
        entityId: number,
        position: { x: number; y: number },
        scale: { x: number; y: number },
        rotation: number,
    ) {
        this.entityId = entityId || 0;
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
    }
}

export class TransformComponentHelpers {
    public static readonly componentSize = 6;

    public static serializeComponent(component: TransformComponentNew): Array<number> {
        return [
            component.entityId,
            component.position.x,
            component.position.y,
            component.scale.x,
            component.scale.y,
            component.rotation,
        ];
    }

    public static deserializeComponent(sharedArray: Float32Array, idx: number): TransformComponentNew {
        const arrayIdx = this.componentSize * idx;
        return new TransformComponentNew(
            sharedArray[arrayIdx],
            { x: sharedArray[arrayIdx + 1], y: sharedArray[arrayIdx + 2] },
            { x: sharedArray[arrayIdx + 3], y: sharedArray[arrayIdx + 4] },
            sharedArray[arrayIdx + 5],
        );
    }
}
