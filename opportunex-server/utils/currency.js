// ---------------------------------------------------------------------------
// ExchangeRate — open.er-api.com (free, no API key required)
// Rate cached for 24h to stay well within free limits
// ---------------------------------------------------------------------------

let cachedRate = null;
let lastFetch = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const FALLBACK_RWF_PER_USD = 1320;       // approximate fallback

export const getUsdToRwf = async () => {
  const now = Date.now();
  if (cachedRate && lastFetch && now - lastFetch < CACHE_TTL) {
    return cachedRate;
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data.result === 'success' && data.rates?.RWF) {
      cachedRate = data.rates.RWF;
      lastFetch = now;
      return cachedRate;
    }
  } catch (err) {
    console.error('[Currency] Failed to fetch exchange rate:', err.message);
  }

  return cachedRate || FALLBACK_RWF_PER_USD;
};

// Convert RWF amount to USD (returns null for 0 or missing values)
export const rwfToUsd = async (rwfAmount) => {
  if (!rwfAmount || rwfAmount === 0) return null;
  const rate = await getUsdToRwf();
  return Math.round(rwfAmount / rate);
};
