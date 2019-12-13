import AbstractController from '../Core/AbstractController'
import { MouseMoveListener } from '../Events/MouseMoveListener'
import * as dat from 'dat.gui'
import * as THREE from 'three'

export default class CameraMouseFollow extends AbstractController {
    private mouseMoveListener: MouseMoveListener
    private basePosition: THREE.Vector3
    private lastMouse: THREE.Vector2
    private speed: THREE.Vector2
    private maxRotation: THREE.Vector3
    public maxMove: THREE.Vector2

    constructor(
        firstMousePosition: THREE.Vector2 = new THREE.Vector2(0, 0),
        speed: THREE.Vector2 = new THREE.Vector2(0.03, 0.03),
        maxRotation: THREE.Vector3 = new THREE.Vector3(0.03, 0.02, 0.01),
        maxMove: THREE.Vector2 = new THREE.Vector2(0.1, 0),
    ) {
        super()
        const gui: any = new dat.GUI()
        const rot = gui.addFolder('Rotation')
        rot.add(maxRotation, 'x', 0, 0.1)
        rot.add(maxRotation, 'y', 0, 0.1)
        rot.add(maxRotation, 'z', 0, 0.1)
        const move = gui.addFolder('Position')
        move.add(maxMove, 'x', -0.3, 0.3)
        move.add(maxMove, 'y', -0.3, 0.3)
        this.maxMove = maxMove
        this.lastMouse = firstMousePosition
        this.speed = speed
        this.maxRotation = maxRotation
        this.mouseMoveListener = MouseMoveListener.getInstance()
    }

    onMount(object3d: THREE.Object3D) {
        this.basePosition = object3d.position.clone()
    }

    update(object3d: THREE.Object3D, time: number) {
        const mouse = this.mouseMoveListener.getValue()
        if (mouse) {
            const smoothMouse = this.SmoothMouse(mouse.clone())
            this.lastMouse.set(smoothMouse.x, smoothMouse.y)
            const normalizedMouse = this.NormalizeMouse(smoothMouse)
            object3d.rotation.y = normalizedMouse.x * this.maxRotation.x
            object3d.rotation.x = normalizedMouse.y * this.maxRotation.y - 0.05
            object3d.rotation.z = -normalizedMouse.x * this.maxRotation.z
            object3d.position.x = this.basePosition.x - normalizedMouse.x * this.maxMove.x
            object3d.position.y = this.basePosition.y - normalizedMouse.y * this.maxMove.y
        }
    }

    private SmoothMouse(mouse: THREE.Vector2): THREE.Vector2 {
        return mouse.set(
            this.lastMouse.x + (mouse.x - this.lastMouse.x) * this.speed.x,
            this.lastMouse.y + (mouse.y - this.lastMouse.y) * this.speed.y,
        )
    }

    private NormalizeMouse(mouse: THREE.Vector2): THREE.Vector2 {
        return mouse.set(1 - (2 * mouse.x) / window.innerWidth, 1 - (2 * mouse.y) / window.innerHeight)
    }
}
