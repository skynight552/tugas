import { AddEditItemModal } from "@/components/AddEditItemModal";
import { EmptyState } from "@/components/EmptyState";
import { ExpenseChart } from "@/components/ExpenseChart";
import { ShoppingHistory } from "@/components/ShoppingHistory";
import { ShoppingItemCard } from "@/components/ShoppingItemCard";
import { categories, colors } from "@/constants/theme";
import { useShoppingItems } from "@/hooks/useShoppingItems";
import { Category, ShoppingItem, ShoppingItemInput } from "@/types/shopping";
import { MapPin, Plus, Search, ShoppingBasket, Sparkles, Trash2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

type Filter = "Semua" | "Belum dibeli" | "Sudah dibeli";
const rupiah = (value: number) => "Rp" + value.toLocaleString("id-ID");

export default function HomeScreen() {
  const {
  items,
  loading,
  addItem,
  updateItem,
  deleteItem,
  togglePurchased,
  clearItems,
  history = [],
  clearHistory,
} = useShoppingItems();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [filter, setFilter] = useState<Filter>("Semua");
  const [categoryFilter, setCategoryFilter] = useState<Category | "Semua kategori">("Semua kategori");
  const [search, setSearch] = useState("");
  const [locationLabel, setLocationLabel] = useState("");

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const purchasedTotal = useMemo(() => items.filter(item => item.isPurchased).reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const purchasedCount = items.filter(item => item.isPurchased).length;
  const remainingCount = items.length - purchasedCount;
  const progress = items.length ? purchasedCount / items.length : 0;

  const visibleItems = items.filter(item => {
    const matchesStatus = filter === "Semua" || (filter === "Sudah dibeli" ? item.isPurchased : !item.isPurchased);
    const matchesCategory = categoryFilter === "Semua kategori" || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const openAdd = () => { setEditingItem(null); setModalVisible(true); };
  const openEdit = (item: ShoppingItem) => { setEditingItem(item); setModalVisible(true); };

  const handleSave = async (data: ShoppingItemInput) => {
    if (editingItem) await updateItem(editingItem.id, data);
    else await addItem(data);
    setModalVisible(false);
    setEditingItem(null);
  };

const handleDelete = (item: ShoppingItem) => {
  const removeItem = () => {
    void deleteItem(item.id);
  };

  if (Platform.OS === "web") {
    const confirmed = window.confirm(
      `Hapus "${item.name}" dari daftar belanja?`
    );

    if (confirmed) {
      removeItem();
    }

    return;
  }

  Alert.alert(
    "Hapus barang?",
    `Hapus "${item.name}" dari daftar belanja?`,
    [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: removeItem
      }
    ]
  );
};

const handleClear = () => {
  const removeAll = () => {
    void clearItems();
  };

  if (Platform.OS === "web") {
    const confirmed = window.confirm(
      "Semua barang belanja akan dihapus. Lanjutkan?"
    );

    if (confirmed) {
      removeAll();
    }

    return;
  }

  Alert.alert(
    "Kosongkan daftar?",
    "Semua barang belanja akan dihapus.",
    [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus semua",
        style: "destructive",
        onPress: removeAll
      }
    ]
  );
};




  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.topline}>
          <View style={styles.brandMark}><ShoppingBasket size={21} color={colors.primary} /></View>
          <View style={styles.brandText}>
            <Text style={styles.brand}>Belanja APA?</Text>
            <Text style={styles.brandCaption}>Bingung mau belanja apa aja?</Text>
          </View>
        </View>

        <View style={styles.greeting}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingKicker}>Mari list belanjaan anda, belanja lebih tenang</Text>
            <Text style={styles.greetingTitle}>Halo, apa yang{'\n'}perlu dibeli?</Text>
            <Text style={styles.greetingBody}>Susun kebutuhanmu sebelum berangkat,{'\n'}biar ga bingung pas ditempat.</Text>
          </View>

        </View>

        <View style={styles.budgetCard}>
          <View style={styles.budgetTop}>
            <View>
              <Text style={styles.cardEyebrow}>ESTIMASI PENGELUARAN</Text>
              <Text style={styles.total}>{rupiah(total)}</Text>
            </View>
            <View style={styles.budgetIcon}><ShoppingBasket color="#F8F5E9" size={22} /></View>
          </View>
          <View style={styles.budgetDivider} />
          <View style={styles.budgetBottom}>
            <View style={styles.budgetMetric}>
              <Text style={styles.metricValue}>{purchasedCount}/{items.length}</Text>
              <Text style={styles.metricLabel}>barang dibeli</Text>
            </View>
            <View style={styles.budgetMetricRight}>
              <Text style={styles.metricValue}>{rupiah(purchasedTotal)}</Text>
              <Text style={styles.metricLabel}>sudah dikeluarkan</Text>
            </View>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
          <Text style={styles.progressCaption}>{remainingCount === 0 && items.length > 0 ? "Semua kebutuhanmu sudah masuk keranjang" : `${remainingCount} barang lagi menunggu masuk keranjang`}</Text>
        </View>

        <View style={styles.quickStats}>
          <View style={styles.statTile}>
            <View style={[styles.statIcon, { backgroundColor: "#E8F0E5" }]}><ShoppingBasket size={16} color="#386B4E" /></View>
            <Text style={styles.statNumber}>{items.length}</Text>
            <Text style={styles.statLabel}>Total barang</Text>
          </View>
          <View style={styles.statTile}>
            <View style={[styles.statIcon, { backgroundColor: "#F8EBDD" }]}><Sparkles size={16} color="#B4773F" /></View>
            <Text style={styles.statNumber}>{remainingCount}</Text>
            <Text style={styles.statLabel}>Belum dibeli</Text>
          </View>
          <View style={styles.statTile}>
            <View style={[styles.statIcon, { backgroundColor: "#E7EEF2" }]}><MapPin size={16} color="#55788A" /></View>
            <Text style={styles.statNumber}>{purchasedCount}</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <View>
            <Text style={styles.sectionTitle}>Daftar belanjaan</Text>
          </View>
          <Pressable onPress={openAdd} style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] }]}>
            <Plus size={17} color="#FFFFFF" /><Text style={styles.addButtonText}>Tambah barang</Text>
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <Search size={17} color="#8B958A" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Cari barang di daftar..." placeholderTextColor="#9AA39A" style={styles.searchInput} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {(["Semua", "Belum dibeli", "Sudah dibeli"] as Filter[]).map(value => (
            <Pressable key={value} onPress={() => setFilter(value)} style={[styles.filter, filter === value && styles.filterActive]}>
              <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>{value}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {(["Semua kategori", ...categories] as (Category | "Semua kategori")[]).map(value => (
            <Pressable key={value} onPress={() => setCategoryFilter(value)} style={[styles.categoryChip, categoryFilter === value && styles.categoryChipActive]}>
              <Text style={[styles.categoryChipText, categoryFilter === value && styles.categoryChipTextActive]}>{value}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.loading}><ActivityIndicator color={colors.primary} size="large" /><Text style={styles.loadingText}>Menyiapkan daftar belanjamu...</Text></View>
        ) : visibleItems.length > 0 ? (
          <View style={styles.list}>
            {visibleItems.map(item => (
              <ShoppingItemCard key={item.id} item={item} onToggle={() => togglePurchased(item.id)}
                onEdit={() => openEdit(item)} onDelete={() => handleDelete(item)} />
            ))}
          </View>
        ) : <EmptyState filtered={items.length > 0} onAdd={openAdd} />}
