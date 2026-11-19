
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ShoppingHistoryItem } from "@/hooks/useShoppingItems";

type Props = {
  history: ShoppingHistoryItem[];
};

const rupiah = (value: number) =>
  "Rp" + value.toLocaleString("id-ID");

export function ExpenseChart({ history }: Props) {
  const grouped = history.reduce<Record<string, number>>(
    (result, item) => {
      const category = String(item.category);
      result[category] =
        (result[category] || 0) + item.price * item.quantity;
      return result;
    },
    {}
  );

  const data = Object.entries(grouped).sort(
    (a, b) => b[1] - a[1]
  );

  const total = data.reduce(
    (sum, item) => sum + item[1],
    0
  );

  const maxValue = Math.max(...data.map(item => item[1]), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Grafik Pengeluaran</Text>
      <Text style={styles.subtitle}>
        Pengeluaran berdasarkan kategori
      </Text>

      <Text style={styles.total}>{rupiah(total)}</Text>
      <Text style={styles.caption}>Total belanja tercatat</Text>

      {data.length === 0 ? (
        <Text style={styles.empty}>
          Belum ada data pengeluaran.
          Tandai barang sebagai sudah dibeli.
        </Text>
      ) : (
        data.map(([category, amount]) => (
          <View key={category} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.amount}>
                {rupiah(amount)}
              </Text>
            </View>

            <View style={styles.track}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(amount / maxValue) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))
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
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#245C43",
  },
  subtitle: {
    fontSize: 11,
    color: "#89958A",
    marginTop: 5,
  },
  total: {
    fontSize: 25,
    fontWeight: "900",
    color: "#245C43",
    marginTop: 18,
  },
  caption: {
    fontSize: 10,
    color: "#89958A",
    marginBottom: 18,
  },
  item: {
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  category: {
    fontSize: 12,
    fontWeight: "700",
    color: "#526052",
  },
  amount: {
    fontSize: 11,
    fontWeight: "700",
    color: "#245C43",
  },
  track: {
    height: 9,
    backgroundColor: "#EAECE5",
    borderRadius: 10,
    overflow: "hidden",
  },
  bar: {
    height: 9,
    backgroundColor: "#C36F43",
    borderRadius: 10,
  },
  empty: {
    color: "#89958A",
    fontSize: 12,
    marginTop: 20,
    textAlign: "center",
  },
});
    