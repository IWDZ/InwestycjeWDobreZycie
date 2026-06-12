import { useEffect, useState, useRef } from "react";
import {
  getMaterialColor,
  getMaterialName,
  Materials,
} from "../../services/game/statics/Materials";
import { ws } from "../../services/WebsocketManager";
import { GameManager } from "../../services/game/GameManager";
import { MaterialMarket } from "../../services/game/MaterialMarket";
import { ShopManager } from "../../services/game/ShopManager";
import { useLocale } from "../../locale/Locale";

const priceHistories = Object.fromEntries(
  Object.values(Materials)
    .filter((v) => typeof v === "number")
    .map((m) => [m, [] as number[]]),
) as unknown as Record<Materials, number[]>;

function PriceBarChart({
  prices,
  width = 420,
  height = 110,
}: {
  prices: number[];
  width?: number;
  height?: number;
}) {
  const padding = {
    top: 10,
    right: 10,
    bottom: 8,
    left: 38,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const spread = high - low || 1;

  const barWidth = chartWidth / (prices.length * 1.45);
  const gap = barWidth * 0.45;

  const ticks = [low, (low + high) / 2, high];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {ticks.map((value, i) => {
        const y =
          padding.top + chartHeight - ((value - low) / spread) * chartHeight;

        return (
          <g key={i}>
            <line
              x1={padding.left}
              y1={y}
              x2={padding.left + chartWidth}
              y2={y}
              stroke="#ececec"
              strokeWidth={1}
              strokeDasharray="3 3"
            />

            <text
              x={padding.left - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={9}
              fill="#999"
            >
              ${Math.round(value)}
            </text>
          </g>
        );
      })}

      {prices.map((price, i) => {
        const previous = prices[i - 1] ?? price;

        let fill = "#a3a3a3";

        if (i > 0) {
          fill = price >= previous ? "#1f9d74" : "#d14b4b";
        }

        const normalized = (price - low) / spread;
        const heightPx = Math.max(3, normalized * chartHeight);

        const x = padding.left + gap + i * (barWidth + gap);

        const y = padding.top + chartHeight - heightPx;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={heightPx}
              rx={2}
              fill={fill}
              opacity={0.9}
            />
          </g>
        );
      })}
    </svg>
  );
}

const savedShopScrollPos = { value: 0 };

