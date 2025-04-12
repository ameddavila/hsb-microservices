# 📦 Auth Service

Este microservicio forma parte del ecosistema `hsb-microservicios`. Su propósito es gestionar **autenticación de usuarios**, incluyendo login, registro y generación de tokens seguros (JWT).

---

## 🚀 Stack Tecnológico

- Node.js + TypeScript
- Express.js
- Sequelize (ORM)
- MSSQL (SQL Server)
- Zod (validaciones)
- JWT + Bcrypt (seguridad)
- dotenv (configuración)
- ts-node (dev)
- tsconfig-paths (alias)

---

## 📁 Estructura de Carpetas

```
src/
├── config/           # Configuración de DB, env, etc.
├── controllers/      # Controladores HTTP
├── models/           # Modelos Sequelize
├── routes/           # Rutas Express
├── services/         # Lógica de negocio
├── validators/       # Validaciones con Zod
└── index.ts          # Entry point
```

---

## 🔐 Variables de Entorno (.env)

```env
# Base de datos
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=yourPassword
DB_NAME=bdCENTRAL
DB_DIALECT=mssql

# Seguridad
JWT_SECRET=supersecretkey

# Puerto
PORT=3001
```

---

## 📦 Scripts útiles (`package.json`)

```json
"scripts": {
  "dev": "ts-node -r tsconfig-paths/register src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

---

## 🛠 Instalación

```bash
# Instalar dependencias
npm install

# Correr en modo desarrollo
npm run dev
```

---

## 📬 Endpoints (ejemplo)

| Método | Ruta              | Descripción             |
|--------|-------------------|-------------------------|
| POST   | `/api/login`      | Inicia sesión           |
| GET    | `/api/users`      | Lista todos los usuarios|
| POST   | `/api/users`      | Crea un nuevo usuario   |

---

## 🔒 Seguridad

- Contraseñas encriptadas con `bcrypt`
- JWT firmado con `JWT_SECRET`
- Validaciones con `Zod`
- Middleware de autorización opcional

---

## 📦 Dependencias importantes

```bash
npm i express sequelize sequelize-typescript mssql dotenv zod bcrypt jsonwebtoken
npm i -D typescript ts-node tsconfig-paths @types/express @types/node
```

---

## 📌 Notas

- Este servicio **no debe** conocer la lógica de otros microservicios (principio de aislamiento).
- Puedes comunicarte con otros servicios mediante HTTP o colas si se define.

---

## 🧩 Relación con otros servicios

Este microservicio se conecta con:
- `bdCENTRAL` para obtener usuarios, roles y permisos.
- [Opcional] servicios externos para datos adicionales (biometría, logs, etc.)

---

## 🔧 Mantenimiento

- [ ] Validar errores en producción
- [ ] Añadir tests unitarios
- [ ] Documentar endpoints con Swagger (futuro)

---

## 👨‍💻 Autor

Proyecto desarrollado por el equipo `HSB Dev`  
Contactar: [amed.dav@gmail.com]