import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ReceiptText } from "lucide-react-native";
import { colors } from "@/constants/theme";

const rupiah = (value: number) => "Rp" + value.toLocaleString("id-ID");

export function SummaryCard({ total, purchased, count }: { total: number; purchased: number; count: number }) {
  const progress = count ? purchased / count : 0;
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View>
          <Text style={styles.label}>RINGKASAN BELANJA</Text>
          <Text style={styles.total}>{rupiah(total)}</Text>
        </View>
        <View style={styles.icon}><ReceiptText color="#FFFFFF" size={21} /></View>
      </View>
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>{purchased} dari {count} barang sudah dibeli</Text>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={styles.track}><View style={[styles.fill, { width: `${progress * 100}%` }]} /></View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: colors.primary, borderRadius: 22, padding: 20 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { color: "#D6E9DC", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  total: { color: "#FFFFFF", fontSize: 27, fontWeight: "900", marginTop: 6 },
  icon: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#FFFFFF22", alignItems: "center", justifyContent: "center" },
  progressRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 19, marginBottom: 8 },
  progressText: { color: "#E1F0E5", fontSize: 10, fontWeight: "700" },
  track: { height: 6, borderRadius: 9, backgroundColor: "#FFFFFF40", overflow: "hidden" },
  fill: { height: 6, borderRadius: 9, backgroundColor: "#E8C47D" }
});
