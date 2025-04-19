using Microsoft.AspNetCore.Mvc;
using zk_bioagent.Services;
using zk_bioagent.Services.ZKEM;
//using zk_bioagent.Services.ZKHID;

namespace zk_bioagent.Controllers
{
    [ApiController]
    [Route("api/biometria")]
    public class BiometriaController : ControllerBase
    {
        private readonly ZKService _zkService;

        public BiometriaController(ZKService zkService)
        {
            _zkService = zkService;
        }
        
        /// <summary>
        /// Escanea la red local y devuelve IPs activas con puerto 4370 (ZKTeco).
        /// </summary>
        [HttpGet("scan")]
        public async Task<IActionResult> EscanearRed(
            [FromQuery] string inicio = "192.168.0.1",
            [FromQuery] string fin = "192.168.7.254",
            [FromQuery] int puerto = 4370)
        {
            var servicio = new DeviceDiscoveryService();
            var encontrados = await servicio.BuscarDispositivos(inicio, fin, puerto);
            return Ok(new { success = true, dispositivos = encontrados });
        }

        /// <summary>
        /// Consulta los datos básicos del dispositivo (modelo, firmware, IP, SN).
        /// </summary>
        [HttpGet("detalle")]
        public IActionResult ObtenerDetalleDispositivo([FromQuery] string? ip = null)
        {
            var servicio = new DeviceInfoService();
            var detalle = servicio.ObtenerDetalle(ip);

            if (detalle == null)
                return BadRequest(new { success = false, mensaje = "No se pudo obtener la información del dispositivo." });

            return Ok(new { success = true, detalle });
        }

        /// <summary>
        /// Captura una huella biométrica (simulado, vía ZKHIDLib).
        /// </summary>
        [HttpPost("huella")]
        public IActionResult CapturarHuella()
        {
            var servicio = new BiometriaService();
            var resultado = servicio.CapturarHuellaDummy();

            if (resultado == null)
                return BadRequest(new { success = false, mensaje = "No se pudo capturar la huella." });

            return Ok(new { success = true, template = resultado });
        }

        /// <summary>
        /// Obtiene información detallada (datos + estadísticas) de múltiples dispositivos por IP.
        /// </summary>
        [HttpPost("batch")]
        public async Task<IActionResult> ObtenerInfoPorLote([FromBody] DeviceBatchService.EntradaDispositivo input)
        {
            var servicio = new DeviceBatchService();
            var resultados = await servicio.ObtenerInfoDeIPs(input.ips);

            return Ok(new
            {
                success = true,
                resultados
            });
        }

        /// <summary>
        /// Consulta detalle completo de un único dispositivo por su IP.
        /// </summary>
        [HttpGet("batch/ip")]
        public async Task<IActionResult> ObtenerInfoPorIP([FromQuery] string ip)
        {
            var servicio = new DeviceBatchService();
            var resultado = await servicio.ObtenerInfoDeIPs(new List<string> { ip });

            if (resultado == null || resultado.Count == 0)
                return BadRequest(new { success = false, mensaje = $"No se pudo obtener información para {ip}" });

            return Ok(new
            {
                success = true,
                resultado = resultado[0]
            });
        }

        /// <summary>
        /// Consulta la cantidad total de registros biométricos (asistencias) en un dispositivo.
        /// </summary>
        [HttpGet("zkem/logs-count")]
        public IActionResult ObtenerCantidad([FromQuery] string ip)
        {
            var servicio = new ZKEMDeviceService();

            if (!servicio.Conectar(ip))
                return BadRequest(new { success = false, mensaje = "No se pudo conectar al dispositivo." });

            var cantidad = servicio.ObtenerCantidadMarcaciones();
            servicio.Desconectar();

            return Ok(new { success = true, ip, cantidad });
        }

        /// <summary>
        /// Descarga todos los registros biométricos del dispositivo (asistencias).
        /// </summary>
        [HttpGet("zkem/logs")]
        public IActionResult DescargarLogs([FromQuery] string ip)
        {
            var servicio = new ZKEMDeviceService();

            if (!servicio.Conectar(ip))
                return BadRequest(new { success = false, mensaje = "No se pudo conectar al dispositivo." });

            var registros = servicio.ObtenerRegistros();
            servicio.Desconectar();

            return Ok(new { success = true, ip, registros });
        }

        /// <summary>
        /// Escanea IPs activas y devuelve información completa de cada dispositivo ZKTeco.
        /// </summary>
        [HttpGet("scan/full")]
        public async Task<IActionResult> EscanearRedYObtenerDetalles(
            [FromQuery] string inicio = "192.168.0.1",
            [FromQuery] string fin = "192.168.7.254",
            [FromQuery] int puerto = 4370)
        {
            var servicio = new DeviceScanFullService();
            var resultados = await servicio.EscanearYObtener(inicio, fin, puerto);

            return Ok(new { success = true, dispositivos = resultados });
        }
        /// <summary>
        /// Obtiene la lista de usuarios registrados en un dispositivo ZKTeco especificado por IP.
        /// Usa el SDK zkemkeeper.dll para conectarse al dispositivo y recuperar datos como ID, nombre,
        /// privilegio y estado (habilitado o no).
        /// </summary>
        /// <param name="ip">Dirección IP del dispositivo ZKTeco</param>
        /// <returns>Lista de usuarios en formato JSON</returns>
        [HttpGet("usuarios")]
        public async Task<IActionResult> ObtenerUsuarios([FromQuery] string ip)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(ip))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "IP no proporcionada"
                    });
                }

                var usuarios = await _zkService.ObtenerUsuarios(ip);

                return Ok(new
                {
                    success = true,
                    usuarios
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Error al obtener usuarios: {ex.Message}"
                });
            }
        }


    }
}
