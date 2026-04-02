// ==========================================
//  OBSERVER — Eventos del sistema de reservas
// ==========================================
class EventBus {
  constructor() { this._listeners = {}; }
  on(evento, cb) {
    if (!this._listeners[evento]) this._listeners[evento] = [];
    this._listeners[evento].push(cb);
  }
  emit(evento, datos) {
    (this._listeners[evento] || []).forEach(cb => cb(datos));
  }
}
const hotelEventBus = new EventBus();

// Ejemplo de listeners
hotelEventBus.on('reserva:creada',   (r) => console.log('📧 Email confirmación →', r.email));
hotelEventBus.on('reserva:cancelada',(r) => console.log('❌ Reserva cancelada →', r.id));
