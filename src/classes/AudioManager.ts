import * as THREE from 'three'
import EventEmitter, { EVENT } from './Events/EventEmitter'
import AudioLoader from './Core/AudioLoader'
import TweenLite from 'gsap'

export default class AudioManager {
    private currentScene: string
    private eventEmitter: EventEmitter
    private listener: THREE.AudioListener

    constructor(listener: THREE.AudioListener) {
        this.listener = listener
        this.eventEmitter = EventEmitter.getInstance()
        this.eventEmitter.Subscribe(EVENT.INTERACTIVE_BIND, name => {
            this.currentScene = name
        })
    }

    public addAudio(audioSetParams: AudioSetParams) {
        const { eventPlay, eventStop, audiosParams, onScene } = audioSetParams
        Promise.all(audiosParams.map(p => this.createAudio(p))).then(audios => {
            if (onScene !== null) {
                if (this.currentScene === onScene) this.playRandom(audios)
                this.setListener({
                    audios,
                    event: EVENT.INTERACTIVE_BIND,
                    on: onScene,
                    exclude: false,
                    onlyStop: false,
                })
                this.setListener({
                    audios,
                    event: EVENT.INTERACTIVE_BIND,
                    on: onScene,
                    exclude: true,
                    onlyStop: true,
                })
            }
            if (eventPlay !== null) {
                this.setListener({
                    audios,
                    event: eventPlay.event,
                    on: eventPlay.info,
                    exclude: !!eventPlay.exclude,
                    onlyStop: false,
                })
            }
            if (eventStop !== null) {
                this.setListener({
                    audios,
                    event: eventStop.event,
                    on: eventStop.info,
                    exclude: !!eventStop.exclude,
                    onlyStop: true,
                })
            }
        })
    }

    private setListener({
        audios,
        event,
        on,
        exclude,
        onlyStop,
    }: {
        audios: THREE.Audio[]
        event: EVENT
        on: EventInfo
        exclude: boolean
        onlyStop: boolean
    }) {
        const trigger = () => {
            audios.forEach(audio => {
                if (audio.isPlaying) {
                    if (onlyStop) {
                        this.fadeAudio(audio)
                    } else {
                        audio.stop()
                    }
                }
            })
            if (!onlyStop) this.playRandom(audios)
        }

        this.eventEmitter.Subscribe(event, info => {
            if (on === null) {
                trigger()
            } else if (typeof on === 'string' && ((on === info && !exclude) || (on !== info && exclude))) {
                trigger()
            } else if (
                typeof on === 'object' &&
                ((on.value === info[on.property] && !exclude) || (on.value !== info[on.property] && exclude))
            ) {
                trigger()
            }
        })
    }

    private createAudio({ url, volume, playbackRate, loop }: AudioParams): Promise<THREE.Audio> {
        return AudioLoader.loadOne(url).then(buffer => {
            const audio = new THREE.Audio(this.listener)
            audio.setBuffer(buffer)
            audio.setVolume(volume)
            audio.setLoop(loop)
            audio.setPlaybackRate(playbackRate)
            return audio
        })
    }

    private playRandom(audios: THREE.Audio[]) {
        const rand = Math.random()
        audios.forEach((audio, i) => {
            if (rand > i / audios.length && rand < (i + 1) / audios.length) {
                audio.play()
            }
        })
    }

    private fadeAudio(audio: THREE.Audio) {
        const baseVolume = audio.getVolume()
        const objSound = { volume: baseVolume }
        TweenLite.to(objSound, 3, {
            volume: 0,
            onUpdate: () => {
                console.log(objSound.volume)
                audio.setVolume(objSound.volume)
            },
            onComplete: () => {
                audio.stop()
                audio.setVolume(baseVolume)
            },
        })
    }
}

export interface AudioParams {
    url: string
    loop: boolean
    volume: number
    playbackRate: number
}

type EventInfo = string | { property: string; value: any } | null

export interface AudioSetParams {
    audiosParams: AudioParams[]
    onScene: string | null
    eventStop: {
        event: EVENT
        info: EventInfo
        exclude: boolean | null
    } | null
    eventPlay: {
        event: EVENT
        info: EventInfo
        exclude: boolean | null
    } | null
}
