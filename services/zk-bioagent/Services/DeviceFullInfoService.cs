using System.Text;
using System.Text.Json;
using zk_bioagent.Helpers;

namespace zk_bioagent.Services
{
    public class DeviceFullInfoService
    {
        public class DispositivoFull
        {
            public string? DeviceName { get; set; }
            public string? ProductModel { get; set; }
            public string? SerialNumber { get; set; }
            public string? IPAddress { get; set; }
            public string? FirmwareVersion { get; set; }
            public int personCount { get; set; }
            public int fpCount { get; set; }
            public int palmCount { get; set; }
            public int faceCount { get; set; }
            public int recordCount { get; set; }
        }

        public DispositivoFull? ObtenerTodo()
        {
            ZKInterop.ZKHID_Init();

            IntPtr handle;
            int res = ZKInterop.ZKHID_Open(0, out handle);
            if (res != 0)
            {
                ZKInterop.ZKHID_Terminate();
                return null;
            }

            // Obtener Detalle
            byte[] bufferDetalle = new byte[4096];
            int lenDetalle = bufferDetalle.Length;
            res = ZKInterop.ZKHID_GetConfig(handle, 5, bufferDetalle, ref lenDetalle);
            if (res != 0)
            {
                ZKInterop.ZKHID_Close(handle);
                ZKInterop.ZKHID_Terminate();
                return null;
            }
            var jsonDetalle = Encoding.UTF8.GetString(bufferDetalle, 0, lenDetalle);
            var detalle = JsonSerializer.Deserialize<DispositivoFull>(jsonDetalle) ?? new DispositivoFull();

            // Obtener Estadísticas
            byte[] bufferStats = new byte[4096];
            int lenStats = bufferStats.Length;
            res = ZKInterop.ZKHID_ManageModuleData(handle, 6, "", bufferStats, ref lenStats); // 6 = QUERY_STATISTICS
            if (res != 0)
            {
                ZKInterop.ZKHID_Close(handle);
                ZKInterop.ZKHID_Terminate();
                return null;
            }

            var jsonStats = Encoding.UTF8.GetString(bufferStats, 0, lenStats);
            var stats = JsonSerializer.Deserialize<DeviceStatsService.EstadisticasDispositivo>(jsonStats);

            ZKInterop.ZKHID_Close(handle);
            ZKInterop.ZKHID_Terminate();

            // Unir
            if (stats != null)
            {
                detalle.personCount = stats.personCount;
                detalle.fpCount = stats.fpCount;
                detalle.palmCount = stats.palmCount;
                detalle.faceCount = stats.faceCount;
                detalle.recordCount = stats.recordCount;
            }

            return detalle;
        }
    }
}
