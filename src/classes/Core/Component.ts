import { Object3D } from 'three'
import ControllerInterface, { Controller } from './ControllerInterface'
import AbstractController from './AbstractController'

export default class Component {
    public object3d: Object3D
    public controllers: Controller[]
    public children: Component[]
    public data: object

    constructor(
        object3dCallback: () => Object3D,
        controllers: Controller[] = [],
        data: object = {},
        children: Component[] = [],
    ) {
        this.object3d = object3dCallback()

        this.setChildren(children)
        this.setControllers(controllers)
    }

    protected setChildren(children: Component[]) {
        this.children = children

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i]
            this.object3d.add(child.object3d)
        }
    }

    protected setControllers(controllers: Controller[]) {
        this.controllers = controllers

        for (let i = 0; i < this.controllers.length; i++) {
            const controller = this.controllers[i]
            if (typeof controller == 'object') {
                controller.onMount(this.object3d)
            }
        }
    }

    update(time: number) {
        for (let i = 0; i < this.controllers.length; i++) {
            const controller = this.controllers[i]
            if (typeof controller == 'object') {
                controller.update(this.object3d, time, this.data)
            } else if (typeof controller == 'function') {
                controller(this.object3d, time, this.data)
            }
        }

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i]
            child.update(time)
        }
    }
}
