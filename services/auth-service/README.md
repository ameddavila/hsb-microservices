
# 🔐 Auth-Service - Microservicio de Autenticación (Resumen Completo)

Este microservicio se encarga exclusivamente del manejo de autenticación utilizando JWT y CSRF. Forma parte de una arquitectura basada en microservicios.

---

## 📦 Estructura de Carpetas

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

- **POST /auth/login**: Verifica credenciales, genera Access Token, Refresh Token y CSRF Token.
- **POST /auth/refresh**: Valida tokens y devuelve un nuevo Access Token + CSRF.
- **POST /auth/logout**: Elimina Refresh Token y cookies.
- **POST /auth/verify-token**: Permite a otros servicios verificar la validez de un access token.

---

## 🧩 Middleware de Seguridad

- **auth.middleware.ts**: Verifica el accessToken.
- **csrf.middleware.ts**: Compara `X-CSRF-TOKEN` con la cookie `csrfToken`.

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

- `generateAccessToken(payload)`
- `verifyToken(token)`
- `generateRefreshToken()`
- `generateCsrfToken(userId)`

---

## 🧪 Seeder

- `seedData.ts`: Crea usuario `admin@admin.com` con contraseña `Admin1234!` y refresh token válido.

---

## 📬 Postman Ready

- Colección organizada: Login, Refresh, Logout, Verify
- Variables: `access_token`, `refresh_token`, `csrf_token`
- Headers y cookies manejados automáticamente

---

## ✅ Variables de entorno (.env)
```
PORT=3001
JWT_SECRET=AMED123456789
CLIENT_URL=http://localhost:3000
```

---

## 🚀 Prompt para continuar en nuevo chat con user-service

```
Estoy desarrollando un sistema con microservicios y ya tengo completamente configurado y probado el microservicio `auth-service`, el cual maneja autenticación con JWT, Refresh Tokens y protección CSRF. Ahora quiero continuar con el microservicio `user-service`, encargado de la gestión de usuarios, roles y permisos (RBAC). Quiero que me ayudes a estructurarlo correctamente, incluyendo modelos, controladores, rutas protegidas, validaciones, y cómo se comunica con `auth-service`. Además, quiero mantener buenas prácticas de arquitectura y seguridad.
```

---

## 📚 Listo para continuar con: `user-service`
