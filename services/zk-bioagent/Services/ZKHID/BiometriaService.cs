using System.Text;
using zk_bioagent.Helpers;
//(Captura real de huella o rostro más adelante)
namespace zk_bioagent.Services
{
    public class BiometriaService
    {
        public string? CapturarHuellaDummy()
        {
            ZKInterop.ZKHID_Init();

            IntPtr handle;
            int res = ZKInterop.ZKHID_Open(0, out handle);
            if (res != 0)
            {
                ZKInterop.ZKHID_Terminate();
                return null;
            }

            byte[] buffer = new byte[102400];
            int length = buffer.Length;

            string json = "{ \"fingerIndex\": 1 }"; // opcional si quieres capturar dedo específico

            // Aquí iría ZKInterop.ZKHID_RegisterPalm(handle, json, buffer, ref length); ← se agrega luego

            ZKInterop.ZKHID_Close(handle);
            ZKInterop.ZKHID_Terminate();

            // Por ahora devolvemos dummy
            return Convert.ToBase64String(Encoding.UTF8.GetBytes("template-dummy"));
        }
    }
}
