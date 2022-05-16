import create from 'zustand'
import { persist } from "zustand/middleware"

const createLocalDataStore = (store_key) => create(
    persist(
        (set, get) => ({
            data: {},
            addData: (key, value) => set({ data: { ...get().data, [key]: value } }),
            removeData: (key) => {
                const dataDupe = { ...get().data };
                delete dataDupe[key];
                set({ data: dataDupe });
            }
        }),
        {
            name: store_key, // unique name
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
)

export const useUploadedDataStore = createLocalDataStore('uploaded_data');
export const useFilterlistDataStore = createLocalDataStore('filter_lists');
