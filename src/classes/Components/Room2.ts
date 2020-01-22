import Component from '../Core/Component'
import * as THREE from 'three'
import Wall from './Wall'
import SceneObject from './SceneObject'
import Interactive from './Interactive'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import LoadedComponent from './LoadedComponent'
import TextureLoader from '../Core/TextureLoader'

export default class Room2 extends LoadedComponent {
    public static isLoaded: boolean = false
    private size: THREE.Vector3

    constructor() {
        const height = 4.5
        const width = height * 1.422
        const size = new THREE.Vector3(width, height, 6)

        super(() => {
            const obj = new THREE.Object3D()
            obj.position.y = size.y / 2
            return obj
        })

        this.size = size
    }

    loadRoom(): Promise<void> {
        if (Room2.isLoaded) return this.load(TextureLoader.load([]), () => [])
        return this.load(
            TextureLoader.load(
                {
                    front_wall_2: 'room2/mur_fond__haut.jpg',
                    left_wall_2: 'room2/mur_gauche_haut.jpg',
                    right_wall_2: 'room2/mur_droite_haut.jpg',
                    floor_2: 'room2/sol_4.jpg',
                    ceil: 'room/plafond_v03.jpg',
                    character_1: 'room2/scene_02_personnage_extreme_gauche_v01.png',
                    character_2: 'room2/scene_02_personnage_gauche_v01.png',
                    character_3: 'room2/scene_02_personnage_milieu_v02.png',
                    character_3_sketch: 'room2/scene_02_personnage_milieu_esquisse_v01.png',
                    character_4: 'room2/scene_02_homme_droite_chaise2_v01.png',
                    character_5: 'room2/scene_02_homme_droite_chaise_v01.png',
                    character_6: 'room2/scene_02_homme_extreme_droite_v01.png',
                    character_7: 'room2/scene_02_assis_fond_v01.png',
                    characters_painting: 'room2/scene_02_cadre_plus_personnages_v01.png',
                    frame: 'room2/scene_02_cadres_v02.png',
                    character_left: 'room2/scene_02_personnages_derriere_cadres_gauche_v02.png',
                    character_right: 'room2/scene_02_personnages_derriere_cadres_droite_v01.png',
                    peace_painting: 'room/elisabeth_peinture_v01.jpg',
                    magnifying_glass: 'loupe.png',
                },
                './assets/',
            ),
            (textures: { [name: string]: THREE.Texture }) => {
                Object.keys(textures)
                    .map(key => textures[key])
                    .map(t => (t.minFilter = THREE.LinearFilter))

                Room2.isLoaded = true
                EventEmitter.getInstance().Emit(EVENT.ROOM_LOADED, 'Room2')

                return [
                    // Front Wall
                    new Wall({
                        size: new THREE.Vector2(this.size.x, this.size.y),
                        position: new THREE.Vector3(0, 0, -this.size.z / 2),
                        rotation: new THREE.Euler(0, 0, 0),
                        texture: textures.front_wall_2,
                    }),
                    // Floor
                    new Wall({
                        size: new THREE.Vector2(this.size.x, this.size.z - 1),
                        position: new THREE.Vector3(0, -this.size.y / 2, -0.5),
                        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                        texture: textures.floor_2,
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
                        position: new THREE.Vector3(-this.size.x / 2, 0, 0),
                        rotation: new THREE.Euler(0, Math.PI / 2, 0),
                        texture: textures.left_wall_2,
                    }),
                    // Right Wall
                    new Wall({
                        size: new THREE.Vector2(this.size.z, this.size.y),
                        position: new THREE.Vector3(this.size.x / 2, 0, 0),
                        rotation: new THREE.Euler(0, -Math.PI / 2, 0),
                        texture: textures.right_wall_2,
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
                        size: new THREE.Vector2(0.733 * 2.9, 0.835 * 2.75),
                        position: new THREE.Vector3(-0, -1.23, -0.48),
                        texture: textures.frame,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.333 * 2.8, 0.835 * 2.8),
                        position: new THREE.Vector3(-1.25, -1.2, -0.575),
                        texture: textures.character_left,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.333 * 2.8, 0.835 * 2.8),
                        position: new THREE.Vector3(0.9, -1.15, -0.575),
                        texture: textures.character_right,
                    }),
                    // new SceneObject({
                    //     size: new THREE.Vector2(1.02 * 3, 0.835 * 2.9),
                    //     position: new THREE.Vector3(-0.175, -0.72, -0.51),
                    //     texture: textures.characters_painting,
                    // }),
                    // new Component(
                    //     () => {
                    //         const object = new THREE.Object3D()
                    //         object.position.set(0, -0.4, -0.49)
                    //         return object
                    //     },
                    //     [],
                    //     {},
                    //     [
                    //         new Interactive({
                    //             name: 'LaPaix2',
                    //             sceneName: 'Demo',
                    //             sketch: textures.peace_sketch,
                    //             painting: textures.peace_painting,
                    //             ratio: new THREE.Vector2(1.7, 1.2),
                    //             glassTexture: textures.magnifying_glass,
                    //         }),
                    //     ],
                    // ),
                    new SceneObject({
                        size: new THREE.Vector2(1.7, 1.2),
                        position: new THREE.Vector3(0, -0.9, -0.49),
                        texture: textures.peace_painting,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.476 * 1.3, 0.708 * 1.3),
                        position: new THREE.Vector3(-1.2, -1.55, 1.2),
                        texture: textures.character_1,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.958 * 1.3, 0.676 * 1.3),
                        position: new THREE.Vector3(-1.25, -1.55, 1.4),
                        texture: textures.character_2,
                    }),
                    new Component(
                        () => {
                            const object = new THREE.Object3D()
                            object.position.set(-0.25, -1.5, 1.55)
                            return object
                        },
                        [],
                        {},
                        [
                            new Interactive({
                                name: 'Character3',
                                sceneName: 'Demo',
                                sketch: textures.character_3_sketch,
                                painting: textures.character_3,
                                ratio: new THREE.Vector2(0.53 * 1.3, 0.675 * 1.3),
                                glassTexture: textures.magnifying_glass,
                                customChildCollider: new Component(() => {
                                    const shape = new THREE.Shape()
                                    const size = new THREE.Vector2(0.6, 0.9)
                                    shape.moveTo(-size.x / 2, -size.y / 2)
                                    shape.lineTo(size.x / 2, -size.y / 2)
                                    shape.lineTo(size.x / 2 - 0.17, size.y / 2)
                                    shape.lineTo(-size.x / 2, size.y / 2)
                                    const mesh = new THREE.Mesh(
                                        new THREE.ShapeGeometry(shape),
                                        new THREE.MeshBasicMaterial({
                                            transparent: true,
                                            opacity: 0,
                                            depthWrite: false,
                                        }),
                                    )
                                    mesh.position.set(0, 0, 0.01)
                                    return mesh
                                }),
                                uvColliderCompensation: (uv: THREE.Vector2) =>
                                    uv.set((uv.x + 0.3) / 0.6, (uv.y + 0.45) / 0.9),
                            }),
                        ],
                    ),
                    new SceneObject({
                        size: new THREE.Vector2(0.452 * 1.4, 0.685 * 1.4),
                        position: new THREE.Vector3(0.75, -1.55, 1.2),
                        texture: textures.character_4,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.686 * 1.2, 0.693 * 1.2),
                        position: new THREE.Vector3(1.1, -1.4, 1.5),
                        texture: textures.character_5,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.867 * 1.2, 1.231 * 1.2),
                        position: new THREE.Vector3(1.75, -1.2, 1.6),
                        texture: textures.character_6,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.547 * 1.2, 0.765 * 1.2),
                        position: new THREE.Vector3(1.35, -1.5, 0.9),
                        texture: textures.character_7,
                    }),
                ]
            },
        )
    }
}
