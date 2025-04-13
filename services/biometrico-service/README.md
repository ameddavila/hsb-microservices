# 🧬 Biometrico-Service

Este microservicio forma parte del sistema modular basado en microservicios, y está encargado de la **gestión biométrica de empleados**, incluyendo zonas, dispositivos, marcaciones, horarios y permisos.

---

## 📦 ¿Qué incluye hasta ahora?

### ✅ Módulos implementados:
- **Zona**: CRUD completo (`zona.controller`, `zona.service`, `zona.routes`)
- **Dispositivo**: Asociado a zona, creado vía seed inicial

### 🧪 Seed de datos:
- `src/scripts/seedData.ts` permite crear una `zona` y un `dispositivo` de prueba

### ⚙️ Tecnologías:
- `Express`, `Sequelize`, `sequelize-typescript`
- Base de datos: **SQL Server**
- Validación con `Zod`
- Seguridad: `JWT`, `CSRF`, `x-internal-call`

---

## 🚀 Iniciar el proyecto

```bash
npm install
npm run dev
```

Verifica que tu archivo `.env` esté bien configurado.

---

## 🌱 Ejecutar seed de prueba

```bash
npm run seed
```

Esto crea:
- Zona: "Zona Central"
- Dispositivo: "Dispositivo Entrada Principal" en esa zona

---

## 🧩 Estructura principal

```
src/
├── config/              # Configuración sequelize + relaciones
├── controllers/         # Lógica de control por módulo
├── middlewares/         # Autenticación y permisos
├── models/              # Modelos Sequelize
├── routes/              # Rutas por entidad
├── services/            # Lógica de negocio
├── validators/          # Esquemas Zod
├── scripts/             # Seeders u otras utilidades
└── index.ts             # Entry point
```

---

## 📚 Guía para agregar más módulos

1. **Crear el modelo Sequelize**
   - Agregar archivo `src/models/miEntidad.model.ts`
   - Incluir en `src/models/index.ts`

2. **Actualizar relaciones**
   - En `src/config/biometrico.relations.ts`, definir asociaciones `belongsTo`, `hasMany`, etc.

3. **Crear el validator Zod**
   - `src/validators/miEntidad.validator.ts`

4. **Crear el service**
   - `src/services/miEntidad.service.ts` con lógica de negocio

5. **Crear el controller**
   - `src/controllers/miEntidad.controller.ts` que llama al service

6. **Crear las rutas**
   - `src/routes/miEntidad.routes.ts`
   - Registrar en `src/routes/index.ts`

7. **Proteger con middleware**
   - Usar `authenticateToken` y `checkPermission` según el rol

---

## 🔐 Seguridad
- Cada endpoint puede validarse por rol (`Administrador`, `Usuario`) y por token (`JWT`) y CSRF (`x-csrf-token`).
- Llamadas internas entre microservicios usan `x-internal-call: true`.


Desarrollado con por Amed Dev
