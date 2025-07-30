// types.ts
export interface DispositivoInput {
    zonaId: number;
    nombre: string;               // alias definido por el usuario
    numeroSerie: string;
    ip: string;
    puerto: number;
    modelo: string;
    ubicacion: string;
  }
  
  export interface DispositivoDetalle {
    deviceName: string;
    productModel: string;
    serialNumber: string;
    ipAddress: string;
    firmwareVersion: string;
  }
  
  export interface EstadisticasDispositivo {
    personCount: number;
    fpCount: number;
    palmCount: number;
    faceCount: number;
    recordCount: number;
  }
  
  export interface DispositivoResumen {
    ip: string;
    tipo: "ZKEM" | "ZKHID";
    detalle: DispositivoDetalle;
    estadisticas: EstadisticasDispositivo;
  }
  
  export interface DispositivoResponse {
    success: boolean;
    dispositivos: DispositivoResumen[];
  }
  
  export interface ZKUsuario {
    id: string;
    nombre: string;
    privilegio: number;
    habilitado: boolean;
    dispositivoIp: string;
  }
  
  export interface ZKUsuarioResponse {
    success: boolean;
    usuarios: ZKUsuario[];
  }

  export type TipoCredencial = "rostro" | "huella" | "password";
