import OrbitControls from 'orbit-controls-es6'
import {
    Camera,
    Scene,
    WebGLRenderer,
    Renderer,
    PerspectiveCamera,
    Color,
} from 'three'
import Component from './Component'

export default class ThreeScene {
    public cameraComponent: Component
    public objects: Component[]
    public scene: Scene
    public renderer: Renderer
    public controls: any
    public time: number

    constructor(cameraComponent: Component, objects: Component[] = []) {
        this.cameraComponent = cameraComponent
        this.objects = objects
        this.time = 0

        this.bind()
        this.setupScene()
        this.setupControls()
    }

    setupScene() {
        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        this.scene = new Scene()

        this.objects.forEach(obj => this.scene.add(obj.object3d))
    }

    setupControls() {
        this.controls = new OrbitControls(
            <Camera>this.cameraComponent.object3d,
            this.renderer.domElement,
        )
        this.controls.enabled = true
        this.controls.maxDistance = 1500
        this.controls.minDistance = 0
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
