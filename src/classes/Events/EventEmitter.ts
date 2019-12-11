import AbstractEventEmitter from './AbstractEventEmitter'
import { EventEmitterInterface } from './EventEmitterInterface'

export default class EventEmitter<ID, INFO> extends AbstractEventEmitter<
    ID,
    INFO
> {
    private static instances: Map<string, EventEmitterInterface> = new Map()

    public static getInstance<D, N>(instanceIdentifier: string) {
        if (!EventEmitter.instances.has(instanceIdentifier)) {
            EventEmitter.instances.set(
                instanceIdentifier,
                new EventEmitter<D, N>(),
            )
        }
        return EventEmitter.instances
    }
}
