// ==========================================
//  FACTORY — Crear objetos Reserva / Habitación
// ==========================================
class ReservaFactory {
  static crearReserva(datos) {
    return {
      id: Date.now(),
      tipo: 'reserva',
      ...datos,
      estado: 'confirmada',
      creadaEn: new Date().toISOString(),
    };
  }
  static crearHabitacion(datos) {
    return { tipo: 'habitacion', disponible: true, ...datos };
  }
}
