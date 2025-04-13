# 🔐 Auth-Service - Microservicio de Autenticación (Actualizado)

Este microservicio se encarga exclusivamente del manejo de **autenticación segura utilizando JWT y CSRF**, y está diseñado para integrarse con un sistema de microservicios desacoplado. La lógica de **roles y permisos** es delegada al microservicio `user-service`.

---

## 🧱 Arquitectura Basada en Responsabilidades

- **Auth-Service**: login, generación de tokens, manejo de sesión.
- **User-Service**: roles, permisos, información del usuario.
- → El `auth-service` consume internamente al `user-service` para obtener `roles` y `permissions` al iniciar sesión.

---

## 📂 Estructura de Carpetas

```
src/
├── auth/                 # Controladores, servicios y validadores
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.routes.ts
│   └── auth.validator.ts
├── config/
│   └── sequelize.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── csrf.middleware.ts
├── models/
│   ├── user.model.ts
│   └── refreshToken.model.ts
├── seeders/
│   └── seedData.ts
├── utils/
│   └── token.ts
├── app.ts
└── index.ts
```

---

## 🔑 Funcionalidades Principales

- `POST /auth/login`  
  Verifica credenciales y llama al `user-service` para obtener roles y permisos.  
  Luego genera `accessToken`, `refreshToken` y `csrfToken`.

- `POST /auth/refresh`  
  Valida el `refreshToken` y `csrfToken`, y genera nuevos tokens.

- `POST /auth/logout`  
  Invalida el `refreshToken` y limpia cookies.

- `POST /auth/verify-token`  
  Permite a otros servicios validar el JWT. Retorna `{ '{ valid: true/false, payload }' }`.

---

## 🛡️ Middleware de Seguridad

- `auth.middleware.ts`: Verifica el `accessToken` usando `jwt.verify`.
- `csrf.middleware.ts`: Verifica coincidencia entre `X-CSRF-TOKEN` y la cookie `csrfToken`.

---

## 🔄 Comunicación con user-service

Durante el login, se realiza una **llamada interna segura** al `user-service`:

- Se obtiene el `dni`, `roles` y `permissions` del usuario autenticado.
- Esta información se **incluye en el payload del JWT** para evitar múltiples consultas.

---

## 🧠 Modelos Sequelize

### ✅ `UserModel`
```ts
@Table({ tableName: "Users", timestamps: true })
class UserModel extends Model {
  id: string;
  username: string;
  email: string;
  password: string;
}
```

### ✅ `RefreshTokenModel`
```ts
@Table({ tableName: "RefreshTokens", timestamps: true })
class RefreshTokenModel extends Model {
  id: string;
  userId: string;
  token: string;
  deviceId: string;
  expiresAt: Date;
  lastUsedAt?: Date;
  isActive: boolean;
}
```

---

## 🔐 Token Utilities (`utils/token.ts`)

- `generateAccessToken(payload)` → incluye roles y permisos.
- `verifyToken(token)`
- `generateRefreshToken()`
- `generateCsrfToken(userId)`

---

## 🧪 Seeder

- `seedData.ts`: crea el usuario `admin@admin.com` con contraseña `Admin1234!` y un `refreshToken` inicial.

---

## 📬 Postman Ready

- Colección organizada con tests automáticos para guardar cookies y tokens.
- Variables de entorno: `access_token`, `refresh_token`, `csrf_token`.
- Soporte para flujo completo: login → refresh → verify → logout.

---

## 🛣️ Pronto: Integración con API Gateway (🧩)

El API Gateway permitirá:

- Verificar tokens antes de llegar a cada microservicio.
- Validar permisos directamente desde el JWT.
- Centralizar logs, headers y control de acceso.

**En esta etapa, auth-service ya está preparado para integrarse sin modificaciones.**

---

📅 Actualizado: 2025-04-13
