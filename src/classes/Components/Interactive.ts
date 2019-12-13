import Component from '../Core/Component'
import * as THREE from 'three'
import StartChunk from '../../shaders/interactive/chunk_start.frag'
import MainChunk from '../../shaders/interactive/chunk_main.frag'
import UniformChunk from '../../shaders/interactive/chunk_uniforms.frag'
import InteractiveShader from '../Controller/InteractiveShader'

export default class Interactive extends Component {
    constructor(
        texture1: THREE.Texture,
        texture2: THREE.Texture,
        ratio: THREE.Vector2,
    ) {
        texture1.minFilter = THREE.LinearFilter
        texture2.minFilter = THREE.LinearFilter
        let materialShader: THREE.Shader

        const gen = () => {
            const material = new THREE.MeshLambertMaterial({ map: texture1 })

            material.onBeforeCompile = function(shader: THREE.Shader) {
                shader.uniforms.texture1 = { value: texture1 }
                shader.uniforms.texture2 = { value: texture2 }
                shader.uniforms.ratio = { value: ratio }
                shader.uniforms.mouse = { value: new THREE.Vector2() }
                shader.uniforms.prog = { value: 0.0 }
                shader.uniforms.time = { value: 0.0 }

                shader.vertexShader = shader.vertexShader.replace(
                    '#include <uv_pars_vertex>',
                    'varying vec2 vUv;\nuniform mat3 uvTransform;\n',
                )

                shader.fragmentShader = UniformChunk + shader.fragmentShader

                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <uv_pars_fragment>',
                    'varying vec2 vUv;',
                )
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <common>',
                    StartChunk,
                )
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <map_fragment>',
                    MainChunk,
                )

                materialShader = shader
            }

            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(ratio.x * 3, ratio.y * 3, 1, 1),
                material,
            )

            mesh.userData.name = 'TEST'

            return mesh
        }

        super(gen, [new InteractiveShader(() => materialShader)])
    }
}
