import { Materials, getMaterialColor, getMaterialName } from "../services/game/statics/Materials";
import { MaterialMarket } from "../services/game/MaterialMarket";
import { ShopManager } from "../services/game/ShopManager";


interface MissingMaterial {
    material: Materials;
    amount: number;
}

interface BuyMaterialsMenuProps {
    missingMaterials: MissingMaterial[];
    onConfirm?: () => void;
    onCancel: () => void;
}

export function BuyMaterialsMenu({ missingMaterials, onConfirm, onCancel }: BuyMaterialsMenuProps) {
    const market = MaterialMarket.getInstance();
    const shop = ShopManager.getInstance();

    const total = missingMaterials.reduce((sum, { material, amount }) => {
        return sum + market.getCurrentPrice(material) * amount;
    }, 0);

    function handleConfirm() {
        for (const { material, amount } of missingMaterials) {
            shop.buy(material, amount);
        }
        onConfirm?.();
    }

    return (
        <div className="panel-overlay" onClick={onCancel}>
            <div
                className="cell-modal"
                style={{ maxWidth: 340, width: "100%" }}
                onClick={e => e.stopPropagation()}
            >
                <p className="cell-modal-title">Brakuje materiałów</p>
                <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
                    Kupić brakujące materiały po obecnych cenach rynkowych?
                </p>

                <div className="cell-modal-stats">
                    {missingMaterials.map(({ material, amount }) => {
                        const price = market.getCurrentPrice(material);
                        return (
                            <div className="cell-modal-stat" key={material}>
                                <span className="cell-modal-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 3,
                                            background: getMaterialColor(material),
                                            flexShrink: 0,
                                            border: "1px solid rgba(0,0,0,0.1)"
                                        }}
                                    />
                                    {getMaterialName(material)}
                                    <span style={{ color: "#bbb" }}>×{amount}</span>
                                </span>
                                <span className="cell-modal-value" style={{ color: "#3b6d11" }}>
                                    ${(price * amount).toLocaleString()}
                                </span>
                            </div>
                        );
                    })}

                    <div className="cell-modal-stat" style={{ borderColor: "#c8e6a0", background: "#f5fbee" }}>
                        <span className="cell-modal-label" style={{ fontWeight: 700, color: "#555" }}>Łącznie</span>
                        <span className="cell-modal-value" style={{ color: "#3b6d11", fontSize: "1rem" }}>
                            ${total.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button className="shop-action-btn shop-action-btn--sell" onClick={onCancel}>
                        Nie
                    </button>
                    <button className="shop-action-btn shop-action-btn--buy" onClick={handleConfirm}>
                        Kup
                    </button>
                </div>
            </div>
        </div>
    );
}