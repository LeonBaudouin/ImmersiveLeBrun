import './css/index.scss'
import Setup from './setup.ts'
import Key from './classes/Key'
import 'gsap'

let threeRaf = () => {}

document.addEventListener('DOMContentLoaded', () => {
    const key = new Key(document.querySelector('.js-key-1'), document.querySelector('.js-button-1'))
    const css3dContainer = document.querySelector('.css3d-container')
    key.addButtonCb(() => {
        css3dContainer.style.display = 'none'

        Setup(key).then(({ cb, raf }) => {
            threeRaf = raf
            setTimeout(cb, 0)
            css3dContainer.style.display = 'flex'
            key.isLoaded = true
        })
    })

    document.querySelectorAll('.menu-card-button').forEach(b => {
        b.addEventListener('click', e => e.preventDefault())
    })

    document.querySelector('.enter-screen').classList.add('hidden')
})

raf()

function raf() {
    threeRaf()
    requestAnimationFrame(raf)
}
