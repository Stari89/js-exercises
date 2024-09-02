import { ColorRepresentation, Mesh, MeshPhongMaterial, SphereGeometry, Vector2, Vector3 } from 'three';
import MeshComponent from '../components/mesh.component';
import Entity from '../entity/entity';
import { Injectable } from '../ioc/injector';
import GravityComponent from '../components/gravity.component';

@Injectable()
export default class CelestialBodyFactory {
    generateCelestialBody(position: Vector2, velocity: Vector2, radius: number, color: ColorRepresentation): Entity {
        const geometry = new SphereGeometry(radius, 64, 64);
        const material = new MeshPhongMaterial({ color });
        const mesh = new Mesh(geometry, material);
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        const meshComponent = new MeshComponent({ mesh });

        const gravityComponent = new GravityComponent({
            mass: Math.pow(radius * 1000, 3),
            preUpdatedPosition: position,
            velocity,
        });

        const entity = new Entity();
        entity.push(meshComponent);
        entity.push(gravityComponent);
        return entity;
    }
}
