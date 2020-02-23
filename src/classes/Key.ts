import { TweenLite, Circ, Power1, Power2 } from 'gsap'
import * as CSSPlugin from 'gsap/CSSPlugin'
import * as THREE from 'three'
import SmoothedPoint from './Utils/SmoothPoint'

const activated = [CSSPlugin]

export default class Key {
    private domElement: HTMLElement
    private boundingBox: ClientRect
    private loadingScreen: HTMLElement
    private wrapper: HTMLElement
    private card: HTMLElement
    private isLoaded: boolean = false
    private isLoading: boolean = false
    private buttonCb: Array<Function> = []
    private keyCb: Array<Function> = []
    private isGrabbed: boolean = false
    private mouseOffset: THREE.Vector2 = new THREE.Vector2()
    private grabPoint: SmoothedPoint = new SmoothedPoint(new THREE.Vector2(0.5, 0.5), new THREE.Vector2())
    private hoverLock: boolean = false

    constructor(key: HTMLElement, button: HTMLElement) {
        this.domElement = key
        this.boundingBox = key.getBoundingClientRect()
        this.loadingScreen = document.querySelector('.loading-screen')
        this.wrapper = this.domElement.querySelector('.menu-card-key-wrapper')
        this.card = document.querySelector('.js-card-1')

        button.addEventListener('click', () => {
            if (!this.isLoaded && !this.isLoading) {
                this.buttonCb.forEach(cb => cb())
                this.transitionIn()
                this.isLoading = true
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
        setTimeout(() => {
            TweenLite.fromTo(
                this.domElement,
                0.25,
                { scale: 1.2, x: this.grabPoint.getPoint().x, y: this.grabPoint.getPoint().y },
                {
                    scale: 0.5,
                    opacity: 0,
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
        this.grabPoint.setTarget(end.x, end.y)
        this.grabPoint.jumbToTarget()

        // Position animation
        TweenLite.fromTo(
            this.domElement,
            1,
            {
                x: start.x,
                y: start.y,
                scale: 1,
                force3D: true,
            },
            {
                x: mid.x,
                y: mid.y,
                scale: 1.4,
                force3D: true,
                ease: Power2.easeInOut,
                onComplete: () => {
                    TweenLite.to(this.domElement, 1, {
                        x: end.x,
                        y: end.y,
                        scale: 1.2,
                        force3D: true,
                        ease: Power2.easeIn,
                        onComplete: () => this.enableDragAndDrop(),
                    })
                },
            },
        )
    }

    private clone() {
        const remainingKey = this.domElement
        this.domElement = <HTMLElement>this.domElement.cloneNode(true)
        this.wrapper = this.domElement.querySelector('.menu-card-key-wrapper')
        setTimeout(() => (remainingKey.style.opacity = '0'), 0)

        this.loadingScreen.appendChild(this.domElement)
        this.domElement.style.width = this.boundingBox.width.toString() + 'px'
        this.domElement.style.height = this.boundingBox.height.toString() + 'px'
        this.domElement.classList.add('draggable')
        this.domElement.setAttribute('draggable', 'false')

        this.card.classList.add('flip')
        this.domElement.style.zIndex = '10'
    }

    private enableDragAndDrop() {
        this.domElement.addEventListener('mousedown', e => {
            e.preventDefault()
            this.isGrabbed = true
            this.grabPoint.setSpeed(0.5, 0.5)
            this.mouseOffset.set(e.offsetX, e.offsetY)
            this.domElement.style.cursor = 'grabbing'
        })

        const lockPos = new THREE.Vector2(window.innerWidth * 0.62, window.innerHeight * 0.5)

        document.addEventListener('mousemove', ({ clientX, clientY }) => {
            if (this.isGrabbed) {
                const lastHoverLock = this.hoverLock
                this.hoverLock =
                    Math.sqrt(
                        (clientX - lockPos.x) * (clientX - lockPos.x) + (clientY - lockPos.y) * (clientY - lockPos.y),
                    ) <
                    window.innerWidth / 6

                if (this.hoverLock && this.isLoaded) {
                    if (!lastHoverLock) {
                        this.domElement.classList.add('onLock')

                        this.grabPoint.setSpeed(0.1, 0.1)
                        this.recalcBoundingBox()
                        const x = this.boundingBox.width / 2
                        const y = this.boundingBox.height / 2

                        this.grabPoint.setTarget(lockPos.x - x, lockPos.y - y)
                    }
                } else {
                    if (lastHoverLock) {
                        this.grabPoint.setSpeed(0.5, 0.5)
                        this.domElement.classList.remove('onLock')
                    }
                    this.grabPoint.setTarget(clientX - this.mouseOffset.x, clientY - this.mouseOffset.y)
                }
            }
        })

        document.addEventListener('mouseup', () => {
            this.isGrabbed = false
            this.domElement.style.cursor = 'grab'
            if (this.hoverLock && this.isLoaded) {
                this.isLoaded = false
                this.keyCb.forEach(cb => cb())
                this.transitionOut()
            } else {
                this.grabPoint.setSpeed(0.1, 0.1)
                this.grabPoint.setTarget(
                    window.innerWidth * 0.4 - this.boundingBox.width * 0.5,
                    (window.innerHeight - this.boundingBox.height) / 2,
                )
            }
        })
    }

    public updateKeyPos() {
        if (this.isLoaded) {
            this.grabPoint.smooth()
            const grabPoint = this.grabPoint.getPoint()
            const x = grabPoint.x
            const y = grabPoint.y
            this.domElement.style.transform = `translate3d(${x}px, ${y}px, 0.3px) scale(1.2, 1.2)`
        }
    }

    public updateProgress(_, load, tot) {
        this.wrapper.style.setProperty('--progress', (load / tot).toString())
        // if (load == tot) this.isLoaded = true
    }
}
