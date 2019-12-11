import { Camera, Scene, PerspectiveCamera, Color } from 'three'
import Component from './Component'
import RendererInterface from './RendererInterface'

export default class ThreeScene {
    public cameraComponent: Component
    public objects: Component[]
    public scene: Scene
    public renderer: RendererInterface
    public controls: any
    public time: number

    constructor(
        cameraComponent: Component,
        renderer: RendererInterface,
        objects: Component[] = [],
    ) {
        this.cameraComponent = cameraComponent
        this.objects = objects
        this.time = 0
        this.renderer = renderer

        this.bind()
        this.setupScene()
    }

    setupScene() {
        this.scene = new Scene()
        this.scene.background = new Color(0xeeeeee)

        this.objects.forEach(obj => this.scene.add(obj.object3d))
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        window.addEventListener('resize', this.resizeCanvas)
    }

    update() {
        this.cameraComponent.update(this.time)
        this.objects.forEach(obj => obj.update(this.time))
        this.renderer.render(this.scene, <Camera>this.cameraComponent.object3d)
        this.time++
    }

    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        ;(<PerspectiveCamera>this.cameraComponent.object3d).aspect =
            window.innerWidth / window.innerHeight
        ;(<PerspectiveCamera>(
            this.cameraComponent.object3d
        )).updateProjectionMatrix()
    }
}
