import Component from '../Core/Component'
import * as THREE from 'three'
import vertSource from '../../shaders/interactive.vert'
import fragSource from '../../shaders/interactive.frag'
import InteractiveShader from '../Controller/InteractiveShader'

export default class Interactive extends Component {
    constructor(
        texture1: THREE.Texture,
        texture2: THREE.Texture,
        ratio: THREE.Vector2,
    ) {
        texture1.minFilter = THREE.LinearFilter
        texture2.minFilter = THREE.LinearFilter

        const gen = () => {
            const uniforms = {
                texture1: {
                    type: 't',
                    value: texture1,
                },
                texture2: {
                    type: 't',
                    value: texture2,
                },
                ratio: {
                    type: 'vec2',
                    value: ratio,
                },
                mouse: {
                    type: 'vec2',
                    value: new THREE.Vector2(),
                },
                prog: {
                    type: 'f',
                    value: 0.0,
                },
                time: {
                    type: 'f',
                    value: 0.0,
                },
            }

            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(ratio.x * 3, ratio.y * 3, 1, 1),
                new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: vertSource,
                    fragmentShader: fragSource,
                }),
            )

            return mesh
        }

        super(gen, [new InteractiveShader()])
    }
}
