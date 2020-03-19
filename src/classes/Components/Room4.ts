import Component from '../Core/Component'
import * as THREE from 'three'
import Wall from './Wall'
import SceneObject from './SceneObject'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import LoadedComponent from './LoadedComponent'
import TextureLoader from '../Core/TextureLoader'

export default class Room4 extends LoadedComponent {
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
        if (Room4.isLoaded) return this.load(TextureLoader.load([]), () => [])
        const firstTarget = new THREE.Object3D()
        firstTarget.position.set(0, -0.4, -0.49)
        const secondTarget = new THREE.Object3D()
        secondTarget.position.set(1.5, 0.8, -0.49)
        return this.load(
            TextureLoader.load(
                {
                    right_wall_4: 'room4/mur_droite_outro_scene_4.jpg',
                    left_wall_4: 'room4/mur_gauche_outro_scene_4.jpg',
                    front_wall_4: 'room4/mur_fond_outro_scene_4.jpg',
                    floor_4: 'room4/sol_outro.jpg',
                    room3_frame: 'room3/cadre_v01.jpg',
                    room3_frame_alpha: 'room3/cadre_v01_alpha.png',
                    peace_painting: 'room/o/interactive/oeuvre.jpg',
                },
                './assets/',
            ),
            (textures: { [name: string]: THREE.Texture }) => {
                Object.keys(textures)
                    .map(key => textures[key])
                    .map(t => (t.minFilter = THREE.LinearFilter))

                Room4.isLoaded = true
                EventEmitter.getInstance().Emit(EVENT.ROOM_LOADED, 'Room')

                return [
                    // Front Wall
                    new Wall({
                        size: new THREE.Vector2(this.size.x, this.size.y),
                        position: new THREE.Vector3(0, 0, -0.5),
                        rotation: new THREE.Euler(0, 0, 0),
                        texture: textures.front_wall_4,
                        defMult: new THREE.Vector2(5, 5),
                    }),
                    // Floor
                    new Wall({
                        size: new THREE.Vector2(this.size.x, this.size.z - 1),
                        position: new THREE.Vector3(0, -this.size.y / 2, this.size.z / 2 - 1),
                        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                        texture: textures.floor_4,
                        defMult: new THREE.Vector2(5, 5),
                    }),
                    // Ceil
                    new Wall({
                        size: new THREE.Vector2(this.size.x, this.size.z),
                        position: new THREE.Vector3(0, this.size.y / 2, 0),
                        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
                        texture: textures.ceil,
                        defMult: new THREE.Vector2(5, 5),
                    }),
                    // Left Wall
                    new Wall({
                        size: new THREE.Vector2(this.size.z, this.size.y),
                        position: new THREE.Vector3(-this.size.x / 2, 0, this.size.z / 2 - 0.5),
                        rotation: new THREE.Euler(0, Math.PI / 2, 0),
                        texture: textures.left_wall_4,
                        defMult: new THREE.Vector2(5, 5),
                    }),
                    // Right Wall
                    new Wall({
                        size: new THREE.Vector2(this.size.z, this.size.y),
                        position: new THREE.Vector3(this.size.x / 2, 0, this.size.z / 2 - 0.5),
                        rotation: new THREE.Euler(0, -Math.PI / 2, 0),
                        texture: textures.right_wall_4,
                        defMult: new THREE.Vector2(5, 5),
                    }),
                    // new Component(() => new THREE.PointLight(0x987656, 0.4)),
                    // new Component(() => {
                    //     const ligth = new THREE.SpotLight(0xd9ebed, 0.4, 50, Math.PI, 2, 2)
                    //     ligth.position.x = -1.9
                    //     ligth.position.y = 2
                    //     ligth.position.z = 1.5
                    //     return ligth
                    // }),
                    new Component(() => {
                        const ligth = new THREE.SpotLight(0xedecd9, 1, 50, Math.PI / 9, 0.5, 0.5)
                        ligth.target = firstTarget
                        ligth.position.z = 2
                        ligth.position.y = 2
                        return ligth
                    }),
                    new Component(() => firstTarget),
                    new Component(() => {
                        const ligth = new THREE.SpotLight(0xedecd9, 0.6, 50, Math.PI / 18, 0.5, 0.5)
                        ligth.target = secondTarget
                        ligth.position.z = 3
                        ligth.position.y = 0
                        ligth.position.x = -3
                        return ligth
                    }),
                    new Component(() => secondTarget),
                    new Component(() => {
                        const ligth = new THREE.PointLight(0x222222, 0.01)
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
                ]
            },
        )
    }
}
