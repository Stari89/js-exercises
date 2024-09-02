import { BoxGeometry, BufferAttribute, BufferGeometry, Mesh, MeshPhongMaterial, SphereGeometry } from 'three';
import InvaderComponent from '../components/invader.component';
import Entity from '../entity/entity';
import { Injectable } from '../ioc/injector';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { crab, octopus, squid, ufo } from './invader-keyframes';

export enum InvaderTypes {
    Octopus = 0,
    Crab = 1,
    Squid = 2,
    Ufo = 3,
}

@Injectable()
export default class InvaderFactory {
    async generateInvader(type: InvaderTypes): Promise<Entity> {
        const scale = 0.015;

        let invaderKeyframes: number[][][];
        switch (type) {
            case InvaderTypes.Octopus:
                invaderKeyframes = octopus;
                break;
            case InvaderTypes.Crab:
                invaderKeyframes = crab;
                break;
            case InvaderTypes.Squid:
                invaderKeyframes = squid;
                break;
            case InvaderTypes.Ufo:
                invaderKeyframes = ufo;
                break;
            default:
                invaderKeyframes = [];
        }

        let maxX = 0;
        let maxY = 0;
        invaderKeyframes.forEach((kf) => {
            kf.forEach((m) => {
                if (maxY < m[0]) maxY = m[0];
                if (maxX < m[1]) maxX = m[1];
            });
        });
        const meshList: Mesh<BufferGeometry, MeshPhongMaterial>[] = [];
        const material = new MeshPhongMaterial({ color: 0xffffff });

        invaderKeyframes.forEach((kf) => {
            const boxGeometries: BoxGeometry[] = [];
            kf.forEach((s) => {
                const g = new BoxGeometry(scale, scale, scale);
                g.translate(s[1] * scale, s[0] * -scale, 0);
                boxGeometries.push(g);
            });
            const geometry = BufferGeometryUtils.mergeGeometries(boxGeometries);
            geometry.translate((-scale * (maxX + 1)) / 2, (scale * (maxY + 1)) / 2, 0);
            const mesh = new Mesh(geometry, material);
            meshList.push(mesh);
        });

        const invaderComponent = new InvaderComponent({
            meshList,
            frameSwitch: 500,
        });

        const entity = new Entity();
        entity.push(invaderComponent);
        return entity;
    }
}
