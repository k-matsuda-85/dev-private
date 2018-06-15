using ProtoBuf;
using System;
using System.IO;
using System.Security.Cryptography;

namespace ProRadServiceLib
{
    //[System.Reflection.Obfuscation(Feature = "Apply to member * when method: virtualization", Exclude = false)]
    class ConvertUtil
    {
        public static string Serialize(object value)
        {
            using (var ms = new MemoryStream())
            {
                Serializer.Serialize(ms, value);
                return ToBase64UrlString(Encrypt(ms.ToArray()));
            }
        }

        public static T Deserialize<T>(string s)
        {
            using (var ms = new MemoryStream(Decrypt(FromBase64UrlString(s))))
            {
                return Serializer.Deserialize<T>(ms);
            }
        }

        public static string ToBase64UrlString(byte[] inArray)
        {
            return Convert.ToBase64String(inArray).Replace('+', '-').Replace('/', '_').Replace("=", "");
        }

        public static byte[] FromBase64UrlString(string s)
        {
            s = s.Replace('-', '+').Replace('_', '/');
            int num = s.Length % 4;
            if (num != 0)
            {
                for (int i = 0; i < 4 - num; i++)
                {
                    s += "=";
                }
            }

            return Convert.FromBase64String(s);
        }

        static readonly byte[] _Key = { 0x5d, 0xb6, 0xd8, 0xa2, 0x53, 0xcc, 0x67, 0xdf, 0x4b, 0x69, 0x6f, 0x89, 0x95, 0x28, 0xc8, 0xff, 0xab, 0x83, 0xb6, 0xf5, 0x0f, 0xdd, 0x26, 0xd7, 0x18, 0x8f, 0x09, 0x6e, 0x39, 0xd6, 0x04, 0x70 };
        static readonly byte[] _IV = { 0x5a, 0xc5, 0xcd, 0x19, 0x38, 0x26, 0x5c, 0xc9, 0x8f, 0xd8, 0xfb, 0xf1, 0x01, 0x0a, 0x0d, 0xa1 };

        private static byte[] Encrypt(byte[] buff)
        {
            using (var aes = new AesManaged())
            using (var ct = aes.CreateEncryptor(_Key, _IV))
            {
                return ct.TransformFinalBlock(buff, 0, buff.Length);
            }
        }

        private static byte[] Decrypt(byte[] buff)
        {
            using (var aes = new AesManaged())
            using (var ct = aes.CreateDecryptor(_Key, _IV))
            {
                return ct.TransformFinalBlock(buff, 0, buff.Length);
            }
        }
    }
}
