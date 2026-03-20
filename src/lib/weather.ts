import { supabase, supabaseAdmin } from "./supabase";

export interface WeatherData {
  condition_text: string;
  condition_icon: string;
  temp_f: number;
  feels_like_f: number;
  humidity: number;
  wind_mph: number;
  is_day: boolean;
  cached_at: string;
}

const API_KEY = process.env.WEATHERAPI_KEY;
const TTL_MS = 60 * 60 * 1000; // 1 hour

export async function getDenverWeather(): Promise<WeatherData | null> {
  // Check Supabase cache first (single row with id=1)
  const { data: cached } = await supabase
    .from("weather_cache")
    .select("data, fetched_at")
    .eq("id", 1)
    .single();

  if (cached?.data && cached?.fetched_at) {
    const age = Date.now() - new Date(cached.fetched_at).getTime();
    if (age < TTL_MS) return cached.data as WeatherData;
  }

  if (!API_KEY) return cached?.data as WeatherData | null;

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent("Denver, CO")}&aqi=no`
    );
    if (!res.ok) return cached?.data as WeatherData | null;

    const json = await res.json();
    const current = json.current;

    const weatherData: WeatherData = {
      condition_text: current.condition.text,
      condition_icon: current.condition.icon.replace("//", "https://"),
      temp_f: current.temp_f,
      feels_like_f: current.feelslike_f,
      humidity: current.humidity,
      wind_mph: current.wind_mph,
      is_day: current.is_day === 1,
      cached_at: new Date().toISOString(),
    };

    await supabaseAdmin
      .from("weather_cache")
      .upsert({ id: 1, data: weatherData, fetched_at: weatherData.cached_at });

    return weatherData;
  } catch {
    return cached?.data as WeatherData | null;
  }
}

// Seasonal tag for SEO/content
export function getSeasonalTag(weather: WeatherData): string | null {
  const temp = weather.temp_f;
  const condition = weather.condition_text.toLowerCase();
  if (condition.includes("snow") || condition.includes("blizzard")) return "cozy";
  if (temp >= 75) return "patio";
  if (temp <= 35) return "cozy";
  return null;
}
