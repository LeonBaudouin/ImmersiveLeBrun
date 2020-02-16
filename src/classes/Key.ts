import { TweenLite, Circ, Power1, Power2 } from 'gsap'
import * as CSSPlugin from 'gsap/CSSPlugin'
import * as THREE from 'three'

const activated = [CSSPlugin]

export default class Key {
    private domElement: HTMLElement
    private boundingBox: ClientRect
    private loadingScreen: HTMLElement
    private card: HTMLElement
    private isLoaded: boolean = false
    private isLoading: boolean = false
    private buttonCb: Array<Function> = []
    private keyCb: Array<Function> = []

    constructor(key: HTMLElement, button: HTMLElement) {
        this.domElement = key
        this.boundingBox = key.getBoundingClientRect()
        this.loadingScreen = document.querySelector('.loading-screen')
        this.card = document.querySelector('.js-card-1')

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
        this.loadingScreen.classList.remove('open')
        this.loadingScreen.classList.add('close')

        const start = new THREE.Vector2(this.boundingBox.left, this.boundingBox.top)
        const end = new THREE.Vector2(
            window.innerWidth * 0.4 - this.boundingBox.width * 0.5,
            (window.innerHeight - this.boundingBox.height) / 2,
        )
        const mid = new THREE.Vector2((start.x + end.x) / 2, start.y * 0.8)

        // Position animation
        TweenLite.fromTo(
            this.domElement,
            1,
            {
                x: start.x,
                y: start.y,
                z: 0.3,
                scale: 1,
            },
            {
                x: mid.x,
                y: mid.y,
                z: 0.3,
                scale: 1.4,
                ease: Power2.easeInOut,
                onComplete: () => {
                    TweenLite.to(this.domElement, 1, {
                        x: end.x,
                        y: end.y,
                        z: 0.3,
                        scale: 1.2,
                        ease: Power2.easeIn,
                    })
                },
            },
        )

        // Position animation
        // TweenLite.to(this.domElement, 1, {
        //     x: end.x - start.x,
        //     y: end.y - start.y,
        //     z: 0.3,
        //     ease: Power1.easeInOut,
        // })
    }

    private clone() {
        const remainingKey = this.domElement
        this.domElement = <HTMLElement>this.domElement.cloneNode()
        setTimeout(() => (remainingKey.style.opacity = '0'), 0)

        this.loadingScreen.appendChild(this.domElement)
        this.domElement.style.width = this.boundingBox.width.toString() + 'px'
        this.domElement.style.height = this.boundingBox.height.toString() + 'px'
        this.domElement.classList.add('button')

        this.card.classList.add('flip')
        this.domElement.style.zIndex = '10'
    }
}
