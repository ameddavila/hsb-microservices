using zkemkeeper;
using System.Collections.Generic;

namespace zk_bioagent.Services.ZKEM
{
    public class ZKEMDeviceService
    {
        private CZKEMClass zkem = new CZKEMClass();

        public bool Conectar(string ip, int puerto = 4370)
        {
            return zkem.Connect_Net(ip, puerto);
        }

        public int ObtenerCantidadMarcaciones()
        {
            int count = 0;
            zkem.GetDeviceStatus(1, 6, ref count);
            return count;
        }

        public List<Dictionary<string, object>> ObtenerRegistros()
        {
            var registros = new List<Dictionary<string, object>>();
            zkem.ReadGeneralLogData(1);

            string empId;
            int verifyMode, inOutMode, year, month, day, hour, minute, second, workCode = 0;

            while (zkem.SSR_GetGeneralLogData(1, out empId, out verifyMode, out inOutMode,
                out year, out month, out day, out hour, out minute, out second, ref workCode))
            {
                registros.Add(new Dictionary<string, object>
                {
                    { "personId", empId },
                    { "timestamp", $"{year:D4}-{month:D2}-{day:D2} {hour:D2}:{minute:D2}:{second:D2}" },
                    { "verifyMode", verifyMode },
                    { "inOutMode", inOutMode }
                });
            }

            return registros;
        }

        public void Desconectar()
        {
            zkem.Disconnect();
        }
    }
}
