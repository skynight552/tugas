import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Plus, ShoppingBag } from "lucide-react-native";
import { colors } from "@/constants/theme";

export function EmptyState({ filtered, onAdd }: { filtered: boolean; onAdd: () => void }) {
  return (
    <View style={styles.box}>
      <ShoppingBag size={38} color="#9BA99E" />
      <Text style={styles.title}>{filtered ? "Tidak ada barang di kategori ini" : "Daftar belanjamu masih kosong"}</Text>
      <Text style={styles.text}>Catat kebutuhan rumah atau kos agar belanja lebih teratur.</Text>
      {!filtered && <Pressable onPress={onAdd} style={styles.button}><Plus size={15} color="#FFFFFF" /><Text style={styles.buttonText}>Tambah barang pertama</Text></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, padding: 27, borderWidth: 1, borderColor: colors.border },
  title: { fontWeight: "800", color: "#33483A", fontSize: 14, marginTop: 12, textAlign: "center" },
  text: { fontSize: 11, color: "#8A968D", textAlign: "center", marginTop: 6, lineHeight: 17 },
  button: { flexDirection: "row", gap: 6, alignItems: "center", backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 11, marginTop: 15 },
  buttonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" }
});
