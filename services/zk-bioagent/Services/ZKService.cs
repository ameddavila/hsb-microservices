using System;
using System.Runtime.InteropServices;

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
    }
}
