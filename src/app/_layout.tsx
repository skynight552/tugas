import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#F5F7F2" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
