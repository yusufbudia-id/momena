/**
 * Bentuk standar return value untuk semua Server Action di aplikasi.
 * Dipakai lintas fitur — jangan buat versi lokal per fitur.
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
