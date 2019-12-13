import AbstractController from '../Core/AbstractController'
import * as THREE from 'three'
import Raycaster from '../Events/Raycaster'
import { TweenLite, Power4 } from 'gsap/all'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import InteractiveClickInfo from '../Events/InteractiveClickInfo'

export default class InteractiveShader extends AbstractController {
    private mouse: THREE.Vector2 = new THREE.Vector2()
    private static hoveredObject: THREE.Object3D
    private dMultTween: any
    private lastIsHovered: boolean
    private getShader: () => THREE.Shader
    private eventEmitter: EventEmitter<string, InteractiveClickInfo>

    constructor(getShader: () => THREE.Shader = () => null) {
        super()
        this.getShader = getShader
        this.eventEmitter = EventEmitter.getInstance()
    }

    public onMount(component: THREE.Object3D) {
        Raycaster.getInstance().Subscribe(component, e => {
            if (e.order == 0) {
                InteractiveShader.hoveredObject = component
                this.mouse = e.uv
            }
        })

        document.addEventListener('click', () => {
            if (InteractiveShader.hoveredObject === component) {
                this.eventEmitter.Emit(EVENT.INTERACTIVE_CLICK, {
                    name: component.userData.name,
                })
            }
        })
    }

    public update(component: THREE.Object3D, time: number) {
        if (this.getShader()) {
            const {
                uniforms: { time: utime, mouse },
            } = this.getShader()

            utime.value = time
            mouse.value = this.mouse

            const isHovered = component === InteractiveShader.hoveredObject

            if (this.lastIsHovered !== isHovered) {
                this.HoveredHasChanged(isHovered)
            }

            this.lastIsHovered = isHovered
        }
    }

    private HoveredHasChanged(isHovered: boolean) {
        const { prog } = this.getShader().uniforms
        if (isHovered) {
            this.RemoveTween()
            this.dMultTween = TweenLite.to(prog, 0.5, {
                value: 1,
                ease: Power4.easeOut,
            })
        } else {
            this.RemoveTween()
            this.dMultTween = TweenLite.to(prog, 0.5, {
                value: 0,
                ease: Power4.easeOut,
            })
        }
    }

    private RemoveTween() {
        if (this.dMultTween) this.dMultTween.kill()
    }
}
