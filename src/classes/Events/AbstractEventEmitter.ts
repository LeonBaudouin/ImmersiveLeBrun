import { EventEmitterInterface } from './EventEmitterInterface'

export default abstract class AbstractEventEmitter<ID, INFO>
    implements EventEmitterInterface {
    protected callbackAssoc: Map<ID, ((info: INFO) => void)[]> = new Map()
    protected constructor() {}

    Subscribe(id: ID, callback: (info: INFO) => void) {
        if (this.callbackAssoc.has(id)) {
            this.callbackAssoc.get(id).push(callback)
        } else {
            this.callbackAssoc.set(id, [callback])
        }
    }

    Emit(id: ID, info: INFO) {
        if (this.callbackAssoc.has(id)) {
            this.callbackAssoc.get(id).forEach(callback => callback(info))
        }
    }
}
