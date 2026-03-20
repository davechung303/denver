export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      places: {
        Row: {
          id: string;
          place_id: string;
          neighborhood_slug: string;
          category_slug: string;
          name: string;
          slug: string;
          address: string | null;
          phone: string | null;
          website: string | null;
          lat: number | null;
          lng: number | null;
          rating: number | null;
          review_count: number | null;
          price_level: number | null;
          hours: Json | null;
          photos: Json | null;
          types: string[] | null;
          cached_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["places"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["places"]["Insert"]>;
      };
      youtube_videos: {
        Row: {
          id: string;
          video_id: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          view_count: number | null;
          published_at: string | null;
          tags: string[] | null;
          cached_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["youtube_videos"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["youtube_videos"]["Insert"]>;
      };
      video_page_associations: {
        Row: {
          id: string;
          video_id: string;
          neighborhood_slug: string | null;
          category_slug: string | null;
          relevance_score: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["video_page_associations"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["video_page_associations"]["Insert"]>;
      };
      user_reviews: {
        Row: {
          id: string;
          place_id: string;
          author_name: string;
          rating: number;
          body: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["user_reviews"]["Insert"]>;
      };
    };
  };
}
