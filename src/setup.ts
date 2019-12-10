import ThreeScene from './classes/Core/ThreeScene'
import * as THREE from 'three'
import Component from './classes/Core/Component'
import OrbitControls from 'orbit-controls-es6'
import {
    CSS3DRenderer,
    CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer'
import RendererInterface from './classes/Core/RendererInterface'
import { Object3D } from 'three'

function initWebglRenderer(camera: THREE.Camera): RendererInterface {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    })
    renderer.setClearColor(0xf0f0f0, 0.0)
    renderer.setSize(window.innerWidth, window.innerHeight)
    return renderer
}

function initCSS3DRenderer(camera: THREE.Camera): RendererInterface {
    const renderer = new CSS3DRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.classList.add('css3d-canvas')

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enabled = true
    controls.maxDistance = 1500
    controls.minDistance = 0
    return renderer
}

export default function Setup() {
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    )
    camera.position.set(0, 0, 5)

    const webGLrenderer = initWebglRenderer(camera)
    const CSS3DRenderer = initCSS3DRenderer(camera)

    CSS3DRenderer.domElement.appendChild(webGLrenderer.domElement)
    document.body.appendChild(CSS3DRenderer.domElement)

    const components = [
        new Component(() => {
            const material = new THREE.MeshNormalMaterial()
            const geometry = new THREE.BoxGeometry(1, 1, 1)
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(0, 0, -1)
            return mesh
        }, [
            (object3d: THREE.Object3D, time: number) => {
                object3d.rotateX(0.001)
                object3d.rotateY(0.002)
            },
        ]),
        new Component(() => {
            const material = new THREE.MeshBasicMaterial({ color: 0x931245 })
            const geometry = new THREE.PlaneGeometry(5, 5, 5, 5)
            const mesh = new THREE.Mesh(geometry, material)
            mesh.rotateX(-Math.PI / 2)
            mesh.position.y = -2
            return mesh
        }),
        new Component(() => new THREE.AmbientLight(0x404040)),
    ]

    const webGlScene = new ThreeScene(
        new Component(() => camera),
        webGLrenderer,
        components,
    )

    const cssComponents = [
        new Component(() => {
            const obj = new CSS3DObject(document.querySelector('#content'))
            obj.position.set(0, 0, 1)
            obj.scale.set(0.01, 0.01, 0.01)
            return obj
        }, [
            (object3d: Object3D, time: number) => {
                object3d.position.y = Math.sin(time * 0.005) * 0.5
            },
        ]),
    ]

    const CSS3DScene = new ThreeScene(
        new Component(() => camera),
        CSS3DRenderer,
        cssComponents,
    )

    raf([CSS3DScene, webGlScene])
}

function raf(scenes: ThreeScene[]) {
    requestAnimationFrame(() => raf(scenes))
    scenes.forEach(scene => {
        scene.update()
    })
}
