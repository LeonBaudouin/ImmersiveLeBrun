import ThreeScene from './components/ThreeScene'
import * as THREE from 'three'
import Component from './components/Component'

export default function Setup() {
    const cameraComponent = new Component(() => {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        )
        camera.position.set(0, 0, 5)
        return camera
    })

    const components = [
        new Component(() => {
            const material = new THREE.MeshNormalMaterial()
            const geometry = new THREE.BoxGeometry(1, 1, 1)
            const mesh = new THREE.Mesh(geometry, material)
            return mesh
        }, [
            (object3d: THREE.Object3D, time: number) => {
                object3d.rotateX(0.001)
                object3d.rotateY(0.002)
            },
        ]),
        new Component(() => new THREE.AmbientLight(0x404040)),
    ]

    const threeScene = new ThreeScene(cameraComponent, components)

    raf(threeScene)
}

function raf(scene: ThreeScene) {
    requestAnimationFrame(() => raf(scene))
    scene.update()
}
