import ThreeScene from './classes/Core/ThreeScene'
import * as THREE from 'three'
import Component from './classes/Core/Component'
import OrbitControls from 'orbit-controls-es6'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import RendererInterface from './classes/Core/RendererInterface'
import Raycaster from './classes/Events/Raycaster'
import Room from './classes/Components/Room'
import Room2 from './classes/Components/Room2'
import CameraMouseFollow from './classes/Controller/CameraMouseFollow'
import { MouseMoveListener } from './classes/Events/MouseMoveListener'
import InteractiveShader from './classes/Controller/InteractiveShader'
import TextureLoader from './classes/Core/TextureLoader'
import TextInfo from './classes/Components/TextInfo'
import EventEmitter, { EVENT } from './classes/Events/EventEmitter'
import TransitionScene from './classes/TransitionScene'
import SceneButton, { Scene } from './classes/SceneButton'

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
            front_wall: 'room/mur_du_fond_titre.jpg',
            floor: 'room/sol_v05.jpg',
            floor_shadow: 'room/ombre.png',
            ceil: 'room/plafond_v03.jpg',
            left_wall_window: 'room/porte_fenete_v01.png',
            left_wall_painting: 'room/mur_de_gauche_v02.jpg',
            left_wall_corner: 'room/mur_de_gauche_recoin_v01.jpg',
            right_wall: 'room/mur_du_droite_v01.jpg',
            chest_sculpture: 'room/sculture.png',
            chest_sculpture_sketch: 'room/scene_01_esquisse_sculture_v01.png',
            chest_sculpture_table: 'room/scene_01_premier_plan_v03.png',
            chair: 'room/01_chaise.png',
            chair_leg: 'room/02_chaise.png',
            chair_shadow: 'room/scene_01_chaise_ombre_v01.png',
            stool: 'room/01_tabouret.png',
            stool_leg: 'room/02_tabouret.png',
            stool_shadow: 'room/scene_01_Tabouret_ombre_v01.png',
            palette: 'room/palette.png',
            palette_sketch: 'room/scene_01_esquisse_palette_v01.png',
            painting: 'room/01_chevalet.png',
            painting_leg: 'room/02_chevalet.png',
            painting_shadow: 'room/scene_01_chevalet_ombre_v01.png',
            painting_front: 'room/scene_01_chevalet_barre_milieu_v01.png',
            table: 'room/scene_01_petit_meuble_v01.png',
            brushs: 'room/pinceaux.png',
            brushs_sketch: 'room/scene_01_esquisse_pinceaux_v01.png',
            back_paintings: 'room/scene_01_toile_fond_v01.png',
            status: 'room/scene_01_statue_fond_v03.png',
            rubens_sketch: 'interactive/rubens_esquisse.jpg',
            rubens_painting: 'interactive/rubens.png',
            peace_painting: 'room/elisabeth_peinture_v01.jpg',
            peace_sketch: 'room/elisabeth_v01.jpg',
            magnifying_glass: 'loupe.png',
            jp_lebrun: 'room/Jean-Baptiste-Pierre_Le_Brun_1796.jpg',
            jp_lebrun_sketch: 'room/cadre_droite_v02.jpg',

            front_wall_2: 'room2/mur_face_5.jpg',
            left_wall_2: 'room2/mur_gauche.jpg',
            right_wall_2: 'room2/mur_droite.jpg',
            floor_2: 'room2/sol_4.jpg',
            character_1: 'room2/scene_02_personnage_extreme_gauche_v01.png',
            character_2: 'room2/scene_02_personnage_gauche_v01.png',
            character_3: 'room2/scene_02_personnage_milieu_v02.png',
            character_3_sketch: 'room2/scene_02_personnage_milieu_esquisse_v01.png',
            character_4: 'room2/scene_02_homme_droite_chaise2_v01.png',
            character_5: 'room2/scene_02_homme_droite_chaise_v01.png',
            character_6: 'room2/scene_02_homme_extreme_droite_v01.png',
            character_7: 'room2/scene_02_assis_fond_v01.png',
            characters_painting: 'room2/scene_02_cadre_plus_personnages_v01.png',
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

    const components1 = [
        new Component(() => {
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial())
            mesh.position.set(0, 0, -50)
            return mesh
        }, [new InteractiveShader('Workshop')]),
        new Room(textures),
        new Component(() => new THREE.AmbientLight(0x999999, 0.7)),
    ]

    const scene1 = new ThreeScene(new Component(() => camera), webGLrenderer, components1)

    const components2 = [
        new Component(() => {
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial())
            mesh.position.set(0, 0, -50)
            return mesh
        }, [new InteractiveShader('Demo')]),
        new Room2(textures),
        new Component(() => new THREE.AmbientLight(0x999999, 0.7)),
    ]

    const scene2 = new ThreeScene(new Component(() => camera), webGLrenderer, components2)

    const cssComponents = [
        new TextInfo({
            position: new THREE.Vector3(1.6, 2, -0.7),
            childPos: new THREE.Vector3(0, -1.2, 1),
            elementId: 'JBLeBrun',
        }),
        new TextInfo({
            position: new THREE.Vector3(1.2, 1.6, 0.1),
            elementId: 'LaPaix',
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
            position: new THREE.Vector3(-1.9, 2, -1.2),
            childPos: new THREE.Vector3(-0.3, -1, 1),
            elementId: 'Rubens',
        }),
        new TextInfo({
            position: new THREE.Vector3(0.9, 1.5, 1.1),
            elementId: 'Buste',
        }),
    ]

    const CSS3DScene = new ThreeScene(
        new Component(() => camera, [new CameraMouseFollow()]),
        CSS3DRenderer,
        cssComponents,
    )

    const transitionScene = new TransitionScene(<THREE.WebGLRenderer>webGLrenderer, scene1)

    const scenes: Scene[] = [
        {
            three: scene1,
            name: 'Workshop',
            buttonText: "Vers l'Atelier",
        },
        {
            three: scene2,
            name: 'Demo',
            buttonText: "Vers l'Académie",
        },
    ]

    const sceneButton = new SceneButton(
        scenes,
        transitionScene,
        document.querySelector('.hud-previousscene'),
        document.querySelector('.hud-nextscene'),
    )

    return {
        raf: () => {
            CSS3DScene.update()
            transitionScene.update()
        },
        cb: () => {
            const mouse = new THREE.Vector2()

            document.addEventListener('mousemove', e => {
                const { clientX, clientY } = e
                mouse.x = (clientX / window.innerWidth) * 2 - 1
                mouse.y = -(clientY / window.innerHeight) * 2 + 1
                Raycaster.getInstance().Cast(camera, mouse)
                MouseMoveListener.getInstance().UpdateValue(e)
            })

            document.querySelector('#enterButton').addEventListener('click', () => {
                document.body.classList.add('start')
            })
            document.body.classList.add('loaded')
            const preventClick = document.querySelectorAll('.preventClick')
            preventClick.forEach(elem => {
                elem.addEventListener('click', e => e.stopPropagation())
            })
            EventEmitter.getInstance().Subscribe(
                EVENT.INTERACTIVE_MOUSEENTER,
                () => (document.body.style.cursor = 'pointer'),
            )
            EventEmitter.getInstance().Subscribe(
                EVENT.INTERACTIVE_MOUSELEAVE,
                () => (document.body.style.cursor = 'default'),
            )
        },
    }
}
