import AbstractController from '../Core/AbstractController'
import { MouseMoveListener } from '../Events/MouseMoveListener'
import * as THREE from 'three'

export default class CameraMouseFollow extends AbstractController {
    private mouseMoveListener: MouseMoveListener
    private lastMouse: THREE.Vector2
    private speed: THREE.Vector2
    private maxRotation: THREE.Vector2

    constructor(
        firstMousePosition: THREE.Vector2 = new THREE.Vector2(0, 0),
        speed: THREE.Vector2 = new THREE.Vector2(0.07, 0.07),
        maxRotation: THREE.Vector2 = new THREE.Vector2(0.02, 0.02),
    ) {
        super()
        this.lastMouse = firstMousePosition
        this.speed = speed
        this.maxRotation = maxRotation
        this.mouseMoveListener = MouseMoveListener.getInstance()
    }

    update(object3d: THREE.Object3D, time: number) {
        const mouse = this.mouseMoveListener.getValue()
        if (mouse) {
            const mouseX =
                this.lastMouse.x + (mouse.x - this.lastMouse.x) * this.speed.x
            const mouseY =
                this.lastMouse.y + (mouse.y - this.lastMouse.y) * this.speed.y

            this.lastMouse.set(mouseX, mouseY)

            object3d.rotation.y =
                (1 - (2 * this.lastMouse.x) / window.innerWidth) *
                this.maxRotation.x
            object3d.rotation.x =
                (1 - (2 * this.lastMouse.y) / window.innerHeight) *
                    this.maxRotation.y -
                0.05
        }
    }
}
