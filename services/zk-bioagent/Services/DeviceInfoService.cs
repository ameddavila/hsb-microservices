using zkemkeeper;
using System.Text;
using System.Text.Json;
using zk_bioagent.Helpers;

namespace zk_bioagent.Services
{
    public class DeviceInfoService
    {
        public class DispositivoDetalle
        {
            public string? DeviceName { get; set; }
            public string? ProductModel { get; set; }
            public string? SerialNumber { get; set; }
            public string? IPAddress { get; set; }
            public string? FirmwareVersion { get; set; }
        }

        public DispositivoDetalle? ObtenerDetalle(string? ip = null)
        {
            if (!string.IsNullOrEmpty(ip))
            {
                // 👉 Modo zkemkeeper (por IP)
                Console.WriteLine($"🌐 Usando zkemkeeper para IP: {ip}");

                try
                {
                    var zkem = new CZKEMClass();

                    if (!zkem.Connect_Net(ip, 4370))
                    {
                        Console.WriteLine("❌ No se pudo conectar vía zkemkeeper.");
                        return null;
                    }

                    string ipAddress = "";
                    string sn = "";
                    string model = "";
                    string firmware = "";
                    string name = "ZKTeco Device"; // Valor manual

                    zkem.GetDeviceIP(1, ref ipAddress);
                    zkem.GetSerialNumber(1, out sn);
                    zkem.GetProductCode(1, out model);
                    zkem.GetFirmwareVersion(1, ref firmware);

                    zkem.Disconnect();

                    return new DispositivoDetalle
                    {
                        DeviceName = name,
                        ProductModel = model,
                        SerialNumber = sn,
                        IPAddress = ipAddress,
                        FirmwareVersion = firmware
                    };
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Error en zkemkeeper: {ex.Message}");
                    return null;
                }
            }
            else
            {
                // 👉 Modo ZKHIDLib (dispositivo local index 0)
                Console.WriteLine("🟡 Iniciando ZKHID_Init...");
                ZKInterop.ZKHID_Init();

                Console.WriteLine("🔵 Intentando abrir el dispositivo...");
                IntPtr handle;
                int res = ZKInterop.ZKHID_Open(0, out handle);
                Console.WriteLine($"🔧 Resultado ZKHID_Open: {res}");

                if (res != 0)
                {
                    Console.WriteLine("❌ No se pudo abrir el dispositivo.");
                    ZKInterop.ZKHID_Terminate();
                    return null;
                }

                byte[] buffer = new byte[4096];
                int len = buffer.Length;

                Console.WriteLine("📦 Solicitando configuración...");
                res = ZKInterop.ZKHID_GetConfig(handle, 5, buffer, ref len);
                Console.WriteLine($"📥 Resultado ZKHID_GetConfig: {res}");

                ZKInterop.ZKHID_Close(handle);
                ZKInterop.ZKHID_Terminate();

                if (res != 0)
                {
                    Console.WriteLine("❌ Error al obtener la configuración del dispositivo.");
                    return null;
                }

                string json = Encoding.UTF8.GetString(buffer, 0, len);
                Console.WriteLine($"✅ Config JSON recibido: {json}");

                return JsonSerializer.Deserialize<DispositivoDetalle>(json);
            }
        }
    }
}
