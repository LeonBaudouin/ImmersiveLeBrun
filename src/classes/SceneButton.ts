import ThreeScene from './Core/ThreeScene'
import TransitionScene from './TransitionScene'
import EventEmitter, { EVENT } from './Events/EventEmitter'

export default class SceneButton {
    private scenes: Scene[]
    private transitionScene: TransitionScene
    private leftButton: HTMLElement
    private rightButton: HTMLElement
    private currentIndex: number
    private eventEmitter: EventEmitter

    constructor(scenes: Scene[], transitionScene: TransitionScene, leftButton: HTMLElement, rightButton: HTMLElement) {
        this.scenes = scenes
        this.transitionScene = transitionScene
        this.leftButton = leftButton
        this.rightButton = rightButton
        this.eventEmitter = EventEmitter.getInstance()

        this.setScene(0)
        this.leftButton.addEventListener('click', () => this.previousScene())
        this.rightButton.addEventListener('click', () => this.nextScene())
    }

    private nextScene() {
        if (this.currentIndex <= this.scenes.length - 1) this.setScene(this.currentIndex + 1)
    }

    private previousScene() {
        if (this.currentIndex >= 0) this.setScene(this.currentIndex - 1)
    }

    private setScene(index: number) {
        this.currentIndex = index
        if (this.transitionScene.currentScene !== this.currentScene.three) {
            this.transitionScene.transition(this.currentScene.three, 4)
        }
        this.eventEmitter.Emit(EVENT.CHANGE_SCENE, this.currentScene.name)
        this.setLeftButton()
        this.setRightButton()
    }

    private setRightButton() {
        if (this.currentIndex < this.scenes.length - 1) {
            this.rightButton.classList.remove('hidden')
            this.rightButton.textContent = this.scenes[this.currentIndex + 1].buttonText
        } else {
            this.rightButton.classList.add('hidden')
        }
    }

    private setLeftButton() {
        if (this.currentIndex > 0) {
            this.leftButton.classList.remove('hidden')
            this.leftButton.textContent = this.scenes[this.currentIndex - 1].buttonText
        } else {
            this.leftButton.classList.add('hidden')
        }
    }

    public get currentScene(): Scene {
        return this.scenes[this.currentIndex]
    }
}

export interface Scene {
    three: ThreeScene
    name: string
    buttonText: string
}
