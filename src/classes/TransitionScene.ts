import * as THREE from 'three'
import TransitionQuad from './Components/TransitionQuad'
import ThreeScene from './Core/ThreeScene'
import EventEmitter, { EVENT } from './Events/EventEmitter'

export default class TransitionScene {
    public time: number = 0
    public renderer: THREE.WebGLRenderer
    public camera: THREE.OrthographicCamera
    public quad: TransitionQuad
    public scene: THREE.Scene
    public currentScene: ThreeScene
    public transitioningScene: ThreeScene | null = null

    constructor(renderer: THREE.WebGLRenderer, currentScene: ThreeScene) {
        this.renderer = renderer
        this.scene = new THREE.Scene()
        this.currentScene = currentScene

        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / -2,
            -10,
            10,
        )

        this.quad = new TransitionQuad()
        this.scene.add(this.quad.object3d)
        this.bind()
    }

    bind() {
        window.addEventListener('resize', () => {
            this.camera.left = window.innerWidth / -2
            this.camera.right = window.innerWidth / 2
            this.camera.top = window.innerHeight / 2
            this.camera.bottom = window.innerHeight / -2
        })
    }

    update() {
        this.quad.update(this.time)
        if (this.transitioningScene !== null) {
            this.currentScene.update(true)
            this.transitioningScene.update(true)
            this.renderer.setRenderTarget(null)
            this.renderer.clear()
            this.renderer.render(this.scene, this.camera)
        } else {
            this.currentScene.update()
        }
        this.time++
    }

    transition(transitioningScene: ThreeScene, delay: number) {
        this.transitioningScene = transitioningScene
        this.quad
            .getTransitionController()
            .transition(this.transitioningScene.fbo.texture, this.currentScene.fbo.texture, delay, () => {
                this.currentScene = this.transitioningScene
                this.transitioningScene = null
            })
    }
}
