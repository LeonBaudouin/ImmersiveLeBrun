import SmoothedPoint from './classes/Utils/SmoothPoint'
import * as THREE from 'three'
import NormalizePoint from './classes/Utils/NormalizePoint'

export default function() {
    const smoother = new SmoothedPoint(new THREE.Vector2(0.01, 0.01), new THREE.Vector2(0, 0))
    const loadingScreen = document.querySelector('.loading-screen')
    loadingScreen.addEventListener('mousemove', ({ clientX, clientY }) => {
        smoother.setTarget({ x: clientX, y: clientY })
    })
    return () => {
        smoother.Smooth()
        const point = smoother.getPoint()
        NormalizePoint(point)
        loadingScreen.style.setProperty('--offset-x', point.x * 40 + 'px')
        loadingScreen.style.setProperty('--offset-y', point.y * 20 + 'px')
    }
}
