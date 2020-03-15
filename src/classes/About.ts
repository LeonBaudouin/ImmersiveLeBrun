import { TweenLite, Power2 } from 'gsap'

export default class About {
    private button: HTMLElement
    private container: HTMLElement
    private inAbout: boolean = false

    constructor(button: HTMLElement, container: HTMLElement) {
        this.button = button
        this.container = container

        this.button.addEventListener('click', e => {
            e.preventDefault()
            this.button.classList.toggle('current')
            this.inAbout = !this.inAbout
            const x = this.inAbout ? -100 : 0
            TweenLite.to(this.container, 1, { x: `${x}%`, force3D: true, ease: Power2.easeInOut })
        })
    }
}
