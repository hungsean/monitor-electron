import { create } from 'zustand';
import TimeManager from './time-manager';

// 定義具體的資料結構
interface StoreData {
    START_REAL_TIME?: TimeManager;
    END_REAL_TIME?: TimeManager;
    videoCurrentTime: number;
    // 可以加入更多需要的欄位
}

interface StoreState {
    data: StoreData;
    setData: (newData: Partial<StoreData>) => void;
}

export const useAppStore = create<StoreState>((set) => ({
    data: {
        videoCurrentTime: 0  // 初始化視頻時間
    },
    setData: (newData) =>
        set((state) => ({
            data: { ...state.data, ...newData }
        })),
}));