import Component from '../Core/Component'
import * as THREE from 'three'

export default class Wall extends Component {
    constructor({
        size = new THREE.Vector2(1, 1),
        rotation = new THREE.Euler(),
        position = new THREE.Vector3(),
        texture = null,
    }: WallParameters) {
        super(() => {
            const geometry = new THREE.PlaneGeometry(size.x, size.y, 1, 1)
            const material = new THREE.MeshPhongMaterial({
                color: 0x423873,
                map: texture,
            })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(position.x, position.y, position.z)
            mesh.rotation.set(rotation.x, rotation.y, rotation.z)
            return mesh
        })
    }
}

export interface WallParameters {
    size: THREE.Vector2
    rotation: THREE.Euler
    position: THREE.Vector3
    texture: THREE.Texture
}
