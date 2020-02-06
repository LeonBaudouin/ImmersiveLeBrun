import AbstractController from '../Core/AbstractController'
import { MouseMoveListener } from '../Events/MouseMoveListener'
import * as THREE from 'three'
import SmoothedPoint from '../Utils/SmoothPoint'
import NormalizePoint from '../Utils/NormalizePoint'

export default class CameraMouseFollow extends AbstractController {
    private mouseMoveListener: MouseMoveListener
    private smoother: SmoothedPoint
    private basePosition: THREE.Vector3
    private baseRotation: THREE.Euler
    private maxRotation: THREE.Vector3
    private maxMove: THREE.Vector2

    constructor(
        initialPos: THREE.Vector2 = new THREE.Vector2(0, 0),
        initialRotation: THREE.Euler = new THREE.Euler(0, 0, 0),
        speed: THREE.Vector2 = new THREE.Vector2(0.03, 0.03),
        maxRotation: THREE.Vector3 = new THREE.Vector3(0.03, 0.02, 0.0),
        maxMove: THREE.Vector2 = new THREE.Vector2(0.15, 0),
    ) {
        super()

        this.maxMove = maxMove
        this.maxRotation = maxRotation

        this.smoother = new SmoothedPoint(speed, initialPos)
        this.mouseMoveListener = MouseMoveListener.getInstance()
    }

    onMount(object3d: THREE.Object3D) {
        this.baseRotation = object3d.rotation.clone()
        this.basePosition = object3d.position.clone()
    }

    update(object3d: THREE.Object3D, time: number) {
        const mouse = this.mouseMoveListener.getValue()
        if (mouse) {
            this.smoother.setTarget(mouse)
            this.smoother.smooth()
            const newPoint = this.smoother.getPoint()
            NormalizePoint(newPoint)
            object3d.rotation.y = this.baseRotation.x + newPoint.x * this.maxRotation.x
            object3d.rotation.x = this.baseRotation.y + newPoint.y * this.maxRotation.y
            object3d.rotation.z = this.baseRotation.z + -newPoint.x * this.maxRotation.z
            object3d.position.x = this.basePosition.x - newPoint.x * this.maxMove.x
            object3d.position.y = this.basePosition.y - newPoint.y * this.maxMove.y
        }
    }
}
