import TransitionScene from './TransitionScene'
import EventEmitter, { EVENT } from './Events/EventEmitter'
import Room from './Components/Room'
import Room2 from './Components/Room2'
import Room3 from './Components/Room3'
import Transitionable from './Core/Transitionable'
import { TweenLite } from 'gsap'

const rooms = [Room, Room2, Room3]

export default class SceneButton {
    private scenes: Scene[]
    private transitionScene: TransitionScene
    private leftButton: HTMLElement
    private rightButton: HTMLElement
    private currentIndex: number
    private eventEmitter: EventEmitter
    private isTransitioning: boolean = false

    constructor(scenes: Scene[], transitionScene: TransitionScene, leftButton: HTMLElement, rightButton: HTMLElement) {
        this.scenes = scenes
        this.transitionScene = transitionScene
        this.leftButton = leftButton
        this.rightButton = rightButton
        this.eventEmitter = EventEmitter.getInstance()

        this.currentIndex = 0
        this.leftButton.addEventListener('click', () => this.previousScene())
        this.rightButton.addEventListener('click', () => this.nextScene())
        this.eventEmitter.Subscribe(EVENT.TRANSITION_START, () => (this.isTransitioning = true))
        this.eventEmitter.Subscribe(EVENT.TRANSITION_END, () => {
            this.isTransitioning = false
            this.setLeftButton()
            this.setRightButton()
        })
        this.eventEmitter.Subscribe(EVENT.ROOM_LOADED, () => {
            this.setLeftButton()
            this.setRightButton()
        })
    }

    private nextScene() {
        const i = this.currentIndex + 1
        if (this.currentIndex < this.scenes.length - 1 && rooms[i].isLoaded) this.setScene(i)
    }

    private previousScene() {
        const i = this.currentIndex - 1
        if (this.currentIndex >= 0 && rooms[i].isLoaded) this.setScene(i)
    }

    private setScene(index: number) {
        if (this.isTransitioning) return
        this.currentIndex = index
        if (this.transitionScene.currentScene !== this.currentScene.three) {
            this.transitionScene.transition(this.currentScene.three, 4)
        }
        this.eventEmitter.Emit(EVENT.INTERACTIVE_BIND, this.currentScene.name)
        this.eventEmitter.Emit(EVENT.CLOSE_TEXTS, this.currentScene.name)
        this.hide(this.leftButton)
        this.hide(this.rightButton)
    }

    private setRightButton() {
        if (this.currentIndex < this.scenes.length - 1) {
            const i = this.currentIndex + 1
            this.show(this.rightButton)
            this.rightButton.textContent = rooms[i].isLoaded ? this.scenes[i].buttonText : 'Chargement...'
        } else {
            this.hide(this.rightButton)
        }
    }

    private setLeftButton() {
        if (this.currentIndex > 0) {
            const i = this.currentIndex - 1
            this.show(this.leftButton)
            this.leftButton.textContent = rooms[i].isLoaded ? this.scenes[i].buttonText : 'Chargement...'
        } else {
            this.hide(this.leftButton)
        }
    }

    private show(button: HTMLElement) {
        button.style.visibility = 'visible'
        TweenLite.to(button, 1, { opacity: 1 })
    }

    private hide(button: HTMLElement) {
        TweenLite.to(button, 1, { opacity: 0, onComplete: () => (button.style.visibility = 'hidden') })
    }

    public get currentScene(): Scene {
        return this.scenes[this.currentIndex]
    }
}

export interface Scene {
    three: Transitionable
    name: string
    buttonText: string
}
