import { Object3D } from 'three'
import ControllerInterface, { Controller } from './ControllerInterface'
import AbstractController from './AbstractController'

export default class Component {
    public object3d: Object3D
    public controllers: Controller[]
    public children: Component[]

    constructor(
        object3dCallback: () => Object3D,
        controllers: Controller[] = [],
        children: Component[] = [],
    ) {
        this.object3d = object3dCallback()
        this.controllers = controllers
        this.children = children
        this.children.forEach(child => {
            this.object3d.add(child.object3d)
        })
        this.controllers.forEach(controller => {
            if (typeof controller == 'object') {
                controller.onMount(this.object3d)
            }
        })
    }

    update(time: number) {
        this.controllers.forEach(controller => {
            if (typeof controller == 'object') {
                controller.update(this.object3d, time)
            } else if (typeof controller == 'function') {
                controller(this.object3d, time)
            }
        })
        this.children.forEach(child => {
            child.update(time)
        })
    }
}
