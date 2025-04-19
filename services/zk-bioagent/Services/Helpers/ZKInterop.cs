using System;
using System.Runtime.InteropServices;

namespace zk_bioagent.Helpers
{
    public static class ZKInterop
    {
        private const string DLL = "ZKHIDLib.dll";

        [DllImport(DLL, CallingConvention = CallingConvention.StdCall)]
        public static extern int ZKHID_Init();

        [DllImport(DLL, CallingConvention = CallingConvention.StdCall)]
        public static extern int ZKHID_Terminate();

        [DllImport(DLL, CallingConvention = CallingConvention.StdCall)]
        public static extern int ZKHID_Open(int index, out IntPtr handle);

        [DllImport(DLL, CallingConvention = CallingConvention.StdCall)]
        public static extern int ZKHID_Close(IntPtr handle);

        [DllImport(DLL, CallingConvention = CallingConvention.StdCall)]
        public static extern int ZKHID_GetConfig(IntPtr handle, int type, byte[] jsonBuffer, ref int len);

        [DllImport(DLL, CallingConvention = CallingConvention.StdCall)]
        public static extern int ZKHID_ManageModuleData(IntPtr handle, int type, string json, byte[] result, ref int len);
    }
}
