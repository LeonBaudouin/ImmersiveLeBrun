import Component from '../Core/Component'
import * as THREE from 'three'
import {
    CSS3DRenderer,
    CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer'
import EventEmitter, { EVENT } from '../Events/EventEmitter'

export default class TextInfo extends Component {
    constructor({
        position = new THREE.Vector3(),
        elementId = '',
        text = '',
        elementClass = '',
    }) {
        super(() => {
            const newDiv = document.createElement("div");
            newDiv.setAttribute("id", elementId);
            newDiv.setAttribute("class", `css3d-container ${elementClass}`);
            newDiv.style.display = 'none';
            const newContent = document.createTextNode(text);
            newDiv.appendChild(newContent);

            const obj = new CSS3DObject(newDiv)
            obj.position.set(position.x, position.y, position.z)
            obj.scale.set(0.005, 0.005, 0.005)

            EventEmitter.getInstance().Subscribe(EVENT.INTERACTIVE_CLICK, (e) => {
                console.log(e.name,elementId, newDiv)
                if (e.name === elementId) {
                    newDiv.style.display = '';
                } else {
                    newDiv.style.display = 'none';
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
