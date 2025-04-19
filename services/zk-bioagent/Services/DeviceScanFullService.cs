using zk_bioagent.Services;

namespace zk_bioagent.Services
{
    public class DeviceScanFullService
    {
        private readonly DeviceDiscoveryService _scanner = new();
        private readonly DeviceBatchService _batch = new();

        public async Task<List<DeviceBatchService.ResumenDispositivo>> EscanearYObtener(string inicio, string fin, int puerto = 4370)
        {
            // Escanea IPs activas en red local
            var activos = await _scanner.BuscarDispositivos(inicio, fin, puerto);

            // Para cada IP encontrada, obtener su detalle completo
            return await _batch.ObtenerInfoDeIPs(activos, puerto);
        }
    }
}
