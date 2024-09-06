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
    onRun: () => void;
}
export interface OnBeforeUpdate {
    onBeforeUpdate: (loopInfo: ILoopInfo) => void;
}
export interface OnUpdate {
    onUpdate: (loopInfo: ILoopInfo) => void;
}
export interface OnAfterUpdate {
    onAfterUpdate: (loopInfo: ILoopInfo) => void;
}
export interface OnBeforeRender {
    onBeforeRender: (loopInfo: ILoopInfo) => void;
}
export interface OnRender {
    onRender: (loopInfo: ILoopInfo) => void;
}
export interface OnAfterRender {
    onAfterRender: (loopInfo: ILoopInfo) => void;
}
export interface OnStop {
    onStop: () => void;
}
export interface OnViewResize {
    onViewResize: () => void;
}
export interface OnSceneInit {
    onSceneInit: () => void;
}
export interface OnSceneInited {
    onSceneInited: () => void;
}
