import { Group } from "three";
import { IBaseComponent } from "./base-component";

export default class PlanetComponent implements IBaseComponent {
    public tGroup: Group;

    constructor(options: { tGroup?: Group} = {}) {
        this.tGroup = options.tGroup || null;
    }
}