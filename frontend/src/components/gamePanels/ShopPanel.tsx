import { useState } from "react";
import { getMaterialBasePrice, getMaterialColor, getMaterialName, Materials } from "../../services/game/statics/Materials";

function generatePriceHistory(
    basePrice: number,
    turns = 20,
    marketVolatility = 1
): number[] {
    let price = basePrice;

    const history: number[] = [price];

    for (let turn = 1; turn < turns; turn++) {
        const ratio = price / basePrice;

        const bought =
            Math.floor(Math.random() * 12);

        const sold =
            Math.floor(Math.random() * 12);

        const net = bought - sold;

        let nextPrice = price;

        if (net > 0) {
            let increase = 0;

            if (ratio < 2.5) {
                if (ratio > 1.5) {
                    increase =
                        bought * 0.005;
                } else {
                    increase =
                        bought * 0.01;
                }
            }

            nextPrice +=
                nextPrice *
                increase *
                marketVolatility;
        }

        else if (net < 0) {
            let decrease = 0;

            if (ratio > 0.33) {
                if (ratio > 1.5) {
                    decrease =
                        sold * 0.01;
                } else if (ratio < 0.5) {
                    decrease =
                        sold * 0.002;
                } else {
                    decrease =
                        sold * 0.005;
                }
            }

            nextPrice -=
                nextPrice *
                decrease *
                marketVolatility;
        }

        else {
            const rng =
                Math.floor(Math.random() * 3) + 1;

            if (rng === 1) {
                if (ratio > 0.33) {
                    const drift =
                        0.8 + Math.random() * 0.2;

                    nextPrice *= drift;
                }
            }

            else if (rng === 2) {
            }

            else {
                if (ratio < 2.5) {
                    const drift =
                        1 + Math.random() * 0.2;

                    nextPrice *= drift;
                }
            }
        }

        const noise =
            1 + (Math.random() * 0.04 - 0.02);

        nextPrice *= noise;

        nextPrice = Math.max(
            basePrice * 0.25,
            nextPrice
        );

        nextPrice = Math.min(
            basePrice * 3,
            nextPrice
        );

        price = Math.round(nextPrice);

        history.push(price);
    }

    return history;
}

const ALL_HISTORIES: Record<Materials, number[]> = Object.fromEntries(
    Object.values(Materials)
        .filter((v) => typeof v === "number")
        .map((m) => [m as Materials, generatePriceHistory(getMaterialBasePrice(m))])
) as Record<Materials, number[]>;

interface ShopPanelProps {
    currentTurn?: number;
    playerMoney?: number;
    inventory?: Partial<Record<Materials, number>>;
    onBuy?: (material: Materials, amount: number, totalCost: number) => void;
    onSell?: (material: Materials, amount: number, totalEarned: number) => void;
}

function PriceBarChart({
    prices,
    width = 420,
    height = 110,
    startTurn = 1,
}: {
    prices: number[];
    width?: number;
    height?: number;
    startTurn?: number;
}) {
    const padding = {
        top: 10,
        right: 10,
        bottom: 22,
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
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
        >
            {ticks.map((value, i) => {
                const y =
                    padding.top +
                    chartHeight -
                    ((value - low) / spread) * chartHeight;

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

                const x =
                    padding.left + gap + i * (barWidth + gap);

                const y =
                    padding.top + chartHeight - heightPx;

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

                        <text
                            x={x + barWidth / 2}
                            y={padding.top + chartHeight + 14}
                            textAnchor="middle"
                            fontSize={7}
                            fill="#999"
                        >
                            T {startTurn + i}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

export function ShopPanel({
    currentTurn = 20,
    playerMoney = 10000,
    inventory = {},
}: ShopPanelProps) {
    const [selected, setSelected] = useState<Materials>(Materials.Wood);
    const [amount, setAmount] = useState(1);

    const priceHistory = ALL_HISTORIES[selected].slice(-10);

    const startTurn =
        Math.max(1, ALL_HISTORIES[selected].length - priceHistory.length + 1);
    const currentPrice = priceHistory[priceHistory.length - 1];
    const prevPrice = priceHistory[priceHistory.length - 2];
    const priceUp = currentPrice >= prevPrice;
    const priceDelta = (currentPrice - prevPrice).toFixed(2);

    const totalCost = currentPrice * amount;
    const canAfford = playerMoney >= totalCost;
    const ownedAmount = inventory[selected] ?? 0;
    const canSell = ownedAmount >= amount;

    return (
        <div className="panel shop-panel">
            <p className="panel-title">Market</p>

            <div className="shop-material-tabs">
                {(Object.values(Materials).filter((v) => typeof v === "number") as Materials[]).map((m) => {
                    const h = ALL_HISTORIES[m];
                    const isUp = h[h.length - 1] >= h[h.length - 2];
                    const active = m === selected;
                    return (
                        <button
                            key={m}
                            className={`shop-material-tab ${active ? "shop-material-tab--active" : ""}`}
                            onClick={() => { setSelected(m); setAmount(1); }}
                            style={active ? { borderColor: getMaterialColor(m), color: getMaterialColor(m) } : {}}
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
                        <span className="shop-chart-material-name">{getMaterialName(selected)}</span>
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
                    <PriceBarChart
                        prices={priceHistory}
                        width={420}
                        height={110}
                        startTurn={startTurn}
                    />
                </div>

                <div className="shop-chart-turn-row">
                    <span className="shop-chart-turn-label">Tura {currentTurn}</span>
                    <span className="shop-chart-turn-range">
                        Ostatnie {Math.min(priceHistory.length, 10)} tur
                    </span>
                </div>
            </div>

            <div className="shop-trade-card">
                <div className="shop-trade-row">
                    <div className="shop-trade-info">
                        <span className="shop-trade-label">W ekwipunku</span>
                        <span className="shop-trade-value">{ownedAmount} sztuk</span>
                    </div>
                    <div className="shop-trade-info">
                        <span className="shop-trade-label">Cena jednego</span>
                        <span className="shop-trade-value">${Math.round(currentPrice)}</span>
                    </div>
                    <div className="shop-trade-info shop-trade-info--total">
                        <span className="shop-trade-label">Koszt</span>
                        <span className="shop-trade-value shop-trade-total">${totalCost.toFixed(2)}</span>
                    </div>
                </div>

                <div className="shop-amount-row">
                    <span className="shop-amount-label">Ilość</span>
                    <div className="shop-amount-controls">
                        <button
                            className="shop-amount-btn"
                            onClick={() => setAmount((a) => Math.max(1, a - 1))}
                        >−</button>
                        <input
                            className="shop-amount-input"
                            type="number"
                            min={1}
                            value={amount}
                            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button
                            className="shop-amount-btn"
                            onClick={() => setAmount((a) => a + 1)}
                        >+</button>
                    </div>
                    <div className="shop-amount-presets">
                        {[1, 5, 10, 50].map((n) => (
                            <button key={n} className="shop-preset-btn" onClick={() => setAmount(n)}>
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="shop-action-row">
                    <button
                        className={`shop-action-btn shop-action-btn--buy ${!canAfford ? "shop-action-btn--disabled" : ""}`}
                        disabled={!canAfford}
                    >
                        Kup {getMaterialName(selected)}
                    </button>
                    <button
                        className={`shop-action-btn shop-action-btn--sell ${!canSell ? "shop-action-btn--disabled" : ""}`}
                        disabled={!canSell}
                    >
                        Sprzedaj {getMaterialName(selected)}
                    </button>
                </div>
            </div>
        </div>
    );
}