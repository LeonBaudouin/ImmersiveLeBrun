import ThreeScene from './classes/Core/ThreeScene'
import * as THREE from 'three'
import Component from './classes/Core/Component'
import OrbitControls from 'orbit-controls-es6'
import {
    CSS3DRenderer,
    CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer'
import RendererInterface from './classes/Core/RendererInterface'
import Raycaster from './classes/Events/Raycaster'
import Interactive from './classes/Components/Interactive'
import Room from './classes/Components/Room'
import CameraMouseFollow from './classes/Controller/CameraMouseFollow'
import { MouseMoveListener } from './classes/Events/MouseMoveListener'

function initWebglRenderer(camera: THREE.Camera): RendererInterface {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    })
    renderer.setClearColor(0xf0f0f0, 0.0)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.debug.checkShaderErrors = true
    return renderer
}

function initCSS3DRenderer(camera: THREE.Camera): RendererInterface {
    const renderer = new CSS3DRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.classList.add('css3d-canvas')

    // const controls = new OrbitControls(camera, renderer.domElement)
    // controls.enabled = true
    // controls.maxDistance = 1500
    // controls.minDistance = 0
    return renderer
}

export default function Setup() {
    const camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    )
    camera.position.set(0.2, 1.6, 1.4)
    camera.rotateX(-0.05)

    const webGLrenderer = initWebglRenderer(camera)
    const CSS3DRenderer = initCSS3DRenderer(camera)

    CSS3DRenderer.domElement.appendChild(webGLrenderer.domElement)
    document.body.appendChild(CSS3DRenderer.domElement)

    const mouse = new THREE.Vector2()
    const textureLoader = new THREE.TextureLoader()

    document.addEventListener('mousemove', e => {
        const { clientX, clientY } = e
        mouse.x = (clientX / window.innerWidth) * 2 - 1
        mouse.y = -(clientY / window.innerHeight) * 2 + 1
        Raycaster.getInstance().Cast(camera, mouse)
        MouseMoveListener.getInstance().UpdateValue(e)
    })

    const components = [
        new Component(
            () => {
                const object = new THREE.Object3D()
                object.position.set(0, 1.7, -2)
                object.scale.set(0.5, 0.5, 0.5)
                return object
            },
            [],
            {},
            [
                new Interactive(
                    textureLoader.load(
                        './assets/interactive/rubens_esquisse.png',
                    ),
                    textureLoader.load('./assets/interactive/rubens.png'),
                    new THREE.Vector2(0.706, 1),
                ),
            ],
        ),
        new Room(),
        // new Component(() => {
        //     const mesh = new THREE.Mesh(
        //         new THREE.PlaneGeometry(5, 5, 3, 3),
        //         new THREE.MeshPhongMaterial({
        //             color: 0x883344,
        //             side: THREE.DoubleSide,
        //         }),
        //     )
        //     mesh.rotateX(-Math.PI / 2)
        //     mesh.position.y = -2
        //     return mesh
        // }),
        new Component(() => new THREE.AmbientLight(0xeeeeee, 0.8)),
        new Component(() => new THREE.PointLight(0x987656, 0.5)),
    ]

    const webGlScene = new ThreeScene(
        new Component(() => camera, [new CameraMouseFollow()]),
        webGLrenderer,
        components,
    )

    const cssComponents = [
        new Component(() => {
            const obj = new CSS3DObject(document.querySelector('#content'))
            obj.position.set(3, 0, 1)
            obj.scale.set(0.01, 0.01, 0.01)
            return obj
        }, [
            (object3d: THREE.Object3D, time: number) => {
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
