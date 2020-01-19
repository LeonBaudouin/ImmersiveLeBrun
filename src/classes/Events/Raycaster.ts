import AbstractEventEmitter from './AbstractEventEmitter'
import { Object3D, Intersection, Vector2, Camera, Raycaster as ThreeRaycaster } from 'three'

export default class Raycaster extends AbstractEventEmitter<Object3D, OrdereredIntersection> {
    private raycaster: ThreeRaycaster
    private static instance: Raycaster = null

    public static getInstance() {
        if (Raycaster.instance === null) {
            Raycaster.instance = new Raycaster()
        }
        return Raycaster.instance
    }

    protected constructor() {
        super()
        this.raycaster = new ThreeRaycaster()
    }

    Cast(camera: Camera, mouse: Vector2) {
        this.raycaster.setFromCamera(mouse, camera)
        const intersected = this.raycaster.intersectObjects([...this.callbackAssoc.keys()])
        for (let i = 0; i < intersected.length; i++) {
            const e = intersected[i]
            ;(<OrdereredIntersection>e).order = i
            this.Emit(e.object, <OrdereredIntersection>e)
        }
    }
}

type OrdereredIntersection = Intersection & { order: number }
