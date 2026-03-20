import type { WeatherData } from "@/lib/weather";
import { getSeasonalTag } from "@/lib/weather";

interface Props {
  weather: WeatherData;
  compact?: boolean;
}

export default function WeatherWidget({ weather, compact = false }: Props) {
  const tag = getSeasonalTag(weather);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={weather.condition_icon} alt={weather.condition_text} className="w-6 h-6" />
        <span className="font-medium text-foreground">{Math.round(weather.temp_f)}°F</span>
        <span>{weather.condition_text} in Denver</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={weather.condition_icon} alt={weather.condition_text} className="w-10 h-10" />
      <div>
        <p className="text-lg font-bold leading-none">{Math.round(weather.temp_f)}°F</p>
        <p className="text-sm text-slate-500">{weather.condition_text} · Denver</p>
      </div>
      <div className="ml-4 pl-4 border-l border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-0.5">
        <p>Feels like {Math.round(weather.feels_like_f)}°</p>
        <p>Humidity {weather.humidity}%</p>
        <p>Wind {Math.round(weather.wind_mph)} mph</p>
      </div>
      {tag && (
        <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${
          tag === "patio"
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-100 text-blue-700"
        }`}>
          {tag === "patio" ? "Patio weather" : "Cozy inside weather"}
        </span>
      )}
    </div>
  );
}
