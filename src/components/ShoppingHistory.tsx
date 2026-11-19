
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import { ShoppingHistoryItem } from "@/hooks/useShoppingItems";

type Props = {
  history: ShoppingHistoryItem[];
};

const rupiah = (value: number) =>
  "Rp" + value.toLocaleString("id-ID");

export function ShoppingHistory({ history }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Riwayat Belanja</Text>
          <Text style={styles.subtitle}>
            Daftar barang yang sudah dibeli
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {history.length} transaksi
          </Text>
        </View>
      </View>

      {history.length === 0 ? (
        <Text style={styles.empty}>
          Belum ada riwayat belanja.
        </Text>
      ) : (
        <ScrollView
          nestedScrollEnabled
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
        >
          {history.map(item => (
            <View key={item.historyId} style={styles.item}>
              <View style={styles.itemLeft}>
                <Text style={styles.name}>
                  {item.name}
                </Text>

                <Text style={styles.detail}>
                  {item.category} • {item.quantity} barang
                </Text>

                <Text style={styles.date}>
                  {new Date(item.purchasedAt).toLocaleString(
                    "id-ID",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }
                  )}
                </Text>
              </View>

              <Text style={styles.price}>
                {rupiah(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#EAECE5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#245C43",
  },
  subtitle: {
    fontSize: 10,
    color: "#89958A",
    marginTop: 5,
  },
  badge: {
    backgroundColor: "#E8F0E5",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },
  badgeText: {
    color: "#386B4E",
    fontSize: 10,
    fontWeight: "800",
  },
  empty: {
    textAlign: "center",
    padding: 25,
    color: "#89958A",
    fontSize: 12,
  },
  historyList: {
    maxHeight: 360,
    marginTop: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0EA",
    gap: 8,
  },
  itemLeft: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: "800",
    color: "#344B3A",
  },
  detail: {
    fontSize: 10,
    color: "#89958A",
    marginTop: 4,
  },
  date: {
    fontSize: 9,
    color: "#A0A79C",
    marginTop: 5,
  },
  price: {
    fontSize: 12,
    fontWeight: "900",
    color: "#C36F43",
  },
});
