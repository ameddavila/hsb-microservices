using System.Net.Sockets;
using System.Net;

namespace zk_bioagent.Services
{
    public class DeviceScanner
    {
        public async Task<List<string>> BuscarDispositivos(string inicio, string fin, int puerto = 4370)
        {
            var dispositivos = new List<string>();
            var tareas = new List<Task>();

            IPAddress ipInicio = IPAddress.Parse(inicio);
            IPAddress ipFin = IPAddress.Parse(fin);

            byte[] inicioBytes = ipInicio.GetAddressBytes();
            byte[] finBytes = ipFin.GetAddressBytes();

            uint ipInicioUint = BitConverter.ToUInt32(inicioBytes.Reverse().ToArray(), 0);
            uint ipFinUint = BitConverter.ToUInt32(finBytes.Reverse().ToArray(), 0);

            for (uint i = ipInicioUint; i <= ipFinUint; i++)
            {
                var ip = new IPAddress(BitConverter.GetBytes(i).Reverse().ToArray()).ToString();
                tareas.Add(Task.Run(async () =>
                {
                    try
                    {
                        using var tcp = new TcpClient();
                        var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(300));
                        await tcp.ConnectAsync(ip, puerto, cts.Token);
                        lock (dispositivos) dispositivos.Add(ip);
                    }
                    catch { /* no responde */ }
                }));
            }

            await Task.WhenAll(tareas);
            return dispositivos;
        }
    }
}
