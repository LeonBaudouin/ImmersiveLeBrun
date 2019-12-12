import { TextureLoader as NativeTextureLoader } from 'three'

export default class TextureLoader {
    static load(
        modelPath: string[],
        assetPath: string = '',
    ): Promise<THREE.Texture[]> {
        return Promise.all(
            modelPath.map(p => assetPath + p).map(TextureLoader.loadOne),
        )
    }

    static loadOne(path: string): Promise<THREE.Texture> {
        const loader = TextureLoader.getNativeLoader()
        return new Promise((resolve, reject) => {
            loader.load(path, resolve, TextureLoader.updateXhr, reject)
        })
    }

    static updateXhr(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    }

    static getNativeLoader(): NativeTextureLoader {
        if (_nativeLoader == null) _nativeLoader = new NativeTextureLoader()

        return _nativeLoader
    }
}

let _nativeLoader = null
