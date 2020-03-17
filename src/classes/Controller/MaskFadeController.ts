import AbstractController from '../Core/AbstractController'
import * as three from 'three'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import { TweenLite, Power0 } from 'gsap'

export default class MaskFadeController extends AbstractController {
    private shaderCb: () => THREE.Shader | null

    constructor(shaderCb: () => THREE.Shader | null, selectiveMasks: { [name: string]: THREE.Texture } = {}) {
        super()
        this.shaderCb = shaderCb

        EventEmitter.getInstance().Subscribe(
            EVENT.INTERACTIVE_CLICK,
            ({
                component: {
                    userData: { name },
                },
            }) => {
                if (this.shaderCb() !== null) {
                    const uniforms = this.shaderCb().uniforms
                    uniforms.secondaryTextureMask.value = uniforms.textureMask.value
                    uniforms.textureMask.value = selectiveMasks.hasOwnProperty(name) ? selectiveMasks[name] : null
                    uniforms.maskTransition.value = 0
                    TweenLite.to(uniforms.maskTransition, 1, { value: 1, ease: Power0.easeNone })
                }
            },
        )
    }

    public update(component: THREE.Object3D, time: number) {}
}
