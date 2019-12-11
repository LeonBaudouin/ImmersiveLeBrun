import AbstractController from '../Core/AbstractController'
import { MouseMoveListener } from '../Events/MouseMoveListener'
import * as THREE from 'three'

export default class CameraMouseFollow extends AbstractController {
    private mouseMoveListener: MouseMoveListener
    private lastMouse: THREE.Vector2 = new THREE.Vector2(0, 0)
    private speed: THREE.Vector2 = new THREE.Vector2(0.5, 0.5)

    constructor() {
        super()
        this.mouseMoveListener = MouseMoveListener.getInstance()
    }

    update(object3d: THREE.Object3D, time: number) {
        const mouse = this.mouseMoveListener.getValue()
        if (mouse) {
            this.lastMouse.set(mouse.x, mouse.y)
            // this.lastMouse.add(mouse.sub(this.lastMouse)).multiply(this.speed)
            object3d.rotation.y =
                (1 - (2 * this.lastMouse.x) / window.innerWidth) * 0.05
            object3d.rotation.x =
                (1 - (2 * this.lastMouse.y) / window.innerHeight) * 0.05
        }
    }
}
