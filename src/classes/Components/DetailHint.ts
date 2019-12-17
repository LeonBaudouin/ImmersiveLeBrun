import Component from '../Core/Component'
import * as THREE from 'three'
import EventEmitter, { EVENT } from '../Events/EventEmitter'
import { TweenLite, Power2 } from 'gsap/all'

export default class DetailHint extends Component {
    constructor(parentName: string, texture: THREE.Texture, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0.2)) {
        super(() => {
            const sprite = new THREE.Sprite(
                new THREE.SpriteMaterial({ transparent: true, map: texture, depthWrite: false, opacity: 0 }),
            )
            sprite.position.set(position.x, position.y, position.z)
            sprite.scale.set(0.2, 0.2, 0.2)
            EventEmitter.getInstance().Subscribe(EVENT.INTERACTIVE_MOUSEENTER, e => {
                if (e.component.userData.name === parentName && e.controller.isClicked) {
                    TweenLite.to(sprite.material, 0.5, {
                        opacity: 1,
                        ease: Power2.easeInOut,
                    })
                }
            })
            EventEmitter.getInstance().Subscribe(EVENT.INTERACTIVE_MOUSELEAVE, e => {
                if (e.component.userData.name === parentName && e.controller.isClicked) {
                    TweenLite.to(sprite.material, 0.5, {
                        opacity: 0,
                        ease: Power2.easeInOut,
                    })
                }
            })

            return sprite
        })
    }
}
