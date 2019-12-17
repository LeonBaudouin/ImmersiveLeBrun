import Component from '../Core/Component'
import * as THREE from 'three'
import StartChunk from '../../shaders/interactive/chunk_start.frag'
import MainChunk from '../../shaders/interactive/chunk_main.frag'
import UniformChunk from '../../shaders/interactive/chunk_uniforms.frag'
import InteractiveShader from '../Controller/InteractiveShader'
import DetailHint from './DetailHint'

export default class Interactive extends Component {
    constructor({
        name,
        sketch,
        painting,
        ratio = new THREE.Vector2(),
        glassTexture,
        glassPosition = undefined,
        customChildCollider = undefined,
        uvColliderCompensation = undefined,
    }: Partial<{
        name: string
        sketch: THREE.Texture
        painting: THREE.Texture
        ratio: THREE.Vector2
        glassTexture: THREE.Texture
        glassPosition: THREE.Vector3 | undefined
        customChildCollider: Component | undefined
        uvColliderCompensation: (uv: THREE.Vector2) => THREE.Vector2
    }>) {
        let materialShader: THREE.Shader

        const children = [new DetailHint(name, glassTexture, glassPosition)]
        if (customChildCollider !== undefined) {
            children.push(customChildCollider)
        }

        const gen = () => {
            const material = new THREE.MeshLambertMaterial({ map: sketch, transparent: true })

            material.onBeforeCompile = function(shader: THREE.Shader) {
                shader.uniforms.sketch = { value: sketch }
                shader.uniforms.painting = { value: painting }
                shader.uniforms.ratio = { value: ratio }
                shader.uniforms.mouse = { value: new THREE.Vector2() }
                shader.uniforms.enterProg = { value: 0.0 }
                shader.uniforms.clickProg = { value: 0.0 }
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
                shader.fragmentShader = shader.fragmentShader.replace('#include <common>', StartChunk)
                shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', MainChunk)

                materialShader = shader
            }

            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(ratio.x, ratio.y, 1, 1), material)

            mesh.userData.name = name

            return mesh
        }

        super(
            gen,
            [new InteractiveShader(() => materialShader, uvColliderCompensation, customChildCollider?.object3d)],
            {},
            children,
        )
    }
}
