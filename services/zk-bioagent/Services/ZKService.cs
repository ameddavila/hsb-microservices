using System.Runtime.InteropServices;
using zk_bioagent.Services.DTOs;
using zkemkeeper;

namespace zk_bioagent.Services
{
    public class ZKService
    {
        private const string DLL = "ZKHIDLib.dll";

        [DllImport(DLL, CallingConvention = CallingConvention.StdCall)]
        public static extern int ZKHID_Init();

        [DllImport(DLL, CallingConvention = CallingConvention.StdCall)]
        public static extern int ZKHID_Terminate();

        public string DummyHuella()
        {
            ZKHID_Init();
            ZKHID_Terminate();
            return "Simulación de huella OK";
        }


    public async Task<List<ZKUsuarioDto>> ObtenerUsuarios(string ip, int puerto = 4370)
{
    var usuarios = new List<ZKUsuarioDto>();
    var idsRegistrados = new HashSet<string>();

    CZKEMClass zkem = new CZKEMClass();
    bool conectado = zkem.Connect_Net(ip, puerto);

    if (!conectado)
        throw new Exception($"No se pudo conectar al dispositivo en IP {ip}:{puerto}");

    // Cargar los datos de usuario en memoria antes de leer
    zkem.ReadAllUserID(1);

    string enrollNumber = "";
    string name = "";
    string password = "";
    int privilege = 0;
    bool enabled = false;

    while (zkem.SSR_GetAllUserInfo(1, out enrollNumber, out name, out password, out privilege, out enabled))
    {
        string id = enrollNumber?.Trim();

        // Filtrar usuarios inválidos
        if (string.IsNullOrWhiteSpace(id) || id == "0" || id.Length < 2 || idsRegistrados.Contains(id))
            continue;

        if (privilege < 0 || privilege > 10)
            continue;

        string nombreLimpio = name?.Trim() ?? "";
        if (nombreLimpio.Length < 1 && privilege == 0)
            continue;

        usuarios.Add(new ZKUsuarioDto
        {
            Id = id,
            Nombre = nombreLimpio,
            Privilegio = privilege,
            Habilitado = enabled,
            DispositivoIp = ip
        });

        idsRegistrados.Add(id);
    }

    zkem.Disconnect();
    return usuarios;
}

    }
}
