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
                    size: new THREE.Vector2(size.x + 0.4, size.z - 1),
                    position: new THREE.Vector3(0 - 0.2, -size.y / 2, -0.5),
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                    texture: textures.floor,
                }),
                // Ceil
                new Wall({
                    size: new THREE.Vector2(size.x + 0.4, size.z),
                    position: new THREE.Vector3(0 - 0.2, size.y / 2, 0),
                    rotation: new THREE.Euler(Math.PI / 2, 0, 0),
                    texture: textures.ceil,
                }),
                // Left Wall
                new Wall({
                    size: new THREE.Vector2(1.5, size.y),
                    position: new THREE.Vector3(-size.x / 2, 0, -1.5),
                    rotation: new THREE.Euler(0, Math.PI / 2, 0),
                    texture: textures.left_wall_painting,
                }),
                new Wall({
                    size: new THREE.Vector2(0.4, size.y),
                    position: new THREE.Vector3(-size.x / 2 - 0.2, 0, -0.75),
                    rotation: new THREE.Euler(0, 0, 0),
                    texture: textures.left_wall_corner,
                }),
                new Wall({
                    size: new THREE.Vector2(1.5, size.y),
                    position: new THREE.Vector3(-size.x / 2 - 0.4, 0, 0),
                    rotation: new THREE.Euler(0, Math.PI / 2, 0),
                    texture: textures.left_wall_window,
                }),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(-size.x / 2 + 0.01, 0.32, -1.65)
                        object.rotation.set(0, Math.PI / 2, 0)
                        return object
                    },
                    [],
                    {},
                    [
                        new Interactive(
                            'Rubens',
                            textures.rubens_sketch,
                            textures.rubens_painting,
                            new THREE.Vector2(0.65, 1.27),
                        ),
                    ],
                ),
                // Right Wall
                new Wall({
                    size: new THREE.Vector2(size.z, size.y),
                    position: new THREE.Vector3(size.x / 2, 0, 0),
                    rotation: new THREE.Euler(0, -Math.PI / 2, 0),
                    texture: textures.right_wall,
                }),
                new Component(() => new THREE.PointLight(0x987656, 0.4)),
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
                    size: new THREE.Vector2(1.2, 0.7),
                    position: new THREE.Vector3(1, -0.74, 1.85),
                    texture: textures.chest_sculpture_table,
                }),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(1.2, -0.68, 1.86)
                        return object
                    },
                    [],
                    {},
                    [
                        new Interactive(
                            'chest',
                            textures.chest_sculpture_sketch,
                            textures.chest_sculpture,
                            new THREE.Vector2(0.6, 0.8),
                        ),
                    ],
                ),

                // chaise
                new SceneObject({
                    size: new THREE.Vector2(0.8, 1.3),
                    position: new THREE.Vector3(0.7, -1.15, 0.4),
                    texture: textures.chair,
                }),
                new SceneObject({
                    size: new THREE.Vector2(0.9, 1.4),
                    position: new THREE.Vector3(0.725, -1.15, 0.25),
                    texture: textures.chair_leg,
                }),
                // tabouret
                new SceneObject({
                    size: new THREE.Vector2(0.8, 0.7),
                    position: new THREE.Vector3(-1, -1.425, 0.3),
                    texture: textures.stool,
                }),
                new SceneObject({
                    size: new THREE.Vector2(0.9, 0.8),
                    position: new THREE.Vector3(-1, -1.45, 0.2),
                    texture: textures.stool_leg,
                }),
                //palette
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(-1, -1.2, 0.31)
                        return object
                    },
                    [],
                    {},
                    [new Interactive('chest', textures.palette_sketch, textures.palette, new THREE.Vector2(0.45, 0.3))],
                ),

                // chevalet
                new SceneObject({
                    size: new THREE.Vector2(2, 2.4),
                    position: new THREE.Vector3(0, -0.5, -0.5),
                    texture: textures.painting,
                }),
                new SceneObject({
                    size: new THREE.Vector2(2, 1),
                    position: new THREE.Vector3(0, -1.4, -0.7),
                    rotation: new THREE.Euler(0.4, 0, 0),
                    texture: textures.painting_leg,
                }),
                new SceneObject({
                    size: new THREE.Vector2(2, 2.4),
                    position: new THREE.Vector3(0, -0.5, -0.48),
                    texture: textures.painting_front,
                }),
                // table
                new SceneObject({
                    size: new THREE.Vector2(0.5, 0.6),
                    position: new THREE.Vector3(-1.2, -1.2, -0.25),
                    texture: textures.table,
                }),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(-1.18, -0.7, -0.24)
                        return object
                    },
                    [],
                    {},
                    [new Interactive('chest', textures.brushs_sketch, textures.brushs, new THREE.Vector2(0.3, 0.6))],
                ),
                // tableaux
                new SceneObject({
                    size: new THREE.Vector2(1.45, 1.25),
                    position: new THREE.Vector3(1.8, -1.21, -2.1),
                    texture: textures.back_paintings,
                }),
                // status
                new SceneObject({
                    size: new THREE.Vector2(0.75, 2.1),
                    position: new THREE.Vector3(-2.4, -0.845, -1.8),
                    texture: textures.status,
                }),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(0, -0.4, -0.49)
                        return object
                    },
                    [],
                    {},
                    [
                        new Interactive(
                            'LaPaix',
                            textures.peace_sketch,
                            textures.peace_painting,
                            new THREE.Vector2(1.7, 1.2),
                        ),
                    ],
                ),
            ],
        )
    }
}
