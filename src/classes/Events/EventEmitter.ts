import AbstractEventEmitter from './AbstractEventEmitter'

export default class EventEmitter<ID, INFO> extends AbstractEventEmitter<ID, INFO> {
    private static instance: EventEmitter<EVENT, any> = null

    public static getInstance(): EventEmitter<EVENT, any> {
        if (EventEmitter.instance === null) {
            EventEmitter.instance = new EventEmitter<EVENT, any>()
        }
        return EventEmitter.instance
    }
}

export enum EVENT {
    INTERACTIVE_CLICK = 'INTERACTIVE_CLICK',
    INTERACTIVE_MOUSEENTER = 'INTERACTIVE_MOUSEENTER',
    INTERACTIVE_MOUSELEAVE = 'INTERACTIVE_MOUSELEAVE',
}
