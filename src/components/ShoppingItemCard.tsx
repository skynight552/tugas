import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Check, Pencil, Trash2 } from "lucide-react-native";
import { colors } from "@/constants/theme";
import { ShoppingItem } from "@/types/shopping";

const rupiah = (value: number) => "Rp" + value.toLocaleString("id-ID");
const categoryColor: Record<string, string> = {
  Makanan: "#EAF0E3", Minuman: "#E8EFF4", Kebersihan: "#F4EDE4", Lainnya: "#EEEAF3"
};

type Props = { item: ShoppingItem; onToggle: () => void; onEdit: () => void; onDelete: () => void; };

export function ShoppingItemCard({ item, onToggle, onEdit, onDelete }: Props) {
  return (
    <View style={[styles.card, item.isPurchased && styles.done]}>
      <Pressable style={[styles.checkbox, item.isPurchased && styles.checked]} onPress={onToggle} accessibilityLabel={item.isPurchased ? "Tandai belum dibeli" : "Tandai sudah dibeli"}>
        {item.isPurchased && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
      </Pressable>
      {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.image} /> : (
        <View style={[styles.imagePlaceholder, { backgroundColor: categoryColor[item.category] || "#EAF0E3" }]}>
          <Text style={styles.placeholderEmoji}>{item.category === "Makanan" ? "🥑" : item.category === "Minuman" ? "🥛" : item.category === "Kebersihan" ? "🧼" : "🛍️"}</Text>
        </View>
      )}
      <Pressable style={styles.info} onPress={onEdit}>
        <View style={styles.nameLine}>
          <Text style={[styles.name, item.isPurchased && styles.strike]} numberOfLines={1}>{item.name}</Text>
          {item.isPurchased ? <Text style={styles.doneLabel}>SELESAI</Text> : null}
        </View>
        <Text style={styles.meta}>{item.category}  ·  {item.quantity} {item.quantity === 1 ? "item" : "item"}</Text>
        <Text style={styles.price}>{rupiah(item.price * item.quantity)}</Text>
        {item.note ? <Text style={styles.note} numberOfLines={1}>{item.note}</Text> : null}
      </Pressable>
      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.action} accessibilityLabel="Edit barang"><Pencil size={14} color={colors.primary} /></Pressable>
        <Pressable onPress={onDelete} style={[styles.action, styles.deleteAction]} accessibilityLabel="Hapus barang"><Trash2 size={14} color={colors.danger} /></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderRadius: 17, padding: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E9EBE3" },
  done: { backgroundColor: "#F3F5F0", opacity: 0.78 },
  checkbox: { width: 23, height: 23, borderRadius: 8, borderWidth: 1.5, borderColor: "#A7B4A6", alignItems: "center", justifyContent: "center", marginRight: 10 },
  checked: { backgroundColor: colors.primary, borderColor: colors.primary },
  image: { width: 47, height: 47, borderRadius: 13, marginRight: 11 },
  imagePlaceholder: { width: 47, height: 47, borderRadius: 13, marginRight: 11, alignItems: "center", justifyContent: "center" },
  placeholderEmoji: { fontSize: 22 },
  info: { flex: 1, minWidth: 0 },
  nameLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 13, fontWeight: "800", color: "#263B2D", flexShrink: 1 },
  strike: { textDecorationLine: "line-through", color: "#89958B" },
  doneLabel: { color: "#568062", backgroundColor: "#E3EEE2", fontSize: 7, fontWeight: "900", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5 },
  meta: { fontSize: 9, color: "#929C91", marginTop: 4 },
  price: { fontSize: 11, fontWeight: "900", color: colors.primary, marginTop: 5 },
  note: { fontSize: 9, color: colors.muted, marginTop: 3 },
  actions: { gap: 5, marginLeft: 7 },
  action: { width: 29, height: 29, borderRadius: 9, backgroundColor: "#EFF3ED", alignItems: "center", justifyContent: "center" },
  deleteAction: { backgroundColor: "#F8EFEC" }
});
