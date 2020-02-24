import Component from '../Core/Component'
import * as THREE from 'three'
import HsvChunk from '../../shaders/hsv_chunk.frag'
import CorrectAlpha from '../../shaders/correct_alpha.frag'
import SelectiveColor from '../../shaders/mask/selective_color.frag'
import SelectiveUniform from '../../shaders/mask/selective_uniform.frag'
import FadeController from '../Controller/FadeController'
import MaskFadeController from '../Controller/MaskFadeController'

export default class SelectiveFadeObject extends Component {
    constructor({
        selectiveMasks = {},
        size = new THREE.Vector2(1, 1),
        rotation = new THREE.Euler(),
        position = new THREE.Vector3(),
        alpha = null,
        texture = null,
        color = null,
        transparent = true,
        depthWrite = true,
    }) {
        let shaderRef = null

        super(() => {
            const geometry = new THREE.PlaneGeometry(size.x, size.y)
            const material = new THREE.MeshLambertMaterial({
                color: color,
                map: texture,
                transparent: transparent ? true : false,
                depthWrite: depthWrite ? true : false,
                alphaMap: alpha,
            })

            material.onBeforeCompile = (shader: THREE.Shader) => {
                shader.uniforms.textureMask = { value: null }
                shader.uniforms.secondaryTextureMask = { value: null }
                shader.uniforms.maskTransition = { value: 1 }
                shader.fragmentShader = SelectiveUniform + shader.fragmentShader
                shader.fragmentShader = shader.fragmentShader.replace('#include <common>', HsvChunk)
                shader.fragmentShader = shader.fragmentShader.replace(
                    'vec4 diffuseColor = vec4( diffuse, opacity );',
                    SelectiveColor,
                )
                shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', CorrectAlpha)
                shaderRef = shader
            }
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(position.x, position.y, position.z)
            mesh.rotation.set(rotation.x, rotation.y, rotation.z)
            return mesh
        }, [new FadeController(), new MaskFadeController(() => shaderRef, selectiveMasks)])
    }
}
