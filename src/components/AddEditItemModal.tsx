import React, { useEffect, useState } from "react";
import {
  Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImagePlus, X } from "lucide-react-native";
import { categories, colors } from "@/constants/theme";
import { Category, ShoppingItem, ShoppingItemInput } from "@/types/shopping";

type Props = {
  visible: boolean;
  initialItem: ShoppingItem | null;
  onClose: () => void;
  onSave: (data: ShoppingItemInput) => void;
};

export function AddEditItemModal({ visible, initialItem, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Makanan");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();

  useEffect(() => {
    if (visible) {
      setName(initialItem?.name ?? "");
      setCategory(initialItem?.category ?? "Makanan");
      setQuantity(String(initialItem?.quantity ?? 1));
      setPrice(initialItem ? String(initialItem.price) : "");
      setNote(initialItem?.note ?? "");
      setImageUri(initialItem?.imageUri);
    }
  }, [visible, initialItem]);

  const chooseImage = async (useCamera: boolean) => {
    try {
      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return Alert.alert("Izin kamera diperlukan", "Aktifkan izin kamera di pengaturan perangkat.");
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
        if (!result.canceled) setImageUri(result.assets[0].uri);
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return Alert.alert("Izin galeri diperlukan", "Aktifkan izin galeri di pengaturan perangkat.");
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.7 });
        if (!result.canceled) setImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Gagal membuka gambar", "Silakan coba kembali.");
    }
  };

  const submit = () => {
    const cleanName = name.trim();
    const qty = Number(quantity);
    const amount = Number(price || 0);
    if (!cleanName) return Alert.alert("Nama barang wajib diisi", "Masukkan nama barang.");
    if (!Number.isInteger(qty) || qty < 1) return Alert.alert("Jumlah tidak valid", "Jumlah harus berupa angka minimal 1.");
    if (!Number.isFinite(amount) || amount < 0) return Alert.alert("Harga tidak valid", "Harga harus 0 atau lebih.");
    onSave({ name: cleanName, category, quantity: qty, price: amount, note: note.trim(), imageUri });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{initialItem ? "Edit barang" : "Tambah barang"}</Text>
            <Pressable onPress={onClose} style={styles.close}><X size={20} color={colors.muted} /></Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Nama barang</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Contoh: Beras 5 kg" style={styles.input} />
            <Text style={styles.label}>Kategori</Text>
            <View style={styles.chips}>
              {categories.map(value => <Pressable key={value} onPress={() => setCategory(value as Category)} style={[styles.chip, category === value && styles.chipActive]}>
                <Text style={[styles.chipText, category === value && styles.chipTextActive]}>{value}</Text>
              </Pressable>)}
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}><Text style={styles.label}>Jumlah</Text><TextInput value={quantity} onChangeText={setQuantity} keyboardType="number-pad" placeholder="1" style={styles.input} /></View>
              <View style={{ flex: 1 }}><Text style={styles.label}>Harga satuan (Rp)</Text><TextInput value={price} onChangeText={setPrice} keyboardType="number-pad" placeholder="0" style={styles.input} /></View>
            </View>
            <Text style={styles.label}>Catatan (opsional)</Text>
            <TextInput value={note} onChangeText={setNote} placeholder="Contoh: merek tertentu" style={styles.input} />
            <Text style={styles.label}>Foto barang (opsional)</Text>
            <View style={styles.photoRow}>
              <Pressable style={styles.photoButton} onPress={() => chooseImage(false)}><ImagePlus size={16} color={colors.primary} /><Text style={styles.photoText}>Galeri</Text></Pressable>
              <Pressable style={styles.photoButton} onPress={() => chooseImage(true)}><Camera size={16} color={colors.primary} /><Text style={styles.photoText}>Kamera</Text></Pressable>
            </View>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
            <Pressable style={styles.save} onPress={submit}><Text style={styles.saveText}>{initialItem ? "Simpan perubahan" : "Simpan barang"}</Text></Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "#00000066", justifyContent: "flex-end" },
  sheet: { maxHeight: "92%", backgroundColor: "#FFFFFF", borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 22, paddingBottom: 28 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 20, fontWeight: "900", color: colors.heading },
  close: { padding: 5 },
  label: { fontSize: 12, fontWeight: "800", color: "#53665A", marginBottom: 8, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#E3EAE2", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#263B2D", backgroundColor: "#FBFCFA" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: "#F0F3EF" },
  chipActive: { backgroundColor: "#DCEBDD" },
  chipText: { fontSize: 11, color: "#728076", fontWeight: "700" },
  chipTextActive: { color: colors.primary },
  row: { flexDirection: "row", gap: 12, marginTop: 4 },
  photoRow: { flexDirection: "row", gap: 9 },
  photoButton: { flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderColor: "#DCE8DE", backgroundColor: "#F5F9F4", padding: 11, borderRadius: 11 },
  photoText: { color: colors.primary, fontSize: 11, fontWeight: "800" },
  preview: { width: 90, height: 90, borderRadius: 12, marginTop: 10 },
  save: { backgroundColor: colors.primary, padding: 15, borderRadius: 13, alignItems: "center", marginTop: 22 },
  saveText: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 }
});
