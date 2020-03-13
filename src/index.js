import './css/index.scss'
import Setup from './setup.ts'
import Key from './classes/Key'
import 'gsap'
import Menu from './classes/Menu'

let rafCbs = []

document.addEventListener('DOMContentLoaded', () => {
    const key = new Key()
    const css3dContainer = document.querySelector('.css3d-container')
    const uiWrapper = document.querySelector('.menu')
    const loadingScreen = document.querySelector('.loading-screen')
    const menu = new Menu(document.querySelectorAll('.menu-navigation-button'), document.querySelector('.menu-content'))

    key.addButtonCb(() => {
        css3dContainer.style.display = 'none'
        loadingScreen.classList.remove('open')
        loadingScreen.classList.add('close')
    })

    key.addKeyCb(() => {
        uiWrapper.style.display = 'none'
        css3dContainer.style.display = 'flex'
        loadingScreen.classList.remove('close')
        loadingScreen.classList.add('open')
    })

    key.addButtonCb(() => {
        rafCbs.push(key.updateKeyPos.bind(key))
        rafCbs.push(key.updateProgressSmoothing.bind(key))

        Setup(key).then(({ cb, raf }) => {
            key.addKeyCb(() => rafCbs.push(raf))
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
