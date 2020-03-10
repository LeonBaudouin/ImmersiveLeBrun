import { TextureLoader as NativeTextureLoader } from 'three'
import * as THREE from 'three'

type onProgressCallback = (url: string, itemsLoaded: number, itemsTotal: number) => void
export default class TextureLoader {
    private static loadingManager: THREE.LoadingManager = null

    static setLoadingManager(loadingManager: THREE.LoadingManager) {
        TextureLoader.loadingManager = loadingManager
    }

    static load(
        modelPath: string[] | { [name: string]: string },
        assetPath: string = '',
    ): Promise<THREE.Texture[] | { [name: string]: THREE.Texture }> {
        if (!Array.isArray(modelPath)) {
            const keys = Object.keys(modelPath)
            const values = keys.map(key => modelPath[key])
            return Promise.all(values.map(p => assetPath + p).map(TextureLoader.loadOne)).then(textures => {
                const output: { [name: string]: THREE.Texture } = {}
                textures.forEach((texture, index) => {
                    output[keys[index]] = texture
                })
                return output
            })
        } else {
            return Promise.all(modelPath.map(p => assetPath + p).map(TextureLoader.loadOne))
        }
    }

    static loadOne(path: string): Promise<THREE.Texture> {
        const loader = TextureLoader.getNativeLoader()
        return new Promise((resolve, reject) => {
            loader.load(path, resolve, null, reject)
        })
    }

    static getNativeLoader(): NativeTextureLoader {
        if (_nativeLoader == null)
            _nativeLoader = TextureLoader.loadingManager
                ? new NativeTextureLoader(TextureLoader.loadingManager)
                : new NativeTextureLoader()

        return _nativeLoader
    }
}

let _nativeLoader = null
