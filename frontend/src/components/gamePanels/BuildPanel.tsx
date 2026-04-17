
const BUILDINGS = [
  { id: 'house', name: 'Dom', cost: 500  },
  { id: 'factory', name: 'Fabryka', cost: 2000 },
  { id: 'shop', name: 'Sklep', cost: 1200 },
  { id: 'school', name: 'Szkoła', cost: 3000 },
  { id: 'hospital', name: 'Szpital', cost: 5000 },
  { id: 'powerplant', name: 'Elektrownia', cost: 8000 },
]

export function BuildPanel() {
  return (
    <div className="panel">
      <p className="panel-title">Wybierz budynek</p>
      <div className="build-grid">
        {BUILDINGS.map(b => (
          <div key={b.id} className="build-card">
            <span className="build-name">{b.name}</span>
            <span className="build-cost">${b.cost.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}