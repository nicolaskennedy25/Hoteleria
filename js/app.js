// ==========================================
//  HOTEL PLAZA — app.js
//  Sistema de reservas de habitaciones
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ── DATOS DE HABITACIONES ──────────────────
  const habitaciones = [
    { id: 1, tipo: 'sencilla',  nombre: 'Sencilla Estándar',  precio_base: 120000, disponible: true,  descripcion: 'Cama doble, baño privado, A/C, TV' },
    { id: 2, tipo: 'sencilla',  nombre: 'Sencilla Vista',      precio_base: 140000, disponible: false, descripcion: 'Cama doble, vista al jardín, balcón' },
    { id: 3, tipo: 'doble',     nombre: 'Doble Estándar',      precio_base: 180000, disponible: true,  descripcion: '2 camas, baño privado, minibar, A/C' },
    { id: 4, tipo: 'doble',     nombre: 'Doble Superior',      precio_base: 220000, disponible: true,  descripcion: '2 camas queen, jacuzzi, vista piscina' },
    { id: 5, tipo: 'suite',     nombre: 'Suite Junior',        precio_base: 350000, disponible: true,  descripcion: 'Sala independiente, cama king, bañera' },
    { id: 6, tipo: 'suite',     nombre: 'Suite Master',        precio_base: 520000, disponible: false, descripcion: 'Suite de lujo, terraza privada, mayordomo' },
    { id: 7, tipo: 'familiar',  nombre: 'Familiar Estándar',   precio_base: 280000, disponible: true,  descripcion: '3 camas, sala, cocina equipada, A/C' },
    { id: 8, tipo: 'familiar',  nombre: 'Familiar Amplia',     precio_base: 320000, disponible: true,  descripcion: '4 camas, 2 baños, sala y comedor' },
  ];

  // ── TEMPORADAS (Strategy Pattern) ─────────────────
  const estrategiasPrecio = {
    alta:  (precio) => precio * 1.4,   // 40% más en temporada alta
    media: (precio) => precio * 1.1,   // 10% más en temporada media
    baja:  (precio) => precio * 0.85,  // 15% descuento en temporada baja
  };

  function obtenerTemporada(fechaEntrada) {
    const mes = new Date(fechaEntrada).getMonth() + 1;
    if ([12, 1, 6, 7].includes(mes)) return 'alta';
    if ([3, 4, 8, 9].includes(mes)) return 'media';
    return 'baja';
  }

  function calcularPrecio(tipoHab, fechaEntrada, fechaSalida) {
    const hab = habitaciones.find(h => h.tipo === tipoHab);
    if (!hab) return 0;
    const noches = Math.max(1, Math.ceil(
      (new Date(fechaSalida) - new Date(fechaEntrada)) / (1000 * 60 * 60 * 24)
    ));
    const temporada = obtenerTemporada(fechaEntrada);
    const estrategia = estrategiasPrecio[temporada];
    return Math.round(estrategia(hab.precio_base) * noches);
  }

  // ── RESERVAS (localStorage) ─────────────────────
  function getReservas() {
    return JSON.parse(localStorage.getItem('reservas') || '[]');
  }
  function saveReservas(reservas) {
    localStorage.setItem('reservas', JSON.stringify(reservas));
  }

  // ── RENDERIZAR HABITACIONES ─────────────────────
  const listaHab = document.getElementById('lista-habitaciones');
  if (listaHab) {
    listaHab.innerHTML = '';
    habitaciones.forEach(h => {
      const card = document.createElement('div');
      card.className = 'hab-card';
      const precioFmt = h.precio_base.toLocaleString('es-CO');
      card.innerHTML = `
        <h3>${h.nombre}</h3>
        <p>${h.descripcion}</p>
        <span class="badge ${h.disponible ? 'disponible' : 'ocupada'}">
          ${h.disponible ? '✓ Disponible' : '✗ Ocupada'}
        </span>
        <p class="precio">Desde $${precioFmt} / noche</p>
        ${h.disponible
          ? `<button onclick="seleccionarHabitacion('${h.tipo}')">Reservar esta</button>`
          : `<button disabled style="opacity:0.4;cursor:not-allowed">No disponible</button>`}
      `;
      listaHab.appendChild(card);
    });
  }

  // ── SELECCIONAR HABITACIÓN DESDE CARD ────────
  window.seleccionarHabitacion = function(tipo) {
    const sel = document.getElementById('tipo-hab');
    if (sel) {
      sel.value = tipo;
      document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
      actualizarPrecio();
    }
  };

  // ── CALCULAR PRECIO EN TIEMPO REAL ─────────────
  function actualizarPrecio() {
    const entrada  = document.getElementById('fecha-entrada')?.value;
    const salida   = document.getElementById('fecha-salida')?.value;
    const tipo     = document.getElementById('tipo-hab')?.value;
    const precioBox   = document.getElementById('precio-box');
    const precioTotal = document.getElementById('precio-total');
    if (entrada && salida && tipo && new Date(salida) > new Date(entrada)) {
      const total = calcularPrecio(tipo, entrada, salida);
      const temporada = obtenerTemporada(entrada);
      const etiquetas = { alta: '🔴 Temporada alta', media: '🟡 Temporada media', baja: '🟢 Temporada baja' };
      precioTotal.textContent = `$${total.toLocaleString('es-CO')} COP — ${etiquetas[temporada]}`;
      precioBox.style.display = 'block';
    } else {
      precioBox.style.display = 'none';
    }
  }

  ['fecha-entrada','fecha-salida','tipo-hab'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', actualizarPrecio);
  });

  // Mínimo: hoy
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('fecha-entrada')?.setAttribute('min', hoy);
  document.getElementById('fecha-salida')?.setAttribute('min', hoy);

  // ── FORMULARIO RESERVA ──────────────────────────
  document.getElementById('form-reserva')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre     = document.getElementById('nombre').value.trim();
    const email      = document.getElementById('email').value.trim();
    const entrada    = document.getElementById('fecha-entrada').value;
    const salida     = document.getElementById('fecha-salida').value;
    const tipo       = document.getElementById('tipo-hab').value;
    const pago       = document.getElementById('metodo-pago').value;

    if (!nombre || !email || !entrada || !salida) return;
    if (new Date(salida) <= new Date(entrada)) {
      alert('La fecha de salida debe ser posterior a la de entrada.');
      return;
    }

    const noches = Math.ceil((new Date(salida) - new Date(entrada)) / (1000*60*60*24));
    const total  = calcularPrecio(tipo, entrada, salida);
    const reserva = {
      id: Date.now(),
      nombre, email, entrada, salida,
      tipo, pago, noches, total,
      fecha_creacion: new Date().toLocaleDateString('es-CO'),
    };

    const reservas = getReservas();
    reservas.push(reserva);
    saveReservas(reservas);

    // Simular envío de confirmación
    console.log(`📧 Confirmación enviada a ${email}`, reserva);

    document.getElementById('form-reserva').style.display = 'none';
    document.getElementById('confirmacion').style.display = 'block';
    renderizarReservas();

    setTimeout(() => {
      document.getElementById('confirmacion').style.display = 'none';
      document.getElementById('form-reserva').style.display = 'flex';
      document.getElementById('form-reserva').reset();
      document.getElementById('precio-box').style.display = 'none';
    }, 4000);
  });

  // ── RENDERIZAR RESERVAS ──────────────────────────
  function renderizarReservas() {
    const lista = document.getElementById('lista-reservas');
    if (!lista) return;
    const reservas = getReservas();
    if (reservas.length === 0) {
      lista.innerHTML = '<p class="empty">No tienes reservas activas.</p>';
      return;
    }
    lista.innerHTML = '';
    reservas.forEach(r => {
      const item = document.createElement('div');
      item.className = 'reserva-item';
      item.innerHTML = `
        <div class="info">
          <h4>${r.nombre} — ${r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1)}</h4>
          <p>📅 ${r.entrada} → ${r.salida} · ${r.noches} noche(s) · 💳 ${r.pago}</p>
          <p>💰 Total: <strong>$${r.total.toLocaleString('es-CO')} COP</strong> · Reservado: ${r.fecha_creacion}</p>
        </div>
        <button class="btn-cancelar" onclick="cancelarReserva(${r.id})">Cancelar</button>
      `;
      lista.appendChild(item);
    });
  }

  // ── CANCELAR RESERVA ─────────────────────────────
  window.cancelarReserva = function(id) {
    if (!confirm('¿Deseas cancelar esta reserva?')) return;
    const reservas = getReservas().filter(r => r.id !== id);
    saveReservas(reservas);
    renderizarReservas();
  };

  renderizarReservas();
});
