using System;
using System.Runtime.InteropServices;

namespace zk_sync_service.Interop
{
    public static class Zkemkeeper
    {
        [DllImport("zkemsdk.dll")]
        public static extern bool Connect_Net(string ip, int port);

        [DllImport("zkemsdk.dll")]
        public static extern void Disconnect();

        [DllImport("zkemsdk.dll")]
        public static extern bool ReadAllUserID(int machineNumber);

        [DllImport("zkemsdk.dll")]
        public static extern bool GetUserTemplate(
            int machineNumber,
            int enrollNumber,
            int fingerIndex,
            ref byte[] template,
            ref int templateLength);

        [DllImport("zkemsdk.dll")]
        public static extern bool SetUserTemplate(
            int machineNumber,
            int enrollNumber,
            int fingerIndex,
            byte[] template,
            int templateLength);
            [DllImport("zkemkeeper.dll", CharSet = CharSet.Ansi)]
        public static extern bool GetUserFace(
            int machineNumber,
            string enrollId,
            int faceIndex,
            ref byte[] template,
            ref int length);

        [DllImport("zkemkeeper.dll", CharSet = CharSet.Ansi)]
        public static extern bool SetUserFace(
            int machineNumber,
            string enrollId,
            int faceIndex,
            byte[] template,
            int length);

    }
}
