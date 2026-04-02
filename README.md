# 🏨 HotelPlaza — Sistema de Reservas

## Estructura del proyecto

```
mi-sistema-refactorizado/
├── index.html                  ← Página principal (ver + reservar + mis reservas)
├── css/
│   └── styles.css
├── js/
│   ├── app.js                  ← Lógica principal (habitaciones, reservas, precios)
│   ├── patterns/
│   │   ├── Singleton.js        ← Configuración única del hotel
│   │   ├── Factory.js          ← Crear objetos Reserva / Habitación
│   │   ├── Strategy.js         ← Precio por temporada (alta/media/baja)
│   │   ├── Observer.js         ← Eventos (email al crear/cancelar reserva)
│   │   ├── Decorator.js        ← Servicios extra (desayuno, transporte...)
│   │   └── Adapter.js          ← Adaptar respuestas de la API PHP
│   └── models/
│       └── Entidad.js          ← Clases base: Entidad, Reserva, Habitacion
├── php/
│   ├── config/
│   │   └── Database.php        ← Singleton de conexión MySQL
│   ├── models/
│   │   └── ReservaModel.php    ← Consultas SQL
│   ├── controllers/
│   │   └── ReservaController.php ← Lógica de negocio + email
│   └── api/
│       └── reservas.php        ← REST API (GET/POST/DELETE)
├── sql/
│   └── schema.sql              ← Tablas + datos iniciales
├── paginas/
│   ├── habitaciones.html
│   ├── piscina.html
│   ├── bar.html
│   ├── parqueadero.html
│   └── metodo-pago.html
└── img/
    ├── hotel/
    ├── habitaciones/
    ├── piscina/
    ├── bar/
    ├── parqueadero/
    └── pagos/
```

---

## 📸 Nombres de imágenes que debes poner

### img/hotel/
| Archivo             | Qué poner                            |
|---------------------|--------------------------------------|
| `fachada.jpg`       | Foto de la entrada o fachada del hotel |
| `lobby.jpg`         | El lobby o recepción interior        |
| `recepcion.jpg`     | El mesón de recepción                |
| `exterior.jpg`      | Vista exterior, jardín o general     |

### img/habitaciones/
| Archivo                   | Qué poner                    |
|---------------------------|------------------------------|
| `habitacion-sencilla.jpg` | Habitación simple/individual |
| `habitacion-doble.jpg`    | Habitación con 2 camas       |
| `suite.jpg`               | La suite más lujosa          |
| `habitacion-familiar.jpg` | Habitación grande familiar   |

### img/piscina/
| Archivo           | Qué poner                        |
|-------------------|----------------------------------|
| `piscina-1.jpg`   | Foto principal de la piscina     |
| `piscina-2.jpg`   | Ángulo diferente o área de sillas|
| `piscina-area.jpg`| El área alrededor con tumbonas   |

### img/bar/
| Archivo            | Qué poner                        |
|--------------------|----------------------------------|
| `bar-interior.jpg` | Interior del bar con la barra    |
| `bar-tragos.jpg`   | Cocteles, bebidas o mesa servida |
| `bar-terraza.jpg`  | La terraza o zona exterior       |

### img/parqueadero/
| Archivo                   | Qué poner                     |
|---------------------------|-------------------------------|
| `parqueadero-1.jpg`       | Vista interior del parqueadero|
| `parqueadero-exterior.jpg`| Entrada o vista desde afuera  |

### img/pagos/
| Archivo               | Qué poner                          |
|-----------------------|------------------------------------|
| `logo-visa.png`       | Logo oficial de Visa (PNG transparente) |
| `logo-mastercard.png` | Logo oficial de Mastercard          |
| `logo-nequi.png`      | Logo de Nequi                       |
| `logo-daviplata.png`  | Logo de Daviplata                   |

> 💡 Los logos los puedes descargar buscando "[nombre] logo PNG transparent" en Google Imágenes.
> Descárgalos en formato PNG con fondo transparente para que se vean bien.

---

## ⚙️ Configuración PHP

1. Importar la base de datos:
```bash
mysql -u root -p < sql/schema.sql
```

2. Ajustar credenciales en `php/config/Database.php`:
```php
private string $host     = 'localhost';
private string $dbname   = 'hotel_plaza';
private string $user     = 'root';
private string $password = 'tu_password';
```

3. Para el envío real de emails, instalar PHPMailer:
```bash
composer require phpmailer/phpmailer
```
Luego descomentar el bloque en `ReservaController.php`.

---

## 🚀 Funcionalidades

| Funcionalidad              | Dónde está                            |
|----------------------------|---------------------------------------|
| Ver habitaciones disponibles | `index.html` → sección #habitaciones |
| Hacer reserva              | `index.html` → sección #reservar      |
| Cancelar reserva           | `index.html` → sección Mis Reservas   |
| Calcular precio (temporada)| `js/app.js` → función calcularPrecio  |
| Enviar confirmación email  | `php/controllers/ReservaController.php` |
| API REST backend           | `php/api/reservas.php`                |

### Temporadas (Strategy Pattern)
- 🔴 **Alta** (dic, ene, jun, jul): +40% sobre precio base
- 🟡 **Media** (mar, abr, ago, sep): +10% sobre precio base  
- 🟢 **Baja** (resto de meses): -15% sobre precio base
