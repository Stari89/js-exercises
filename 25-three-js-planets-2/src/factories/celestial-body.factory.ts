import { ColorRepresentation, Mesh, MeshPhongMaterial, SphereGeometry, Vector2, Vector3 } from 'three';
import MeshComponent from '../components/mesh.component';
import Entity from '../entity/entity';
import GravityComponent from '../components/gravity.component';
import TransformComponent from '../components/transform.component';
import { Injectable } from '../decorators/injectable';

@Injectable()
export default class CelestialBodyFactory {
    generateCelestialBody(position: Vector2, velocity: Vector2, diameter: number, color: ColorRepresentation): Entity {
        const geometry = new SphereGeometry(diameter / 4, 64, 64);
        const material = new MeshPhongMaterial({ color });
        const mesh = new Mesh(geometry, material);
        const meshComponent = new MeshComponent({ mesh });

        const transfrormComponent = new TransformComponent({
            position,
            scale: new Vector2(1, 1),
        });

        const gravityComponent = new GravityComponent({
            mass: Math.pow(diameter, 3),
            preUpdatedPosition: position,
            velocity,
        });

        const entity = new Entity();
        entity.push(meshComponent);
        entity.push(transfrormComponent);
        entity.push(gravityComponent);
        return entity;
    }
}
