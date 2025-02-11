import { useEffect } from 'react';

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

const pressedKeySet = new Set<KeyCode>();

const useKeyEvent = (
    eventType: KeyEventType,
    targetKeyCode: KeyCode,
    callback: (() => void) | (() => Promise<void>)
) => {
    useEffect(() => {
        const handleKeyPress = async (event: KeyboardEvent) => {
            console.log("now key set: ", pressedKeySet);
            if (event.code === targetKeyCode) {
                event.preventDefault();
                event.stopPropagation();
                window.ipcRenderer.send('key-intercepted', event.code);

                // 如果是 keydown 且該按鍵已經在 Set 中，則不執行
                if (eventType === 'keydown' && pressedKeySet.has(targetKeyCode)) {
                    return;
                }

                // 如果是 keydown，將按鍵加入 Set
                if (eventType === 'keydown') {
                    pressedKeySet.add(targetKeyCode);
                }

                // if (eventType === 'keyup') {
                //     pressedKeySet.delete(targetKeyCode);
                // }

                try {
                    console.log("running callback")
                    await callback();
                } catch (error) {
                    console.error('Error in key event callback:', error);
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === targetKeyCode) {
                pressedKeySet.delete(targetKeyCode);
            }
        };

        window.addEventListener(eventType, handleKeyPress);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener(eventType, handleKeyPress);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [eventType, targetKeyCode, callback]);
};

const pressedKeySetMultiple = new Set<string>();

export const useKeyCombination = (
    targetKeyCodes: KeyCode[],
    callback: (() => void) 
) => {
    useEffect(() => {
        
        // let isProcessing = false;

        const handleKeyDown = (event: KeyboardEvent) => {
            pressedKeySetMultiple.add(event.code);
            // console.info("pressed keys add: ", event.code);

            // console.log("pressed keys: ", pressedKeySetMultiple);

            const allKeysPressed = targetKeyCodes.every(key => pressedKeySetMultiple.has(key));
            const keysMatchExactly = pressedKeySetMultiple.size === targetKeyCodes.length;

            if (allKeysPressed && keysMatchExactly) {
                event.preventDefault();
                event.stopPropagation();

                // isProcessing = true;
                try {
                    // console.info("start running callback");
                    // console.info("now pressed key: ", pressedKeySetMultiple);
                    callback();
                    // console.info("finished running callback");
                    // console.info("now pressed key: ", pressedKeySetMultiple);
                } catch (error) {
                    // console.error('Error in key combination callback:', error);
                } finally {
                    // isProcessing = false;
                    // pressedKeys.clear();
                    // console.info("pressed keys cleared");
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            // console.info("handleKeyUp: now pressed key: ", pressedKeySetMultiple)
            pressedKeySetMultiple.delete(event.code);
            // console.log("pressed keys deleted: ", event.code);
            // console.info("handleKeyUp: now pressed key: ", pressedKeySetMultiple)
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