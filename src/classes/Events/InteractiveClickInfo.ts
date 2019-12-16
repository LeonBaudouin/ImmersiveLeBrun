import InteractiveShader from '../Controller/InteractiveShader'
import * as THREE from 'three'

export default interface InteractiveClickInfo {
    controller: InteractiveShader
    component: THREE.Object3D
}
