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
    | 'KeyC'
    | 'KeyV'
    | 'ControlLeft'
    /*add more*/;

type KeyEventType = 'keydown' | 'keyup';

const useKeyEvent = (
    eventType: KeyEventType,
    targetKeyCode: KeyCode,
    callback: (() => void) | (() => Promise<void>)
) => {
    useEffect(() => {
        const handleKeyPress = async (event: KeyboardEvent) => {
            if (event.code === targetKeyCode) {
                event.preventDefault();
                event.stopPropagation();
                window.ipcRenderer.send('key-intercepted', event.code);

                try {
                    await callback();
                } catch (error) {
                    console.error('Error in key event callback:', error);
                }
            }
        };

        window.addEventListener(eventType, handleKeyPress);

        return () => {
            window.removeEventListener(eventType, handleKeyPress);
        };
    }, [eventType, targetKeyCode, callback]);
};

export const useKeyCombination = (
    targetKeyCodes: KeyCode[],
    callback: (() => void) 
) => {
    useEffect(() => {
        const pressedKeys = new Set<string>();
        let isProcessing = false;

        const handleKeyDown = async (event: KeyboardEvent) => {
            pressedKeys.add(event.code);

            const allKeysPressed = targetKeyCodes.every(key => pressedKeys.has(key));
            const keysMatchExactly = pressedKeys.size === targetKeyCodes.length;

            if (allKeysPressed && keysMatchExactly && !isProcessing) {
                event.preventDefault();
                event.stopPropagation();

                isProcessing = true;
                try {
                    callback();
                } catch (error) {
                    console.error('Error in key combination callback:', error);
                } finally {
                    isProcessing = false;
                    pressedKeys.clear();
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            pressedKeys.delete(event.code);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [targetKeyCodes, callback]);
};


export const useKeyDown = (targetKeyCode: KeyCode, callback: () => void) => {
    useKeyEvent('keydown', targetKeyCode, callback);
};

export const useKeyUp = (targetKeyCode: KeyCode, callback: () => void) => {
    useKeyEvent('keyup', targetKeyCode, callback);
};