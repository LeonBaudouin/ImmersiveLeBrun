import Component from '../Core/Component'
import * as THREE from 'three'
import Wall from './Wall'

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
                    size: new THREE.Vector2(size.x, size.z),
                    position: new THREE.Vector3(0, -size.y / 2, 0),
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                    color: new THREE.Color(0xc3a395),
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
            ],
        )
    }
}
