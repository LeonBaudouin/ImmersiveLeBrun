import AbstractController from '../Core/AbstractController'
import * as THREE from 'three'
import Raycaster from '../Events/Raycaster'
import { TweenLite, Power4, Power2 } from 'gsap/all'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import InteractiveClickInfo from '../Events/InteractiveClickInfo'

export default class InteractiveShader extends AbstractController {
    private eventEmitter: EventEmitter<string, InteractiveClickInfo>

    private mouse: THREE.Vector2 = new THREE.Vector2()
    private targetMouse: THREE.Vector2 = new THREE.Vector2()
    private dMultTween: any
    private isClicked: boolean = false
    private speed: THREE.Vector2

    private getShader: () => THREE.Shader

    private static hoveredObject: THREE.Object3D
    private lastIsHovered: boolean

    constructor(getShader: () => THREE.Shader = () => null, speed: THREE.Vector2 = new THREE.Vector2(0.05, 0.05)) {
        super()
        this.speed = speed
        this.getShader = getShader
        this.eventEmitter = EventEmitter.getInstance()
    }

    public onMount(component: THREE.Object3D) {
        Raycaster.getInstance().Subscribe(component, ({ order, uv }) => {
            if (order == 0) {
                InteractiveShader.hoveredObject = component
                this.targetMouse = uv
            }
        })

        document.querySelector('.css3d-canvas').addEventListener('click', () => {
            if (InteractiveShader.hoveredObject === component) {
                if (!this.isClicked) {
                    this.isClicked = true
                    this.Clicked()
                }
                this.eventEmitter.Emit(EVENT.INTERACTIVE_CLICK, {
                    name: component.userData.name,
                })
            }
        })
    }

    public update(component: THREE.Object3D, time: number) {
        if (this.getShader()) {
            this.mouse.set(
                this.mouse.x + (this.targetMouse.x - this.mouse.x) * this.speed.x,
                this.mouse.y + (this.targetMouse.y - this.mouse.y) * this.speed.y,
            )
            const {
                uniforms: { time: utime, mouse },
            } = this.getShader()

            utime.value = time
            if (!this.isClicked) {
                mouse.value.x = this.mouse.x
                mouse.value.y = this.mouse.y
            }

            const isHovered = component === InteractiveShader.hoveredObject

            if (this.lastIsHovered !== isHovered || this.isClicked) {
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
