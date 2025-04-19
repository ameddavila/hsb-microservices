using Microsoft.AspNetCore.Mvc;
using zk_bioagent.Services;
using zk_bioagent.Services.ZKEM;


namespace zk_bioagent.Controllers
{
    [ApiController]
    [Route("api/biometria")]
    public class BiometriaController : ControllerBase
    {
        /// <summary>
        /// Escanea la red local para encontrar dispositivos ZKTeco activos en el puerto 4370.
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
        /// Obtiene los detalles de un dispositivo (modelo, SN, IP, firmware).
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
        /// Obtiene las estadísticas del dispositivo (usuarios, huellas, rostros, marcaciones).
        /// </summary>
        [HttpGet("estadisticas")]
        public IActionResult ObtenerEstadisticas()
        {
            var servicio = new DeviceStatsService();
            var stats = servicio.ObtenerEstadisticas();

            if (stats == null)
                return BadRequest(new { success = false, mensaje = "No se pudo obtener estadísticas del dispositivo." });

            return Ok(new { success = true, estadisticas = stats });
        }

        /// <summary>
        /// Obtiene detalle + estadísticas del dispositivo en una sola respuesta.
        /// </summary>
        [HttpGet("full")]
        public IActionResult ObtenerTodoDelDispositivo()
        {
            var servicio = new DeviceFullInfoService();
            var full = servicio.ObtenerTodo();

            if (full == null)
                return BadRequest(new { success = false, mensaje = "No se pudo obtener la información completa del dispositivo." });

            return Ok(new { success = true, dispositivo = full });
        }

        /// <summary>
        /// Captura una huella (dummy temporal, será reemplazado).
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
        
        /*para despues trabajar con la bd*/
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




    }
}
