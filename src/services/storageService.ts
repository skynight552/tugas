import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShoppingItem } from "@/types/shopping";

const STORAGE_KEY = "@belanjayuk/shopping-items";

export async function getStoredItems(): Promise<ShoppingItem[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) as ShoppingItem[] : [];
}

export async function saveStoredItems(items: ShoppingItem[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
