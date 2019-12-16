import Component from '../Core/Component'
import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import EventEmitter, { EVENT } from '../Events/EventEmitter'

export default class TextInfo extends Component {
    constructor({ elementId, position = new THREE.Vector3(), childPos = new THREE.Vector3() }) {
        const elem = <HTMLElement>document.querySelector('#' + elementId)
        const children = []

        const quote = <HTMLElement>elem.querySelector('.css3d-quote')
        if (quote) {
            elem.querySelector('.css3d-quoteicon').addEventListener('click', e => {
                e.stopPropagation()
                quote.classList.toggle('show')
            })
            children.push(
                new Component(() => {
                    const obj = new CSS3DObject(quote)
                    obj.position.set(childPos.x / 0.005, childPos.y / 0.005, childPos.z / 0.005)
                    return obj
                }),
            )
        }

        EventEmitter.getInstance().Subscribe(EVENT.INTERACTIVE_CLICK, ({ component }) => {
            if (component.userData.name === elementId) {
                elem.classList.add('show')
            } else {
                elem.classList.remove('show')
                if (quote) quote.classList.remove('show')
            }
        })

        super(
            () => {
                const obj = new CSS3DObject(elem)
                obj.position.set(position.x, position.y, position.z)
                obj.scale.set(0.0025, 0.0025, 0.0025)
                return obj
            },
            [],
            {},
            children,
        )
    }
}
