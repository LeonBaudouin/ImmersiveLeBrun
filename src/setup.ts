import ThreeScene from './classes/Core/ThreeScene'
import * as THREE from 'three'
import Component from './classes/Core/Component'
import OrbitControls from 'orbit-controls-es6'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import RendererInterface from './classes/Core/RendererInterface'
import Raycaster from './classes/Events/Raycaster'
import Room from './classes/Components/Room'
import CameraMouseFollow from './classes/Controller/CameraMouseFollow'
import { MouseMoveListener } from './classes/Events/MouseMoveListener'
import InteractiveShader from './classes/Controller/InteractiveShader'
import TextureLoader from './classes/Core/TextureLoader'
import TextInfo from './classes/Components/TextInfo'
import SmoothedPoint from './classes/Utils/SmoothPoint'
import NormalizePoint from './classes/Utils/NormalizePoint'

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

export default function Load() {
    return TextureLoader.load(
        {
            front_wall: 'room/mur_porte_01.jpg',
            floor: 'room/Sol_sombre_v03.png',
            ceil: 'room/plafond_v02.jpg',
            left_wall_window: 'room/Porte_v01.jpg',
            left_wall_painting: 'room/mur_de_gauche_avec_rubens_v01.jpg',
            left_wall_corner: 'room/mur_de_gauche_recoin_v01.jpg',
            right_wall: 'room/mur_du_droite_v01.jpg',
            chest_sculpture: 'room/scene_01_sculture_v01.png',
            chest_sculpture_sketch: 'room/scene_01_esquisse_sculture_v01.png',
            chest_sculpture_table: 'room/scene_01_premier_plan_v02.png',
            chair: 'room/01_chaise.png',
            chair_leg: 'room/02_chaise.png',
            stool: 'room/01_tabouret.png',
            stool_leg: 'room/02_tabouret.png',
            palette: 'room/scene_01_palette_v01.png',
            palette_sketch: 'room/scene_01_esquisse_palette_v01.png',
            painting: 'room/01_chevalet.png',
            painting_leg: 'room/02_chevalet.png',
            painting_front: 'room/scene_01_chevalet_barre_milieu_v01.png',
            table: 'room/scene_01_petit_meuble_v01.png',
            brushs: 'room/scene_01_pinceaux_v01.png',
            brushs_sketch: 'room/scene_01_esquisse_pinceaux_v01.png',
            back_paintings: 'room/scene_01_toile_fond_v01.png',
            status: 'room/scene_01_statue_fond_v02.png',
            rubens_sketch: 'interactive/rubens_esquisse.png',
            rubens_painting: 'interactive/rubens.png',
            peace_painting: 'room/elisabeth_peinture_v01.jpg',
            peace_sketch: 'room/elisabeth_v01.jpg',
        },
        './assets/',
    ).then(Setup)
}

function Setup(textures: { [name: string]: THREE.Texture }): { raf: Function; cb: Function } {
    Object.keys(textures)
        .map(key => textures[key])
        .map(t => (t.minFilter = THREE.LinearFilter))

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0.2, 1.25, 2.8)
    camera.rotateX(-0.05)

    const webGLrenderer = initWebglRenderer(camera)
    const CSS3DRenderer = initCSS3DRenderer(camera)

    CSS3DRenderer.domElement.appendChild(webGLrenderer.domElement)
    document.body.appendChild(CSS3DRenderer.domElement)

    const mouse = new THREE.Vector2()

    document.addEventListener('mousemove', e => {
        const { clientX, clientY } = e
        mouse.x = (clientX / window.innerWidth) * 2 - 1
        mouse.y = -(clientY / window.innerHeight) * 2 + 1
        Raycaster.getInstance().Cast(camera, mouse)
        MouseMoveListener.getInstance().UpdateValue(e)
    })

    const components = [
        new Component(() => {
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial())
            mesh.position.set(0, 0, -50)
            return mesh
        }, [new InteractiveShader()]),
        new Room(textures),
        new Component(() => new THREE.AmbientLight(0x999999, 0.7)),
    ]

    const webGlScene = new ThreeScene(new Component(() => camera), webGLrenderer, components)

    const cssComponents = [
        new TextInfo({
            position: new THREE.Vector3(-1.2, -0.9, 0.25),
            elementId: 'Rubens',
            text:
                'Lorem c moche dolor sit amet consectetur c moche elit. Facilis iure neque corrupti quis voluptate, c moche, fugiat obcaecati c moche c moche ab vero, doloremque beatae, c moche natus? Cum, c moche. At, cum molestiae! Vero?',
        }),
    ]

    const CSS3DScene = new ThreeScene(
        new Component(() => camera, [new CameraMouseFollow()]),
        CSS3DRenderer,
        cssComponents,
    )

    const scenes = [CSS3DScene, webGlScene]

    return {
        raf: () => {
            scenes.forEach(scene => {
                scene.update()
            })
        },
        cb: () => {
            document.querySelector('#enterButton').addEventListener('click', () => {
                document.body.classList.add('start')
            })
            document.body.classList.add('loaded')
            document.querySelector('.css3d-canvas .preventClick').addEventListener('click', e => e.stopPropagation())
        },
    }
}
