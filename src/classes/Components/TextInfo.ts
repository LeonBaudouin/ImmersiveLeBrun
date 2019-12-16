import Component from '../Core/Component'
import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import EventEmitter, { EVENT } from '../Events/EventEmitter'

export default class TextInfo extends Component {
    constructor({ position = new THREE.Vector3(), elementId = '', text = '', elementClass = '' }) {
        super(() => {
            const elem = document.createElement('div')
            elem.id = elementId
            elem.className = 'css3d-textinfo'
            elem.classList.add('preventClick')
            if (elementClass !== '') elem.classList.add(elementClass)
            elem.style.display = 'none'
            elem.innerHTML = text

            const obj = new CSS3DObject(elem)
            obj.position.set(position.x, position.y, position.z)
            obj.scale.set(0.005, 0.005, 0.005)

            EventEmitter.getInstance().Subscribe(EVENT.INTERACTIVE_CLICK, e => {
                if (e.name === elementId) {
                    elem.style.display = ''
                } else {
                    elem.style.display = 'none'
                }
            })

            return obj
        }, [
            (object3d: THREE.Object3D, time: number) => {
                object3d.position.y = 2 + Math.sin(time * 0.005) * 0.05
            },
        ])
    }
}
