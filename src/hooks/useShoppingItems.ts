
import {
  ShoppingItem,
  ShoppingItemInput,
} from "@/types/shopping";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type ShoppingHistoryItem = ShoppingItem & {
  historyId: string;
  purchasedAt: string;
};

const ITEMS_KEY = "@belanja_items";
const HISTORY_KEY = "@belanja_history";

export function useShoppingItems() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [history, setHistory] = useState<ShoppingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const savedItems = await AsyncStorage.getItem(ITEMS_KEY);
        const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);

        if (savedItems) setItems(JSON.parse(savedItems));
        if (savedHistory) setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.log("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items))
        .catch(error => console.log("Gagal menyimpan barang:", error));
    }
  }, [items, loading]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history))
        .catch(error => console.log("Gagal menyimpan riwayat:", error));
    }
  }, [history, loading]);

  const addItem = async (data: ShoppingItemInput) => {
    const newItem: ShoppingItem = {
      ...data,
      id: Date.now().toString(),
      isPurchased: false,
    };

    setItems(prev => [...prev, newItem]);
  };

  const updateItem = async (
    id: string,
    data: ShoppingItemInput
  ) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...data } : item
      )
    );
  };

  const deleteItem = async (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const togglePurchased = async (id: string) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    if (!item.isPurchased) {
      const purchasedItem: ShoppingHistoryItem = {
        ...item,
        isPurchased: true,
        historyId: `${id}-${Date.now()}`,
        purchasedAt: new Date().toISOString(),
      };

      setHistory(prev => [purchasedItem, ...prev]);
    } else {
      setHistory(prev =>
        prev.filter(entry =>
          !(entry.id === id && entry.isPurchased)
        )
      );
    }

    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isPurchased: !item.isPurchased }
          : item
      )
    );
  };

  const clearItems = async () => {
    setItems([]);
  };

  const clearHistory = async () => {
    setHistory([]);
  };

  return {
    items,
    history,
    loading,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased,
    clearItems,
    clearHistory,
  };
}
