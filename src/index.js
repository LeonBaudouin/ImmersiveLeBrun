import './css/index.scss'
import Setup from './setup.ts'
import ui from './ui'

let threeRaf = () => {}

Setup().then(({ cb, raf }) => {
    threeRaf = raf
    setTimeout(cb, 0)
})

const smoothRaf = ui()

raf()

function raf() {
    smoothRaf()
    threeRaf()
    requestAnimationFrame(raf)
}
