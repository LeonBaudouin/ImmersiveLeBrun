import Component from '../Core/Component'
import * as THREE from 'three'
import FadeController from '../Controller/FadeController'

export default class SceneObject extends Component {
    constructor({
        size = new THREE.Vector2(1, 1),
        rotation = new THREE.Euler(),
        position = new THREE.Vector3(),
        alpha = null,
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
                alphaMap: alpha,
                alphaTest: alpha === null ? 0 : 0.3,
            })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(position.x, position.y, position.z)
            mesh.rotation.set(rotation.x, rotation.y, rotation.z)
            return mesh
        }, [new FadeController()])
    }
}
