export interface PlantillaZK {
  empleadoId: string;
  nombre: string;
  tipo: "finger" | "face";
  plantilla: string;
  dedo?: string;
}

export interface UsuarioZKBuffer {
  id: string;                        // EnrollNumber del dispositivo
  nombre: string;                    // Nombre visible del usuario
  privilegio: number;               // Nivel de acceso (0=Usuario, 14=Admin)
  habilitado: boolean;              // Si está activo en el dispositivo
  dispositivoIp: string;            // IP desde donde fue leído
  tieneRostro: boolean;             // ¿Tiene rostro registrado?
  faceDataBase64?: string;          // Plantilla de rostro en base64
  faceLength?: number;              // Tamaño en bytes del rostro

  tieneHuella: boolean;             // ¿Tiene alguna huella?
  huellas?: {
    dedoIndex: number;              // Índice del dedo (0-9)
    huellaDataBase64: string;       // Plantilla de huella en base64
  }[];

  tienePassword: boolean;           // ¿Tiene password configurado?
  passwordData?: string;            // Password en string (se convertirá a base64)

  tienePalma: boolean;              // ¿Tiene palma registrada?
  palmaDataBase64?: string;         // Plantilla de palma en base64
  palmaLength?: number;             // Tamaño de la palma

  userIdNumerico?: number;          // USERID interno del dispositivo (si disponible)
}


