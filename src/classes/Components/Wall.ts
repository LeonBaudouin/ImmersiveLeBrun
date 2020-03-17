import Component from '../Core/Component'
import * as THREE from 'three'
import FadeController from '../Controller/FadeController'

export default class Wall extends Component {
    constructor({
        size = new THREE.Vector2(1, 1),
        rotation = new THREE.Euler(),
        position = new THREE.Vector3(),
        texture = null,
        color = null,
        defMult = new THREE.Vector2(1, 1),
    }: Partial<WallParameters>) {
        super(() => {
            const geometry = new THREE.PlaneGeometry(
                size.x,
                size.y,
                Math.ceil(size.x) * defMult.x,
                Math.ceil(size.y) * defMult.y,
            )
            const material = new THREE.MeshLambertMaterial({
                color: color,
                map: texture,
            })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(position.x, position.y, position.z)
            mesh.rotation.set(rotation.x, rotation.y, rotation.z)
            return mesh
        }, [new FadeController()])
    }
}

export interface WallParameters {
    size: THREE.Vector2
    rotation: THREE.Euler
    position: THREE.Vector3
    texture: THREE.Texture
    color: THREE.Color
    defMult: THREE.Vector2
}
