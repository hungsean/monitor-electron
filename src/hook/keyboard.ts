import { useEffect } from 'react';

export type KeyCode =
    | 'Space'
    | 'AltLeft'
    | 'AltRight'
    | 'Digit4'
    | 'KeyW'
    | 'KeyS'
    | 'KeyA'
    | 'KeyD'
    /*add more*/;

type KeyEventType = 'keydown' | 'keyup';

const useKeyEvent = (eventType: KeyEventType, targetKeyCode: KeyCode, callback: () => void) => {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === targetKeyCode) {
                event.preventDefault();
                event.stopPropagation();
                window.ipcRenderer.send('key-intercepted', event.code);
                callback();
            }
        };

        window.addEventListener(eventType, handleKeyPress);

        return () => {
            window.removeEventListener(eventType, handleKeyPress);
        };
    }, [eventType, targetKeyCode, callback]);
};

export const useKeyDown = (targetKeyCode: KeyCode, callback: () => void) => {
    useKeyEvent('keydown', targetKeyCode, callback);
};

export const useKeyUp = (targetKeyCode: KeyCode, callback: () => void) => {
    useKeyEvent('keyup', targetKeyCode, callback);
};