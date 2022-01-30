import './style.css';
import * as b from 'babylonjs';

const root = document.body;
const canvas = document.createElement('canvas');

const setCanvasSize = () => {
    const scale = window.devicePixelRatio || 1;
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    canvas.width = viewWidth * scale;
    canvas.height = viewHeight * scale;
    canvas.style.width = viewWidth + 'px';
    canvas.style.height = viewHeight + 'px';
    resizeCamera();
};

const getAspect = () => {
    return window.innerHeight / window.innerWidth;
};

const resizeCamera = () => {
    if (!camera) {
        return;
    }
    const rect = 2;
    camera.orthoLeft = -rect;
    camera.orthoRight = rect;
    camera.orthoTop = rect * getAspect();
    camera.orthoBottom = -rect * getAspect();
};

class CustomCameraInput implements b.ICameraInput<b.ArcRotateCamera> {
    camera: b.ArcRotateCamera;
    private keysUp = [38];
    private keysDown = [40];
    private keysLeft = [37];
    private keysRight = [39];
    private sensibility = 10;

    private scene: b.Scene;
    private engine: b.Engine;
    private element: HTMLElement;

    private keys: number[] = [];
    private onKeyDown: (e: any) => void;
    private onKeyUp: (e: any) => void;

    constructor() {}

    getClassName = (): string => {
        return 'CustomCameraInput';
    };
    getSimpleName = (): string => {
        return 'Custom camera input';
    };

    attachControl = (noPreventDefault?: boolean): void => {
        this.scene = this.camera.getScene();
        this.engine = this.camera.getEngine();
        this.element = this.engine.getInputElement();
        console.log('attach control');

        if (!this.onKeyDown) {
            this.element.tabIndex = 1;
            this.onKeyDown = (evt: KeyboardEvent) => {
                if (this.keysLeft.indexOf(evt.keyCode) !== -1 || this.keysRight.indexOf(evt.keyCode) !== -1) {
                    const index = this.keys.indexOf(evt.keyCode);
                    if (index === -1) {
                        this.keys.push(evt.keyCode);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            this.onKeyUp = (evt: KeyboardEvent) => {
                if (this.keysLeft.indexOf(evt.keyCode) !== -1 || this.keysRight.indexOf(evt.keyCode) !== -1) {
                    const index = this.keys.indexOf(evt.keyCode);
                    if (index >= 0) {
                        this.keys.splice(index, 1);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
        }

        this.element.addEventListener('keydown', this.onKeyDown, false);
        this.element.addEventListener('keyup', this.onKeyUp, false);
    };

    detachControl = (): void => {
        if (this.onKeyDown) {
            this.element.removeEventListener('keydown', this.onKeyDown);
            this.element.removeEventListener('keyup', this.onKeyUp);
            this.keys = [];
            this.onKeyDown = null;
            this.onKeyUp = null;
        }
    };

    checkInputs = () => {
        if (!this.onKeyDown) {
            return;
        }
        for (let index = 0; index < this.keys.length; index++) {
            const keyCode = this.keys[index];
            console.log('keycode', keyCode);
            if (this.keysLeft.indexOf(keyCode) !== -1) {
                this.camera.position.z += this.sensibility;
                // camera.cameraRotation.x += this.sensibility;
            } else if (this.keysRight.indexOf(keyCode) !== -1) {
                this.camera.position.z -= this.sensibility;
                // camera.cameraRotation.x -= this.sensibility;
            }
        }
    };
}

const createScene = () => {
    const scene = new b.Scene(engine);
    //camera = new b.UniversalCamera('camera2', new b.Vector3(0, 5, 0), scene);
    camera = new b.ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 2, 3, b.Vector3.Zero(), scene);
    camera.inputs.clear();
    camera.inputs.add(new CustomCameraInput());
    camera.attachControl(false);

    camera.mode = b.Camera.ORTHOGRAPHIC_CAMERA;
    resizeCamera();

    const light = new b.HemisphericLight('light1', new b.Vector3(1, 1, 0), scene);

    const mat = new b.StandardMaterial('', scene);
    mat.diffuseTexture = new b.Texture('https://assets.babylonjs.com/environments/tile1.jpg', scene);

    const front = new b.Vector4(0, 0, 0.5, 1);
    const back = new b.Vector4(0.5, 0, 1, 1);

    const plane = b.MeshBuilder.CreatePlane(
        'plane',
        { frontUVs: front, backUVs: back, sideOrientation: b.Mesh.DOUBLESIDE },
        scene
    );
    plane.material = mat;

    return scene;
};

window.addEventListener('resize', () => {
    setCanvasSize();
    engine.resize();
});
let camera: b.ArcRotateCamera = null;

setCanvasSize();
root.appendChild(canvas);

const engine = new b.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});
