import { TweenLite } from 'gsap'
import * as THREE from 'three'

export default class Key {
    private domElement: HTMLElement
    private boundingBox: ClientRect
    private isLoaded: boolean = false
    private isLoading: boolean = false
    private beforeLoadCb: Array<Function>
    private afterLoadCb: Array<Function>

    constructor(domElement: HTMLElement) {
        this.domElement = domElement
        this.boundingBox = domElement.getBoundingClientRect()

        this.domElement.addEventListener('click', () => {
            if (!this.isLoaded && !this.isLoading) {
                this.beforeLoadCb.forEach(cb => cb())
                this.transition()
                this.isLoading = true
            }
            if (this.isLoaded) {
                this.afterLoadCb.forEach(cb => cb())
            }
        })
    }

    public addBeforeLoadCb(cb: Function) {
        this.beforeLoadCb.push(cb)
    }

    public addAfterLoadCb(cb: Function) {
        this.afterLoadCb.push(cb)
    }

    private transition() {
        const start = new THREE.Vector2(this.boundingBox.left, this.boundingBox.top)
        const end = new THREE.Vector2(
            (window.innerWidth - this.boundingBox.width) / 2,
            (window.innerHeight - this.boundingBox.height) / 2,
        )
        TweenLite.to(this.domElement, 1, {
            x: end.x - start.x,
            y: end.y - start.y,
        })
    }
}
