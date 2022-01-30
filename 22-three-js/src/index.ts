import {
    AmbientLight,
    BoxGeometry,
    DirectionalLight,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    WebGL1Renderer,
} from 'three';
import './style.css';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const camera = new OrthographicCamera(-10, 10, -10, 10, 0.01, 1000);

const renderer = new WebGL1Renderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new BoxGeometry();

const material = new MeshBasicMaterial({ color: 0x00ff00 });
const material2 = new MeshPhongMaterial({ color: 0x0000ff });

const cube = new Mesh(geometry, material2);
scene.add(cube);

const light = new DirectionalLight(0xffffff, 1.2);
light.position.x = 1;
light.position.y = 1;
light.position.z = 10;
scene.add(light);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();
