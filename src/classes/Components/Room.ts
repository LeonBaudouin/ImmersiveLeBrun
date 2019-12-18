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
                        new Interactive({
                            name: 'Rubens',
                            sceneName: 'Workshop',
                            sketch: textures.rubens_sketch,
                            painting: textures.rubens_painting,
                            ratio: new THREE.Vector2(0.65, 1.27),
                            glassTexture: textures.magnifying_glass,
                            glassPosition: new THREE.Vector3(-0.2, 0, 0.2),
                        }),
                    ],
                ),
                // Right Wall
                new Wall({
                    size: new THREE.Vector2(size.z, size.y),
                    position: new THREE.Vector3(size.x / 2, 0, 0),
                    rotation: new THREE.Euler(0, -Math.PI / 2, 0),
                    texture: textures.right_wall,
                }),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(size.x / 2 - 0.01, 0.32, -1.425)
                        object.rotation.set(0, -Math.PI / 2, 0)
                        return object
                    },
                    [],
                    {},
                    [
                        new Interactive({
                            name: 'JBLeBrun',
                            sceneName: 'Workshop',
                            sketch: textures.jp_lebrun_sketch,
                            painting: textures.jp_lebrun,
                            ratio: new THREE.Vector2(0.61, 1.28),
                            glassTexture: textures.magnifying_glass,
                            glassPosition: new THREE.Vector3(0.4, 0, 0.2),
                        }),
                    ],
                ),
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
                    size: new THREE.Vector2(1.2, 0.9),
                    position: new THREE.Vector3(1.05, -0.74, 1.85),
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
                        new Interactive({
                            name: 'Buste',
                            sceneName: 'Workshop',
                            sketch: textures.chest_sculpture_sketch,
                            painting: textures.chest_sculpture,
                            ratio: new THREE.Vector2(0.6, 0.8),
                            glassTexture: textures.magnifying_glass,
                            glassPosition: new THREE.Vector3(-0.1, -0.1, 0.05),
                            customChildCollider: new Component(() => {
                                const heartShape = new THREE.Shape()
                                const size = new THREE.Vector2(0.6, 0.8)
                                heartShape.moveTo(-size.x / 2, -size.y / 2)
                                heartShape.lineTo(size.x / 2, -size.y / 2)
                                heartShape.lineTo(size.x / 2, size.y / 2)
                                heartShape.lineTo(-size.x / 2 + 0.12, size.y / 2)
                                heartShape.lineTo(-size.x / 2 + 0.12, size.y / 2 - 0.4)
                                heartShape.lineTo(-size.x / 2, size.y / 2 - 0.45)
                                const mesh = new THREE.Mesh(
                                    new THREE.ShapeGeometry(heartShape),
                                    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
                                )
                                mesh.position.set(0, 0, 0)
                                return mesh
                            }),
                            uvColliderCompensation: (uv: THREE.Vector2) =>
                                uv.set((uv.x + 0.3) / 0.6, (uv.y + 0.4) / 0.8),
                        }),
                    ],
                ),

                // chaise
                new SceneObject({
                    size: new THREE.Vector2(0.8, 1.3),
                    position: new THREE.Vector3(0.7, -1.15, 0.4),
                    texture: textures.chair,
                    depthWrite: false,
                }),
                new SceneObject({
                    size: new THREE.Vector2(0.9, 1.4),
                    position: new THREE.Vector3(0.725, -1.15, 0.25),
                    texture: textures.chair_leg,
                    depthWrite: false,
                }),
                new SceneObject({
                    size: new THREE.Vector2(1.9, 0.6),
                    position: new THREE.Vector3(1.2, -1.745, 0.27),
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                    texture: textures.chair_shadow,
                    depthWrite: false,
                }),
                // tabouret
                new SceneObject({
                    size: new THREE.Vector2(0.8, 0.7),
                    position: new THREE.Vector3(-1, -1.425, 0.3),
                    texture: textures.stool,
                    depthWrite: false,
                }),
                new SceneObject({
                    size: new THREE.Vector2(0.9, 0.8),
                    position: new THREE.Vector3(-1, -1.45, 0.2),
                    texture: textures.stool_leg,
                    depthWrite: false,
                }),
                new SceneObject({
                    size: new THREE.Vector2(1, 0.7),
                    position: new THREE.Vector3(-0.95, -1.749, 0.2),
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                    texture: textures.stool_shadow,
                    depthWrite: false,
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
                    [
                        new Interactive({
                            name: 'Palette',
                            sceneName: 'Workshop',
                            sketch: textures.palette_sketch,
                            painting: textures.palette,
                            ratio: new THREE.Vector2(0.45, 0.3),
                            glassTexture: textures.magnifying_glass,
                            glassPosition: new THREE.Vector3(0, 0.1, 0.2),
                        }),
                    ],
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
                new SceneObject({
                    size: new THREE.Vector2(2.9, 0.6),
                    position: new THREE.Vector3(0.45, -1.745, -0.9),
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                    texture: textures.painting_shadow,
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
                    [
                        new Interactive({
                            name: 'Pencils',
                            sceneName: 'Workshop',
                            sketch: textures.brushs_sketch,
                            painting: textures.brushs,
                            ratio: new THREE.Vector2(0.3, 0.6),
                            glassTexture: textures.magnifying_glass,
                        }),
                    ],
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
                    depthWrite: false,
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
                        new Interactive({
                            name: 'LaPaix',
                            sceneName: 'Workshop',
                            sketch: textures.peace_sketch,
                            painting: textures.peace_painting,
                            ratio: new THREE.Vector2(1.7, 1.2),
                            glassTexture: textures.magnifying_glass,
                        }),
                    ],
                ),
                new SceneObject({
                    size: new THREE.Vector2(1, 1.5),
                    position: new THREE.Vector3(-2.5, -size.y / 2 + 0.001, -1.45),
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                    texture: textures.floor_shadow,
                }),
            ],
        )
    }
}
