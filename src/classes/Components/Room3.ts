import Component from '../Core/Component'
import * as THREE from 'three'
import Wall from './Wall'
import SceneObject from './SceneObject'
import Interactive from './Interactive'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import LoadedComponent from './LoadedComponent'
import TextureLoader from '../Core/TextureLoader'

export default class Room3 extends LoadedComponent {
    private size: THREE.Vector3
    public static isLoaded: boolean = false

    constructor() {
        const height = 4
        const width = 3.5 * 1.7134637
        const size = new THREE.Vector3(width, height, 4.5)

        super(() => {
            const obj = new THREE.Object3D()
            obj.position.y = size.y / 2 - 0.25
            return obj
        })

        this.size = size
    }

    loadRoom(): Promise<void> {
        if (Room3.isLoaded) return this.load(TextureLoader.load([]), () => [])
        return this.load(
            TextureLoader.load(
                {
                    right_wall_3: 'room3/mur_droite.jpg',
                    left_wall_3: 'room3/mur_gauche.jpg',
                    front_wall_3: 'room3/mur_fond.jpg',
                    floor_3: 'room3/sol.jpg',
                    perso_01: 'room3/perso_01_v01.jpg',
                    perso_01_alpha: 'room3/perso_01_v01.png',
                    perso_02: 'room3/perso_02_v01.jpg',
                    perso_02_alpha: 'room3/perso_02_v01.png',
                    perso_02_sketch: 'room3/perso_02_croquis.png',
                    perso_02_shadow: 'room3/perso_02_ombre_v01.png',
                    perso_03: 'room3/perso_03_v01.jpg',
                    perso_03_alpha: 'room3/perso_03_v01.png',
                    perso_03_sketch: 'room3/perso_03_croquis.png',
                    perso_03_shadow: 'room3/perso_03_ombre_v01.png',
                    perso_04: 'room3/perso_04_v01.jpg',
                    perso_04_alpha: 'room3/perso_04_v01.png',
                    perso_04_sketch: 'room3/perso_04_croquis.png',
                    perso_04_shadow: 'room3/perso_04_ombre_v01.png',
                    room3_frame: 'room3/cadre_v01.jpg',
                    room3_frame_alpha: 'room3/cadre_v01_alpha.png',
                    peace_painting: 'room/o/interactive/oeuvre.jpg',
                    magnifying_glass: 'loupe.png',
                },
                './assets/',
            ),
            (textures: { [name: string]: THREE.Texture }) => {
                Object.keys(textures)
                    .map(key => textures[key])
                    .map(t => (t.minFilter = THREE.LinearFilter))

                Room3.isLoaded = true
                EventEmitter.getInstance().Emit(EVENT.ROOM_LOADED, 'Room')

                return [
                    // Front Wall
                    new Wall({
                        size: new THREE.Vector2(this.size.x, this.size.y),
                        position: new THREE.Vector3(0, 0, -0.5),
                        rotation: new THREE.Euler(0, 0, 0),
                        texture: textures.front_wall_3,
                    }),
                    // Floor
                    new Wall({
                        size: new THREE.Vector2(this.size.x, this.size.z - 1),
                        position: new THREE.Vector3(0, -this.size.y / 2, this.size.z / 2 - 1),
                        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                        texture: textures.floor_3,
                    }),
                    // Ceil
                    new Wall({
                        size: new THREE.Vector2(this.size.x, this.size.z),
                        position: new THREE.Vector3(0, this.size.y / 2, 0),
                        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
                        texture: textures.ceil,
                    }),
                    // Left Wall
                    new Wall({
                        size: new THREE.Vector2(this.size.z, this.size.y),
                        position: new THREE.Vector3(-this.size.x / 2, 0, this.size.z / 2 - 0.5),
                        rotation: new THREE.Euler(0, Math.PI / 2, 0),
                        texture: textures.left_wall_3,
                    }),
                    // Right Wall
                    new Wall({
                        size: new THREE.Vector2(this.size.z, this.size.y),
                        position: new THREE.Vector3(this.size.x / 2, 0, this.size.z / 2 - 0.5),
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
                        size: new THREE.Vector2(1.7 * 1.2, 1.2 * 1.32),
                        position: new THREE.Vector3(0, -0.4, -0.48),
                        texture: textures.room3_frame,
                        alpha: textures.room3_frame_alpha,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.286 * 2.5, 0.746 * 2.5),
                        position: new THREE.Vector3(-1.25, -1, 0.2),
                        texture: textures.perso_01,
                        alpha: textures.perso_01_alpha,
                    }),
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
                                name: 'JBPierre2',
                                sceneName: 'Galerie',
                                sketch: textures.perso_03_sketch,
                                painting: textures.perso_03,
                                alpha: textures.perso_03_alpha,
                                ratio: new THREE.Vector2(0.296 * 2.5, 0.78 * 2.5),
                                glassTexture: textures.magnifying_glass,
                            }),
                        ],
                    ),
                    new SceneObject({
                        size: new THREE.Vector2(0.9, 0.4),
                        position: new THREE.Vector3(-0.75, -1.95, 0.17),
                        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                        texture: textures.perso_03_shadow,
                    }),
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
                                name: 'Barth',
                                sceneName: 'Galerie',
                                sketch: textures.perso_02_sketch,
                                painting: textures.perso_02,
                                alpha: textures.perso_02_alpha,
                                ratio: new THREE.Vector2(0.291 * 2.5, 0.766 * 2.5),
                                glassTexture: textures.magnifying_glass,
                            }),
                        ],
                    ),
                    new SceneObject({
                        size: new THREE.Vector2(0.7, 0.4),
                        position: new THREE.Vector3(0.85, -1.95, 0.13),
                        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                        texture: textures.perso_02_shadow,
                    }),
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
                                name: 'Critique',
                                sceneName: 'Galerie',
                                sketch: textures.perso_04_sketch,
                                painting: textures.perso_04,
                                alpha: textures.perso_04_alpha,
                                ratio: new THREE.Vector2(0.373 * 2.5, 0.822 * 2.5),
                                glassTexture: textures.magnifying_glass,
                            }),
                        ],
                    ),
                    new SceneObject({
                        size: new THREE.Vector2(1, 0.4),
                        position: new THREE.Vector3(1.7, -1.95, -0.05),
                        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                        texture: textures.perso_04_shadow,
                    }),
                ]
            },
        )
    }
}
