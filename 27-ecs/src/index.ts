const ENTITY_COUNT = 1000;
const POSITION_COMPONENT_SIZE = 2; // x, y (2 floats)
const VELOCITY_COMPONENT_SIZE = 2; // vx, vy (2 floats)

const buffer = new SharedArrayBuffer(
    (ENTITY_COUNT * (POSITION_COMPONENT_SIZE + VELOCITY_COMPONENT_SIZE)) * Float32Array.BYTES_PER_ELEMENT
);
const floatView = new Float32Array(buffer);

class EntityManager {
    private nextEntityId = 0;

    createEntity(): number {
        return this.nextEntityId++;
    }
}

const positionOffset = 0;
const velocityOffset = ENTITY_COUNT * POSITION_COMPONENT_SIZE;

function setPosition(entityId: number, x: number, y: number) {
    const index = positionOffset + entityId * POSITION_COMPONENT_SIZE;
    floatView[index] = x;
    floatView[index + 1] = y;
}

function getPosition(entityId: number) {
    const index = positionOffset + entityId * POSITION_COMPONENT_SIZE;
    return { x: floatView[index], y: floatView[index + 1] };
}

function setVelocity(entityId: number, vx: number, vy: number) {
    const index = velocityOffset + entityId * VELOCITY_COMPONENT_SIZE;
    floatView[index] = vx;
    floatView[index + 1] = vy;
}

function getVelocity(entityId: number) {
    const index = velocityOffset + entityId * VELOCITY_COMPONENT_SIZE;
    return { vx: floatView[index], vy: floatView[index + 1] };
}

function safeSetPosition(entityId: number, x: number, y: number) {
    if (hasComponent(entityId, ComponentFlags.POSITION)) {
        setPosition(entityId, x, y);
    } else {
        console.warn(`Entity ${entityId} does not have a POSITION component.`);
    }
}

function safeSetVelocity(entityId: number, vx: number, vy: number) {
    if (hasComponent(entityId, ComponentFlags.VELOCITY)) {
        setVelocity(entityId, vx, vy);
    } else {
        console.warn(`Entity ${entityId} does not have a VELOCITY component.`);
    }
}

const entityComponentMap = new Uint32Array(ENTITY_COUNT); // 1 int per entity

enum ComponentFlags {
    POSITION = 1 << 0, // 0001
    VELOCITY = 1 << 1, // 0010
}

function addComponent(entityId: number, componentFlag: number) {
    entityComponentMap[entityId] |= componentFlag;
}

function hasComponent(entityId: number, componentFlag: number): boolean {
    return (entityComponentMap[entityId] & componentFlag) !== 0;
}

window.onload = () => {
    const entity = new EntityManager().createEntity();

    addComponent(entity, ComponentFlags.POSITION);
    addComponent(entity, ComponentFlags.VELOCITY);

    safeSetPosition(entity, 10, 20);
    safeSetVelocity(entity, 5, -2);

    console.log(getPosition(entity)); // { x: 10, y: 20 }
    console.log(getVelocity(entity)); // { vx: 5, vy: -2 }

    console.log(floatView);
};
