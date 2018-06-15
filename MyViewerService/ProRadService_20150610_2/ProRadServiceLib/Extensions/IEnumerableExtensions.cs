using System.Collections.Generic;
using System.Text;

namespace ProRadServiceLib.Extensions
{
    static class IEnumerableExtensions
    {
        public static string ToString<T>(this IEnumerable<T> items, char delimiter)
        {
            var sb = new StringBuilder();
            foreach (var item in items)
            {
                sb.Append(item);
                sb.Append(delimiter);
            }
            return sb.ToString().TrimEnd(delimiter);
        }

        public static string ToString<T>(this IEnumerable<T> items, char delimiter, int length)
        {
            var s = ToString(items, delimiter);
            return s.Length > length ? s.Substring(0, length) : s;
        }

        public static string ToString<T>(this IEnumerable<T> items, char delimiter, char encloseChar)
        {
            var sb = new StringBuilder();
            foreach (var item in items)
            {
                sb.Append(encloseChar);
                sb.Append(item);
                sb.Append(encloseChar);
                sb.Append(delimiter);
            }
            return sb.ToString().TrimEnd(delimiter);
        }
    }
}
