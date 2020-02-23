import { TweenLite, Power2 } from 'gsap'
import * as CSSPlugin from 'gsap/CSSPlugin'
import * as THREE from 'three'
import SmoothedPoint from './Utils/SmoothPoint'

const activated = [CSSPlugin]

export default class Key {
    private cardKey: HTMLElement
    private loadingSreenKey: HTMLElement
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
    private loadingSmoothing: SmoothedPoint = new SmoothedPoint(new THREE.Vector2(0.02, 0.02), new THREE.Vector2())

    constructor() {
        this.card = document.querySelector('.js-card-1')
        this.cardKey = this.card.querySelector('.js-card-key-1')
        this.loadingScreen = document.querySelector('.loading-screen')
        this.loadingSreenKey = this.loadingScreen.querySelector('.loading-screen-key')
        this.wrapper = this.loadingSreenKey.querySelector('.loading-screen-key-wrapper')

        this.card.querySelector('.js-button-1').addEventListener('click', () => {
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

    private transitionOut() {
        setTimeout(() => {
            TweenLite.fromTo(
                this.loadingSreenKey,
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

        const boundingBox = this.cardKey.getBoundingClientRect()

        const start = new THREE.Vector2(boundingBox.left, boundingBox.top)
        const end = new THREE.Vector2(
            window.innerWidth * 0.4 - boundingBox.width * 0.5,
            (window.innerHeight - boundingBox.height) / 2,
        )
        const mid = new THREE.Vector2((start.x + end.x) / 2, start.y * 0.8)
        this.grabPoint.setTarget(end.x, end.y)
        this.grabPoint.jumbToTarget()

        // Position animation
        TweenLite.fromTo(
            this.loadingSreenKey,
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
                    TweenLite.to(this.loadingSreenKey, 1, {
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
        setTimeout(() => (this.cardKey.style.opacity = '0'), 0)
        const boundingBox = this.cardKey.getBoundingClientRect()
        this.loadingSreenKey.style.width = boundingBox.width.toString() + 'px'
        this.loadingSreenKey.style.height = boundingBox.height.toString() + 'px'
        this.loadingSreenKey.classList.add('draggable')
        this.card.classList.add('flip')
    }

    private enableDragAndDrop() {
        this.loadingSreenKey.addEventListener('mousedown', e => {
            e.preventDefault()
            this.isGrabbed = true
            this.grabPoint.setSpeed(0.5, 0.5)
            this.mouseOffset.set(e.offsetX, e.offsetY)
            this.loadingSreenKey.style.cursor = 'grabbing'
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
                        this.loadingSreenKey.classList.add('onLock')

                        this.grabPoint.setSpeed(0.1, 0.1)
                        const boundingBox = this.loadingSreenKey.getBoundingClientRect()
                        const x = boundingBox.width / 2
                        const y = boundingBox.height / 2

                        this.grabPoint.setTarget(lockPos.x - x, lockPos.y - y)
                    }
                } else {
                    if (lastHoverLock) {
                        this.grabPoint.setSpeed(0.5, 0.5)
                        this.loadingSreenKey.classList.remove('onLock')
                    }
                    this.grabPoint.setTarget(clientX - this.mouseOffset.x, clientY - this.mouseOffset.y)
                }
            }
        })

        document.addEventListener('mouseup', () => {
            this.isGrabbed = false
            this.loadingSreenKey.style.cursor = 'grab'
            if (this.hoverLock && this.isLoaded) {
                this.isLoaded = false
                this.keyCb.forEach(cb => cb())
                this.transitionOut()
            } else {
                const boundingBox = this.loadingSreenKey.getBoundingClientRect()
                this.grabPoint.setSpeed(0.1, 0.1)
                this.grabPoint.setTarget(
                    window.innerWidth * 0.4 - boundingBox.width * 0.5,
                    (window.innerHeight - boundingBox.height) / 2,
                )
            }
        })
    }

    public updateKeyPos() {
        this.grabPoint.smooth()
        const grabPoint = this.grabPoint.getPoint()
        const x = grabPoint.x
        const y = grabPoint.y
        this.loadingSreenKey.style.transform = `translate3d(${x}px, ${y}px, 0.3px) scale(1.2, 1.2)`
    }

    public updateProgressSmoothing() {
        if (!this.isLoaded) {
            this.loadingSmoothing.smooth()
            const { x: value } = this.loadingSmoothing.getPoint()
            this.wrapper.style.setProperty('--progress', value.toString())
            if (value > 0.99) {
                this.isLoaded = true
                this.wrapper.classList.add('finished')
            }
        }
    }

    public updateProgress(_, load, tot) {
        const a = load / tot
        this.loadingSmoothing.setTarget(a, a)
    }
}
