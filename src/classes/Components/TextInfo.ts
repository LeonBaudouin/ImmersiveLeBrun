import Component from '../Core/Component'
import * as THREE from 'three'
import {
    CSS3DRenderer,
    CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer'
import EventEmitter, { EVENT } from '../Events/EventEmitter'

export default class SceneObject extends Component {
    constructor({
        size = new THREE.Vector2(1, 1),
        rotation = new THREE.Euler(),
        position = new THREE.Vector3(),
        texture = null,
        color = null,
        transparent = true,
    }) {
        super(() => {
            const obj = new CSS3DObject(document.querySelector('#content'))
            obj.position.set(0, 0, 0)
            obj.scale.set(0.005, 0.005, 0.005)

            EventEmitter.getInstance().Subscribe(EVENT.INTERACTIVE_CLICK, (name) => {
                console.log(name, obj)
            })
            
            return obj
        }, [
            (object3d: THREE.Object3D, time: number) => {
                object3d.position.y = 2 + Math.sin(time * 0.005) * 0.05
            },
        ])
    }
}
