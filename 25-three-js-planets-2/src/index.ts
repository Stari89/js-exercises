import App from './app';
import { Injector } from './ioc/injector';
import './style.css';

window.onload = () => {
    Injector.instance.resolve(App);
};
