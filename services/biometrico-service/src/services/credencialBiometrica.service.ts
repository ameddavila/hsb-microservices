import { z } from "zod";
import axios from "axios";
import { Buffer } from "buffer";
import { logger } from "../utils/logger";
import EmpleadoModel from "../models/empleado.model";
import CredencialBiometricaModel from "../models/credencialBiometrica.model";
import EmpleadoDispositivoModel from "../models/empleadoDispositivo.model";
import DispositivoModel from "../models/dispositivo.model";
import { UsuarioZKBuffer } from "../types/PlantillaZK";
import { ZKAgentClient } from "../services/zkBioagentClient.service";  // Asegúrate que exportas correctamente

const BASE_ZK_AGENT = process.env.ZK_AGENT_BASE_URL || "http://localhost:3010";
const tipoBiometriaSchema = z.enum(['rostro', 'huella', 'password']);

interface EmpleadoConDispositivo extends EmpleadoModel {
    dispositivosAsignados: {
        dispositivoAsignado: DispositivoModel
    }[];
}

// Helper para dividir en lotes
const dividirEnLotes = (array: string[], tamañoLote: number): string[][] => {
    const resultados = [];
    for (let i = 0; i < array.length; i += tamañoLote) {
        resultados.push(array.slice(i, i + tamañoLote));
    }
    return resultados;
};


// =======================================================
// 🔹 1️⃣ Sincronizar plantillas desde un dispositivo específico
// =======================================================
export const sincronizarPlantillasDesdeZKAgent = async (dispositivoId: number, tipo: string) => {
    tipoBiometriaSchema.parse(tipo);

    const dispositivo = await DispositivoModel.findByPk(dispositivoId);
    if (!dispositivo) throw new Error(`Dispositivo con ID ${dispositivoId} no encontrado.`);

    logger.info(`🔌 Conectando a ${dispositivo.ip} para sincronizar '${tipo}'`);

    const usuarios = await consultarDispositivo(dispositivo.ip, tipo);

    const resultados: any[] = [];
    for (const usuario of usuarios) {
        const empleado = await EmpleadoModel.findOne({ where: { codigoEmpleado: usuario.id } });
        if (!empleado) {
            resultados.push({ codigoEmpleado: usuario.id, estado: "Empleado no encontrado" });
            continue;
        }
        await procesarPorTipo(empleado, usuario, tipo, dispositivo.ip, resultados);
    }

    logger.success(`✅ Sincronización completada para ${dispositivo.ip}`);
    return generarResumenResultados(dispositivo.nombre || dispositivo.ip, tipo, usuarios.length, resultados);
};


// =======================================================
// 🔹 2️⃣ Sincronizar credenciales faltantes globalmente
// =======================================================
export const sincronizarCredencialesFaltantes = async (tipo: string) => {
    tipoBiometriaSchema.parse(tipo);

    const empleados = await EmpleadoModel.findAll({
        include: [
            { model: CredencialBiometricaModel, as: "credenciales", where: { tipo, activo: true }, required: false },
            { model: EmpleadoDispositivoModel, as: "dispositivosAsignados", required: true, include: [{ model: DispositivoModel, as: "dispositivoAsignado", required: true }] }
        ]
    });

    const empleadosFaltantes = empleados.filter(emp => 
        !emp.getDataValue('credenciales') || emp.getDataValue('credenciales').length === 0
    );

    logger.info(`🔄 Procesando ${empleadosFaltantes.length} empleados sin '${tipo}'`);

    const resultados: any[] = [];
    const agrupadoPorIp: Record<string, string[]> = {};

    // Agrupación por IP
    for (const empleado of empleadosFaltantes) {
        const empleadoConDispositivo = empleado as EmpleadoConDispositivo;
        const dispositivo = empleadoConDispositivo.dispositivosAsignados[0]?.dispositivoAsignado;

        if (!dispositivo) continue;

        if (!agrupadoPorIp[dispositivo.ip]) agrupadoPorIp[dispositivo.ip] = [];
        agrupadoPorIp[dispositivo.ip].push(empleado.codigoEmpleado);
    }

    // Procesar por cada IP en lotes
    const TAMAÑO_LOTE = 100;

    for (const ip in agrupadoPorIp) {
        const codigos = agrupadoPorIp[ip];
        const lotes = dividirEnLotes(codigos, TAMAÑO_LOTE);

        for (const lote of lotes) {
            logger.info(`🚀 Consultando zk-bioagent | IP: ${ip} | Tipo: ${tipo} | Lote de: ${lote.length}`);

            const usuarios = await consultarDispositivo(ip, tipo, lote);

            for (const usuario of usuarios) {
                const empleado = empleadosFaltantes.find(e => e.codigoEmpleado === usuario.id);
                if (!empleado) {
                    resultados.push({ codigoEmpleado: usuario.id, estado: "Empleado no encontrado en BD" });
                    continue;
                }
                await procesarPorTipo(empleado, usuario, tipo, ip, resultados);
            }
        }
    }

    logger.success(`🎯 Sincronización de faltantes completada.`);

    return generarResumenResultados("Global", tipo, empleadosFaltantes.length, resultados);
};


