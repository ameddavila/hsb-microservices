using Microsoft.AspNetCore.Mvc;
using zk_sync_service.Services;

namespace zk_sync_service.Controllers
{
    [ApiController]
    [Route("api/zkteco")]
    public class ZktecoController : ControllerBase
    {
        private readonly ZktecoSdkService _sdk = new();

        [HttpPost("get-template")]
        public IActionResult ObtenerTemplate([FromBody] ZkRequest req)
        {
            try
            {
                Console.WriteLine($"🔌 Conectando al dispositivo {req.Ip}:{req.Port}...");
                if (!_sdk.Conectar(req.Ip, req.Port))
                {
                    Console.WriteLine("❌ No se pudo conectar.");
                    return BadRequest("No se pudo conectar al dispositivo");
                }

                Console.WriteLine($"📥 Buscando plantilla: EnrollId={req.EnrollId}, Finger={req.FingerIndex}");
                var plantilla = _sdk.ObtenerTemplateHuella(req.EnrollId, req.FingerIndex);
                _sdk.Desconectar();

                if (plantilla == null)
                {
                    Console.WriteLine("⚠️ No se encontró plantilla.");
                    return NotFound("Plantilla no encontrada");
                }

                Console.WriteLine("✅ Plantilla encontrada, longitud: " + plantilla.Length);
                return Ok(Convert.ToBase64String(plantilla));
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error interno: " + ex.Message);
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }

    public class ZkRequest
    {
        public string Ip { get; set; } = "";
        public int Port { get; set; }
        public string EnrollId { get; set; } = "";
        public int FingerIndex { get; set; }
    }
}
