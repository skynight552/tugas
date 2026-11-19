
import { Platform } from "react-native";
import * as Location from "expo-location";

export async function getCurrentLocation() {
  // Khusus browser
  if (Platform.OS === "web") {
    if (!navigator.geolocation) {
      throw new Error("Browser tidak mendukung fitur lokasi.");
    }

    return new Promise<{
      latitude: number;
      longitude: number;
    }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let message = "Gagal mendapatkan lokasi.";

          if (error.code === 1) {
            message = "Izin lokasi ditolak. Izinkan akses lokasi melalui pengaturan browser.";
          } else if (error.code === 2) {
            message = "Lokasi tidak tersedia. Periksa GPS atau koneksi internet.";
          } else if (error.code === 3) {
            message = "Waktu mendapatkan lokasi habis. Coba lagi.";
          }

          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }
      );
    });
  }

  // Khusus Android dan iOS
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== "granted") {
    throw new Error("Izin lokasi ditolak. Aktifkan izin lokasi aplikasi.");
  }

  const result = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return result.coords;
}
