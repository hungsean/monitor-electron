import { useEffect } from 'react';
import { PiRedditLogo } from 'react-icons/pi';

export type KeyCode =
    | 'Space'
    | 'AltLeft'
    | 'AltRight'
    | 'Digit1'
    | 'Digit2'
    | 'Digit3'
    | 'Digit4'
    | 'Digit5'
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
        let isLocked = false;

        const handleKeyPress = async (event: KeyboardEvent) => {
            if (event.code === targetKeyCode && !isLocked) {
                event.preventDefault();
                event.stopPropagation();
                window.ipcRenderer.send('key-intercepted', event.code);

                try {
                    isLocked = true;
                    console.log("running callback")
                    await callback();
                } catch (error) {
                    console.error('Error in key event callback:', error);
                } finally {
                    // 在 keyup 時解除鎖定
                    if (eventType === 'keydown') {
                        const unlockHandler = () => {
                            if (event.code === targetKeyCode) {
                                isLocked = false;
                                window.removeEventListener('keyup', unlockHandler);
                            }
                        };
                        window.addEventListener('keyup', unlockHandler);
                    } else {
                        isLocked = false;
                    }
                }
            }
        };

        window.addEventListener(eventType, handleKeyPress);

        return () => {
            window.removeEventListener(eventType, handleKeyPress);
        };
    }, [eventType, targetKeyCode, callback]);
};

const pressedKeys = new Set<string>();

export const useKeyCombination = (
    targetKeyCodes: KeyCode[],
    callback: (() => void) 
) => {
    useEffect(() => {
        
        // let isProcessing = false;

        const handleKeyDown = (event: KeyboardEvent) => {
            pressedKeys.add(event.code);
            console.info("pressed keys add: ", event.code);

            console.log("pressed keys: ", pressedKeys);

            const allKeysPressed = targetKeyCodes.every(key => pressedKeys.has(key));
            const keysMatchExactly = pressedKeys.size === targetKeyCodes.length;

            if (allKeysPressed && keysMatchExactly) {
                event.preventDefault();
                event.stopPropagation();

                // isProcessing = true;
                try {
                    console.info("start running callback");
                    console.info("now pressed key: ", pressedKeys);
                    callback();
                    console.info("finished running callback");
                    console.info("now pressed key: ", pressedKeys);
                } catch (error) {
                    console.error('Error in key combination callback:', error);
                } finally {
                    // isProcessing = false;
                    // pressedKeys.clear();
                    console.info("pressed keys cleared");
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            console.info("handleKeyUp: now pressed key: ", pressedKeys)
            pressedKeys.delete(event.code);
            console.log("pressed keys deleted: ", event.code);
            console.info("handleKeyUp: now pressed key: ", pressedKeys)
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