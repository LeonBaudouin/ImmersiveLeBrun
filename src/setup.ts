import ThreeScene from './classes/Core/ThreeScene'
import * as THREE from 'three'
import Component from './classes/Core/Component'
import OrbitControls from 'orbit-controls-es6'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import RendererInterface from './classes/Core/RendererInterface'
import Raycaster from './classes/Events/Raycaster'
import Room from './classes/Components/Room'
import Room2 from './classes/Components/Room2'
import Room3 from './classes/Components/Room3'
import CameraMouseFollow from './classes/Controller/CameraMouseFollow'
import { MouseMoveListener } from './classes/Events/MouseMoveListener'
import InteractiveShader from './classes/Controller/InteractiveShader'
import TextInfo from './classes/Components/TextInfo'
import EventEmitter, { EVENT } from './classes/Events/EventEmitter'
import TransitionScene from './classes/TransitionScene'
import ComposerScene from './classes/Core/ComposerScene'
import FadeController from './classes/Controller/FadeController'
import Key from './classes/Key'
import TextureLoader from './classes/Core/TextureLoader'
import SceneMenu from './classes/SceneMenu'
import AudioManager from './classes/AudioManager'
import Room4 from './classes/Components/Room4'

function initWebglRenderer(camera: THREE.Camera): THREE.WebGLRenderer {
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
    return renderer
}

function waitAnim(): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, 2000)
    })
}

export default function Setup(sceneMenu: SceneMenu, key: Key): Promise<{ raf: Function; cb: Function }> {
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0.2, 1.25, 2.8)
    camera.rotateX(-0.05)

    const webGLrenderer = initWebglRenderer(camera)
    const CSS3DRenderer = initCSS3DRenderer(camera)

    CSS3DRenderer.domElement.appendChild(webGLrenderer.domElement)
    document.body.appendChild(CSS3DRenderer.domElement)

    const room = new Room()
    const components1 = [
        new Component(() => {
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial())
            mesh.position.set(0, 0, -50)
            return mesh
        }, [new InteractiveShader('Workshop'), new FadeController(true)]),
        room,
        new Component(() => new THREE.AmbientLight(0x999999, 0.7)),
    ]

    const scene1 = new ComposerScene(new Component(() => camera), webGLrenderer, components1)

    const room2 = new Room2()
    const components2 = [
        new Component(() => {
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial())
            mesh.position.set(0, 0, -50)
            return mesh
        }, [new InteractiveShader('Demo'), new FadeController(true)]),
        room2,
        new Component(() => new THREE.AmbientLight(0x999999, 0.7)),
    ]

    const scene2 = new ComposerScene(new Component(() => camera), webGLrenderer, components2)

    const room3 = new Room3()
    const components3 = [
        new Component(() => {
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial())
            mesh.position.set(0, 0, -50)
            return mesh
        }, [new InteractiveShader('Galerie'), new FadeController(true)]),
        room3,
        new Component(() => new THREE.AmbientLight(0x999999, 0.7)),
    ]

    const scene3 = new ComposerScene(new Component(() => camera), webGLrenderer, components3)

    const room4 = new Room4()
    const components4 = [
        new Component(() => {
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(1000, 1000),
                new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            )
            mesh.position.set(0, 0, -50)
            return mesh
        }, [new InteractiveShader('Louvre'), new FadeController(true)]),
        room4,
        new Component(() => new THREE.AmbientLight(0x999999, 0.7)),
    ]

    const scene4 = new ComposerScene(new Component(() => camera), webGLrenderer, components4)

    const CSS3DScene = new ThreeScene(
        new Component(() => camera, [new CameraMouseFollow()]),
        CSS3DRenderer,
        SetupCss3d(),
    )

    const transitionScene = new TransitionScene(<THREE.WebGLRenderer>webGLrenderer, scene1)

    const scenes = [
        {
            three: scene1,
            name: 'Workshop',
        },
        {
            three: scene2,
            name: 'Demo',
        },
        {
            three: scene3,
            name: 'Galerie',
        },
        {
            three: scene4,
            name: 'Louvre',
        },
    ]

    const loadingManager = new THREE.LoadingManager()
    loadingManager.onProgress = key.updateProgress.bind(key)

    TextureLoader.setLoadingManager(loadingManager)

    const audioListener = new THREE.AudioListener()
    const audioManager = new AudioManager(audioListener)
    SetupAudio(audioManager)

    camera.add(audioListener)

    return waitAnim()
        .then(() => Promise.all([room.loadRoom(), room2.loadRoom(), room3.loadRoom(), room4.loadRoom()]))
        .then(() => {
            return {
                raf: () => {
                    CSS3DScene.update()
                    transitionScene.update()
                },
                cb: () => {
                    const changeScene = (i: number) => {
                        const scene = scenes[i].three
                        const name = scenes[i].name
                        if (transitionScene.currentScene !== scene) {
                            transitionScene.transition(scene, 4)
                        }
                        EventEmitter.getInstance().Emit(EVENT.INTERACTIVE_BIND, name)
                        EventEmitter.getInstance().Emit(EVENT.CLOSE_TEXTS, name)
                    }

                    const menuCbs = [
                        () => {},
                        () => changeScene(0),
                        () => changeScene(1),
                        () => changeScene(2),
                        () => changeScene(3),
                    ]
                    sceneMenu.addCbsToButtons(menuCbs)

                    let firstBind = true
                    key.addKeyCb(() => {
                        if (firstBind) {
                            // -- Raycast --
                            const mouse = new THREE.Vector2()
                            document.addEventListener('mousemove', e => {
                                const { clientX, clientY } = e
                                mouse.x = (clientX / window.innerWidth) * 2 - 1
                                mouse.y = -(clientY / window.innerHeight) * 2 + 1
                                Raycaster.getInstance().Cast(camera, mouse)
                                MouseMoveListener.getInstance().UpdateValue(e)
                            })
                        }
                    })

                    // -- Prevent Click --

                    document.querySelectorAll('.preventClick').forEach(elem => {
                        elem.addEventListener('click', e => e.stopPropagation())
                    })
                },
            }
        })
}

