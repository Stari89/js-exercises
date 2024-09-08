export interface IBaseComponent {
    readonly componentName: string;
}

export interface IBaseComponentType<T extends IBaseComponent> {
    readonly name: string;
    new (): T;
}
