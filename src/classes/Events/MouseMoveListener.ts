import { ListenEvent, NativeEventListener } from './SimpleEventListener'

export class MouseMoveListener extends NativeEventListener {
    protected static instance: MouseMoveListener
    protected static value: THREE.Vector2

    public static getInstance(): ListenEvent {
        if (MouseMoveListener.instance == null)
            MouseMoveListener.instance = new MouseMoveListener()

        return MouseMoveListener.instance
    }

    private constructor() {
        super('mousemove')
    }

    public getValue() {
        return MouseMoveListener.value
    }

    public UpdateValue(e: MouseEvent) {
        MouseMoveListener.value.x = e.clientX
        MouseMoveListener.value.y = e.clientY
    }
}
