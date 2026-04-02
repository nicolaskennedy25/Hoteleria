// ==========================================
//  ENTIDAD — Modelo base del sistema
// ==========================================
class Entidad {
  constructor(datos = {}) {
    this.id        = datos.id || Date.now();
    this.creadoEn  = datos.creadoEn || new Date().toISOString();
  }
  toJSON() { return { ...this }; }
}

class Reserva extends Entidad {
  constructor(datos) {
    super(datos);
    this.nombre   = datos.nombre;
    this.email    = datos.email;
    this.entrada  = datos.entrada;
    this.salida   = datos.salida;
    this.tipo     = datos.tipo;
    this.pago     = datos.pago;
    this.noches   = datos.noches;
    this.total    = datos.total;
    this.estado   = datos.estado || 'confirmada';
  }
  cancelar() { this.estado = 'cancelada'; return this; }
  estaActiva() { return this.estado === 'confirmada'; }
}

class Habitacion extends Entidad {
  constructor(datos) {
    super(datos);
    this.nombre      = datos.nombre;
    this.tipo        = datos.tipo;
    this.precio_base = datos.precio_base;
    this.disponible  = datos.disponible !== undefined ? datos.disponible : true;
    this.descripcion = datos.descripcion || '';
  }
  marcarOcupada()    { this.disponible = false; }
  marcarDisponible() { this.disponible = true; }
}
