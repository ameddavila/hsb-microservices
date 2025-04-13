# 👥 User-Service - Gestión de Usuarios, Roles y Permisos

Este microservicio es responsable de manejar toda la lógica de usuarios, incluyendo su registro, asignación de roles, definición de permisos y consultas protegidas por autenticación y autorización.

---

## 📁 Estructura de Carpetas

```
src/
├── config/                # Configuración de Sequelize
│   └── sequelize.ts
├── controllers/           # Lógica de controladores
│   ├── public.controller.ts
│   ├── role.controller.ts
│   ├── user.controller.ts
│   └── permission.controller.ts
├── middlewares/           # Middlewares para seguridad
│   ├── authenticateToken.ts
│   └── checkRole.ts
├── models/                # Modelos Sequelize
│   ├── user.model.ts
│   ├── role.model.ts
│   ├── permission.model.ts
│   ├── userRole.model.ts
│   └── rolePermission.model.ts
├── routes/                # Rutas agrupadas
│   ├── index.ts
│   ├── public.routes.ts
│   ├── user.routes.ts
│   ├── role.routes.ts
│   └── permission.routes.ts
├── scripts/               # Seed de datos iniciales
│   └── seedData.ts
├── services/              # Lógica de negocio
│   ├── user.service.ts
│   ├── role.service.ts
│   └── permission.service.ts
├── validators/            # Esquemas Zod para validación
│   └── user.validator.ts
├── app.ts                 # Express App
└── index.ts               # Entrada del servidor
```

---

## 🔄 Flujo General

1. **Registro de Usuario Público**
   - Ruta: `POST /register`
   - Se valida con `Zod`, se crea el usuario y se le asigna el rol `Invitado`.

2. **Consulta de Usuarios**
   - Ruta protegida: `GET /users`
   - Requiere token válido y rol `Administrador`.

3. **Asignación de Rol**
   - Ruta protegida: `POST /users/assign-role`
   - El administrador puede asignar un rol existente a un usuario.

4. **Consulta de Roles y Permisos**
   - Ruta interna protegida: `GET /users/:id/roles-permissions`
   - Devuelve los roles y permisos formateados para uso en JWT.

---

## 🧩 Modelos Principales

### 🔹 `UserModel`
Contiene los datos personales, credenciales y campos para recuperación de contraseña.

### 🔹 `RoleModel` y `UserRoleModel`
Relacionan usuarios con roles (Many-to-Many).

### 🔹 `PermissionModel` y `RolePermissionModel`
Relacionan permisos con roles (Many-to-Many).

---

## 🔐 Seguridad

- Se usa `authenticateToken` para validar JWT y CSRF.
- Se usa `checkRole(["Administrador"])` para asegurar el acceso solo a administradores.

---

## 🚀 Endpoints Clave

| Ruta                           | Método | Autenticación | Descripción                        |
|--------------------------------|--------|----------------|------------------------------------|
| `/register`                   | POST   | ❌             | Registro público                   |
| `/users`                      | GET    | ✅ Admin       | Listar usuarios                    |
| `/users/:id`                  | GET    | ❌ (pública)   | Obtener usuario por ID             |
| `/users/assign-role`          | POST   | ✅ Admin       | Asignar rol                        |
| `/users/:id/roles-permissions`| GET    | 🔁 Interna     | Consulta para construir el JWT     |

---

## 🧪 Seed Inicial

- Crea permisos base: `read`, `manage` para módulos `usuarios` y `menus`.
- Crea roles `Administrador` y `Invitado`.
- Asocia permisos según el rol.
- Crea usuario `admin@example.com` con contraseña `Admin1234!`.

---