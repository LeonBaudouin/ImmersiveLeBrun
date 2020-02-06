import AbstractController from '../Core/AbstractController'
import * as THREE from 'three'
import { TweenLite, Power1 } from 'gsap'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import InteractiveShader from './InteractiveShader'

export default class FadeController extends AbstractController {
    private static controllers: FadeController[] = []
    private static globalFade: boolean = false
    private meshLambertMaterial: THREE.MeshLambertMaterial
    private defaultColor: THREE.Color
    private restoreAll: boolean
    private tween: any
    private doesForceRestore: boolean = false

    constructor(restoreAll: boolean = false) {
        super()
        this.restoreAll = restoreAll
        FadeController.controllers.push(this)
    }

    public update(component: THREE.Object3D, time: number) {}

    public onMount(component: THREE.Object3D) {
        this.meshLambertMaterial = (<THREE.Mesh>component).material as THREE.MeshLambertMaterial
        this.defaultColor = this.meshLambertMaterial.color.clone()

        if (this.restoreAll) {
            EventEmitter.getInstance().Subscribe(
                EVENT.INTERACTIVE_CLICK,
                ({ component: m }: { component: THREE.Mesh }) => {
                    if (m.material === this.meshLambertMaterial) {
                        FadeController.globalFade = false
                        FadeController.controllers.forEach(c => c.restoreMaterial(1.5, true))
                    }
                },
            )
        } else {
            EventEmitter.getInstance().Subscribe(
                EVENT.INTERACTIVE_CLICK,
                ({ component: m }: { component: THREE.Mesh }) => {
                    FadeController.globalFade = true
                    if (m.material === this.meshLambertMaterial) {
                        this.restoreMaterial(1.5)
                    } else {
                        this.darkenMaterial(1.5, 0.4)
                    }
                },
            )
            EventEmitter.getInstance().Subscribe(
                EVENT.INTERACTIVE_MOUSEENTER,
                ({ component: m, controller }: { component: THREE.Mesh; controller: InteractiveShader }) => {
                    if (
                        m.material === this.meshLambertMaterial &&
                        FadeController.globalFade &&
                        !controller.currentFocus
                    ) {
                        this.restoreMaterial(1.5)
                    }
                },
            )
            EventEmitter.getInstance().Subscribe(
                EVENT.INTERACTIVE_MOUSELEAVE,
                ({ component: m, controller }: { component: THREE.Mesh; controller: InteractiveShader }) => {
                    if (
                        m.material === this.meshLambertMaterial &&
                        FadeController.globalFade &&
                        !controller.currentFocus
                    ) {
                        this.darkenMaterial(1.5, 0.4)
                    }
                },
            )
            EventEmitter.getInstance().Subscribe(EVENT.TRANSITION_START, () => {
                this.restoreMaterial(1.5)
            })
        }
    }

    public darkenMaterial(duration: number, amount: number) {
        if (this.doesForceRestore) return
        if (this.tween !== undefined) this.tween.kill()
        this.tween = TweenLite.to(this.meshLambertMaterial.color, duration, {
            r: amount,
            g: amount,
            b: amount,
            ease: Power1.easeInOut,
        })
    }

    public restoreMaterial(duration: number, force: boolean = false) {
        if (this.tween !== undefined) this.tween.kill()
        const onComplete = force ? () => (this.doesForceRestore = false) : () => {}
        this.doesForceRestore = force
        this.tween = TweenLite.to(this.meshLambertMaterial.color, duration, {
            r: this.defaultColor.r,
            g: this.defaultColor.g,
            b: this.defaultColor.b,
            ease: Power1.easeInOut,
            onComplete,
        })
    }
}
