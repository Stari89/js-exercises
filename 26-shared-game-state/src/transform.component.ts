export interface IVector2 {
    x: number;
    y: number;
}

export enum ComponentTypes {
    Transform = 0x00000001,
    Gravity = 0x00000002,
    Mesh = 0x00000004,
    Camera = 0x00000008,
    Light = 0x00000010,
    Scene = 0x00000020,
}

export interface IBaseComponent {
    componentType: ComponentTypes;
}

export interface ITransformComponent extends IBaseComponent {
    componentType: ComponentTypes.Transform;
    position: IVector2;
    scale: IVector2;
    rotation: number;
}

export class TransformComponentHelpers {
    public static readonly componentSize = 6;

    static generateComponent(position?: IVector2, scale?: IVector2, rotation?: number): ITransformComponent {
        const component: ITransformComponent = {
            componentType: ComponentTypes.Transform,
            position: position || { x: 0, y: 0 },
            scale: scale || { x: 1, y: 1 },
            rotation: rotation || 0,
        };
        return component;
    }

    public static serializeComponent(component: ITransformComponent): ArrayBuffer {
        const arrayBuffer = new ArrayBuffer(48);
        const float64View = new Float64Array(arrayBuffer);
        const bigUint64View = new BigUint64Array(arrayBuffer);

        bigUint64View[0] = BigInt(component.componentType);
        float64View[1] = component.position.x;
        float64View[2] = component.position.y;
        float64View[3] = component.scale.x;
        float64View[4] = component.scale.y;
        float64View[5] = component.rotation;

        return arrayBuffer;
    }

    public static deserializeComponent(
        sharedArray: Float32Array,
        idx: number,
        sharedArrayBuffer: SharedArrayBuffer,
        startIdx: number,
    ): ITransformComponent {
        const arrayIdx = this.componentSize * idx;
        const component: ITransformComponent = {
            componentType: sharedArray[arrayIdx],
            position: { x: sharedArray[arrayIdx + 1], y: sharedArray[arrayIdx + 2] },
            scale: { x: sharedArray[arrayIdx + 3], y: sharedArray[arrayIdx + 4] },
            rotation: sharedArray[arrayIdx + 5],
        };
        return component;
    }
}
