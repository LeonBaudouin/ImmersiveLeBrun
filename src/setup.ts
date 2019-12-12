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
import InteractiveShader from './classes/Controller/InteractiveShader'

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
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    )
    camera.position.set(0.2, 1.6, 3)
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
        new Component(() => {
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(1000, 1000),
                new THREE.MeshBasicMaterial(),
            )
            mesh.position.set(0, 0, -50)
            return mesh
        }, [new InteractiveShader()]),
        new Room(),
        new Component(() => new THREE.AmbientLight(0x777777, 0.1)),
        new Component(() => new THREE.PointLight(0x987656, 0.3)),
        new Component(() => {
            const ligth =  new THREE.SpotLight( 0xd9ebed, 0.4, 50, Math.PI, 2, 2 );
            ligth.position.x = -1.9;
            ligth.position.y = 2;
            ligth.position.z = 1.5
            return ligth;
        }),
        new Component(() => {
            const ligth =  new THREE.SpotLight( 0xedecd9, 0.3, 50, Math.PI, 1, 1.5 );
            ligth.position.x = -0.5;
            ligth.position.y = 1.8;
            ligth.position.z = 2
            return ligth;
        })
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
