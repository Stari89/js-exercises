import { InjectedType } from '../ioc/util';

export const Injectable = (): ((target: InjectedType<any>) => void) => {
    return (target: InjectedType<any>) => {
        target.prototype.isInjectedService = true;
    };
};
