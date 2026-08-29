import { supabase } from "@/integrations/supabase/client";

/**
 * Generates sequential continuous reference number.
 * Format: VTU2026MSD001, VTU2026MSD002, VTU2026MSD003 ...
 */
export async function generateSequentialReferenceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `VTU${currentYear}MSD`;

  try {
    // Count existing registrations in Supabase
    const { count, error } = await supabase
      .from("vtu_minority_registrations")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error getting count for reference number:", error);
      const fallbackSeq = Math.floor(100 + Math.random() * 900);
      return `${prefix}${String(fallbackSeq).padStart(3, "0")}`;
    }

    const nextSeq = (count || 0) + 1;
    // Format to 3 or more digits: 001, 002, 003 ... 010 ... 100
    const formattedSeq = String(nextSeq).padStart(3, "0");
    return `${prefix}${formattedSeq}`;
  } catch (e) {
    console.error(e);
    const fallbackSeq = Math.floor(100 + Math.random() * 900);
    return `${prefix}${String(fallbackSeq).padStart(3, "0")}`;
  }
}
