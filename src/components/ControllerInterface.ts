import { Object3D } from 'three'

export default class ControllerInterface {
    update(component: Object3D, time: number) {
        throw new Error('Update method is not implemented')
    }
    onMount(component: Object3D) {}
}

export type ControllerFunction = (object3d: Object3D, time: number) => void

export type Controller = ControllerFunction | ControllerInterface