export function ShopPanel() {
  const l = useLocale();
  const [selected, setSelected] = useState<Materials>(Materials.Wood);
  const [amount, setAmount] = useState("0");
  const [, forceUpdate] = useState(0);

  useEffect(() => {
      const onUpdate = () => forceUpdate((v) => v + 1);
      ws.register_handler("material_prices_update", onUpdate);
      return () => ws.unregister_handler("material_prices_update", onUpdate);
  }, []);
  
  const market = MaterialMarket.getInstance();
  const shop = ShopManager.getInstance();
  const priceHistory = market.getPriceHistory(selected);
  const currentPrice = market.getCurrentPrice(selected);
  
  const chartPrices = (
    priceHistory[priceHistory.length - 1] === currentPrice
      ? priceHistory
      : [...priceHistory, currentPrice]
  ).slice(-15);
  const prevPrice = priceHistory[priceHistory.length - 2] ?? currentPrice;
  const priceUp = currentPrice >= prevPrice;
  const priceDelta = (currentPrice - prevPrice).toFixed(2);

  let inventory = GameManager.getInstance().inventory;

  const totalCost = currentPrice * parseInt(amount, 10);
  const canAfford = inventory.money >= totalCost;
  const ownedAmount = inventory.materialCount[selected] ?? 0;
  const canSell = ownedAmount >= parseInt(amount, 10);

  useEffect(() => {
    const scrollable = document.querySelector(".panel-popup") as HTMLElement;
    if (!scrollable) return;
  
    const frame = requestAnimationFrame(() => {
      scrollable.scrollTop = savedShopScrollPos.value;
    });
  
    const handleScroll = () => {
      savedShopScrollPos.value = scrollable.scrollTop;
    };
  
    scrollable.addEventListener("scroll", handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      scrollable.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
    <div className="panel shop-panel">
      <p className="panel-title">{l.t("shop.title")}</p>

      <div className="shop-material-tabs">
        {(
          Object.values(Materials).filter(
            (v) => typeof v === "number",
          ) as Materials[]
        ).map((m) => {
          const h = priceHistories[m];
          const isUp =
            h.length >= 2 ? h[h.length - 1] >= h[h.length - 2] : true;
          const active = m === selected;
          return (
            <button
              key={m}
              className={`shop-material-tab ${active ? "shop-material-tab--active" : ""}`}
              onClick={() => {
                setSelected(m);
                setAmount("1");
              }}
              style={
                active
                  ? {
                      borderColor: getMaterialColor(m),
                      color: getMaterialColor(m),
                    }
                  : {}
              }
            >
              <span className="shop-tab-label">{getMaterialName(m)}</span>
              <span className={`shop-tab-price-change ${isUp ? "up" : "down"}`}>
                {isUp ? "▲" : "▼"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="shop-chart-card">
        <div className="shop-chart-header">
          <div className="shop-chart-title-row">
            <span className="shop-chart-material-name">
              {getMaterialName(selected)}
            </span>
            <span
              className={`shop-chart-price-badge ${priceUp ? "shop-chart-price-badge--up" : "shop-chart-price-badge--down"}`}
            >
              ${Math.round(currentPrice)}
              <span className="shop-chart-delta">
                {priceUp ? "▲" : "▼"} {Math.abs(Number(priceDelta))}
              </span>
            </span>
          </div>
        </div>

        <div className="shop-chart-svg-wrapper">
          <PriceBarChart prices={chartPrices} width={420} height={110} />
        </div>

        <div className="shop-chart-turn-row">
          <span className="shop-chart-turn-label">{l.t("shop.turn", priceHistory.length)}</span>
          <span className="shop-chart-turn-range">
            {l.t("shop.lasturns", Math.min(chartPrices.length, 15))}
          </span>
        </div>
      </div>

      <div className="shop-trade-card">
        <div className="shop-trade-row">
          <div className="shop-trade-info">
            <span className="shop-trade-label">{l.t("shop.owned")}</span>
            <span className="shop-trade-value">{l.t("shop.units", ownedAmount)}</span>
          </div>
          <div className="shop-trade-info">
            <span className="shop-trade-label">{l.t("shop.unitprice")}</span>
            <span className="shop-trade-value">
              ${Math.round(currentPrice)}
            </span>
          </div>
          <div className="shop-trade-info shop-trade-info--total">
            <span className="shop-trade-label">{l.t("shop.cost")}</span>
            <span className="shop-trade-value shop-trade-total">
              ${totalCost.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="shop-amount-row">
          <span className="shop-amount-label">{l.t("shop.amount")}</span>
          <div className="shop-amount-controls">
            <button
              className="shop-amount-btn"
              onClick={() => setAmount((a) => a)}
            >
              −
            </button>
            <input
              className="shop-amount-input"
              type="number"
              value={amount}
              onChange={(e) => {
                const val = e.target.value.replace(/^0+(\d)/, '$1'); 
                setAmount(val === "" ? "0" : val);
              }}
            />
            <button
              className="shop-amount-btn"
              onClick={() => setAmount((a) => a + 1)}
            >
              +
            </button>
          </div>
          <div className="shop-amount-presets">
            {[1, 5, 10, 50, 100, 200].map((n) => (
              <button
                key={n}
                className="shop-preset-btn"
                onClick={() => setAmount(`${n}`)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="shop-action-row">
          <button
              className={`shop-action-btn shop-action-btn--buy ${!canAfford ? "shop-action-btn--disabled" : ""}`}
              disabled={!canAfford}
              onClick={() => {
                  console.log("button clicked");
                  try {
                      const result = shop.buy(selected, parseInt(amount, 10));
                      console.log("buy result:", result);
                  } catch (e) {
                      console.error("shop.buy threw:", e);
                  }
                  forceUpdate((v) => v + 1);
              }}
          >
            {l.t("shop.buy", getMaterialName(selected))}
          </button>
          <button
              className={`shop-action-btn shop-action-btn--sell ${!canSell ? "shop-action-btn--disabled" : ""}`}
              disabled={!canSell}
              onClick={() => {
                  shop.sell(selected, parseInt(amount, 10));
                  forceUpdate((v) => v + 1);
              }}
          >
            {l.t("shop.sell", getMaterialName(selected))}
          </button>
        </div>
      </div>
    </div>
  );
}
