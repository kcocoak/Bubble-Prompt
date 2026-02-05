/**
 * @file weatherService.js
 * @description Provides weather data fetching and theme adaptation logic.
 * Integrates with the Open-Meteo API to retrieve real-time weather based on user location,
 * and maps WMO weather codes to aesthetic themes (colors, gradients).
 * 
 * @module Utils/WeatherService
 * @author Feng
 * @date 2026-02-04
 */

/**
 * Fetches the current weather data for the user's location.
 * Requires browser Geolocation permission.
 * Uses Open-Meteo API (free tier).
 * 
 * @returns {Promise<Object>} A promise resolving to the weather data object.
 * Format: { temperature: number, weathercode: number, windspeed: number, ... }
 */
export const getWeather = async () => {
    return new Promise((resolve, reject) => {
        // Check for Geolocation support
        if (!navigator.geolocation) {
            reject('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Fetch current weather from Open-Meteo
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
                    );
                    const data = await response.json();
                    resolve(data.current_weather);
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                reject(error);
            }
        );
    });
};

/**
 * Determines the UI theme configuration based on the WMO weather code.
 * 
 * @param {number} wmoCode - The WMO weather code returned by the API.
 * 
 * @returns {Object} A theme object containing:
 * - name: {string} Display name of the theme (e.g., '晴空万里').
 * - bg: {string} CSS gradient string for the background.
 * - meshColors: {Array<string>} Array of colors for mesh gradient effects (unused but reserved).
 */
export const getWeatherTheme = (wmoCode) => {
    // WMO Weather interpretation codes (WW)
    // Code 0: Clear sky
    // Code 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // Code 45, 48: Fog and depositing rime fog
    // Code 51, 53, 55: Drizzle: Light, moderate, and dense intensity
    // Code 61, 63, 65: Rain: Light, moderate and heavy intensity
    // Code 80, 81, 82: Rain showers: Slight, moderate, and violent
    // Code 95: Thunderstorm: Slight or moderate

    const themes = {
        default: {
            name: '默认梦幻',
            bg: 'linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%)', // Original
            meshColors: ['#a18cd1', '#fbc2eb', '#fad0c4']
        },
        sunny: {
            name: '晴空万里',
            bg: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
            meshColors: ['#89f7fe', '#66a6ff', '#fff1eb']
        },
        cloudy: {
            name: '多云舒卷',
            bg: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
            meshColors: ['#cfd9df', '#e2ebf0', '#a1c4fd']
        },
        rainy: {
            name: '雨季朦胧',
            bg: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
            // Made it a bit lighter purple/blue for "Dreamy Rain"
            bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            meshColors: ['#667eea', '#764ba2', '#a18cd1']
        },
        snowy: {
            name: '冰雪奇缘',
            bg: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)',
            bg: 'linear-gradient(180deg, #2af598 0%, #009efd 100%)', // Ice Blue
            meshColors: ['#a1c4fd', '#c2e9fb', '#fbc2eb']
        }
    };

    if (wmoCode === undefined) return themes.default;

    if (wmoCode === 0) return themes.sunny;
    if ([1, 2, 3].includes(wmoCode)) return themes.cloudy;
    if ([45, 48].includes(wmoCode)) return themes.cloudy;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(wmoCode)) return themes.rainy;
    if ([71, 73, 75, 77, 85, 86].includes(wmoCode)) return themes.snowy;
    if (wmoCode >= 95) return themes.rainy; // Storm

    return themes.default;
};
