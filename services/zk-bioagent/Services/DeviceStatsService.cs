using System.Text;
using System.Text.Json;
using zk_bioagent.Helpers;

namespace zk_bioagent.Services
{
    public class DeviceStatsService
    {
        public class EstadisticasDispositivo
        {
            public int personCount { get; set; }
            public int fpCount { get; set; }
            public int palmCount { get; set; }
            public int faceCount { get; set; }
            public int recordCount { get; set; }
        }

        public EstadisticasDispositivo? ObtenerEstadisticas()
        {
            ZKInterop.ZKHID_Init();

            IntPtr handle;
            int res = ZKInterop.ZKHID_Open(0, out handle);
            if (res != 0)
            {
                ZKInterop.ZKHID_Terminate();
                return null;
            }

            byte[] buffer = new byte[4096];
            int len = buffer.Length;

            res = ZKInterop.ZKHID_ManageModuleData(handle, 6, "", buffer, ref len); // 6 = QUERY_STATISTICS

            ZKInterop.ZKHID_Close(handle);
            ZKInterop.ZKHID_Terminate();

            if (res != 0) return null;

            string json = Encoding.UTF8.GetString(buffer, 0, len);
            return JsonSerializer.Deserialize<EstadisticasDispositivo>(json);
        }
    }
}
