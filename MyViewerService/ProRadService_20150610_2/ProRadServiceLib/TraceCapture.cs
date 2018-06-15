using DicomAnalyzer;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Text;

namespace ProRadServiceLib
{
    class TraceCapture
    {
        public static Image ToImage(string[] trace, ImageControl ic)
        {
            Image Image = null;
            int wc = 0; int ww = 0;
            int rotate = 0;
            double scale = 1;
            PointF position = new PointF();
            bool flipX = false;
            //string imageKey = "";

            var tokens = lex(trace[0]);
            if (tokens.Length == 0 || tokens[0] != "begin")
                return null;
            Image = new Bitmap(int.Parse(tokens[1]), int.Parse(tokens[2]));
            using (var gr = Graphics.FromImage(Image))
            {
                gr.SmoothingMode = SmoothingMode.HighQuality;
                gr.Clear(Color.Black);
                foreach (var line in trace)
                {
                    tokens = lex(line);
                    if (tokens.Length == 0)
                        continue;
                    switch (tokens[0])
                    {
                        case "begin":
                            break;
                        case "set":
                            switch (tokens[1])
                            {
                                case "WindowLevel":
                                    wc = (int)double.Parse(tokens[2]);
                                    ww = (int)double.Parse(tokens[3]);
                                    break;
                                case "ImageRotate":
                                    rotate = (int)double.Parse(tokens[2]);
                                    break;
                                case "ImageScale":
                                    scale = double.Parse(tokens[2]);
                                    break;
                                case "ImagePosition":
                                    position = new PointF(
                                        (float)double.Parse(tokens[2]),
                                        (float)double.Parse(tokens[3])
                                        );
                                    break;
                                case "ImageFlipX":
                                    flipX = bool.Parse(tokens[2]);
                                    break;
                                case "ImageKey":
                                    //imageKey = tokens[2];
                                    break;
                            }
                            break;
                        case "image":
                            {
                                //ImageControl ic = GetImage(imageKey);
                                if (ic == null)
                                    continue;
                                ic.WindowCenter = wc;
                                ic.WindowWidth = ww;
                                using (Matrix mat = new Matrix())
                                {
                                    mat.Translate(Image.Width / 2, Image.Height / 2);
                                    mat.Translate(position.X, position.Y);
                                    mat.Scale((float)scale, (float)scale);
                                    gr.Transform = mat;
                                    using (var img = ic.CreateImage())
                                    {
                                        switch (rotate)
                                        {
                                            case 0:
                                                img.RotateFlip((flipX) ? RotateFlipType.RotateNoneFlipX : RotateFlipType.RotateNoneFlipNone);
                                                break;
                                            case 90:
                                                img.RotateFlip((flipX) ? RotateFlipType.Rotate90FlipY : RotateFlipType.Rotate90FlipNone);
                                                break;
                                            case 180:
                                                img.RotateFlip((flipX) ? RotateFlipType.Rotate180FlipX : RotateFlipType.Rotate180FlipNone);
                                                break;
                                            case 270:
                                                img.RotateFlip((flipX) ? RotateFlipType.Rotate270FlipY : RotateFlipType.Rotate270FlipNone);
                                                break;
                                        }
                                        gr.DrawImage(img, new PointF((float)-ic.Width / 2, (float)-ic.Height / 2));
                                    }
                                }
                                gr.ResetTransform();
                            }
                            break;
                        case "line":
                            {
                                var p0 = ToPoint(tokens[1]);
                                var p1 = ToPoint(tokens[2]);
                                var width = double.Parse(tokens[3]);
                                var color = Color.FromName(tokens[4]);
                                using (Pen pen = new Pen(color, (float)width))
                                {
                                    gr.DrawLine(pen, p0, p1);
                                }
                            }
                            break;
                        case "lines":
                            {
                                var ps = ToPoints(tokens[1]);
                                var width = double.Parse(tokens[2]);
                                var color = Color.FromName(tokens[3]);
                                using (Pen pen = new Pen(color, (float)width))
                                {
                                    gr.DrawLines(pen, ps);
                                }
                            }
                            break;
                        case "fillpolygon":
                            {
                                var ps = ToPoints(tokens[1]);
                                var color = Color.FromName(tokens[2]);
                                using (Brush brush = new SolidBrush(color))
                                {
                                    gr.FillPolygon(brush, ps);
                                }
                            }
                            break;
                        case "dot":
                            {
                                var point = ToPoint(tokens[1]);
                                var width = (float)double.Parse(tokens[2]);
                                var color = Color.FromName(tokens[3]);
                                using (Brush brush = new SolidBrush(color))
                                {
                                    gr.FillEllipse(brush, new RectangleF(point.X - width / 2, point.Y - width / 2, width, width));
                                }
                            }
                            break;
                        case "text":
                            {
                                var text = tokens[1];
                                var point = ToPoint(tokens[2]);
                                var fontparam = tokens[3];
                                var color = Color.FromName(tokens[4]);
                                text = text.Replace("<BR>", "\r\n");
                                using (var font = new Font("ＭＳ Ｐゴシック", 16, FontStyle.Bold))
                                {
                                    using (var br = new SolidBrush(color))
                                    {
                                        gr.DrawString(text, font, br, point);
                                    }
                                }
                            }
                            break;
                        case "circle":
                            {
                                var point = ToPoint(tokens[1]);
                                var width = (float)double.Parse(tokens[2]);
                                var linewidth = (float)double.Parse(tokens[3]);
                                var color = Color.FromName(tokens[4]);
                                using (var pen = new Pen(color, linewidth))
                                {
                                    gr.DrawEllipse(pen, new RectangleF(point.X - width, point.Y - width, width * 2, width * 2));
                                }
                            }
                            break;
                    }
                }
            }
            return Image;
        }
        static PointF ToPoint(string point)
        {
            var points = point.Split(',');
            return new PointF((float)double.Parse(points[0]), (float)double.Parse(points[1]));
        }
        static PointF[] ToPoints(string point)
        {
            List<PointF> list = new List<PointF>();
            var ps = point.Split('\\');
            foreach (var p in ps)
            {
                list.Add(ToPoint(p));
            }
            return list.ToArray();
        }
        //字句解析（トークンに分解) ESCAPE非対応
        public static string[] lex(string line)
        {
            List<string> list = new List<string>();
            StringBuilder sb = new StringBuilder();
            bool isText = false;
            foreach (var c in line)
            {
                if (c == '\"')
                {
                    isText = !isText;
                    continue;
                }
                //token end
                if (!isText && c == ' ')
                {
                    if (sb.Length > 0)
                    {
                        list.Add(sb.ToString());
                        sb.Length = 0;
                    }
                    continue;
                }
                sb.Append(c);
            }
            if (sb.Length > 0)
            {
                list.Add(sb.ToString());
            }
            return list.ToArray();
        }
    }
}
