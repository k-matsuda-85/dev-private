using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace ProRadServiceLib
{
    [System.Reflection.Obfuscation(Feature = "Apply to member * when method: virtualization", Exclude = false)]
    class CryptoUtil
    {
        public static string PasswordString(string password, string userid, string systemid)
        {
            return HashString(password, userid + systemid);
        }

        public static string LicenseString()
        {
            using (var mo = new System.Management.ManagementObject("Win32_OperatingSystem=@"))
            {
                //プロダクトID
                string SerialNumber = (string)mo["SerialNumber"];

                //ホスト名
                string CSName = (string)mo["CSName"];

                return HashString(SerialNumber.ToUpper(), CSName.ToUpper()).Replace("+", "").Replace("/", "").Replace("=", "").Substring(0, 10);
            }
        }

        const string STRETCH = "1234";

        private static string HashString(string Password, string Salt)
        {
            using (var hash = new SHA256Managed())
            {
                var pass = Encoding.UTF8.GetBytes(Password);
                var salt = hash.ComputeHash(Encoding.UTF8.GetBytes(Salt));

                var buff = new byte[0];
                for (int i = 0; i < Convert.ToInt32(STRETCH); i++)
                {
                    buff = hash.ComputeHash(buff.Concat(pass).Concat(salt).ToArray());
                }

                return Convert.ToBase64String(buff);
            }
        }
    }
}
