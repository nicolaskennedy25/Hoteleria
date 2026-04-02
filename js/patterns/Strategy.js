// ==========================================
//  STRATEGY — Cálculo de precio por temporada
// ==========================================
const PrecioStrategy = {
  alta:  { nombre: 'Temporada Alta',  calcular: (base) => base * 1.4  },
  media: { nombre: 'Temporada Media', calcular: (base) => base * 1.1  },
  baja:  { nombre: 'Temporada Baja',  calcular: (base) => base * 0.85 },
};

function aplicarEstrategiaPrecio(precioBase, temporada) {
  const estrategia = PrecioStrategy[temporada] || PrecioStrategy.media;
  return Math.round(estrategia.calcular(precioBase));
}
