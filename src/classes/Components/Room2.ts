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
                    front_wall_2: 'room2/mur_fond.jpg',
                    left_wall_2: 'room2/mur_gauche.jpg',
                    right_wall_2: 'room2/mur_droite.jpg',
                    floor_2: 'room2/sol.jpg',
                    ceil: 'room/o/structure/plafond.jpg',

                    character_1: 'room2/s2_personnage_extreme_gauche.jpg',
                    character_1_alpha: 'room2/s2_personnage_extreme_gauche_alpha.png',

                    character_2: 'room2/s2_personnage_gauche.jpg',
                    character_2_alpha: 'room2/s2_personnage_gauche_alpha.png',

                    character_3: 'room2/s2_personnage_milieu.jpg',
                    character_3_sketch: 'room2/s2_personnage_milieu_croquis.png',
                    character_3_alpha: 'room2/s2_personnage_milieu_alpha.png',

                    character_4: 'room2/s2_homme_droite_chaise_2.jpg',
                    character_4_alpha: 'room2/s2_homme_droite_chaise_2_alpha.png',

                    character_5: 'room2/s2_homme_droite_chaise.jpg',
                    character_5_alpha: 'room2/s2_homme_droite_chaise_alpha.png',

                    character_6: 'room2/scene_02_homme_extreme_droite_v01.jpg',
                    character_6_alpha: 'room2/scene_02_homme_extreme_droite_v01.png',
                    character_6_sketch: 'room2/scene_02_homme_extreme_droite_v01_croquis.png',

                    character_7: 'room2/s2_assis_fond.jpg',
                    character_7_alpha: 'room2/s2_assis_fond_alpha.png',

                    character_left: 'room2/s2_personnages_derriere_gauche.jpg',
                    character_left_sketch: 'room2/s2_personnages_derriere_gauche_croquis.png',
                    character_left_alpha: 'room2/s2_personnages_derriere_gauche_alpha.png',

                    character_right: 'room2/s2_personnages_derriere_cadres_droite.jpg',
                    character_right_sketch: 'room2/s2_personnages_derriere_cadres_droite_croquis.png',
                    character_right_alpha: 'room2/s2_personnages_derriere_cadres_droite_alpha.png',

                    // characters_painting: 'room2/scene_02_cadre_plus_personnages_v01.png',
                    frame: 'room2/scene_02_cadres_v01.jpg',
                    frame_alpha: 'room2/scene_02_cadres_v01.png',
                    frame_shadow: 'room2/scene_02_cadres_ombre_v01.png',

                    peace_painting: 'room/o/interactive/oeuvre.jpg',
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
                        size: new THREE.Vector2(0.733 * 2.9, 0.835 * 2.64),
                        position: new THREE.Vector3(0, -1.177, -0.48),
                        texture: textures.frame,
                        alpha: textures.frame_alpha,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(2.126, 1),
                        position: new THREE.Vector3(0, -2.2, -0.6),
                        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                        texture: textures.frame_shadow,
                        depthWrite: false,
                    }),
                    new Component(
                        () => {
                            const object = new THREE.Object3D()
                            object.position.set(-1.25, -1.2, -0.575)
                            return object
                        },
                        [],
                        {},
                        [
                            new Interactive({
                                name: 'Abondance',
                                sceneName: 'Demo',
                                sketch: textures.character_left_sketch,
                                painting: textures.character_left,
                                alpha: textures.character_left_alpha,
                                ratio: new THREE.Vector2(0.333 * 2.8, 0.835 * 2.8),
                                glassTexture: textures.magnifying_glass,
                                glassPosition: new THREE.Vector3(0.2, 0.4, 0.3),
                            }),
                        ],
                    ),
                    new Component(
                        () => {
                            const object = new THREE.Object3D()
                            object.position.set(0.9, -1.15, -0.575)
                            return object
                        },
                        [],
                        {},
                        [
                            new Interactive({
                                name: 'LaPaix',
                                sceneName: 'Demo',
                                sketch: textures.character_right_sketch,
                                painting: textures.character_right,
                                alpha: textures.character_right_alpha,
                                ratio: new THREE.Vector2(0.333 * 2.8, 0.835 * 2.8),
                                glassTexture: textures.magnifying_glass,
                                glassPosition: new THREE.Vector3(0.15, 0.5, 0.3),
                            }),
                        ],
                    ),
                    new SceneObject({
                        size: new THREE.Vector2(1.7, 1.2),
                        position: new THREE.Vector3(0, -0.9, -0.49),
                        texture: textures.peace_painting,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.476 * 1.3, 0.708 * 1.3),
                        position: new THREE.Vector3(-1.2, -1.55, 1.2),
                        texture: textures.character_1,
                        alpha: textures.character_1_alpha,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.958 * 1.3, 0.676 * 1.3),
                        position: new THREE.Vector3(-1.25, -1.55, 1.4),
                        texture: textures.character_2,
                        alpha: textures.character_2_alpha,
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
                                name: 'Hiérarchie',
                                sceneName: 'Demo',
                                sketch: textures.character_3_sketch,
                                painting: textures.character_3,
                                alpha: textures.character_3_alpha,
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
                        alpha: textures.character_4_alpha,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.686 * 1.2, 0.693 * 1.2),
                        position: new THREE.Vector3(1.1, -1.4, 1.5),
                        texture: textures.character_5,
                        alpha: textures.character_5_alpha,
                    }),
                    new Component(
                        () => {
                            const object = new THREE.Object3D()
                            object.position.set(1.75, -1.2, 1.6)
                            return object
                        },
                        [],
                        {},
                        [
                            new Interactive({
                                name: 'JBPierre',
                                sceneName: 'Demo',
                                sketch: textures.character_6_sketch,
                                painting: textures.character_6,
                                alpha: textures.character_6_alpha,
                                ratio: new THREE.Vector2(0.867 * 1.2, 1.231 * 1.2),
                                glassTexture: textures.magnifying_glass,
                                glassPosition: new THREE.Vector3(-0.5, 0.1, 0.3),
                            }),
                        ],
                    ),
                    new SceneObject({
                        size: new THREE.Vector2(0.547 * 1.2, 0.765 * 1.2),
                        position: new THREE.Vector3(1.35, -1.5, 0.9),
                        texture: textures.character_7,
                        alpha: textures.character_7_alpha,
                    }),
                ]
            },
        )
    }
}
