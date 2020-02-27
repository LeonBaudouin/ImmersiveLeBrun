import { TweenLite, Power2 } from 'gsap'

export default class Menu {
    private buttons: HTMLElement[]
    private container: HTMLElement
    private currentIndex: number

    constructor(buttons: HTMLElement[], container: HTMLElement) {
        this.buttons = buttons
        this.container = container

        this.currentIndex = 0
        this.buttons[this.currentIndex].classList.add('current')

        this.buttons.forEach((button, i) => {
            button.addEventListener('click', e => {
                e.preventDefault()
                TweenLite.to(this.container, 1, { x: `${-i * 100}%`, force3D: true, ease: Power2.easeInOut })
                this.buttons[this.currentIndex].classList.remove('current')
                this.currentIndex = i
                this.buttons[this.currentIndex].classList.add('current')
            })
        })
    }
}
