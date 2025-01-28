type EventCallback = (data: any) => void;

const EVENT_TYPES = {
    UPDATE_VIDEO_URL: 'UPDATE_VIDEO_URL',
    // 可以加入更多事件常數
} as const;


class EventBus {

    private events: { [key: string]: EventCallback[] } = {};

    subscribe(event: string, callback: EventCallback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);

        // 返回取消訂閱的函數
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    }

    emit(event: string, data: any) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

export const eventBus = new EventBus();
export { EVENT_TYPES };