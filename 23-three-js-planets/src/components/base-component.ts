export interface IBaseComponent {}

export interface IBaseComponentType<T extends IBaseComponent> {
    readonly name: string;
    new (): T;
}
