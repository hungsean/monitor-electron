import { create } from 'zustand';

// 定義具體的資料結構
interface StoreData {
    START_REAL_TIME?: string;
    END_REAL_TIME?: string;
    // 可以加入更多需要的欄位
}

interface StoreState {
    data: StoreData;
    setData: (newData: Partial<StoreData>) => void;
}

export const useStore = create<StoreState>((set) => ({
    data: {},
    setData: (newData) =>
        set((state) => ({
            data: { ...state.data, ...newData }
        })),
}));