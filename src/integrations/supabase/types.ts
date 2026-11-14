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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      galeri: {
        Row: {
          created_at: string
          gambar_url: string
          id: string
          judul: string
          keterangan: string
          updated_at: string
          urutan: number
        }
        Insert: {
          created_at?: string
          gambar_url?: string
          id?: string
          judul: string
          keterangan?: string
          updated_at?: string
          urutan?: number
        }
        Update: {
          created_at?: string
          gambar_url?: string
          id?: string
          judul?: string
          keterangan?: string
          updated_at?: string
          urutan?: number
        }
        Relationships: []
      }
      konten_religi: {
        Row: {
          created_at: string
          id: string
          isi: string
          judul: string
          slug: string
          updated_at: string
          urutan: number
        }
        Insert: {
          created_at?: string
          id?: string
          isi?: string
          judul: string
          slug: string
          updated_at?: string
          urutan?: number
        }
        Update: {
          created_at?: string
          id?: string
          isi?: string
          judul?: string
          slug?: string
          updated_at?: string
          urutan?: number
        }
        Relationships: []
      }
      perangkat_desa: {
        Row: {
          created_at: string
          foto_url: string
          id: string
          jabatan: string
          nama: string
          updated_at: string
          urutan: number
        }
        Insert: {
          created_at?: string
          foto_url?: string
          id?: string
          jabatan: string
          nama: string
          updated_at?: string
          urutan?: number
        }
        Update: {
          created_at?: string
          foto_url?: string
          id?: string
          jabatan?: string
          nama?: string
          updated_at?: string
          urutan?: number
        }
        Relationships: []
      }
      profil_desa: {
        Row: {
          alamat_kantor: string
          created_at: string
          email: string
          id: string
          jam_layanan: string
          jumlah_dusun: number
          jumlah_penduduk: number
          jumlah_rt: number
          jumlah_rw: number
          maps_embed_url: string
          misi: string[]
          nama_desa: string
          sejarah: string
          telepon: string
          updated_at: string
          visi: string
          wilayah: string
        }
        Insert: {
          alamat_kantor?: string
          created_at?: string
          email?: string
          id?: string
          jam_layanan?: string
          jumlah_dusun?: number
          jumlah_penduduk?: number
          jumlah_rt?: number
          jumlah_rw?: number
          maps_embed_url?: string
          misi?: string[]
          nama_desa?: string
          sejarah?: string
          telepon?: string
          updated_at?: string
          visi?: string
          wilayah?: string
        }
        Update: {
          alamat_kantor?: string
          created_at?: string
          email?: string
          id?: string
          jam_layanan?: string
          jumlah_dusun?: number
          jumlah_penduduk?: number
          jumlah_rt?: number
          jumlah_rw?: number
          maps_embed_url?: string
          misi?: string[]
          nama_desa?: string
          sejarah?: string
          telepon?: string
          updated_at?: string
          visi?: string
          wilayah?: string
        }
        Relationships: []
      }
      statistik_penduduk: {
        Row: {
          created_at: string
          id: string
          jumlah: number
          kategori: string
          label: string
          updated_at: string
          urutan: number
        }
        Insert: {
          created_at?: string
          id?: string
          jumlah?: number
          kategori: string
          label: string
          updated_at?: string
          urutan?: number
        }
        Update: {
          created_at?: string
          id?: string
          jumlah?: number
          kategori?: string
          label?: string
          updated_at?: string
          urutan?: number
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
          role: Database["public"]["Enums"]["app_role"]
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