function SetupAudio(audioManager: AudioManager) {
    audioManager.addAudio({
        audiosParams: [{ url: './assets/audio/spring.mp3', loop: true, volume: 0.03, playbackRate: 1 }],
        onScene: 'Workshop',
        eventPlay: null,
        eventStop: null,
    })

    audioManager.addAudio({
        audiosParams: [{ url: './assets/audio/workshop_ambient.mp3', loop: true, volume: 0.1, playbackRate: 1 }],
        onScene: 'Workshop',
        eventPlay: null,
        eventStop: null,
    })

    audioManager.addAudio({
        audiosParams: [{ url: './assets/audio/op5no1.mp3', loop: true, volume: 0.03, playbackRate: 1 }],
        onScene: 'Demo',
        eventPlay: null,
        eventStop: null,
    })

    audioManager.addAudio({
        audiosParams: [{ url: './assets/audio/demo_ambient.mp3', loop: true, volume: 0.03, playbackRate: 1 }],
        onScene: 'Demo',
        eventPlay: null,
        eventStop: null,
    })

    audioManager.addAudio({
        audiosParams: [
            { url: './assets/audio/quote.mp3', loop: false, volume: 0.3, playbackRate: 1 },
            { url: './assets/audio/quote_alt.mp3', loop: false, volume: 1.2, playbackRate: 1 },
        ],
        onScene: null,
        eventPlay: { event: EVENT.OPEN_QUOTE, info: null, exclude: null },
        eventStop: null,
    })

    audioManager.addAudio({
        audiosParams: [
            { url: './assets/audio/reveal.mp3', loop: false, volume: 0.2, playbackRate: 1.3 },
            { url: './assets/audio/reveal_alt.mp3', loop: false, volume: 0.2, playbackRate: 0.8 },
        ],
        onScene: null,
        eventPlay: {
            event: EVENT.INTERACTIVE_CLICK,
            info: { property: 'firstClick', value: true },
            exclude: false,
        },
        eventStop: null,
    })
}

function SetupCss3d() {
    return [
        new TextInfo({
            position: new THREE.Vector3(1.6, 2, -0.7),
            childPos: new THREE.Vector3(0, -1.2, 1),
            elementId: 'JBLeBrun',
        }),
        new TextInfo({
            position: new THREE.Vector3(1.2, 1.6, 0.1),
            elementId: 'Tableau',
        }),
        new TextInfo({
            position: new THREE.Vector3(-0.2, 1, -0.1),
            elementId: 'Pencils',
        }),
        new TextInfo({
            position: new THREE.Vector3(-1, 1.15, 0.3),
            elementId: 'Palette',
        }),
        new TextInfo({
            position: new THREE.Vector3(-1.4, 2, -1.2),
            childPos: new THREE.Vector3(-0.3, -1, 1),
            elementId: 'Rubens',
        }),
        new TextInfo({
            position: new THREE.Vector3(0.9, 1.5, 1.1),
            elementId: 'Buste',
        }),
        new TextInfo({
            position: new THREE.Vector3(-0.8, 1.5, 1.1),
            elementId: 'Hiérarchie',
        }),
        new TextInfo({
            position: new THREE.Vector3(-1.5, 1.4, 0),
            elementId: 'Abondance',
        }),
        new TextInfo({
            position: new THREE.Vector3(1.5, 1.6, 0),
            elementId: 'LaPaix',
        }),
        new TextInfo({
            position: new THREE.Vector3(1.2, 1.5, 1.1),
            elementId: 'JBPierre',
        }),
        new TextInfo({
            position: new THREE.Vector3(1.5, 2, -0.5),
            elementId: 'Attribut',
        }),
        new TextInfo({
            position: new THREE.Vector3(-1.7, 2, 0.3),
            elementId: 'Adelaide',
        }),
    ]
}
