import Component from '../Core/Component'
import * as THREE from 'three'
import Wall from './Wall'
import SceneObject from './SceneObject'
import Interactive from './Interactive'
import EventEmitter, { EVENT } from '../Events/EventEmitter'

export default class Room extends Component {
    constructor(textures: { [name: string]: THREE.Texture } = {}) {
        const height = 3.5
        const width = height * 1.7134637
        const size = new THREE.Vector3(width, height, 4.5)

        super(
            () => {
                const obj = new THREE.Object3D()
                obj.position.y = size.y / 2
                return obj
            },
            [],
            {},
            [
                // Front Wall
                new Wall({
                    size: new THREE.Vector2(size.x, size.y),
                    position: new THREE.Vector3(0, 0, -size.z / 2),
                    rotation: new THREE.Euler(0, 0, 0),
                    texture: textures.front_wall,
                }),
                // Floor
                new Wall({
                    size: new THREE.Vector2(size.x, size.z - 1),
                    position: new THREE.Vector3(0, -size.y / 2, -0.5),
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                    texture: textures.floor,
                }),
                // Ceil
                new Wall({
                    size: new THREE.Vector2(size.x, size.z),
                    position: new THREE.Vector3(0, size.y / 2, 0),
                    rotation: new THREE.Euler(Math.PI / 2, 0, 0),
                }),
                // Left Wall
                new Wall({
                    size: new THREE.Vector2(size.z, size.y),
                    position: new THREE.Vector3(-size.x / 2, 0, 0),
                    rotation: new THREE.Euler(0, Math.PI / 2, 0),
                    texture: textures.left_wall,
                }),
                // Right Wall
                new Wall({
                    size: new THREE.Vector2(size.z, size.y),
                    position: new THREE.Vector3(size.x / 2, 0, 0),
                    rotation: new THREE.Euler(0, -Math.PI / 2, 0),
                    texture: textures.right_wall,
                }),
                new Component(() => new THREE.PointLight(0x987656, 0.3)),
                new Component(() => {
                    const ligth = new THREE.SpotLight(0xd9ebed, 0.4, 50, Math.PI, 2, 2)
                    ligth.position.x = -1.9
                    ligth.position.y = 2
                    ligth.position.z = 1.5
                    return ligth
                }),
                new Component(() => {
                    const ligth = new THREE.SpotLight(0xedecd9, 0.2, 50, Math.PI, 1.5, 1.5)
                    ligth.position.x = -0.5
                    ligth.position.y = 1.8
                    ligth.position.z = 4
                    return ligth
                }),
                new Component(() => {
                    const ligth = new THREE.PointLight(0x222222, 0.5)
                    ligth.position.x = 1.3
                    ligth.position.y = -0.4
                    ligth.position.z = 3.5
                    return ligth
                }),
                // premier_plan
                new SceneObject({
                    size: new THREE.Vector2(1, 0.8),
                    position: new THREE.Vector3(1.1, -0.425, 1.85),
                    texture: textures.chest_sculpture,
                }),
                // chaise
                new SceneObject({
                    size: new THREE.Vector2(1, 1.5),
                    position: new THREE.Vector3(0.7, -1.15, 0.4),
                    texture: textures.chair,
                }),
                // tabouret
                new SceneObject({
                    size: new THREE.Vector2(0.8, 1),
                    position: new THREE.Vector3(-1, -1.55, 0.3),
                    texture: textures.stool,
                }),
                // tableau
                new SceneObject({
                    size: new THREE.Vector2(2, 2.4),
                    position: new THREE.Vector3(0, -0.5, -0.5),
                    texture: textures.painting,
                }),
                // gueridon
                new SceneObject({
                    size: new THREE.Vector2(0.45, 1.3),
                    position: new THREE.Vector3(-1.2, -0.9, -0.25),
                    texture: textures.table,
                }),
                // tableaux
                new SceneObject({
                    size: new THREE.Vector2(1.4, 1.8),
                    position: new THREE.Vector3(2, -0.85, -2),
                    texture: textures.back_paintings,
                }),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(0, 0, 0)
                        object.scale.set(0.5, 0.5, 0.5)
                        return object
                    },
                    [],
                    {},
                    [new Interactive(textures.rubens_sketch, textures.rubens_painting, new THREE.Vector2(0.706, 1))],
                ),
            ],
        )
    }
}
