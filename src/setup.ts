import ThreeScene from './classes/Core/ThreeScene'
import * as THREE from 'three'
import Component from './classes/Core/Component'
import OrbitControls from 'orbit-controls-es6'
import {
    CSS3DRenderer,
    CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer'
import RendererInterface from './classes/Core/RendererInterface'
import vertSource from './shaders/cube.vert'
import fragSource from './shaders/cube.frag'
import Raycaster from './classes/Events/Raycaster'

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

    const raycaster = Raycaster.getInstance()
    const mouse = new THREE.Vector2()

    document.addEventListener('mousemove', ({ clientX, clientY }) => {
        mouse.x = (clientX / window.innerWidth) * 2 - 1
        mouse.y = -(clientY / window.innerHeight) * 2 + 1
        raycaster.Cast(camera, mouse)
    })

    // document.addEventListener('mousemove', ({ clientX, clientY }) => {

    // })

    const components = [
        new Component(() => {
            const uniforms = {
                texture1: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture(
                        './assets/rubens_esquisse.png',
                    ),
                },
                texture2: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('./assets/rubens.png'),
                },
                mouse: {
                    type: 'vec2',
                    value: new THREE.Vector2(),
                },
            }

            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(0.706 * 3, 3, 1, 1),
                new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: vertSource,
                    fragmentShader: fragSource,
                }),
            )

            raycaster.Subscribe(mesh, e => (uniforms.mouse.value = e.uv))

            mesh.position.set(0, 0, -1)
            return mesh
        }),
        new Component(() => {
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 5, 3, 3),
                new THREE.MeshPhongMaterial({
                    color: 0x883344,
                    side: THREE.DoubleSide,
                }),
            )
            mesh.rotateX(-Math.PI / 2)
            mesh.position.y = -2
            return mesh
        }),
        new Component(() => new THREE.AmbientLight(0xffffff)),
    ]

    const webGlScene = new ThreeScene(
        new Component(() => camera),
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
