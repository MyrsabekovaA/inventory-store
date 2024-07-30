import { defineStore } from 'pinia'
import {ref, watch} from 'vue';

interface Item {
    id: number;
    name: string;
    description: string;
    color: string;
    quantity: number;
}

const LOCAL_STORAGE_KEY = 'inventory-items';

export const useInventoryStore = defineStore('inventory', () => {
    const items = ref<(Item | null)[]>(Array(25).fill(null));

    function addItem(item: Item) {
        items.value[item.id] = item;
        saveItemsToLocalStorage();
    }

    function removeItem(id: number) {
        items.value[id] = null;
        saveItemsToLocalStorage();
    }

    function saveItemsToLocalStorage() {
        const itemsData = items.value.map(item => item ? { ...item } : null);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(itemsData));
    }

    function loadItemsFromLocalStorage() {
        const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedItems) {
            items.value = JSON.parse(savedItems);
        }
    }
    loadItemsFromLocalStorage();

    watch(items, saveItemsToLocalStorage, { deep: true });

    return {
        items,
        addItem,
        removeItem,
    };
});