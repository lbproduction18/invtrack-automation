export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_simulation_metadata: {
        Row: {
          ai_note: string | null
          budget_max: number
          created_at: string
          id: string
          simulation_label: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_note?: string | null
          budget_max?: number
          created_at?: string
          id?: string
          simulation_label?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_note?: string | null
          budget_max?: number
          created_at?: string
          id?: string
          simulation_label?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      analysis_items: {
        Row: {
          created_at: string | null
          date_added: string | null
          id: string
          lab_status_text: string | null
          last_order_date: string | null
          last_order_info: string | null
          note: string | null
          price_1000: number | null
          price_2000: number | null
          price_3000: number | null
          price_4000: number | null
          price_5000: number | null
          price_8000: number | null
          priority_badge: string | null
          product_id: string | null
          quantity_selected: number | null
          simulation_id: string | null
          sku_code: string | null
          sku_label: string | null
          status: string | null
          stock: number | null
          threshold: number | null
          updated_at: string | null
          weeks_delivery: string | null
        }
        Insert: {
          created_at?: string | null
          date_added?: string | null
          id?: string
          lab_status_text?: string | null
          last_order_date?: string | null
          last_order_info?: string | null
          note?: string | null
          price_1000?: number | null
          price_2000?: number | null
          price_3000?: number | null
          price_4000?: number | null
          price_5000?: number | null
          price_8000?: number | null
          priority_badge?: string | null
          product_id?: string | null
          quantity_selected?: number | null
          simulation_id?: string | null
          sku_code?: string | null
          sku_label?: string | null
          status?: string | null
          stock?: number | null
          threshold?: number | null
          updated_at?: string | null
          weeks_delivery?: string | null
        }
        Update: {
          created_at?: string | null
          date_added?: string | null
          id?: string
          lab_status_text?: string | null
          last_order_date?: string | null
          last_order_info?: string | null
          note?: string | null
          price_1000?: number | null
          price_2000?: number | null
          price_3000?: number | null
          price_4000?: number | null
          price_5000?: number | null
          price_8000?: number | null
          priority_badge?: string | null
          product_id?: string | null
          quantity_selected?: number | null
          simulation_id?: string | null
          sku_code?: string | null
          sku_label?: string | null
          status?: string | null
          stock?: number | null
          threshold?: number | null
          updated_at?: string | null
          weeks_delivery?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Low stock product"
            referencedColumns: ["id"]
          },
        ]
      }
      "Low stock product": {
        Row: {
          created_at: string
          current_stock: number
          estimated_delivery_date: string | null
          id: string
          lab_status: string | null
          last_order_date: string | null
          last_order_quantity: number | null
          note: string | null
          price_1000: number | null
          price_2000: number | null
          price_3000: number | null
          price_4000: number | null
          price_5000: number | null
          priority_badge: Database["public"]["Enums"]["priority_level"]
          product_name: string | null
          SKU: string
          status: string | null
          threshold: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          current_stock?: number
          estimated_delivery_date?: string | null
          id?: string
          lab_status?: string | null
          last_order_date?: string | null
          last_order_quantity?: number | null
          note?: string | null
          price_1000?: number | null
          price_2000?: number | null
          price_3000?: number | null
          price_4000?: number | null
          price_5000?: number | null
          priority_badge?: Database["public"]["Enums"]["priority_level"]
          product_name?: string | null
          SKU: string
          status?: string | null
          threshold?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          current_stock?: number
          estimated_delivery_date?: string | null
          id?: string
          lab_status?: string | null
          last_order_date?: string | null
          last_order_quantity?: number | null
          note?: string | null
          price_1000?: number | null
          price_2000?: number | null
          price_3000?: number | null
          price_4000?: number | null
          price_5000?: number | null
          priority_badge?: Database["public"]["Enums"]["priority_level"]
          product_name?: string | null
          SKU?: string
          status?: string | null
          threshold?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      low_stock_last_updated: {
        Row: {
          id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      product_prices: {
        Row: {
          created_at: string | null
          id: string
          price_1000: number | null
          price_2000: number | null
          price_3000: number | null
          price_4000: number | null
          price_5000: number | null
          price_8000: number | null
          product_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          price_1000?: number | null
          price_2000?: number | null
          price_3000?: number | null
          price_4000?: number | null
          price_5000?: number | null
          price_8000?: number | null
          product_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          price_1000?: number | null
          price_2000?: number | null
          price_3000?: number | null
          price_4000?: number | null
          price_5000?: number | null
          price_8000?: number | null
          product_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      priority_level: "standard" | "moyen" | "prioritaire"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
