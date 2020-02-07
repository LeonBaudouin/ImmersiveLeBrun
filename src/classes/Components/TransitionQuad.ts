import * as THREE from 'three'
import Component from '../Core/Component'
import vertexShader from '../../shaders/transition/transition.vert'
import fragmentShader from '../../shaders/transition/transition.frag'
import TransitionController from '../Controller/TransitionController'

export default class TransitionQuad extends Component {
    transitionController: TransitionController

    constructor() {
        super(() => {
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    tDiffuse1: {
                        value: null,
                    },
                    tDiffuse2: {
                        value: null,
                    },
                    mixRatio: {
                        value: 0.0,
                    },
                    seed: {
                        value: 0.0,
                    },
                    ratio: {
                        value: new THREE.Vector2(1, window.innerHeight / window.innerWidth),
                    },
                },
                vertexShader,
                fragmentShader,
            })
            const geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight)
            return new THREE.Mesh(geometry, material)
        }, [new TransitionController()])
    }

    public getTransitionController(): TransitionController {
        return <TransitionController>this.controllers.filter(c => c instanceof TransitionController)[0]
    }
}
