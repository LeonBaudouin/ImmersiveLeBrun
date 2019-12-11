import Component from '../Core/Component'
import * as THREE from 'three'

export default class Room extends Component {
    constructor() {
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
                new Component(() => {
                    const geometry = new THREE.PlaneGeometry(
                        size.x,
                        size.y,
                        Math.ceil(size.x),
                        Math.ceil(size.y),
                    )
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x423873,
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.position.set(0, 0, -size.z / 2)
                    return mesh
                }),
                // Floor
                new Component(() => {
                    const geometry = new THREE.PlaneGeometry(
                        size.x,
                        size.z,
                        Math.ceil(size.x),
                        Math.ceil(size.z),
                    )
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x423873,
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.position.set(0, -size.y / 2, 0)
                    mesh.rotateX(-Math.PI / 2)
                    return mesh
                }),
                // Ceil
                new Component(() => {
                    const geometry = new THREE.PlaneGeometry(
                        size.x,
                        size.z,
                        Math.ceil(size.x),
                        Math.ceil(size.z),
                    )
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x423873,
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.position.set(0, size.y / 2, 0)
                    mesh.rotateX(Math.PI / 2)
                    return mesh
                }),
                // Left Wall
                new Component(() => {
                    const geometry = new THREE.PlaneGeometry(
                        size.z,
                        size.y,
                        Math.ceil(size.z),
                        Math.ceil(size.y),
                    )
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x423873,
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.position.set(-size.x / 2, 0, 0)
                    mesh.rotateY(Math.PI / 2)
                    return mesh
                }),
                // Right Wall
                new Component(() => {
                    const geometry = new THREE.PlaneGeometry(
                        size.z,
                        size.y,
                        Math.ceil(size.z),
                        Math.ceil(size.y),
                    )
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x423873,
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.position.set(size.x / 2, 0, 0)
                    mesh.rotateY(-Math.PI / 2)
                    return mesh
                }),
            ],
        )
    }
}
