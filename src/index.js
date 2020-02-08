import './css/index.scss'
import Setup from './setup.ts'

let threeRaf = () => {}

const css3dContainer = document.querySelector('.css3d-container')
document.querySelectorAll('.menu-card-button').forEach(b => {
    b.addEventListener('click', e => e.preventDefault())
})

document.addEventListener('DOMContentLoaded', () => {
    window.setTimeout(() => {
        Promise.all([Setup(), toLebrun()]).then(([{ cb, raf }]) => {
            threeRaf = raf
            setTimeout(cb, 0)
            css3dContainer.style.display = 'flex'
        })
    }, 1000)
})

function toLebrun() {
    const loadingScreen = document.querySelector('.loading-screen')

    css3dContainer.style.display = 'none'
    loadingScreen.style.display = 'none'
    document.querySelector('#menu-to-lebrun').addEventListener('click', () => {
        loadingScreen.style.display = 'flex'
        document.querySelector('.menu').style.display = 'none'

        return Promise.resolve()
    })
}

raf()

function raf() {
    threeRaf()
    requestAnimationFrame(raf)
}
