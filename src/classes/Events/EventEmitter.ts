import AbstractEventEmitter from './AbstractEventEmitter'

export default class EventEmitter extends AbstractEventEmitter<EVENT, any> {
    private static instance: EventEmitter = null

    public static getInstance(): EventEmitter {
        if (EventEmitter.instance === null) {
            EventEmitter.instance = new EventEmitter()
        }
        return EventEmitter.instance
    }
}

export enum EVENT {
    INTERACTIVE_CLICK = 'INTERACTIVE_CLICK',
    INTERACTIVE_MOUSEENTER = 'INTERACTIVE_MOUSEENTER',
    INTERACTIVE_MOUSELEAVE = 'INTERACTIVE_MOUSELEAVE',
    CHANGE_SCENE = 'CHANGE_SCENE',
}
