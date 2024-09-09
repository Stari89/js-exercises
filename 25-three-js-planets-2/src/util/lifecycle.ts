import { ILoopInfo } from './loop-info';

export enum LifecycleEvents {
    OnRun = 'onRun',
    OnBeforeUpdate = 'onBeforeUpdate',
    OnUpdate = 'onUpdate',
    OnAfterUpdate = 'onAfterUpdate',
    OnBeforeRender = 'onBeforeRender',
    OnRender = 'onRender',
    OnAfterRender = 'onAfterRender',
    OnStop = 'onStop',
    OnViewResize = 'onViewResize',
    OnSceneInit = 'onSceneInit',
    OnSceneInited = 'onSceneInited',
}

export interface OnRun {
    onRun: () => Promise<void>;
}
export interface OnBeforeUpdate {
    onBeforeUpdate: (loopInfo: ILoopInfo) => Promise<void>;
}
export interface OnUpdate {
    onUpdate: (loopInfo: ILoopInfo) => Promise<void>;
}
export interface OnAfterUpdate {
    onAfterUpdate: (loopInfo: ILoopInfo) => Promise<void>;
}
export interface OnBeforeRender {
    onBeforeRender: (loopInfo: ILoopInfo) => Promise<void>;
}
export interface OnRender {
    onRender: (loopInfo: ILoopInfo) => Promise<void>;
}
export interface OnAfterRender {
    onAfterRender: (loopInfo: ILoopInfo) => Promise<void>;
}
export interface OnStop {
    onStop: () => Promise<void>;
}
export interface OnViewResize {
    onViewResize: () => Promise<void>;
}
export interface OnSceneInit {
    onSceneInit: () => Promise<void>;
}
export interface OnSceneInited {
    onSceneInited: () => Promise<void>;
}
