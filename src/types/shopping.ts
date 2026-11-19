export type Category = "Makanan" | "Minuman" | "Kebersihan" | "Lainnya";

export type ShoppingItem = {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  price: number;
  note: string;
  imageUri?: string;
  isPurchased: boolean;
  createdAt: string;
};

export type ShoppingItemInput = Omit<ShoppingItem, "id" | "isPurchased" | "createdAt">;
