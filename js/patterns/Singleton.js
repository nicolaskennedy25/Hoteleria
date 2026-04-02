// ==========================================
//  SINGLETON — Configuración única del hotel
// ==========================================
class HotelConfig {
  constructor() {
    if (HotelConfig._instance) return HotelConfig._instance;
    this.nombre       = 'HotelPlaza';
    this.moneda       = 'COP';
    this.emailAdmin   = 'reservas@hotelplaza.com';
    this.temporadas   = {
      alta:  { meses: [12,1,6,7],  factor: 1.4 },
      media: { meses: [3,4,8,9],   factor: 1.1 },
      baja:  { meses: [2,5,10,11], factor: 0.85 },
    };
    HotelConfig._instance = this;
  }
  static getInstance() {
    if (!HotelConfig._instance) new HotelConfig();
    return HotelConfig._instance;
  }
}
HotelConfig._instance = null;
