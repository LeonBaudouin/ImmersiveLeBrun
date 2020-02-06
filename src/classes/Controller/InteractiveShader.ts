import AbstractController from '../Core/AbstractController'
import * as THREE from 'three'
import Raycaster from '../Events/Raycaster'
import { TweenLite, Power4 } from 'gsap/all'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import SmoothedPoint from '../Utils/SmoothPoint'

export default class InteractiveShader extends AbstractController {
    private eventEmitter: EventEmitter

    private dMultTween: any
    private isClicked: boolean = false
    public currentFocus: boolean = false
    private smoother: SmoothedPoint

    private scene: string

    private getShader: () => THREE.Shader
    private uvCompensation: (uv: THREE.Vector2) => THREE.Vector2
    private customCollider: THREE.Object3D

    private static hoveredObject: THREE.Object3D
    private lastIsHovered: boolean

    constructor(
        scene: string,
        getShader: () => THREE.Shader = () => null,
        uvCompensation: (uv: THREE.Vector2) => THREE.Vector2 = (uv: THREE.Vector2) => uv,
        customCollider: THREE.Object3D = null,
        speed: THREE.Vector2 = new THREE.Vector2(0.1, 0.1),
    ) {
        super()
        this.scene = scene
        this.uvCompensation = uvCompensation
        this.customCollider = customCollider
        this.smoother = new SmoothedPoint(speed, new THREE.Vector2(0, 0))
        this.getShader = getShader
        this.eventEmitter = EventEmitter.getInstance()
    }

    public onMount(component: THREE.Object3D) {
        this.bind(component)
    }

    private bind(component: THREE.Object3D) {
        const css3dCanvas = document.querySelector('.css3d-canvas')
        const collider = this.customCollider === null ? component : this.customCollider

        const raycastCallback = infos => this.onRayCollide(component, infos)
        const clickCallback = () => this.onClick(component)

        this.eventEmitter.Subscribe(EVENT.INTERACTIVE_BIND, name => {
            if (name === this.scene) {
                Raycaster.getInstance().Subscribe(collider, raycastCallback)
                css3dCanvas.addEventListener('click', clickCallback)
            } else {
                Raycaster.getInstance().Unsubscribe(collider, raycastCallback)
                css3dCanvas.removeEventListener('click', clickCallback)
            }
        })
    }

    private onRayCollide(component: THREE.Object3D, { order, uv }: THREE.Intersection & { order: number }) {
        if (order == 0) {
            InteractiveShader.hoveredObject = component
            this.smoother.setTarget(this.uvCompensation(uv))
        }
    }

    private onClick(component: THREE.Object3D) {
        this.currentFocus = InteractiveShader.hoveredObject === component
        if (InteractiveShader.hoveredObject === component) {
            if (!this.isClicked) {
                this.isClicked = true
                this.Clicked()
            }
            this.eventEmitter.Emit(EVENT.INTERACTIVE_CLICK, {
                component,
                controller: this,
            })
        }
    }

    public update(component: THREE.Object3D, time: number) {
        if (this.getShader()) {
            this.smoother.smooth()
            const newMouse = this.smoother.getPoint()

            const {
                uniforms: { time: utime, mouse },
            } = this.getShader()

            utime.value = time
            if (!this.isClicked) {
                mouse.value.x = newMouse.x
                mouse.value.y = newMouse.y
            }

            const isHovered = component === InteractiveShader.hoveredObject
            const hoveredChange = this.lastIsHovered !== isHovered

            if (hoveredChange) {
                if (isHovered) this.smoother.jumbToTarget()
                this.eventEmitter.Emit(isHovered ? EVENT.INTERACTIVE_MOUSEENTER : EVENT.INTERACTIVE_MOUSELEAVE, {
                    component,
                    controller: this,
                })
                this.HoveredHasChanged(isHovered || this.isClicked)
            }

            this.lastIsHovered = isHovered
        }
    }

    private HoveredHasChanged(isHovered: boolean) {
        const { enterProg } = this.getShader().uniforms
        if (isHovered) {
            this.RemoveTween()
            this.dMultTween = TweenLite.to(enterProg, 0.5, {
                value: 1,
                ease: Power4.easeOut,
            })
        } else {
            this.RemoveTween()
            this.dMultTween = TweenLite.to(enterProg, 0.5, {
                value: 0,
                ease: Power4.easeOut,
            })
        }
    }

    private Clicked() {
        if (this.getShader()) {
            const { clickProg } = this.getShader().uniforms
            TweenLite.to(clickProg, 3, {
                value: 1,
                ease: Power4.easeOut,
            })
        }
    }

    private RemoveTween() {
        if (this.dMultTween) this.dMultTween.kill()
    }
}
