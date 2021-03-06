import Component from '../Core/Component'
import * as THREE from 'three'
import Wall from './Wall'
import SceneObject from './SceneObject'
import Interactive from './Interactive'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import LoadedComponent from './LoadedComponent'
import TextureLoader from '../Core/TextureLoader'

export default class Room extends LoadedComponent {
    public static isLoaded: boolean = false
    private size: THREE.Vector3

    constructor() {
        const height = 3.5
        const width = height * 1.7134637
        const size = new THREE.Vector3(width, height, 4.5)

        super(() => {
            const obj = new THREE.Object3D()
            obj.position.y = size.y / 2
            return obj
        })

        this.size = size
    }

    loadRoom(): Promise<void> {
        if (Room.isLoaded) return this.load(TextureLoader.load([]), () => [])
        return this.load(
            TextureLoader.load(
                {
                    front_wall: 'room/o/structure/mur_du_fond.jpg',
                    floor: 'room/o/structure/sol.jpg',
                    left_wall_window: 'room/o/structure/porte_gauche.jpg',
                    left_wall_painting: 'room/o/structure/mur_gauche.jpg',
                    left_wall_corner: 'room/o/structure/mur_gauche_recoin.jpg',
                    right_wall: 'room/o/structure/mur_droite.jpg',
                    floor_shadow: 'room/o/left_shadow.png',
                    ceil: 'room/o/structure/plafond.jpg',
                    chest_sculpture: 'room/o/interactive/scene_01_sculture_v01.jpg',
                    chest_sculpture_alpha: 'room/o/interactive/scene_01_sculture_v01_alpha.png',
                    chest_sculpture_sketch: 'room/o/interactive/scene_01_esquisse_sculture_v01.png',
                    chest_sculpture_table: 'room/o/scene_01_premier_plan_v01.jpg',
                    chest_sculpture_table_alpha: 'room/o/scene_01_premier_plan_v01.png',
                    chair: 'room/o/scene_01_chaise_v01.jpg',
                    chair_alpha: 'room/o/scene_01_chaise_v01.png',
                    chair_leg: 'room/o/scene_01_chaise_pied.jpg',
                    chair_leg_alpha: 'room/o/scene_01_chaise_pied.png',
                    chair_shadow: 'room/o/scene_01_chaise_ombre_v01.png',
                    stool: 'room/o/scene_01_Tabouret_v01.jpg',
                    stool_alpha: 'room/o/scene_01_Tabouret_v01.png',
                    stool_leg: 'room/o/scene_01_Tabouret_pied_v01.jpg',
                    stool_leg_alpha: 'room/o/scene_01_Tabouret_pied_v01.png',
                    stool_shadow: 'room/o/scene_01_Tabouret_ombre_v01.png',
                    palette: 'room/o/interactive/scene_01_palette_v01.jpg',
                    palette_alpha: 'room/o/interactive/scene_01_palette_v01.png',
                    palette_sketch: 'room/o/interactive/scene_01_palette_Croquis_v01.png',
                    painting: 'room/o/scene_01_chevalet_v01.jpg',
                    painting_alpha: 'room/o/scene_01_chevalet_v01.png',
                    painting_leg: 'room/o/scene_01_chevalet_pied_v01.jpg',
                    painting_leg_alpha: 'room/o/scene_01_chevalet_pied_v01.png',
                    painting_shadow: 'room/o/scene_01_chevalet_ombre_v01.png',
                    painting_front: 'room/scene_01_chevalet_barre_milieu_v01.png',
                    table: 'room/o/scene_01_petit_meuble_v01.jpg',
                    table_alpha: 'room/o/scene_01_petit_meuble_v01.png',
                    brushes: 'room/o/interactive/pinceau.jpg',
                    brushes_alpha: 'room/o/interactive/pinceau_alpha.png',
                    brushes_sketch: 'room/o/interactive/pinceau_sketch.png',
                    back_paintings: 'room/o/scene_01_toile_fond_v01.jpg',
                    back_paintings_alpha: 'room/o/scene_01_toile_fond_v01.png',
                    statue: 'room/o/scene_01_statue_fond_v01.jpg',
                    statue_alpha: 'room/o/scene_01_statue_fond_v01.png',
                    rubens_sketch: 'room/o/interactive/rubens_croquis_v01.jpg',
                    rubens_painting: 'room/o/interactive/rubens_peinture_v01.jpg',
                    peace_painting: 'room/o/interactive/oeuvre.jpg',
                    peace_sketch: 'room/o/interactive/oeuvre_sketch.jpg',
                    magnifying_glass: 'loupe.png',
                    jp_lebrun: 'room/o/interactive/peinture_droite_v01.jpg',
                    jp_lebrun_sketch: 'room/o/interactive/peinture_droite_croquis_v01.jpg',
                    jb_frame: 'room/o/cadre_droite_sans_peinture_v01.jpg',
                    jb_frame_alpha: 'room/o/cadre_droite_sans_peinture_v01.png',
                },
                './assets/',
            ),
            (textures: { [name: string]: THREE.Texture }) => {
                Object.keys(textures)
                    .map(key => textures[key])
                    .map(t => (t.minFilter = THREE.LinearFilter))

                Room.isLoaded = true
                EventEmitter.getInstance().Emit(EVENT.ROOM_LOADED, 'Room')

                return [
                    // Front Wall
                    new Wall({
                        size: new THREE.Vector2(this.size.x, this.size.y),
                        position: new THREE.Vector3(0, 0, -this.size.z / 2),
                        rotation: new THREE.Euler(0, 0, 0),
                        texture: textures.front_wall,
                    }),
                    // Floor
                    new Wall({
                        size: new THREE.Vector2(this.size.x + 0.4, this.size.z - 1),
                        position: new THREE.Vector3(0 - 0.2, -this.size.y / 2, -0.5),
                        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                        texture: textures.floor,
                    }),
                    // Ceil
                    new Wall({
                        size: new THREE.Vector2(this.size.x + 0.4, this.size.z),
                        position: new THREE.Vector3(0 - 0.2, this.size.y / 2, 0),
                        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
                        texture: textures.ceil,
                    }),
                    // Left Wall
                    new Wall({
                        size: new THREE.Vector2(1.5, this.size.y),
                        position: new THREE.Vector3(-this.size.x / 2, 0, -1.5),
                        rotation: new THREE.Euler(0, Math.PI / 2, 0),
                        texture: textures.left_wall_painting,
                    }),
                    new Wall({
                        size: new THREE.Vector2(0.4, this.size.y),
                        position: new THREE.Vector3(-this.size.x / 2 - 0.2, 0, -0.75),
                        rotation: new THREE.Euler(0, 0, 0),
                        texture: textures.left_wall_corner,
                    }),
                    new Wall({
                        size: new THREE.Vector2(1.5, this.size.y),
                        position: new THREE.Vector3(-this.size.x / 2 - 0.4, 0, 0),
                        rotation: new THREE.Euler(0, Math.PI / 2, 0),
                        texture: textures.left_wall_window,
                    }),
                    new Component(
                        () => {
                            const object = new THREE.Object3D()
                            object.position.set(-this.size.x / 2 + 0.01, 0.32, -1.65)
                            object.rotation.set(0, Math.PI / 2, 0)
                            object.scale.set(1.01, 1.01, 1.01)
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
                        size: new THREE.Vector2(this.size.z, this.size.y),
                        position: new THREE.Vector3(this.size.x / 2, 0, 0),
                        rotation: new THREE.Euler(0, -Math.PI / 2, 0),
                        texture: textures.right_wall,
                    }),
                    new Component(
                        () => {
                            const object = new THREE.Object3D()
                            object.position.set(this.size.x / 2 - 0.01, 0.32, -1.425)
                            object.rotation.set(0, -Math.PI / 2, 0)
                            object.scale.set(1.01, 1.01, 1.01)
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
                    new Component(
                        () => {
                            const object = new THREE.Object3D()
                            object.position.set(
                                this.size.x / 2 - 0.02,
                                (117 - 720 / 2 + 322 - 10) * (this.size.y / 720),
                                (427 - 1320 / 2 - 351 / 2 - 45) * (this.size.z / 1320),
                            )
                            object.rotation.set(0, -Math.PI / 2, 0)
                            return object
                        },
                        [],
                        {},
                        [
                            new SceneObject({
                                size: new THREE.Vector2((this.size.z / 1320) * 322, (this.size.y / 720) * 351),
                                position: new THREE.Vector3(0.2, 0, 0),
                                texture: textures.jb_frame,
                                alpha: textures.jb_frame_alpha,
                                depthWrite: false,
                            }),
                        ],
                    ),
                    new Component(() => {
                        const ligth = new THREE.PointLight(0x222222, 0.5)
                        ligth.position.x = 1.3
                        ligth.position.y = -0.4
                        ligth.position.z = 3.5
                        return ligth
                    }),
                    // premier_plan
                    new SceneObject({
                        size: new THREE.Vector2(1.2, 0.42),
                        position: new THREE.Vector3(1.05, -0.98, 1.85),
                        texture: textures.chest_sculpture_table,
                        alpha: textures.chest_sculpture_table_alpha,
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
                                alpha: textures.chest_sculpture_alpha,
                                painting: textures.chest_sculpture,
                                ratio: new THREE.Vector2(0.6, 0.8),
                                glassTexture: textures.magnifying_glass,
                                glassPosition: new THREE.Vector3(-0.1, -0.1, 0.05),
                                customChildCollider: new Component(() => {
                                    const shape = new THREE.Shape()
                                    const size = new THREE.Vector2(0.6, 0.8)
                                    shape.moveTo(-size.x / 2, -size.y / 2)
                                    shape.lineTo(size.x / 2, -size.y / 2)
                                    shape.lineTo(size.x / 2, size.y / 2)
                                    shape.lineTo(-size.x / 2 + 0.12, size.y / 2)
                                    shape.lineTo(-size.x / 2 + 0.12, size.y / 2 - 0.4)
                                    shape.lineTo(-size.x / 2, size.y / 2 - 0.45)
                                    const mesh = new THREE.Mesh(
                                        new THREE.ShapeGeometry(shape),
                                        new THREE.MeshBasicMaterial({
                                            transparent: true,
                                            opacity: 0,
                                            depthWrite: false,
                                        }),
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
                        alpha: textures.chair_alpha,
                        depthWrite: false,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.11, 0.4),
                        position: new THREE.Vector3(0.725, -1.58, 0.25),
                        texture: textures.chair_leg,
                        alpha: textures.chair_leg_alpha,
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
                        alpha: textures.stool_alpha,
                        depthWrite: false,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.16, 0.4),
                        position: new THREE.Vector3(-0.95, -1.44, 0.2),
                        texture: textures.stool_leg,
                        alpha: textures.stool_leg_alpha,
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
                                alpha: textures.palette_alpha,
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
                        alpha: textures.painting_alpha,
                    }),
                    new SceneObject({
                        size: new THREE.Vector2(0.15, 0.9),
                        position: new THREE.Vector3(0, -1.35, -0.8),
                        rotation: new THREE.Euler(0.4, 0, 0),
                        texture: textures.painting_leg,
                        alpha: textures.painting_leg_alpha,
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
                        alpha: textures.table_alpha,
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
                                sketch: textures.brushes_sketch,
                                painting: textures.brushes,
                                alpha: textures.brushes_alpha,
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
                        alpha: textures.back_paintings_alpha,
                    }),
                    // statue
                    new SceneObject({
                        size: new THREE.Vector2(0.75, 2.1),
                        position: new THREE.Vector3(-2.4, -0.845, -1.8),
                        texture: textures.statue,
                        alpha: textures.statue_alpha,
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
                                name: 'Tableau',
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
                        position: new THREE.Vector3(-2.5, -this.size.y / 2 + 0.001, -1.45),
                        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                        texture: textures.floor_shadow,
                    }),
                ]
            },
        )
    }
}
