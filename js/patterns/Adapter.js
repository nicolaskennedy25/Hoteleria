// ==========================================
//  ADAPTER — Adaptar respuestas de la API PHP
// ==========================================
class ReservaAdapter {
  static fromAPI(data) {
    return {
      id:       data.id_reserva || data.id,
      nombre:   data.nombre_huesped || data.nombre,
      email:    data.correo || data.email,
      entrada:  data.fecha_entrada || data.entrada,
      salida:   data.fecha_salida  || data.salida,
      tipo:     data.tipo_habitacion || data.tipo,
      total:    parseFloat(data.precio_total || data.total || 0),
      estado:   data.estado || 'confirmada',
    };
  }
  static toAPI(reserva) {
    return {
      nombre_huesped:   reserva.nombre,
      correo:           reserva.email,
      fecha_entrada:    reserva.entrada,
      fecha_salida:     reserva.salida,
      tipo_habitacion:  reserva.tipo,
      precio_total:     reserva.total,
    };
  }
}
