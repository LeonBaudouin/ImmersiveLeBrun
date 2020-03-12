import EventEmitter, { EVENT } from './Events/EventEmitter'

export default class SceneMenu {
    private buttons: HTMLButtonElement[]
    private buttonCbs: Function[]
    private currentIndex: number
    private isTransitioning: boolean

    constructor(buttonCbs: Function[], buttons: HTMLButtonElement[]) {
        this.buttons = buttons
        this.buttonCbs = buttonCbs

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
        eventEmitter.Subscribe(EVENT.TRANSITION_START, () => (this.isTransitioning = true))
        eventEmitter.Subscribe(EVENT.TRANSITION_END, () => (this.isTransitioning = false))
    }

    private moveTo(i) {
        this.buttons[this.currentIndex].classList.remove('active')
        this.currentIndex = i
        this.buttons[this.currentIndex].classList.add('active')
        this.buttonCbs[this.currentIndex]()
    }
}
