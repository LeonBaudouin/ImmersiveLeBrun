import Component from '../Core/Component'
import * as THREE from 'three'
import Wall from './Wall'
import SceneObject from './SceneObject'
import Interactive from './Interactive'
import EventEmitter, { EVENT } from '../Events/EventEmitter'

export default class Room2 extends Component {
    constructor(textures: { [name: string]: THREE.Texture } = {}) {
        const height = 4
        const width = 3.5 * 1.7134637
        const size = new THREE.Vector3(width, height, 4.5)

        super(
            () => {
                const obj = new THREE.Object3D()
                obj.position.y = size.y / 2 - 0.25
                return obj
            },
            [],
            {},
            [
                // Front Wall
                new Wall({
                    size: new THREE.Vector2(size.x, size.y),
                    position: new THREE.Vector3(0, 0, -0.5),
                    rotation: new THREE.Euler(0, 0, 0),
                    texture: textures.front_wall_3,
                }),
                // Floor
                new Wall({
                    size: new THREE.Vector2(size.x, size.z - 1),
                    position: new THREE.Vector3(0, -size.y / 2, size.z/2 -1),
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                    texture: textures.floor_3,
                }),
                // Ceil
                new Wall({
                    size: new THREE.Vector2(size.x, size.z),
                    position: new THREE.Vector3(0, size.y / 2, 0),
                    rotation: new THREE.Euler(Math.PI / 2, 0, 0),
                    texture: textures.ceil,
                }),
                // Left Wall
                new Wall({
                    size: new THREE.Vector2(size.z, size.y),
                    position: new THREE.Vector3(-size.x / 2, 0, size.z/2 -0.5),
                    rotation: new THREE.Euler(0, Math.PI / 2, 0),
                    texture: textures.left_wall_3,
                }),
                // Right Wall
                new Wall({
                    size: new THREE.Vector2(size.z, size.y),
                    position: new THREE.Vector3(size.x / 2, 0, size.z/2 -0.5),
                    rotation: new THREE.Euler(0, -Math.PI / 2, 0),
                    texture: textures.right_wall_3,
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
                new SceneObject({
                    size: new THREE.Vector2(1.7, 1.2),
                    position: new THREE.Vector3(0, -0.4, -0.49),
                    texture: textures.peace_painting,
                }),
                new SceneObject({
                    size: new THREE.Vector2(1.7*1.2, 1.2*1.32),
                    position: new THREE.Vector3(0, -0.4, -0.48),
                    texture: textures.room3_frame,
                }),
                // new SceneObject({
                //     size: new THREE.Vector2(0.286*2.5, 0.746*2.5),
                //     position: new THREE.Vector3(-1.25, -0.7, 0.2),
                //     texture: textures.perso_01,
                // }),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(-1.25, -1, 0.2)
                        return object
                    },
                    [],
                    {},
                    [
                        new Interactive({
                            name: 'room3_perso1',
                            sceneName: 'Galerie',
                            sketch: textures.perso_01_sketch,
                            painting: textures.perso_01,
                            ratio: new THREE.Vector2(0.286*2.5, 0.746*2.5),
                            glassTexture: textures.magnifying_glass,
                        }),
                    ],
                ),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(-0.75, -1, 0.3)
                        return object
                    },
                    [],
                    {},
                    [
                        new Interactive({
                            name: 'room3_perso3',
                            sceneName: 'Galerie',
                            sketch: textures.perso_03_sketch,
                            painting: textures.perso_03,
                            ratio: new THREE.Vector2(0.296*2.5, 0.780*2.5),
                            glassTexture: textures.magnifying_glass,
                        }),
                    ],
                ),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(0.75, -1, 0.3)
                        return object
                    },
                    [],
                    {},
                    [
                        new Interactive({
                            name: 'room3_perso2',
                            sceneName: 'Galerie',
                            sketch: textures.perso_02_sketch,
                            painting: textures.perso_02,
                            ratio: new THREE.Vector2(0.291*2.5, 0.766*2.5),
                            glassTexture: textures.magnifying_glass,
                        }),
                    ],
                ),
                new Component(
                    () => {
                        const object = new THREE.Object3D()
                        object.position.set(1.5, -0.9, 0.2)
                        return object
                    },
                    [],
                    {},
                    [
                        new Interactive({
                            name: 'room3_perso4',
                            sceneName: 'Galerie',
                            sketch: textures.perso_04_sketch,
                            painting: textures.perso_04,
                            ratio: new THREE.Vector2(0.373*2.5, 0.822*2.5),
                            glassTexture: textures.magnifying_glass,
                        }),
                    ],
                ),
            ],
        )
    }
}
