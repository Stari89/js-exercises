import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader } from 'three';
import Entity from '../entity/entity';
import { Injectable } from '../ioc/injector';
import splashSrc from '../assets/splash.jpg';
import MeshComponent from '../components/mesh.component';

@Injectable()
export default class PlaneFactory {
    async generateSplashPlane(): Promise<Entity> {
        const planeGeometry = new PlaneGeometry(1.2, 0.859);
        const planeTexture = await new TextureLoader().loadAsync(splashSrc);
        const planeMaterial = new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide, map: planeTexture });
        const mesh = new Mesh(planeGeometry, planeMaterial);
        const meshComponent = new MeshComponent({ mesh });

        const entity = new Entity();
        entity.push(meshComponent);
        return entity;
    }
}
