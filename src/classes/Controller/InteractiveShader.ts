import AbstractController from '../Core/AbstractController'
import * as THREE from 'three'
import { MouseMoveListener } from '../Events/MouseMoveListener'
import Raycaster from '../Events/Raycaster'

export default class InteractiveShader extends AbstractController {
    private mouse: THREE.Vector2
    private static hoveredObject: THREE.Object3D

    public onMount(component: THREE.Object3D) {
        Raycaster.getInstance().Subscribe(component, e => {
            if (e.order == 0) {
                InteractiveShader.hoveredObject = component
                this.mouse = e.uv
            }
        })
    }

    public update(component: THREE.Object3D, time: number) {
        const uniforms = <{ mouse: THREE.IUniform }>(
            (<THREE.ShaderMaterial>(<THREE.Mesh>component).material).uniforms
        )

        if (uniforms) {
            const oobPoint = new THREE.Vector2(-5, -5)
            uniforms.mouse.value =
                component === InteractiveShader.hoveredObject
                    ? this.mouse
                    : oobPoint
        }
    }
}
