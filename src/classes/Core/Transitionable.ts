export default interface Transitionable {
    update(recordOnFbo?: boolean)
    getFbo(): THREE.WebGLRenderTarget
}
