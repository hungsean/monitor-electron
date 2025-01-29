class TimeManager {
    private hours: number;
    private minutes: number;
    private seconds: number;

    constructor(time?: string | null) {
        if (!time) {
            // 如果沒有輸入，設置為 00:00:00
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
            return;
        }

        // 去除所有空白
        time = time.trim();

        if (time.includes(':')) {
            // 處理 hh:mm:ss 格式
            const [h, m, s] = time.split(':').map(num => parseInt(num));
            this.hours = h || 0;
            this.minutes = m || 0;
            this.seconds = s || 0;
        } else if (time.length === 6) {
            // 處理 hhmmss 格式
            this.hours = parseInt(time.substring(0, 2)) || 0;
            this.minutes = parseInt(time.substring(2, 4)) || 0;
            this.seconds = parseInt(time.substring(4, 6)) || 0;
        } else {
            // 如果格式不符合，設置為 00:00:00
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
        }
    }

    // Setters
    setHours(hours: number): void {
        this.hours = hours;
    }

    setMinutes(minutes: number): void {
        this.minutes = minutes;
    }

    setSeconds(seconds: number): void {
        this.seconds = seconds;
    }

    // Getters
    getHours(): number {
        return this.hours;
    }

    getMinutes(): number {
        return this.minutes;
    }

    getSeconds(): number {
        return this.seconds;
    }

    toString(): string {
        const formatNumber = (num: number): string => {
            return num.toString().padStart(2, '0');
        };

        return `${formatNumber(this.hours)}:${formatNumber(this.minutes)}:${formatNumber(this.seconds)}`;
    }

    isLaterThan(other: TimeManager): boolean {
        if (this.hours !== other.getHours()) {
            return this.hours > other.getHours();
        }
        if (this.minutes !== other.getMinutes()) {
            return this.minutes > other.getMinutes();
        }
        return this.seconds > other.getSeconds();
    }

    addHours(amount: number): void {
        this.hours += amount;
    }

    addMinutes(amount: number): void {
        if (amount > 59) {
            console.warn('Amount is too high');
            return;
        }

        this.minutes += amount;

        if (this.minutes > 59) {
            this.hours += 1;
            this.minutes -= 60;
        }
        else if (this.minutes < 0) {
            this.hours -= 1;
            this.minutes += 60;
        }
        return;
    }


}

export default TimeManager;