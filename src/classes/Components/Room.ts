import Component from '../Core/Component'
import * as THREE from 'three'
import Wall from './Wall'
import SceneObject from './SceneObject'
import { Object3D } from 'three'

export default class Room extends Component {
    constructor() {
        const height = 3.5
        const width = height * 1.7134637
        const size = new THREE.Vector3(width, height, 4.5)
        const loader = new THREE.TextureLoader()
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
                    texture: loader.load('../../assets/room/mur_porte_01.jpg'),
                }),
                // Floor
                new Wall({
                    size: new THREE.Vector2(size.x, size.z-1),
                    position: new THREE.Vector3(0, -size.y / 2, -0.5),
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                    texture: loader.load('../../assets/room/Sol_sombre_v01.png'),
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
                    texture: loader.load('../../assets/room/mur_02.jpg'),
                }),
                // Right Wall
                new Wall({
                    size: new THREE.Vector2(size.z, size.y),
                    position: new THREE.Vector3(size.x / 2, 0, 0),
                    rotation: new THREE.Euler(0, -Math.PI / 2, 0),
                    texture: loader.load('../../assets/room/mur_02.jpg'),
                }),
                new Component(() => new THREE.PointLight(0x987656, 0.3)),
                new Component(() => {
                    const ligth =  new THREE.SpotLight( 0xd9ebed, 0.4, 50, Math.PI, 2, 2 );
                    ligth.position.x = -1.9;
                    ligth.position.y = 2;
                    ligth.position.z = 1.5
                    return ligth;
                }),
                new Component(() => {
                    const ligth =  new THREE.SpotLight( 0xedecd9, 0.3, 50, Math.PI, 1.5, 1.5 );
                    ligth.position.x = -0.5;
                    ligth.position.y = 1.8;
                    ligth.position.z = 4
                    return ligth;
                }), 
                new Component(() => {
                    const ligth =  new THREE.PointLight( 0x222222, 0.5);
                    ligth.position.x = 1.3;
                    ligth.position.y = -0.4;
                    ligth.position.z = 3.5;
                    return ligth;
                }), 
                new SceneObject({
                    size: new THREE.Vector2(1, 0.8),
                    position: new THREE.Vector3(1.1, -0.425, 1.8),
                    texture: loader.load('../../assets/room/scene_01_premier_plan_v01.png'),
                }),
                new SceneObject({
                    size: new THREE.Vector2(2.5, 1.3),
                    position: new THREE.Vector3(0, -1.15, 0.5),
                    texture: loader.load('../../assets/room/2_siege_fauteuil.png'),
                }),
                new SceneObject({
                    size: new THREE.Vector2(2, 2.4),
                    position: new THREE.Vector3(0, -0.5, -0.5),
                    texture: loader.load('../../assets/room/3_tableau.png'),
                }),
                new SceneObject({
                    size: new THREE.Vector2(0.45, 1.3),
                    position: new THREE.Vector3(-1.2, -0.9, -0.25),
                    texture: loader.load('../../assets/room/4_gueridon.png'),
                }),
                new SceneObject({
                    size: new THREE.Vector2(1.4, 1.8),
                    position: new THREE.Vector3(2, -0.85, -2),
                    texture: loader.load('../../assets/room/5_tableaux.png'),
                })
            ],
        )
    }
}
