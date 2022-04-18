import create from 'zustand'

const LOCAL_STORAGE_KEY = 'uploaded_data';
export const useUploadedDataStore = create(set => ({
    uploadedData: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}'),
    addData: (name, data) => set(state => {
        const newData = { ...state.uploadedData, [name]: data };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
        return ({ uploadedData: newData })
    }),
    removeData: (name) => set(state => {
        const dataDupe = { ...state.uploadedData };
        delete dataDupe[name];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataDupe));
        return ({ uploadedData: dataDupe });
    }),
}))
