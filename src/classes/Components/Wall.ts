import Component from '../Core/Component'
import * as THREE from 'three'

export default class Wall extends Component {
    constructor({
        size = new THREE.Vector2(1, 1),
        rotation = new THREE.Euler(),
        position = new THREE.Vector3(),
        texture = null,
        color = null,
    }: Partial<WallParameters>) {
        super(() => {
            const geometry = new THREE.PlaneGeometry(size.x, size.y, Math.ceil(size.x), Math.ceil(size.y))
            const material = new THREE.MeshLambertMaterial({
                color: color,
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
    color: THREE.Color
}
