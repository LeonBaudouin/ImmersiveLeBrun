import './css/index.scss'
import Setup from './setup.ts'
import Key from './classes/Key'
import 'gsap'
import About from './classes/About'
import SceneMenu from './classes/SceneMenu'
import EventEmitter, { EVENT } from './classes/Events/EventEmitter'

let rafCbs = []

document.addEventListener('DOMContentLoaded', () => {
    const key = new Key()
    const css3dContainer = document.querySelector('.css3d-container')
    const uiWrapper = document.querySelector('.menu')
    const loadingScreen = document.querySelector('.loading-screen')
    const menu = new About(document.querySelector('.menu-navigation-button'), document.querySelector('.menu-content'))
    const sceneMenu = new SceneMenu(
        [...document.querySelectorAll('.hud-menu-button')],
        document.querySelector('.hud-menu'),
    )
    const soundButtons = document.querySelectorAll('.sound-icon')

    let soundIsOn = true
    soundButtons.forEach(button => {
        button.addEventListener('click', e => {
            if (soundIsOn) EventEmitter.getInstance().Emit(EVENT.SOUND_MUTE)
            if (!soundIsOn) EventEmitter.getInstance().Emit(EVENT.SOUND_UNMUTE)
            soundButtons.forEach(f => f.classList.toggle('disabled'))
            soundIsOn = !soundIsOn
        })
    })
    let inScene = false
    let threeRaf = () => {}

    const closeDoors = () => {
        loadingScreen.classList.remove('open')
        loadingScreen.classList.add('close')
        rafCbs.push(key.updateKeyPos.bind(key))
        rafCbs.push(key.updateProgressSmoothing.bind(key))
    }

    const openDoors = () => {
        loadingScreen.classList.remove('close')
        loadingScreen.classList.add('open')
        rafCbs.splice(rafCbs.indexOf(key.updateKeyPos.bind(key)), 1)
        rafCbs.splice(rafCbs.indexOf(key.updateProgressSmoothing.bind(key)), 1)
    }

    const toScene = () => {
        uiWrapper.style.display = 'none'
        css3dContainer.style.display = 'flex'

        openDoors()
        rafCbs.push(threeRaf)

        EventEmitter.getInstance().Emit(EVENT.INTERACTIVE_BIND, 'Workshop')
        sceneMenu.moveTo(1)

        inScene = true
    }

    const toMenu = () => {
        uiWrapper.style.display = 'inline-flex'
        css3dContainer.style.display = 'none'
        rafCbs.splice(rafCbs.indexOf(threeRaf), 1)

        document.body.style.cursor = 'default'

        inScene = false
    }

    key.addButtonCb(closeDoors)
    uiWrapper.style.display = 'inline-flex'
    css3dContainer.style.display = 'none'

    sceneMenu.addCbToOneButton(() => {
        loadingScreen.classList.remove('open')
        loadingScreen.classList.add('close')

        setTimeout(() => {
            toMenu()
            loadingScreen.classList.remove('close')
            loadingScreen.classList.add('open')
        }, 1500)
    }, 0)
    key.addKeyCb(toScene)

    let firstButtonClick = true
    key.addButtonCb(() => {
        if (firstButtonClick) {
            Setup(sceneMenu, key).then(({ cb, raf }) => {
                threeRaf = raf
                setTimeout(cb, 0)
            })
            firstButtonClick = false
        }
    })

    let firstKeyDrop = true
    key.addKeyCb(() => {
        if (firstKeyDrop) {
            EventEmitter.getInstance().Subscribe(EVENT.INTERACTIVE_MOUSEENTER, () => {
                if (inScene) document.body.style.cursor = 'pointer'
            })

            EventEmitter.getInstance().Subscribe(EVENT.INTERACTIVE_MOUSELEAVE, () => {
                if (inScene) document.body.style.cursor = 'default'
            })
            firstKeyDrop = false
        }
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
