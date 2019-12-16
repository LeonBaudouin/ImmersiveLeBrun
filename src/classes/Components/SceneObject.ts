import Component from '../Core/Component'
import * as THREE from 'three'

export default class SceneObject extends Component {
    constructor({
        size = new THREE.Vector2(1, 1),
        rotation = new THREE.Euler(),
        position = new THREE.Vector3(),
        texture = null,
        color = null,
        transparent = true,
        depthWrite = true,
    }) {
        super(() => {
            const geometry = new THREE.PlaneGeometry(size.x, size.y)
            const material = new THREE.MeshLambertMaterial({
                color: color,
                map: texture,
                transparent: transparent ? true : false,
                depthWrite: depthWrite ? true : false,
            })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(position.x, position.y, position.z)
            mesh.rotation.set(rotation.x, rotation.y, rotation.z)
            return mesh
        })
    }
}
