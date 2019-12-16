import AbstractController from '../Core/AbstractController'
import { MouseMoveListener } from '../Events/MouseMoveListener'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import SmoothedPoint from '../Utils/SmoothPoint'
import NormalizePoint from '../Utils/NormalizePoint'

export default class CameraMouseFollow extends AbstractController {
    private mouseMoveListener: MouseMoveListener
    private smoother: SmoothedPoint
    private basePosition: THREE.Vector3
    private maxRotation: THREE.Vector3
    private maxMove: THREE.Vector2
    private gui: any

    constructor(
        initialPos: THREE.Vector2 = new THREE.Vector2(0, 0),
        speed: THREE.Vector2 = new THREE.Vector2(0.03, 0.03),
        maxRotation: THREE.Vector3 = new THREE.Vector3(0.03, 0.02, 0.0),
        maxMove: THREE.Vector2 = new THREE.Vector2(0.15, 0),
    ) {
        super()
        this.gui = new dat.GUI()

        const rot = this.gui.addFolder('Rotation')
        rot.add(maxRotation, 'x', 0, 0.1)
        rot.add(maxRotation, 'y', 0, 0.1)
        rot.add(maxRotation, 'z', 0, 0.1)
        const move = this.gui.addFolder('Position')
        move.add(maxMove, 'x', -0.3, 0.3)
        move.add(maxMove, 'y', -0.3, 0.3)

        this.maxMove = maxMove
        this.maxRotation = maxRotation

        this.smoother = new SmoothedPoint(speed, initialPos)
        this.mouseMoveListener = MouseMoveListener.getInstance()
    }

    onMount(object3d: THREE.Object3D) {
        this.basePosition = object3d.position.clone()
        const basePos = this.gui.addFolder('Base Position')
        basePos.add(this.basePosition, 'x', -3, 3)
        basePos.add(this.basePosition, 'y', -3, 3)
        basePos.add(this.basePosition, 'z', -3, 3)
    }

    update(object3d: THREE.Object3D, time: number) {
        const mouse = this.mouseMoveListener.getValue()
        if (mouse) {
            this.smoother.setTarget(mouse)
            this.smoother.Smooth()
            const newPoint = this.smoother.getPoint()
            NormalizePoint(newPoint)
            object3d.rotation.y = newPoint.x * this.maxRotation.x
            object3d.rotation.x = newPoint.y * this.maxRotation.y
            object3d.rotation.z = -newPoint.x * this.maxRotation.z
            object3d.position.x = this.basePosition.x - newPoint.x * this.maxMove.x
            object3d.position.y = this.basePosition.y - newPoint.y * this.maxMove.y
        }
    }
}
