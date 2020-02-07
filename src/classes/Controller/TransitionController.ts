import AbstractController from '../Core/AbstractController'
import * as THREE from 'three'
import { TweenLite, Power1 } from 'gsap/all'

export default class TransitionController extends AbstractController {
    private uniforms: { [name: string]: THREE.IUniform }
    private tween: any

    public onMount(component: THREE.Object3D) {
        this.uniforms = (<THREE.ShaderMaterial>(<THREE.Mesh>component).material).uniforms
    }

    public update(component: THREE.Object3D, time: number) {}

    public transition(sceneA: THREE.Texture, sceneB: THREE.Texture, delay: number, callback: Function) {
        this.uniforms.tDiffuse1.value = sceneA
        this.uniforms.tDiffuse2.value = sceneB
        this.uniforms.seed.value = Math.random()
        this.tween = TweenLite.to(this.uniforms.mixRatio, delay, {
            value: 1.0,
            ease: Power1.easeOut,
            onComplete: () => {
                callback()
                this.uniforms.mixRatio.value = 0.0
            },
        })
    }
}
