import { Camera, WebGLRenderTarget, LinearFilter, RGBFormat, WebGLRenderer } from 'three'
import Component from './Component'
import Transitionable from './Transitionable'
import ThreeScene from './ThreeScene'

export default class FboScene extends ThreeScene implements Transitionable {
    public renderer: WebGLRenderer
    public fbo: WebGLRenderTarget = null

    constructor(cameraComponent: Component, renderer: WebGLRenderer, objects: Component[] = []) {
        super(cameraComponent, renderer, objects)
        this.fbo = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format: RGBFormat,
            stencilBuffer: false,
        })
    }

    update(onFbo: boolean = false) {
        this.cameraComponent.update(this.time)
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].update(this.time)
        }
        if (onFbo) {
            this.renderer.setRenderTarget(this.fbo)
            this.renderer.clear()
            this.renderer.render(this.scene, <Camera>this.cameraComponent.object3d)
        } else {
            this.renderer.setRenderTarget(null)
            this.renderer.render(this.scene, <Camera>this.cameraComponent.object3d)
        }
        this.time++
    }

    resizeCanvas() {
        super.resizeCanvas()
        this.fbo.width = window.innerWidth
        this.fbo.height = window.innerHeight
    }

    getFbo(): THREE.WebGLRenderTarget {
        return this.fbo
    }
}
