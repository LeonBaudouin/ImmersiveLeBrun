import ThreeScene from './Core/ThreeScene'
import TransitionScene from './TransitionScene'
import EventEmitter, { EVENT } from './Events/EventEmitter'
import Room from './Components/Room'
import Room2 from './Components/Room2'
import Room3 from './Components/Room3'

const rooms = [Room, Room2, Room3]

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
        this.eventEmitter.Subscribe(EVENT.ROOM_LOADED, () => {
            this.setLeftButton()
            this.setRightButton()
        })
    }

    private nextScene() {
        const i = this.currentIndex + 1
        if (this.currentIndex <= this.scenes.length - 1 && rooms[i].isLoaded) this.setScene(i)
    }

    private previousScene() {
        const i = this.currentIndex - 1
        if (this.currentIndex >= 0 && rooms[i].isLoaded) this.setScene(i)
    }

    private setScene(index: number) {
        this.currentIndex = index
        if (this.transitionScene.currentScene !== this.currentScene.three) {
            this.transitionScene.transition(this.currentScene.three, 4)
        }
        this.eventEmitter.Emit(EVENT.INTERACTIVE_BIND, this.currentScene.name)
        this.eventEmitter.Emit(EVENT.CLOSE_TEXTS, this.currentScene.name)
        this.setLeftButton()
        this.setRightButton()
    }

    private setRightButton() {
        if (this.currentIndex < this.scenes.length - 1) {
            const i = this.currentIndex + 1
            this.rightButton.classList.remove('hidden')
            this.rightButton.textContent = rooms[i].isLoaded ? this.scenes[i].buttonText : 'Chargement...'
        } else {
            this.rightButton.classList.add('hidden')
        }
    }

    private setLeftButton() {
        if (this.currentIndex > 0) {
            const i = this.currentIndex - 1
            this.leftButton.classList.remove('hidden')
            this.leftButton.textContent = rooms[i].isLoaded ? this.scenes[i].buttonText : 'Chargement...'
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
