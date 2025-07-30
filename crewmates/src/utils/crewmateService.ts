import { supabase } from "./supabase";
import { Crewmate, CrewmateFormData } from "../types/crewmate";

export const crewmateService = {
  // Get all crewmates (sorted by creation date, newest first)
  async getAllCrewmates(): Promise<Crewmate[]> {
    const { data, error } = await supabase
      .from("crewmates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching crewmates:", error);
      throw new Error("Failed to fetch crewmates");
    }

    return data || [];
  },

  // Get a single crewmate by ID
  async getCrewmateById(id: string): Promise<Crewmate | null> {
    const { data, error } = await supabase
      .from("crewmates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Error fetching crewmate:", error);
      throw new Error("Failed to fetch crewmate");
    }

    return data;
  },

  // Create a new crewmate
  async createCrewmate(crewmateData: CrewmateFormData): Promise<Crewmate> {
    const { data, error } = await supabase
      .from("crewmates")
      .insert([crewmateData])
      .select()
      .single();

    if (error) {
      console.error("Error creating crewmate:", error);
      throw new Error("Failed to create crewmate");
    }

    return data;
  },

  // Update an existing crewmate
  async updateCrewmate(
    id: string,
    crewmateData: Partial<CrewmateFormData>
  ): Promise<Crewmate> {
    const { data, error } = await supabase
      .from("crewmates")
      .update({ ...crewmateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating crewmate:", error);
      throw new Error("Failed to update crewmate");
    }

    return data;
  },

  // Delete a crewmate
  async deleteCrewmate(id: string): Promise<void> {
    const { error } = await supabase.from("crewmates").delete().eq("id", id);

    if (error) {
      console.error("Error deleting crewmate:", error);
      throw new Error("Failed to delete crewmate");
    }
  },

  // Get statistics (for stretch features)
  async getCrewmateStats(): Promise<{
    total: number;
    colorDistribution: Record<string, number>;
    categoryDistribution?: Record<string, number>;
  }> {
    const { data, error } = await supabase
      .from("crewmates")
      .select("color, category");

    if (error) {
      console.error("Error fetching stats:", error);
      throw new Error("Failed to fetch statistics");
    }

    const total = data?.length || 0;
    const colorDistribution: Record<string, number> = {};
    const categoryDistribution: Record<string, number> = {};

    data?.forEach((crewmate) => {
      // Count colors
      colorDistribution[crewmate.color] =
        (colorDistribution[crewmate.color] || 0) + 1;

      // Count categories (if exists)
      if (crewmate.category) {
        categoryDistribution[crewmate.category] =
          (categoryDistribution[crewmate.category] || 0) + 1;
      }
    });

    return {
      total,
      colorDistribution,
      categoryDistribution:
        Object.keys(categoryDistribution).length > 0
          ? categoryDistribution
          : undefined,
    };
  },

  // Phase 4: Toggle favorite status
  async toggleFavorite(id: string): Promise<Crewmate> {
    // First get the current crewmate
    const current = await this.getCrewmateById(id);
    if (!current) {
      throw new Error("Crewmate not found");
    }

    // Toggle the favorite status
    const { data, error } = await supabase
      .from("crewmates")
      .update({ is_favorite: !current.is_favorite })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling favorite:", error);
      throw new Error("Failed to toggle favorite");
    }

    return data;
  },

  // Phase 4: Bulk delete crewmates
  async bulkDelete(ids: string[]): Promise<void> {
    const { error } = await supabase.from("crewmates").delete().in("id", ids);

    if (error) {
      console.error("Error bulk deleting crewmates:", error);
      throw new Error("Failed to delete crewmates");
    }
  },
};