// =======================================================
// 🔹 Consulta al zk-bioagent para obtener usuarios biométricos
// =======================================================
const consultarDispositivo = async (ip: string, tipo: string, codigos: string[] = []) => {
    try {
        if (codigos.length === 0) {
            throw new Error("No se proporcionaron códigos para consultar.");
        }

        const { data } = await axios.post<{ success: boolean; data: UsuarioZKBuffer[] }>(
            `${BASE_ZK_AGENT}/api/biometria/usuario`,
            codigos,   // 👉 Enviar el array directamente
            { params: { ip, tipo }, 
            //timeout: 15000 
            }
        );

        if (!data.success) throw new Error("Respuesta negativa del zk-bioagent");
        return data.data;

    } catch (err) {
        logger.error(`❌ Error consultando ${ip}: ${(err as Error).message}`);
        return [];
    }
};




// =======================================================
// 🔹 Procesar empleado en sus dispositivos asignados
// =======================================================
const procesarEmpleado = async (empleado: any, tipo: string, resultados: any[]) => {
    const dispositivos = empleado.dispositivosAsignados.map((ed: any) => ed.dispositivoAsignado) || [];

    for (const dispositivo of dispositivos) {
        const usuarios = await consultarDispositivo(dispositivo.ip, tipo, empleado.codigoEmpleado);
        const usuarioZK = usuarios.find(u => u.id === empleado.NombreBio);
        if (!usuarioZK) continue;

        await procesarPorTipo(empleado, usuarioZK, tipo, dispositivo.ip, resultados);
        return;
    }

    resultados.push({ empleadoId: empleado.empleadoId, nombre: empleado.nombre, estado: "No encontrado en dispositivos" });
};


// =======================================================
// 🔹 Procesar datos según tipo de biometría
// =======================================================
const procesarPorTipo = async (empleado: any, usuarioZK: UsuarioZKBuffer, tipo: string, ip: string, resultados: any[]) => {
    if (tipo === "rostro" && usuarioZK.tieneRostro && usuarioZK.faceDataBase64) {
        logger.info(`📸 Rostro - ${empleado.nombre}`);
        await registrarSimple(empleado, tipo, usuarioZK.faceDataBase64, ip, resultados);
    }

    if (tipo === "password" && usuarioZK.tienePassword && usuarioZK.passwordData) {
        logger.info(`🔐 Password - ${empleado.nombre}`);
        await registrarSimple(empleado, tipo, Buffer.from(usuarioZK.passwordData).toString('base64'), ip, resultados);
    }

    if (tipo === "huella" && usuarioZK.tieneHuella && Array.isArray(usuarioZK.huellas)) {
        logger.info(`✋ Huellas (${usuarioZK.huellas.length}) - ${empleado.nombre}`);
        for (const huella of usuarioZK.huellas) {
            if (huella.huellaDataBase64) {
                await registrarHuella(empleado, huella, ip, resultados);
            }
        }
    }
};