<ExpenseChart history={history} />

<ShoppingHistory history={history} />

{history.length > 0 && (
  <Pressable
    style={styles.clearButton}
    onPress={() => {
      if (Platform.OS === "web") {
        if (window.confirm("Hapus seluruh riwayat belanja?")) {
          void clearHistory();
        }
      } else {
        Alert.alert(
          "Hapus riwayat?",
          "Seluruh riwayat belanja akan dihapus.",
          [
            { text: "Batal", style: "cancel" },
            {
              text: "Hapus",
              style: "destructive",
              onPress: () => void clearHistory(),
            },
          ]
        );
      }
    }}
  >
    <Trash2 size={14} color={colors.danger} />
    <Text style={styles.clearText}>
      Hapus riwayat belanja
    </Text>
  </Pressable>
)}

        {items.length > 0 && (
          <Pressable style={styles.clearButton} onPress={handleClear}>
            <Trash2 size={14} color={colors.danger} /><Text style={styles.clearText}>Kosongkan daftar</Text>
          </Pressable>
        )}
      </ScrollView>

      <AddEditItemModal visible={modalVisible} initialItem={editingItem}
        onClose={() => { setModalVisible(false); setEditingItem(null); }} onSave={handleSave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 38, maxWidth: 720, width: "100%", alignSelf: "center" },
  topline: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  brandMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#E4EDE1", alignItems: "center", justifyContent: "center" },
  brandText: { marginLeft: 10, flex: 1 },
  brand: { color: colors.heading, fontSize: 18, fontWeight: "900", letterSpacing: -0.5 },
  brandCaption: { color: "#89958A", fontSize: 8, fontWeight: "800", letterSpacing: 1.5, marginTop: 2 },
  monthPill: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, backgroundColor: "#EFEDE3" },
  monthText: { color: "#7C806D", fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  greeting: { flexDirection: "row", alignItems: "center", marginBottom: 22 },
  greetingKicker: { color: "#9B795A", fontSize: 10, fontWeight: "800", letterSpacing: 0.4, marginBottom: 8 },
  greetingTitle: { color: colors.heading, fontSize: 29, lineHeight: 34, fontWeight: "900", letterSpacing: -1 },
  greetingBody: { color: colors.muted, fontSize: 12, marginTop: 7 },
  illustration: { width: 94, height: 94, borderRadius: 32, backgroundColor: "#E8EBDD", alignItems: "center", justifyContent: "center", transform: [{ rotate: "5deg" }] },
  illustrationEmoji: { fontSize: 43 },
  illustrationDot: { position: "absolute", width: 12, height: 12, borderRadius: 6, backgroundColor: "#D9A35D", right: 12, top: 13 },
  budgetCard: { backgroundColor: "#245C43", borderRadius: 25, padding: 20, overflow: "hidden" },
  budgetTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardEyebrow: { color: "#C7D8C9", fontSize: 9, fontWeight: "800", letterSpacing: 1.2 },
  total: { color: "#FFFDF5", fontSize: 27, fontWeight: "900", letterSpacing: -0.8, marginTop: 5 },
  budgetIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: "#FFFFFF20", alignItems: "center", justifyContent: "center" },
  budgetDivider: { height: 1, backgroundColor: "#FFFFFF25", marginVertical: 17 },
  budgetBottom: { flexDirection: "row", justifyContent: "space-between" },
  budgetMetric: { flex: 1 },
  budgetMetricRight: { flex: 1, alignItems: "flex-end" },
  metricValue: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  metricLabel: { color: "#C6D8CB", fontSize: 9, marginTop: 3 },
  progressTrack: { height: 6, backgroundColor: "#FFFFFF35", borderRadius: 8, overflow: "hidden", marginTop: 16 },
  progressFill: { height: 6, borderRadius: 8, backgroundColor: "#E8C47D" },
  progressCaption: { color: "#D5E2D6", fontSize: 10, marginTop: 9 },
  quickStats: { flexDirection: "row", gap: 9, marginTop: 13 },
  statTile: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 17, padding: 12, borderWidth: 1, borderColor: "#EAECE5" },
  statIcon: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statNumber: { color: colors.heading, fontSize: 18, fontWeight: "900" },
  statLabel: { color: colors.muted, fontSize: 9, marginTop: 2 },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 30, marginBottom: 14, gap: 8 },
  sectionTitle: { color: colors.heading, fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  sectionSub: { color: colors.muted, fontSize: 10, marginTop: 3 },
  addButton: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#C36F43", paddingHorizontal: 13, paddingVertical: 11, borderRadius: 13 },
  addButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 10 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8EAE2", borderRadius: 14, paddingHorizontal: 13, height: 46 },
  searchInput: { flex: 1, color: colors.heading, fontSize: 12, paddingVertical: 0, outlineStyle: "none" as any },
  filterRow: { gap: 8, paddingVertical: 14 },
  filter: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#EAECE5" },
  filterActive: { backgroundColor: "#245C43" },
  filterText: { fontSize: 10, fontWeight: "700", color: "#7E8B80" },
  filterTextActive: { color: "#FFFFFF" },
  categoryRow: { gap: 7, paddingBottom: 13 },
  categoryChip: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 9, borderWidth: 1, borderColor: "#E3E7DE", backgroundColor: "#F8F8F3" },
  categoryChipActive: { borderColor: "#B7C9B5", backgroundColor: "#E6EEE2" },
  categoryChipText: { color: "#8A958A", fontSize: 9, fontWeight: "700" },
  categoryChipTextActive: { color: "#315D43" },
  list: { gap: 9 },
  loading: { alignItems: "center", padding: 40, gap: 10 },
  loadingText: { color: colors.muted, fontSize: 11 },
  locationButton: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "#E8EEE4", padding: 13, borderRadius: 15, marginTop: 20 },
  locationIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#D9E5D6", alignItems: "center", justifyContent: "center" },
  locationTitle: { color: colors.heading, fontSize: 11, fontWeight: "800" },
  locationText: { color: "#829084", fontSize: 9, marginTop: 3 },
  locationArrow: { color: colors.primary, fontSize: 24, marginHorizontal: 5 },
  clearButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: 15 },
  clearText: { color: colors.danger, fontSize: 10, fontWeight: "700" },
  footer: { textAlign: "center", color: "#A0A79C", fontSize: 9, marginTop: 8 }
});
