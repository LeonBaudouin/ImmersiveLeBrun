import EventEmitter, { EVENT } from './Events/EventEmitter'

export default class SceneMenu {
    private menu: HTMLElement
    private buttons: HTMLButtonElement[]
    private buttonCbs: Function[]
    private currentIndex: number
    private isTransitioning: boolean

    constructor(buttonCbs: Function[], buttons: HTMLButtonElement[], menu: HTMLElement) {
        this.buttons = buttons
        this.buttonCbs = buttonCbs
        this.menu = menu

        this.currentIndex = 0
        this.buttons[0].classList.add('active')
        this.isTransitioning = false

        this.buttons.forEach((button, i) => {
            button.addEventListener('click', () => {
                if (i >= 0 && i < buttonCbs.length && i !== this.currentIndex && !this.isTransitioning) {
                    this.moveTo(i)
                }
            })
        })

        const eventEmitter = EventEmitter.getInstance()
        eventEmitter.Subscribe(EVENT.TRANSITION_START, () => {
            this.isTransitioning = true
            this.menu.classList.add('in-transition')
        })
        eventEmitter.Subscribe(EVENT.TRANSITION_END, () => {
            this.isTransitioning = false
            this.menu.classList.remove('in-transition')
        })
    }

    public moveTo(i) {
        this.currentIndex = i
        this.setButtonClass()
        this.buttonCbs[this.currentIndex]()
        this.menu.style.setProperty('--progress', (i / (this.buttons.length - 1)).toString())
    }

    private setButtonClass() {
        this.buttons.forEach((b, i) => {
            if (i <= this.currentIndex) {
                if (i < this.currentIndex) {
                    b.classList.add('passed')
                    b.classList.remove('active')
                } else {
                    b.classList.add('active')
                }
            } else {
                b.classList.remove('passed')
                b.classList.remove('active')
            }
        })
    }
}
