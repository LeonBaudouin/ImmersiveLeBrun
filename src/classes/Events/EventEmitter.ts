import AbstractEventEmitter from './AbstractEventEmitter'

export default class EventEmitter<ID, INFO> extends AbstractEventEmitter<
    ID,
    INFO
> {
    private static instance: EventEmitter<string, any> = null

    public static getInstance(): EventEmitter<string, any> {
        if (EventEmitter.instance === null) {
            EventEmitter.instance = new EventEmitter<string, any>()
        }
        return EventEmitter.instance
    }
}

export enum EVENT {
    INTERACTIVE_CLICK = 'INTERACTIVE_CLICK',
}
