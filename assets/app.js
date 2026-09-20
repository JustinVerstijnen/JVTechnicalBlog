(function () {
  const location = {
    latitude: 52.68,
    longitude: 5.95,
    timezone: "Europe/Amsterdam",
  };

  const weatherLabels = {
    0: "Helder",
    1: "Licht bewolkt",
    2: "Half bewolkt",
    3: "Bewolkt",
    45: "Mist",
    48: "Rijpmist",
    51: "Lichte motregen",
    53: "Motregen",
    55: "Stevige motregen",
    61: "Lichte regen",
    63: "Regen",
    65: "Zware regen",
    71: "Lichte sneeuw",
    73: "Sneeuw",
    75: "Zware sneeuw",
    80: "Lichte bui",
    81: "Bui",
    82: "Felle bui",
    95: "Onweer",
    96: "Onweer met hagel",
    99: "Zwaar onweer",
  };

  const days = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];

  const element = (id) => document.getElementById(id);
  const formatNumber = (value, digits) =>
    value === undefined || Number.isNaN(value)
      ? "-"
      : new Intl.NumberFormat("nl-NL", {
          maximumFractionDigits: digits,
          minimumFractionDigits: digits,
        }).format(value);

  function buildWeatherUrl() {
    const params = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      timezone: location.timezone,
      past_minutely_15: "2",
      forecast_minutely_15: "13",
      past_hours: "48",
      forecast_days: "4",
      current:
        "temperature_2m,dew_point_2m,precipitation,weather_code,is_day,pressure_msl,wind_speed_10m,wind_direction_10m",
      minutely_15: "precipitation",
      hourly:
        "temperature_2m,dew_point_2m,precipitation,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,dew_point_2m_mean,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant",
    });

    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
  }

  function parseTime(value) {
    return new Date(value).getTime();
  }

  function addMinutes(value, minutes) {
    const date = new Date(value);
    date.setMinutes(date.getMinutes() + minutes);
    const pad = (part) => String(part).padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

  function timeLabel(value) {
    return value.slice(11, 16);
  }

  function dayLabel(value) {
    const date = new Date(value + "T12:00:00");
    return days[date.getDay()];
  }

  function roundTenth(value) {
    const rounded = Math.round(value / 10) * 10;
    return rounded === 360 ? 0 : rounded;
  }

  function windCompass(degrees) {
    return ["N", "NO", "O", "ZO", "Z", "ZW", "W", "NW"][Math.round(degrees / 45) % 8];
  }

  function knotsFromKmh(kmh) {
    return kmh / 1.852;
  }

  function beaufortFromKmh(kmh) {
    const knots = knotsFromKmh(kmh);
    const limits = [1, 4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64];
    const index = limits.findIndex((limit) => knots < limit);
    return index === -1 ? 12 : index;
  }

  function rainIntensity(value) {
    if (value >= 2.5) return "Zwaar";
    if (value >= 1) return "Matig";
    if (value > 0) return "Licht";
    return "Droog";
  }

  function weatherIconName(code, isDay = 1) {
    const night = Number(isDay) === 0;
    if (code === 0) return night ? "moon" : "sun";
    if ([1, 2].includes(code)) return night ? "partly-night" : "partly";
    if (code === 3) return "cloud";
    if ([45, 48].includes(code)) return "fog";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
    if (code >= 95) return "storm";
    if (code >= 51) return "rain";
    return "cloud";
  }

  function weatherIconSvg(name) {
    const sun = `
      <circle class="wx-sun" cx="12" cy="12" r="4.2"></circle>
      <path class="wx-sun-ray" d="M12 2.4v2.1M12 19.5v2.1M2.4 12h2.1M19.5 12h2.1M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5"></path>`;
    const moon = `<path class="wx-moon" d="M18.2 15.9A7.2 7.2 0 0 1 8.1 5.8 7.4 7.4 0 1 0 18.2 15.9Z"></path>`;
    const cloud = `<path class="wx-cloud" d="M6.1 18.2h11.4a4.1 4.1 0 0 0 .2-8.2 6 6 0 0 0-11.4 1.9 3.2 3.2 0 0 0-.2 6.3Z"></path>`;

    const icons = {
      sun,
      moon,
      cloud,
      partly: `${sun}<path class="wx-cloud" d="M7.1 19h10.7a3.8 3.8 0 0 0 .2-7.6 5.5 5.5 0 0 0-10.5 1.8A2.9 2.9 0 0 0 7.1 19Z"></path>`,
      "partly-night": `${moon}<path class="wx-cloud" d="M7.1 19h10.7a3.8 3.8 0 0 0 .2-7.6 5.5 5.5 0 0 0-10.5 1.8A2.9 2.9 0 0 0 7.1 19Z"></path>`,
      rain: `${cloud}<path class="wx-detail" d="M8 20.2l-.8 1.4M12.2 20.2l-.8 1.4M16.4 20.2l-.8 1.4"></path>`,
      snow: `${cloud}<circle class="wx-snow" cx="8" cy="21" r=".8"></circle><circle class="wx-snow" cx="12.2" cy="20.3" r=".8"></circle><circle class="wx-snow" cx="16.4" cy="21" r=".8"></circle>`,
      fog: `${cloud}<path class="wx-fog" d="M5.2 20h13.6M7.2 22h9.6"></path>`,
      storm: `${cloud}<path class="wx-lightning" d="m13.2 18-2.6 4.1h2.3l-1.1 3.1 4-4.8h-2.5l1.4-2.4Z"></path>`,
    };

    return `<svg class="weather-icon-svg" viewBox="0 0 24 26" aria-hidden="true" focusable="false">${icons[name] || icons.cloud}</svg>`;
  }

  function buildFiveMinuteRainPoints(series) {
    return (series.time || []).flatMap((time, index) => {
      const amountPerFiveMinutes = ((series.precipitation || [])[index] || 0) / 3;
      return [0, 5, 10].map((offset) => {
        const pointTime = addMinutes(time, offset);
        return {
          time: pointTime,
          label: timeLabel(pointTime),
          amount: amountPerFiveMinutes,
          intensity: amountPerFiveMinutes * 12,
        };
      });
    });
  }

  function sumBetween(points, start, end) {
    return points
      .filter((point) => {
        const time = parseTime(point.time);
        return time > start && time <= end;
      })
      .reduce((total, point) => total + point.amount, 0);
  }

  function setWeatherIcon(target, code, label, isDay = 1) {
    target.className = "weather-icon-wrap weather-icon-current";
    target.setAttribute("aria-label", label);
    target.innerHTML = weatherIconSvg(weatherIconName(code, isDay));
  }

  const windFlagState = {
    ready: false,
    rafId: 0,
    windKmh: 0,
    canvas: null,
    context: null,
    cloth: null,
    image: null,
  };

  function buildWindFlag() {
    const canvas = element("flag-canvas");
    const cloth = element("flag-cloth");
    if (!canvas || !cloth) return;
    if (windFlagState.canvas === canvas && windFlagState.image) return;

    windFlagState.canvas = canvas;
    windFlagState.context = canvas.getContext("2d");
    windFlagState.cloth = cloth;

    const image = new Image();
    image.decoding = "async";
    image.src = "assets/vlag-vollenhove.svg";
    image.onload = () => {
      windFlagState.image = image;
      windFlagState.ready = true;
      if (!windFlagState.rafId) {
        windFlagState.rafId = window.requestAnimationFrame(animateWindFlag);
      }
    };
    image.onerror = () => {
      console.error("De vlag van Vollenhove kon niet worden geladen.");
    };
  }

  function drawWindFlag(now) {
    if (!windFlagState.ready || !windFlagState.canvas || !windFlagState.context || !windFlagState.image) return;

    const ctx = windFlagState.context;
    const canvas = windFlagState.canvas;
    const image = windFlagState.image;
    const w = canvas.width;
    const h = canvas.height;
    const safeWind = Math.max(0, Number(windFlagState.windKmh) || 0);
    const normalized = Math.min(safeWind, 80) / 80;
    const seconds = now / 1000;
    const stripWidth = 2;
    const speed = 0.9 + normalized * 2.0;
    const amplitude = 0.8 + normalized * 7.8;

    ctx.clearRect(0, 0, w, h);

    for (let x = 0; x < w; x += stripWidth) {
      const progress = x / Math.max(w - 1, 1);
      const edgeFactor = Math.pow(progress, 1.1);
      const phaseA = x * 0.11 - seconds * (3.5 + speed * 1.85);
      const phaseB = x * 0.22 - seconds * (6.4 + speed * 2.35) + 0.8;
      const phaseC = x * 0.06 - seconds * (1.6 + speed * 0.55) + 1.1;
      const wave = Math.sin(phaseA) + Math.sin(phaseB) * 0.38 + Math.sin(phaseC) * 0.18;
      const nextWave = Math.sin((x + stripWidth) * 0.11 - seconds * (3.5 + speed * 1.85)) +
        Math.sin((x + stripWidth) * 0.22 - seconds * (6.4 + speed * 2.35) + 0.8) * 0.38 +
        Math.sin((x + stripWidth) * 0.06 - seconds * (1.6 + speed * 0.55) + 1.1) * 0.18;
      const offsetY = wave * amplitude * edgeFactor;
      const stretch = 1 + Math.sin(phaseA + 0.9) * (0.012 + normalized * 0.03) * edgeFactor;
      const destH = h * stretch;
      const destY = (h - destH) / 2 + offsetY;
      const srcX = (x / w) * image.width;
      const srcW = Math.max(1, (stripWidth / w) * image.width + 0.9);
      const shade = (nextWave - wave) * (0.07 + normalized * 0.06) * edgeFactor;

      ctx.drawImage(image, srcX, 0, srcW, image.height, x, destY, stripWidth + 1.2, destH);

      if (shade > 0.002) {
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.18, shade).toFixed(3)})`;
        ctx.fillRect(x, destY, stripWidth + 1.2, destH);
      } else if (shade < -0.002) {
        ctx.fillStyle = `rgba(0,0,0,${Math.min(0.16, Math.abs(shade)).toFixed(3)})`;
        ctx.fillRect(x, destY, stripWidth + 1.2, destH);
      }
    }

    const topGradient = ctx.createLinearGradient(0, 0, 0, h);
    topGradient.addColorStop(0, "rgba(255,255,255,0.12)");
    topGradient.addColorStop(0.22, "rgba(255,255,255,0.03)");
    topGradient.addColorStop(0.72, "rgba(0,0,0,0.02)");
    topGradient.addColorStop(1, "rgba(0,0,0,0.09)");
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, w, h);
  }

  function animateWindFlag(now) {
    const cloth = windFlagState.cloth || element("flag-cloth");
    const flag = element("wind-flag");
    if (!cloth || !flag) {
      windFlagState.rafId = window.requestAnimationFrame(animateWindFlag);
      return;
    }

    const safeWind = Math.max(0, Number(windFlagState.windKmh) || 0);
    const normalized = Math.min(safeWind, 80) / 80;
    const seconds = now / 1000;
    const swayY = Math.sin(seconds * (1.05 + normalized * 0.85)) * (0.2 + normalized * 1.5);
    const swayRotY = Math.sin(seconds * (0.92 + normalized * 0.72)) * (0.8 + normalized * 2.3);
    const swayRotZ = Math.sin(seconds * (0.74 + normalized * 0.48)) * (0.08 + normalized * 0.35);

    cloth.style.transform = `translate3d(0, ${swayY.toFixed(2)}px, 0) rotateY(${swayRotY.toFixed(2)}deg) rotateZ(${swayRotZ.toFixed(2)}deg)`;
    drawWindFlag(now);
    windFlagState.rafId = window.requestAnimationFrame(animateWindFlag);
  }

  function updateWindFlag(windKmh) {
    const flag = element("wind-flag");
    if (!flag) return;

    buildWindFlag();

    const safeWind = Math.max(0, Number(windKmh) || 0);
    windFlagState.windKmh = safeWind;
    flag.classList.toggle("is-calm", safeWind < 1);
    flag.setAttribute(
      "aria-label",
      "Vlag van Vollenhove; animatiesnelheid gebaseerd op " + formatNumber(safeWind, 1) + " kilometer per uur wind",
    );
  }

  function selectRainWindow(points, currentTime) {
    const currentMs = parseTime(currentTime);
    const start = currentMs - 15 * 60 * 1000;
    const end = currentMs + 3 * 60 * 60 * 1000;

    return points.filter((point) => {
      const pointMs = parseTime(point.time);
      return pointMs >= start && pointMs <= end;
    });
  }

  function renderRainChart(points, currentTime) {
    const target = element("rain-chart");
    const chartWidth = 720;
    const chartHeight = 190;
    const padding = { top: 18, right: 28, bottom: 30, left: 72 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;
    const maxRain = Math.max(2.5, ...points.map((point) => point.intensity));
    const currentMs = parseTime(currentTime);
    const currentIndex = points.reduce((nearestIndex, point, index) => {
      if (nearestIndex === -1) return index;
      const nearestDistance = Math.abs(parseTime(points[nearestIndex].time) - currentMs);
      const pointDistance = Math.abs(parseTime(point.time) - currentMs);
      return pointDistance < nearestDistance ? index : nearestIndex;
    }, -1);
    let activeIndex = Math.max(currentIndex, 0);

    const xForIndex = (index) => padding.left + (index / Math.max(points.length - 1, 1)) * plotWidth;
    const yForIntensity = (intensity) => padding.top + plotHeight - (intensity / maxRain) * plotHeight;
    const nowX = currentIndex >= 0 ? xForIndex(currentIndex) : padding.left;
    const path = points
      .map((point, index) => {
        const x = xForIndex(index);
        const y = yForIntensity(point.intensity);
        return (index === 0 ? "M" : "L") + " " + x.toFixed(2) + " " + y.toFixed(2);
      })
      .join(" ");
    const areaPath =
      path + " L " + (padding.left + plotWidth) + " " + (padding.top + plotHeight) + " L " + padding.left + " " + (padding.top + plotHeight) + " Z";

    target.innerHTML = `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" role="img">
        <defs>
          <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1683d8" stop-opacity="0.48"></stop>
            <stop offset="100%" stop-color="#21b5c9" stop-opacity="0.05"></stop>
          </linearGradient>
        </defs>
        <title>Neerslag van de laatste 15 minuten en komende 3 uur in Vollenhove</title>
        <desc>De grafiek toont neerslag per vijf minuten, vanaf 15 minuten geleden tot 3 uur vooruit.</desc>
        ${[0.25, 1, 2.5]
          .map((level) => {
            const y = padding.top + plotHeight - (level / maxRain) * plotHeight;
            return `<line x1="${padding.left}" x2="${padding.left + plotWidth}" y1="${y}" y2="${y}"></line>`;
          })
          .join("")}
        <text x="12" y="${padding.top + plotHeight - (2.5 / maxRain) * plotHeight + 4}">Zwaar</text>
        <text x="12" y="${padding.top + plotHeight - (1 / maxRain) * plotHeight + 4}">Matig</text>
        <text x="12" y="${padding.top + plotHeight - (0.25 / maxRain) * plotHeight + 4}">Licht</text>
        <path class="rain-area" d="${areaPath}"></path>
        <path class="rain-line" d="${path}"></path>
        <line class="now-line" x1="${nowX}" x2="${nowX}" y1="${padding.top - 8}" y2="${padding.top + plotHeight}"></line>
        <text class="now-label" x="${nowX - 10}" y="14">Nu</text>
        <g class="active-layer"></g>
        ${points
          .filter((_, index) => index === 0 || index === Math.floor(points.length / 2) || index === points.length - 1)
          .map((point) => `<text class="axis-label" x="${xForIndex(points.indexOf(point))}" y="${chartHeight - 6}">${timeLabel(point.time)}</text>`)
          .join("")}
      </svg>
    `;

    const svg = target.querySelector("svg");
    const activeLayer = target.querySelector(".active-layer");

    function drawActive(index) {
      activeIndex = Math.max(0, Math.min(points.length - 1, index));
      const point = points[activeIndex];
      const activeX = xForIndex(activeIndex);
      const activeY = yForIntensity(point.intensity);
      const tooltipX = Math.max(78, Math.min(activeX + 8, chartWidth - 152));
      activeLayer.innerHTML = `
        <line class="hover-line" x1="${activeX}" x2="${activeX}" y1="${padding.top}" y2="${padding.top + plotHeight}"></line>
        <circle class="hover-dot" cx="${activeX}" cy="${activeY}" r="5"></circle>
        <g class="rain-tooltip" transform="translate(${tooltipX} 4)">
          <rect width="144" height="58" rx="8"></rect>
          <text x="72" y="17">${timeLabel(point.time)}</text>
          <text x="72" y="34">${formatNumber(point.amount, 2)} mm / 5 min</text>
          <text x="72" y="50">${formatNumber(point.intensity, 2)} mm/u</text>
        </g>
      `;
    }

    svg.addEventListener("pointermove", (event) => {
      const rect = svg.getBoundingClientRect();
      const svgX = ((event.clientX - rect.left) / rect.width) * chartWidth;
      const rawIndex = Math.round(((svgX - padding.left) / plotWidth) * (points.length - 1));
      drawActive(rawIndex);
    });

    svg.addEventListener("pointerleave", () => drawActive(Math.max(currentIndex, 0)));
    drawActive(activeIndex);
  }

  function renderForecast(data, todayIndex) {
    const grid = element("forecast-grid");
    const nextDays = data.daily.time.slice(todayIndex + 1, todayIndex + 4);
    grid.innerHTML = nextDays
      .map((date) => {
        const index = data.daily.time.indexOf(date);
        const code = data.daily.weather_code[index] || 3;
        const wind = data.daily.wind_speed_10m_max[index] || 0;
        const direction = data.daily.wind_direction_10m_dominant[index] || 0;

        return `
          <article class="forecast-card">
            <div>
              <p>${dayLabel(date)}</p>
              <strong>${date.slice(8, 10)}-${date.slice(5, 7)}</strong>
            </div>
            <div class="forecast-icon-box">
              <span class="weather-icon-wrap" role="img" aria-label="${weatherLabels[code] || "Weerbeeld"}">${weatherIconSvg(weatherIconName(code, 1))}</span>
            </div>
            <dl>
              <div><dt>Temperatuur</dt><dd>${formatNumber(data.daily.temperature_2m_min[index], 0)}&deg; / ${formatNumber(
                data.daily.temperature_2m_max[index],
                0,
              )}&deg;</dd></div>
              <div><dt>Neerslag</dt><dd>${formatNumber(data.daily.precipitation_sum[index], 1)} mm</dd></div>
              <div><dt>Dauwpunt</dt><dd>${formatNumber(data.daily.dew_point_2m_mean[index], 1)}&deg;C</dd></div>
              <div><dt>Wind</dt><dd>${windCompass(direction)} ${roundTenth(direction)}&deg; - ${formatNumber(wind, 0)} km/u</dd></div>
            </dl>
          </article>
        `;
      })
      .join("");
  }

  function renderWeather(data) {
    const current = data.current;
    const points = buildFiveMinuteRainPoints(data.minutely_15);
    const rainChartPoints = selectRainWindow(points, current.time);
    const currentMs = parseTime(current.time);
    const todayIndex = Math.max(0, data.daily.time.findIndex((date) => current.time.startsWith(date)));
    const label = weatherLabels[current.weather_code] || "Weerbeeld";
    const windDegrees = roundTenth(current.wind_direction_10m);
    const windKmh = current.wind_speed_10m;

    element("updated").textContent = "Bijgewerkt om " + timeLabel(current.time) + " Vollenhove tijd";
    element("current-temp").innerHTML = formatNumber(current.temperature_2m, 1) + "&deg;C";
    element("current-label").textContent = label;
    setWeatherIcon(element("current-icon"), current.weather_code, label, current.is_day);
    element("min-max").innerHTML =
      formatNumber(data.daily.temperature_2m_min[todayIndex], 1) + "&deg;C - " + formatNumber(data.daily.temperature_2m_max[todayIndex], 1) + "&deg;C";
    element("dew-point").innerHTML = "Dauwpunt " + formatNumber(current.dew_point_2m, 1) + "&deg;C";
    element("pressure").textContent = formatNumber(current.pressure_msl, 0) + " hPa";
    element("wind-direction").innerHTML = windCompass(current.wind_direction_10m) + " " + windDegrees + "&deg;";
    element("wind-speed").textContent =
      formatNumber(knotsFromKmh(windKmh), 1) + " kts - " + beaufortFromKmh(windKmh) + " bft - " + formatNumber(windKmh, 1) + " km/u";
    updateWindFlag(windKmh);
    element("rain-pill").textContent = rainIntensity(current.precipitation);
    element("rain-last").textContent = formatNumber(sumBetween(points, currentMs - 15 * 60 * 1000, currentMs), 2) + " mm";
    element("rain-next").textContent = formatNumber(sumBetween(points, currentMs, currentMs + 3 * 60 * 60 * 1000), 2) + " mm";
    element("rain-day").textContent = formatNumber(data.daily.precipitation_sum[todayIndex] || 0, 1) + " mm";
    renderRainChart(rainChartPoints, current.time);
    renderForecast(data, todayIndex);
  }

  async function loadWeather() {
    try {
      const response = await fetch(buildWeatherUrl(), { cache: "no-store" });
      if (!response.ok) throw new Error("Open-Meteo gaf geen succesvolle response.");
      renderWeather(await response.json());
      element("error-panel").classList.add("is-hidden");
    } catch (error) {
      element("error-panel").classList.remove("is-hidden");
      console.error(error);
    }
  }

  buildWindFlag();
  loadWeather();
  window.setInterval(loadWeather, 10 * 60 * 1000);
})();
