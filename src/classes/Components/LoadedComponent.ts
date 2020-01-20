import Component from '../Core/Component'
import * as THREE from 'three'
import { Controller } from '../Core/ControllerInterface'

export default class LoadedComponent extends Component {
    constructor(object3dCallback: () => THREE.Object3D, controllers: Controller[] = []) {
        super(object3dCallback, controllers)
    }

    load(
        texturesPromise: Promise<THREE.Texture[] | { [name: string]: THREE.Texture }>,
        createChildren: (texture: THREE.Texture[] | { [name: string]: THREE.Texture }) => Component[],
    ): Promise<void> {
        return texturesPromise.then(createChildren).then(children => this.setChildren(children))
    }
}
