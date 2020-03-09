import { AudioLoader as NativeAudioLoader } from 'three'
import * as THREE from 'three'

type onProgressCallback = (url: string, itemsLoaded: number, itemsTotal: number) => void

export default class AudioLoader {
    private static loadingManager: THREE.LoadingManager = null
    private static onProgressCallbacks: onProgressCallback[] = []

    static setLoadingManager(loadingManager: THREE.LoadingManager) {
        AudioLoader.loadingManager = loadingManager
        AudioLoader.loadingManager.onProgress = AudioLoader.onUpdate
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
            loader.load(path, resolve, null, reject)
        })
    }

    static onUpdate(url: string, itemsLoaded: number, itemsTotal: number) {
        for (let index = 0; index < AudioLoader.onProgressCallbacks.length; index++) {
            AudioLoader.onProgressCallbacks[index](url, itemsLoaded, itemsTotal)
        }
    }

    static addOnProgressCallback(func: onProgressCallback) {
        AudioLoader.onProgressCallbacks.push(func)
    }

    static getNativeLoader(): NativeAudioLoader {
        if (_nativeLoader == null) _nativeLoader = new NativeAudioLoader()

        return _nativeLoader
    }
}

let _nativeLoader = null
