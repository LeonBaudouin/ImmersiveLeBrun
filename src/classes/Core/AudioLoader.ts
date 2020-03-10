import { AudioLoader as NativeAudioLoader } from 'three'
import * as THREE from 'three'

type onProgressCallback = (url: string, itemsLoaded: number, itemsTotal: number) => void

export default class AudioLoader {
    private static loadingManager: THREE.LoadingManager = null

    static setLoadingManager(loadingManager: THREE.LoadingManager) {
        AudioLoader.loadingManager = loadingManager
    }

    static load(
        modelPath: string[] | { [name: string]: string },
        assetPath: string = '',
    ): Promise<THREE.AudioBuffer[] | { [name: string]: THREE.AudioBuffer }> {
        if (!Array.isArray(modelPath)) {
            const keys = Object.keys(modelPath)
            const values = keys.map(key => modelPath[key])
            return Promise.all(values.map(p => assetPath + p).map(AudioLoader.loadOne)).then(audios => {
                const output: { [name: string]: THREE.AudioBuffer } = {}
                audios.forEach((audio, index) => {
                    output[keys[index]] = audio
                })
                return output
            })
        } else {
            return Promise.all(modelPath.map(p => assetPath + p).map(AudioLoader.loadOne))
        }
    }

    static loadOne(path: string): Promise<THREE.AudioBuffer> {
        const loader = AudioLoader.getNativeLoader()
        return new Promise((resolve, reject) => {
            loader.load(path, resolve, p => console.log(p.loaded / p.total), reject)
        })
    }

    static getNativeLoader(): NativeAudioLoader {
        if (_nativeLoader == null)
            _nativeLoader = AudioLoader.loadingManager
                ? new NativeAudioLoader(AudioLoader.loadingManager)
                : new NativeAudioLoader()

        return _nativeLoader
    }
}

let _nativeLoader = null
