// ==========================================
//  DECORATOR — Agregar servicios extra a reservas
// ==========================================
function conDesayuno(reserva) {
  return { ...reserva, total: reserva.total + 25000 * reserva.noches, servicios: [...(reserva.servicios || []), 'Desayuno incluido'] };
}
function conTransporte(reserva) {
  return { ...reserva, total: reserva.total + 40000, servicios: [...(reserva.servicios || []), 'Transporte aeropuerto'] };
}
function conPiscina(reserva) {
  return { ...reserva, servicios: [...(reserva.servicios || []), 'Acceso piscina VIP'] };
}
