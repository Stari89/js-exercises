import './style.css';
import * as BABYLON from 'babylonjs';

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
};

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
    sphere.position.y = 1;
    const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false);
    return scene;
};

window.addEventListener('resize', () => {
    setCanvasSize();
    engine.resize();
});

setCanvasSize();
root.appendChild(canvas);

const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});
