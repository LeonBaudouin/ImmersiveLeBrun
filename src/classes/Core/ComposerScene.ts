import { Camera, Scene, PerspectiveCamera, Color, WebGLRenderTarget, WebGLRenderer, ShaderMaterial } from 'three'
import Component from './Component'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import Transitionable from './Transitionable'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import fragmentShader from '../../shaders/effect/noise.frag'
import vertexShader from '../../shaders/effect/default.vert'

export default class ComposerScene implements Transitionable {
    public cameraComponent: Component
    public objects: Component[]
    public scene: Scene
    public composer: EffectComposer
    public controls: any
    public time: number
    public renderer: WebGLRenderer

    private shaderPass: ShaderPass

    constructor(cameraComponent: Component, renderer: WebGLRenderer, objects: Component[] = []) {
        this.cameraComponent = cameraComponent
        this.objects = objects
        this.time = 0
        this.renderer = renderer
        this.composer = new EffectComposer(renderer)

        this.bind()
        this.setupScene()

        this.shaderPass = new ShaderPass({
            uniforms: {
                tDiffuse: { value: null },
                tTime: { value: 1 },
            },
            fragmentShader,
            vertexShader,
        })

        const renderPass = new RenderPass(this.scene, <Camera>this.cameraComponent.object3d)
        this.composer.addPass(renderPass)
        // this.composer.addPass(this.shaderPass)
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

    update(onFbo: boolean = false) {
        this.cameraComponent.update(this.time)
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update(this.time)
        }
        ;(<any>this.composer).renderToScreen = !onFbo
        this.composer.render()
        this.time++
        ;(<ShaderMaterial>this.shaderPass.material).uniforms.tTime.value = this.time
    }

    resizeCanvas() {
        this.composer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        ;(<PerspectiveCamera>this.cameraComponent.object3d).aspect = window.innerWidth / window.innerHeight
        ;(<PerspectiveCamera>this.cameraComponent.object3d).updateProjectionMatrix()
    }

    getFbo(): WebGLRenderTarget {
        return this.composer.renderTarget2
    }
}
