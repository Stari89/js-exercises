import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Entity from '../entity/entity';
import { Injectable } from '../ioc/injector';
import sceneSrc from '../assets/planet/scene.glb';
import PlanetComponent from '../components/planet.component';
import MeshComponent from '../components/mesh.component';

@Injectable()
export default class PlanetFactory {
    async generatePlanet(): Promise<Entity> {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(sceneSrc);
        const group = gltf.scene;
        group.scale.x = 15;
        group.scale.y = 15;
        group.scale.z = 15;

        const entity = new Entity();
        const meshComponent = new MeshComponent({ mesh: group });
        entity.push(meshComponent);
        entity.push(new PlanetComponent());
        return entity;
    }
}
