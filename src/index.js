import './css/index.scss'
import Setup from './setup.ts'
import Key from './classes/Key'
import 'gsap'
import Menu from './classes/Menu'
import SceneMenu from './classes/SceneMenu'
import EventEmitter, { EVENT } from './classes/Events/EventEmitter'

let rafCbs = []

document.addEventListener('DOMContentLoaded', () => {
    const key = new Key()
    const css3dContainer = document.querySelector('.css3d-container')
    const uiWrapper = document.querySelector('.menu')
    const loadingScreen = document.querySelector('.loading-screen')
    const menu = new Menu(document.querySelectorAll('.menu-navigation-button'), document.querySelector('.menu-content'))

    const closeDoors = () => {
        loadingScreen.classList.remove('open')
        loadingScreen.classList.add('close')
    }

    const openDoors = () => {
        loadingScreen.classList.remove('close')
        loadingScreen.classList.add('open')
    }

    const toScene = () => {
        uiWrapper.style.display = 'none'
        css3dContainer.style.display = 'flex'
        openDoors()
    }

    const toMenu = () => {
        uiWrapper.style.display = 'inline-flex'
        css3dContainer.style.display = 'none'
        closeDoors()
    }

    uiWrapper.style.display = 'inline-flex'
    css3dContainer.style.display = 'none'

    key.addButtonCb(closeDoors)

    key.addKeyCb(toScene)

    key.addButtonCb(() => {
        rafCbs.push(key.updateKeyPos.bind(key))
        rafCbs.push(key.updateProgressSmoothing.bind(key))

        const sceneMenu = new SceneMenu(
            [...document.querySelectorAll('.hud-menu-button')],
            document.querySelector('.hud-menu'),
        )

        Setup(sceneMenu, key).then(({ cb, raf }) => {
            key.addKeyCb(() => {
                rafCbs.push(raf)
                EventEmitter.getInstance().Emit(EVENT.INTERACTIVE_BIND, 'Workshop')
                sceneMenu.moveTo(1)
            })
            setTimeout(cb, 0)
        })
    })

    uiWrapper.classList.add('domLoaded')
    document.querySelectorAll('.menu-card-button').forEach(b => {
        b.addEventListener('click', e => e.preventDefault())
    })

    document.querySelector('.enter-screen').classList.add('hidden')
})

raf()

function raf() {
    for (let i = 0; i < rafCbs.length; i++) {
        rafCbs[i]()
    }
    requestAnimationFrame(raf)
}
