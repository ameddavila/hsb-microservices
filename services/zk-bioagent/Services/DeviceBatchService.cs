using System.Text;
using System.Text.Json;
using zk_bioagent.Helpers;
using zkemkeeper;

namespace zk_bioagent.Services
{
    public class DeviceBatchService
    {
        public class EntradaDispositivo
        {
            public List<string> ips { get; set; } = new();
        }

        public class ResumenDispositivo
        {
            public string ip { get; set; } = "";
            public string tipo { get; set; } = ""; // "ZKEM" o "ZKHID"
            public DeviceInfoService.DispositivoDetalle? detalle { get; set; }
            public DeviceStatsService.EstadisticasDispositivo? estadisticas { get; set; }
        }

        public async Task<List<ResumenDispositivo>> ObtenerInfoDeIPs(List<string> ips, int puerto = 4370)
        {
            var resultados = new List<ResumenDispositivo>();

            foreach (var ip in ips)
            {
                Console.WriteLine($"🌐 Verificando IP: {ip}");
                try
                {
                    var resultado = await ObtenerPorIP(ip, puerto);
                    if (resultado != null)
                        resultados.Add(resultado);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Error en IP {ip}: {ex.Message}");
                }
            }

            return resultados;
        }

private async Task<ResumenDispositivo?> ObtenerPorIP(string ip, int puerto)
{
    try
    {
        // 👉 Intentar primero con zkemkeeper (G2/G3 por IP)
        var zkem = new CZKEMClass();
        if (zkem.Connect_Net(ip, puerto))
        {
            string ipAddress = "";
            string sn = "";
            string model = "";
            string firmware = "";
            zkem.GetDeviceIP(1, ref ipAddress);
            zkem.GetSerialNumber(1, out sn);
            zkem.GetProductCode(1, out model);
            zkem.GetFirmwareVersion(1, ref firmware);
             zkem.GetDeviceStrInfo(1, 5, out string name);

            // ⚠️ Declarar variables antes del uso con ref
            int users = 0, templates = 0, logs = 0, faceCount = 0;
            zkem.GetDeviceStatus(1, 2, ref users);
            zkem.GetDeviceStatus(1, 3, ref templates);
            zkem.GetDeviceStatus(1, 6, ref logs);
            zkem.GetDeviceStatus(1, 21, ref faceCount);

            zkem.Disconnect();

            // Reemplazar nombre si es genérico
            if (name == "10" || string.IsNullOrWhiteSpace(name))
                name = model;

            return new ResumenDispositivo
            {
                ip = ip,
                tipo = "ZKEM",
                detalle = new DeviceInfoService.DispositivoDetalle
                {
                    DeviceName = name,
                    ProductModel = model,
                    SerialNumber = sn,
                    IPAddress = ipAddress,
                    FirmwareVersion = firmware
                },
                estadisticas = new DeviceStatsService.EstadisticasDispositivo
                {
                    personCount = users,
                    fpCount = templates,
                    faceCount = faceCount,
                    palmCount = 0,
                    recordCount = logs
                }
            };
        }

        // 👉 Fallback: ZKHID (USB)
        ZKInterop.ZKHID_Init();
        IntPtr handle;
        int res = ZKInterop.ZKHID_Open(0, out handle);
        if (res != 0)
        {
            ZKInterop.ZKHID_Terminate();
            return null;
        }

        byte[] bufDetalle = new byte[4096];
        int lenDetalle = bufDetalle.Length;
        res = ZKInterop.ZKHID_GetConfig(handle, 5, bufDetalle, ref lenDetalle);
        if (res != 0)
        {
            ZKInterop.ZKHID_Close(handle);
            ZKInterop.ZKHID_Terminate();
            return null;
        }

        var detalle = JsonSerializer.Deserialize<DeviceInfoService.DispositivoDetalle>(
            Encoding.UTF8.GetString(bufDetalle, 0, lenDetalle));

        byte[] bufStats = new byte[4096];
        int lenStats = bufStats.Length;
        res = ZKInterop.ZKHID_ManageModuleData(handle, 6, "", bufStats, ref lenStats);
        if (res != 0)
        {
            ZKInterop.ZKHID_Close(handle);
            ZKInterop.ZKHID_Terminate();
            return null;
        }

        var stats = JsonSerializer.Deserialize<DeviceStatsService.EstadisticasDispositivo>(
            Encoding.UTF8.GetString(bufStats, 0, lenStats));

        ZKInterop.ZKHID_Close(handle);
        ZKInterop.ZKHID_Terminate();

        return new ResumenDispositivo
        {
            ip = ip,
            tipo = "ZKHID",
            detalle = detalle,
            estadisticas = stats
        };
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error general en dispositivo {ip}: {ex.Message}");
        return null;
    }
}


    }
}
