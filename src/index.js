import './css/index.scss'
import Setup from './setup.ts'

let threeRaf = () => {}

Setup().then(({ cb, raf }) => {
    threeRaf = raf
    setTimeout(cb, 0)
})

raf()

function raf() {
    threeRaf()
    requestAnimationFrame(raf)
}
