import AbstractController from '../Core/AbstractController'
import * as THREE from 'three'

export default class FadeController extends AbstractController {
    private static controllers: FadeController[] = []
    private meshLambertMaterial: THREE.MeshLambertMaterial
    private defaultColor: THREE.Color

    constructor() {
        super()
        FadeController.controllers.push(this)
    }

    public update(component: THREE.Object3D, time: number) {}

    public onMount(component: THREE.Object3D) {
        this.meshLambertMaterial = (<THREE.Mesh>component).material as THREE.MeshLambertMaterial
        this.defaultColor = this.meshLambertMaterial.color.clone()
    }

    public darkenMaterial(duration: number, amount: number) {
        this.meshLambertMaterial.color.lerp(new THREE.Color(0x000000), amount)
    }

    public restoreMaterial(duration: number) {
        this.meshLambertMaterial.color.set(this.defaultColor)
    }

    public static darkenAllButOne(material: THREE.MeshLambertMaterial) {}
}
