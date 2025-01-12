import EntityHelpers from './entity.helpers';
import { ComponentTypes, ITransformComponent, TransformComponentHelpers } from './transform.component';

window.onload = () => {
    const gameState = new SharedArrayBuffer(1024);
    const gameStateView = new Uint8Array(gameState);

    const transformComponent = TransformComponentHelpers.generateComponent();

    const serializedComponent = TransformComponentHelpers.serializeComponent(transformComponent);

    // const componentView = new Uint8Array(serializedComponent);

    // gameStateView.set(componentView, 4);

    EntityHelpers.pushEntity(gameState, transformComponent);
};
