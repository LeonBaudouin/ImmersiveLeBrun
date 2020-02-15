import { TweenLite, Circ, Power1 } from 'gsap'
import * as THREE from 'three'

export default class Key {
    private domElement: HTMLElement
    private boundingBox: ClientRect
    private isLoaded: boolean = false
    private isLoading: boolean = false
    private buttonCb: Array<Function> = []
    private keyCb: Array<Function> = []

    constructor(key: HTMLElement, button: HTMLElement) {
        this.domElement = key
        this.boundingBox = key.getBoundingClientRect()

        button.addEventListener('click', () => {
            if (!this.isLoaded && !this.isLoading) {
                this.buttonCb.forEach(cb => cb())
                this.transitionIn()
                this.isLoading = true

                this.domElement.addEventListener('click', () => {
                    if (this.isLoaded) {
                        this.keyCb.forEach(cb => cb())
                        this.transitionOut()
                    }
                })
            }
        })
    }

    public addButtonCb(cb: Function) {
        this.buttonCb.push(cb)
    }

    public addKeyCb(cb: Function) {
        this.keyCb.push(cb)
    }

    private recalcBoundingBox() {
        this.boundingBox = this.domElement.getBoundingClientRect()
    }

    private transitionOut() {
        this.recalcBoundingBox()
        this.recalcBoundingBox()
        setTimeout(() => {
            TweenLite.fromTo(
                this.domElement,
                1,
                { x: this.boundingBox.left },
                {
                    x: -200,
                    ease: Power1.easeOut,
                },
            )
        }, 0)
    }

    private transitionIn() {
        this.clone()
        document.querySelector('.loading-screen').classList.remove('open')
        document.querySelector('.loading-screen').classList.add('close')

        const start = new THREE.Vector2(this.boundingBox.left, this.boundingBox.top)
        const end = new THREE.Vector2(
            window.innerWidth * 0.55 + this.boundingBox.width / 2,
            (window.innerHeight + this.boundingBox.height) / 2,
        )
        TweenLite.to(this.domElement, 0, {
            x: start.x,
            y: start.y,
            z: 0.3,
        })

        TweenLite.to(this.domElement, 1, {
            scale: 1.2,
            ease: Circ.easeOut,
        })

        TweenLite.to(this.domElement, 1, {
            x: end.x - start.x,
            y: end.y - start.y,
            z: 0.3,
            ease: Power1.easeInOut,
        })
    }

    private clone() {
        const remainingKey = this.domElement
        this.domElement = <HTMLElement>this.domElement.cloneNode()
        setTimeout(() => (remainingKey.style.opacity = '0'), 0)

        document.querySelector('.loading-screen').appendChild(this.domElement)
        this.domElement.style.width = this.boundingBox.width.toString() + 'px'
        this.domElement.style.height = this.boundingBox.height.toString() + 'px'
        this.domElement.classList.add('button')

        document.querySelector('.js-card-1').classList.add('flip')
        this.domElement.style.zIndex = '10'
    }
}
