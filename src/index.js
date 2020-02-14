import './css/index.scss'
import Setup from './setup.ts'

let threeRaf = () => {}

document.addEventListener('DOMContentLoaded', () => {
    window.setTimeout(() => {
        Promise.all([Setup(), toLebrun()]).then(([{ cb, raf }]) => {
            document.querySelector('.loading-screen').classList.remove('open')
            document.querySelector('.loading-screen').classList.add('close')
            threeRaf = raf
            setTimeout(cb, 0)
            document.querySelector('.css3d-container').style.display = 'flex'
        })
    }, 1000)

    document.querySelectorAll('.menu-card-button').forEach(b => {
        b.addEventListener('click', e => e.preventDefault())
    })

    document.querySelector('.enter-screen').classList.add('hidden')
})

function toLebrun() {
    return new Promise(resolve => {
        document.querySelector('.css3d-container').style.display = 'none'
        // Key
        document.querySelector('#menu-to-lebrun').addEventListener('click', () => {
            resolve()
        })
    })
}

raf()

function raf() {
    threeRaf()
    requestAnimationFrame(raf)
}
