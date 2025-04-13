using System;
using zk_sync_service.Interop;

namespace zk_sync_service.Services
{
    public class ZktecoSdkService
    {
        private const int MachineNumber = 1;

        public bool Conectar(string ip, int port)
        {
            return Zkemkeeper.Connect_Net(ip, port);
        }

        public void Desconectar()
        {
            Zkemkeeper.Disconnect();
        }

        // 🔹 HUELLAS
        public byte[]? ObtenerTemplateHuella(string enrollId, int fingerIndex)
        {
            Console.WriteLine($"📥 Buscando huella: EnrollId={enrollId}, Dedo={fingerIndex}");

            byte[] template = new byte[2048];
            int length = 0;

            bool success = Zkemkeeper.GetUserTemplate(MachineNumber, int.Parse(enrollId), fingerIndex, ref template, ref length);

            Console.WriteLine($"🔍 GetUserTemplate => success={success}, length={length}");

            return (success && length > 0) ? template[..length] : null;
        }

        public bool SubirTemplateHuella(string enrollId, int fingerIndex, byte[] template)
        {
            return Zkemkeeper.SetUserTemplate(MachineNumber, int.Parse(enrollId), fingerIndex, template, template.Length);
        }

        // 🔹 FACIAL
        public byte[]? ObtenerPlantillaFacial(string enrollId, int faceIndex = 50)
        {
            byte[] template = new byte[2048];
            int length = 0;

            bool success = Zkemkeeper.GetUserFace(MachineNumber, enrollId, faceIndex, ref template, ref length);

            return (success && length > 0) ? template[..length] : null;
        }

        public bool SubirPlantillaFacial(string enrollId, byte[] template, int faceIndex = 50)
        {
            return Zkemkeeper.SetUserFace(MachineNumber, enrollId, faceIndex, template, template.Length);
        }
    }
}