// =======================================================
// 🔹 Registro simple (rostro, password)
// =======================================================
const registrarSimple = async (empleado: any, tipo: string, dataBase64: string, ip: string, resultados: any[]) => {
    const existe = await CredencialBiometricaModel.findOne({ where: { empleadoId: empleado.empleadoId, tipo, activo: true } });
    if (existe) {
        resultados.push({ empleadoId: empleado.empleadoId, nombre: empleado.nombre, dispositivo: ip, estado: "Ya existía" });
        return;
    }
    await CredencialBiometricaModel.create({ empleadoId: empleado.empleadoId, tipo, valor: Buffer.from(dataBase64, "base64"), activo: true });
    resultados.push({ empleadoId: empleado.empleadoId, nombre: empleado.nombre, dispositivo: ip, estado: "Registrado" });
};


// =======================================================
// 🔹 Registro específico de huellas
// =======================================================
const registrarHuella = async (empleado: any, huella: any, ip: string, resultados: any[]) => {
    const existe = await CredencialBiometricaModel.findOne({
        where: { empleadoId: empleado.empleadoId, tipo: "huella", dedo: huella.dedoIndex.toString(), activo: true }
    });

    if (existe) {
        resultados.push({ empleadoId: empleado.empleadoId, nombre: empleado.nombre, dedo: huella.dedoIndex, dispositivo: ip, estado: "Huella ya existente" });
        return;
    }

    await CredencialBiometricaModel.create({
        empleadoId: empleado.empleadoId,
        tipo: "huella",
        valor: Buffer.from(huella.huellaDataBase64, "base64"),
        dedo: huella.dedoIndex.toString(),
        activo: true
    });

    resultados.push({ empleadoId: empleado.empleadoId, nombre: empleado.nombre, dedo: huella.dedoIndex, dispositivo: ip, estado: "Huella registrada" });
};


// =======================================================
// 🔹 Generar resumen estándar de resultados
// =======================================================
const generarResumenResultados = (dispositivo: string, tipo: string, total: number, resultados: any[]) => ({
    dispositivo,
    tipoSincronizado: tipo,
    totalUsuariosProcesados: total,
    registrados: resultados.filter(r => r.estado.includes("Registrado")).length,
    yaExistentes: resultados.filter(r => r.estado.includes("existía")).length,
    noEncontrados: resultados.filter(r => r.estado.includes("no encontrado")).length,
    detalles: resultados
});


// =======================================================
// 🔹 Obtener estado actual de las credenciales desde la bd
// =======================================================
export const obtenerEstadoCredenciales = async (tipo: string) => {
    const empleados = await EmpleadoModel.findAll({
        include: [
            {
                model: CredencialBiometricaModel,
                as: "credenciales",
                where: tipo !== "todo" ? { tipo, activo: true } : {},
                required: false
            },
            {
                model: EmpleadoDispositivoModel,
                as: "dispositivosAsignados",
                include: [{ model: DispositivoModel, as: "dispositivoAsignado" }]
            }
        ]
    });

    return empleados.map(empleado => {
        const credenciales = empleado.getDataValue('credenciales') || [];
        const dispositivos = empleado.get('dispositivosAsignados') as any[];
    
        return {
            empleadoId: empleado.empleadoId,
            codigoEmpleado: empleado.codigoEmpleado,
            nombreBio: empleado.NombreBio,
            dispositivoIp: dispositivos[0]?.dispositivoAsignado?.ip || "No asignado",
            tieneRostro: credenciales.some((c: any) => c.tipo === 'rostro'),
            tieneHuella: credenciales.some((c: any) => c.tipo === 'huella'),
            huellasRegistradas: credenciales.filter((c: any) => c.tipo === 'huella').length,
            tienePassword: credenciales.some((c: any) => c.tipo === 'password'),
            tienePalma: credenciales.some((c: any) => c.tipo === 'palma')
        };
    });
    
};
