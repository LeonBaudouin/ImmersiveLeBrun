import Component from '../Core/Component'
import * as THREE from 'three'
import vertSource from '../../shaders/painting.vert'
import fragSource from '../../shaders/painting.frag'
import Raycaster from '../Events/Raycaster'

export default class Interactable extends Component {
    constructor(
        texture1: THREE.Texture,
        texture2: THREE.Texture,
        ratio: THREE.Vector2,
    ) {
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
            }

            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(ratio.x * 3, ratio.y * 3, 1, 1),
                new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: vertSource,
                    fragmentShader: fragSource,
                }),
            )

            Raycaster.getInstance().Subscribe(
                mesh,
                e => (uniforms.mouse.value = e.uv),
            )

            mesh.position.set(0, 0, -1)
            return mesh
        }

        super(gen)
    }
}
