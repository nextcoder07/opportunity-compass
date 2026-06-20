export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string | null
          created_at: string
          id: string
          item_id: string
          item_type: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      careers: {
        Row: {
          academic_path: string | null
          ai_impact: string | null
          created_at: string
          entrance_exams: string[] | null
          future_scope: string | null
          id: string
          image_url: string | null
          name: string
          overview: string | null
          roadmap: Json | null
          salary_range: string | null
          skills: string[] | null
          slug: string
          tags: string[] | null
          top_recruiters: string[] | null
        }
        Insert: {
          academic_path?: string | null
          ai_impact?: string | null
          created_at?: string
          entrance_exams?: string[] | null
          future_scope?: string | null
          id?: string
          image_url?: string | null
          name: string
          overview?: string | null
          roadmap?: Json | null
          salary_range?: string | null
          skills?: string[] | null
          slug: string
          tags?: string[] | null
          top_recruiters?: string[] | null
        }
        Update: {
          academic_path?: string | null
          ai_impact?: string | null
          created_at?: string
          entrance_exams?: string[] | null
          future_scope?: string | null
          id?: string
          image_url?: string | null
          name?: string
          overview?: string | null
          roadmap?: Json | null
          salary_range?: string | null
          skills?: string[] | null
          slug?: string
          tags?: string[] | null
          top_recruiters?: string[] | null
        }
        Relationships: []
      }
      competitions: {
        Row: {
          apply_url: string | null
          category: string | null
          created_at: string
          deadline: string | null
          domain: string | null
          education_level: string | null
          id: string
          image_url: string | null
          mode: string | null
          name: string
          organizer: string | null
          prize: string | null
          tags: string[] | null
        }
        Insert: {
          apply_url?: string | null
          category?: string | null
          created_at?: string
          deadline?: string | null
          domain?: string | null
          education_level?: string | null
          id?: string
          image_url?: string | null
          mode?: string | null
          name: string
          organizer?: string | null
          prize?: string | null
          tags?: string[] | null
        }
        Update: {
          apply_url?: string | null
          category?: string | null
          created_at?: string
          deadline?: string | null
          domain?: string | null
          education_level?: string | null
          id?: string
          image_url?: string | null
          mode?: string | null
          name?: string
          organizer?: string | null
          prize?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          certification: boolean | null
          created_at: string
          description: string | null
          duration: string | null
          education_level: string | null
          free: boolean | null
          id: string
          image_url: string | null
          name: string
          provider: string | null
          subject: string | null
          tags: string[] | null
          url: string | null
        }
        Insert: {
          certification?: boolean | null
          created_at?: string
          description?: string | null
          duration?: string | null
          education_level?: string | null
          free?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          provider?: string | null
          subject?: string | null
          tags?: string[] | null
          url?: string | null
        }
        Update: {
          certification?: boolean | null
          created_at?: string
          description?: string | null
          duration?: string | null
          education_level?: string | null
          free?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          provider?: string | null
          subject?: string | null
          tags?: string[] | null
          url?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string
          id: string
          mime_type: string | null
          name: string
          size_bytes: number
          storage_path: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          mime_type?: string | null
          name: string
          size_bytes?: number
          storage_path: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          mime_type?: string | null
          name?: string
          size_bytes?: number
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      internships: {
        Row: {
          apply_url: string | null
          company: string
          created_at: string
          deadline: string | null
          domain: string | null
          duration: string | null
          id: string
          location: string | null
          logo_url: string | null
          mode: string | null
          paid: boolean | null
          source: string | null
          stipend: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          apply_url?: string | null
          company: string
          created_at?: string
          deadline?: string | null
          domain?: string | null
          duration?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          mode?: string | null
          paid?: boolean | null
          source?: string | null
          stipend?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          apply_url?: string | null
          company?: string
          created_at?: string
          deadline?: string | null
          domain?: string | null
          duration?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          mode?: string | null
          paid?: boolean | null
          source?: string | null
          stipend?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      loans: {
        Row: {
          apply_url: string | null
          bank: string
          bank_type: string | null
          collateral: string | null
          created_at: string
          eligibility: string | null
          id: string
          image_url: string | null
          interest_rate: string | null
          max_amount: string | null
          moratorium: string | null
          name: string
          repayment: string | null
        }
        Insert: {
          apply_url?: string | null
          bank: string
          bank_type?: string | null
          collateral?: string | null
          created_at?: string
          eligibility?: string | null
          id?: string
          image_url?: string | null
          interest_rate?: string | null
          max_amount?: string | null
          moratorium?: string | null
          name: string
          repayment?: string | null
        }
        Update: {
          apply_url?: string | null
          bank?: string
          bank_type?: string | null
          collateral?: string | null
          created_at?: string
          eligibility?: string | null
          id?: string
          image_url?: string | null
          interest_rate?: string | null
          max_amount?: string | null
          moratorium?: string | null
          name?: string
          repayment?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string | null
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string | null
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string | null
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch: string | null
          career_interests: string[] | null
          category: string | null
          created_at: string
          degree: string | null
          district: string | null
          education_level: string | null
          full_name: string | null
          gender: string | null
          id: string
          income_range: string | null
          onboarded: boolean
          state: string | null
          stream: string | null
          updated_at: string
          year_or_semester: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch?: string | null
          career_interests?: string[] | null
          category?: string | null
          created_at?: string
          degree?: string | null
          district?: string | null
          education_level?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          income_range?: string | null
          onboarded?: boolean
          state?: string | null
          stream?: string | null
          updated_at?: string
          year_or_semester?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch?: string | null
          career_interests?: string[] | null
          category?: string | null
          created_at?: string
          degree?: string | null
          district?: string | null
          education_level?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          income_range?: string | null
          onboarded?: boolean
          state?: string | null
          stream?: string | null
          updated_at?: string
          year_or_semester?: string | null
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
      schemes: {
        Row: {
          benefits: string | null
          categories: string[] | null
          created_at: string
          documents_required: string[] | null
          eligibility: string | null
          gender: string | null
          id: string
          image_url: string | null
          name: string
          official_url: string | null
          provider: string | null
          scheme_type: string | null
          state: string | null
          tags: string[] | null
          target_group: string | null
          updated_at: string
        }
        Insert: {
          benefits?: string | null
          categories?: string[] | null
          created_at?: string
          documents_required?: string[] | null
          eligibility?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          name: string
          official_url?: string | null
          provider?: string | null
          scheme_type?: string | null
          state?: string | null
          tags?: string[] | null
          target_group?: string | null
          updated_at?: string
        }
        Update: {
          benefits?: string | null
          categories?: string[] | null
          created_at?: string
          documents_required?: string[] | null
          eligibility?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          name?: string
          official_url?: string | null
          provider?: string | null
          scheme_type?: string | null
          state?: string | null
          tags?: string[] | null
          target_group?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          amount: string | null
          apply_url: string | null
          categories: string[] | null
          created_at: string
          deadline: string | null
          description: string | null
          education_levels: string[] | null
          fields: string[] | null
          gender: string | null
          id: string
          image_url: string | null
          income_max: number | null
          name: string
          popularity: number | null
          provider: string
          scope: string | null
          source_type: string | null
          state: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          amount?: string | null
          apply_url?: string | null
          categories?: string[] | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          education_levels?: string[] | null
          fields?: string[] | null
          gender?: string | null
          id?: string
          image_url?: string | null
          income_max?: number | null
          name: string
          popularity?: number | null
          provider: string
          scope?: string | null
          source_type?: string | null
          state?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          amount?: string | null
          apply_url?: string | null
          categories?: string[] | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          education_levels?: string[] | null
          fields?: string[] | null
          gender?: string | null
          id?: string
          image_url?: string | null
          income_max?: number | null
          name?: string
          popularity?: number | null
          provider?: string
          scope?: string | null
          source_type?: string | null
          state?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          email_notifications: boolean | null
          preferred_filters: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          email_notifications?: boolean | null
          preferred_filters?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          email_notifications?: boolean | null
          preferred_filters?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
