import './css/index.scss'
import Setup from './setup.ts'
import Key from './classes/Key'
import 'gsap'

let rafCbs = []

document.addEventListener('DOMContentLoaded', () => {
    const key = new Key()
    const css3dContainer = document.querySelector('.css3d-container')
    key.addButtonCb(() => {
        css3dContainer.style.display = 'none'
        rafCbs.push(key.updateKeyPos.bind(key))

        Setup(key).then(({ cb, raf }) => {
            rafCbs.push(raf)
            setTimeout(cb, 0)
            css3dContainer.style.display = 'flex'
        })
    })

    document.querySelector('.menu').classList.add('domLoaded')
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
