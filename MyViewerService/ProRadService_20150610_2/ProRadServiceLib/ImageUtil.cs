using DicomAnalyzer;
using DicomSplitter;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading;

namespace ProRadServiceLib
{
    class ImageUtil
    {
        class MyImageControl : ImageControl
        {
            public MyImageControl(ImageControl ic)
            {
                _width = ic.Width;
                _height = ic.Height;
                switch (ic.PlaneSize)
                {
                    case 8:
                        _pixels = ic.bPixels;
                        break;
                    case 16:
                        _pixels = ic.wPixels;
                        break;
                }
                _planeSize = ic.PlaneSize;
                _planeCount = ic.PlaneCount;
                _pixelSize = ic.PixelSize;
                IsSign = ic.IsSign;
                Revers = ic.Revers;
                WindowCenter = ic.WindowCenter;
                WindowWidth = ic.WindowWidth;
                RescaleIntercept = ic.RescaleIntercept;
                RescaleSlope = ic.RescaleSlope;
            }
            static T[] ConvertImage<T>(T[] pixels, int components, int width, int height, int rot, bool isFlip)
            {
                if (isFlip == false && rot == 0)
                    return pixels;
                int sp; int dp;
                T[] work = new T[width * height * components];
                //左右反転
                if (isFlip)
                {
                    sp = 0;
                    dp = 0;
                    //グレースケール時は高速化
                    if (components != 1)
                    {
                        for (int y = 0; y < height; y++)
                        {
                            dp = ((y + 1) * width - 1) * components;
                            for (int x = 0; x < width; x++)
                            {
                                for (int i = 0; i < components; i++)
                                {
                                    work[dp + i] = pixels[sp++];
                                }
                                dp -= components;
                            }
                        }
                    }
                    else
                    {
                        for (int y = 0; y < height; y++)
                        {
                            dp = (y + 1) * width - 1;
                            for (int x = 0; x < width; x++)
                            {
                                work[dp--] = pixels[sp++];
                            }
                        }
                    }
                    //作業領域スワップ
                    var tmp = work;
                    work = pixels;
                    pixels = tmp;
                }
                //回転
                int dx;
                int dy;
                switch (rot)
                {
                    case 0:
                        work = pixels;
                        break;
                    case 90:
                        {
                            /*
                             *   ABC      GDA
                             *   DEF  ⇒  HEB
                             *   GHI      IFC
                             */
                            int dwidth = height;
                            int dheight = width;
                            for (int y = 0; y < height; y++)
                            {
                                sp = y * width * components;
                                for (int x = 0; x < width; x++)
                                {
                                    //DX:SH-SY-1 DY:SX
                                    dx = height - y - 1;
                                    dy = x;
                                    dp = (dy * dwidth + dx) * components;
                                    for (int i = 0; i < components; i++)
                                    {
                                        work[dp + i] = pixels[sp++];
                                    }
                                }
                            }
                        }
                        break;
                    case 180:
                        {
                            /*
                             *   ABC      IHG
                             *   DEF  ⇒  FED
                             *   GHI      CBA
                             */
                            int dwidth = width;
                            int dheight = height;
                            for (int y = 0; y < height; y++)
                            {
                                sp = y * width * components;
                                for (int x = 0; x < width; x++)
                                {
                                    //DX:SW-SX-1 DY:SH-SX-1
                                    dx = width - x - 1;
                                    dy = height - y - 1;
                                    dp = (dy * dwidth + dx) * components;
                                    for (int i = 0; i < components; i++)
                                    {
                                        work[dp + i] = pixels[sp++];
                                    }
                                }
                            }
                        }
                        break;
                    case 270:
                        {
                            /*
                             *   ABC      CFI
                             *   DEF  ⇒  BEH
                             *   GHI      ADG
                             */
                            int dwidth = height;
                            int dheight = width;
                            for (int y = 0; y < height; y++)
                            {
                                sp = y * width * components;
                                for (int x = 0; x < width; x++)
                                {
                                    //DX:SY DY:SW-SX-1
                                    dx = y;
                                    dy = width - x - 1;
                                    dp = (dy * dwidth + dx) * components;
                                    for (int i = 0; i < components; i++)
                                    {
                                        work[dp + i] = pixels[sp++];
                                    }
                                }
                            }
                        }
                        break;
                }
                return work;
            }
            public void Rotate(int rot, bool flip)
            {
                //回転ピクセルを取得
                switch (PlaneSize)
                {
                    case 8:
                        {
                            _pixels = ConvertImage(bPixels, PlaneCount, Width, Height, rot, flip);
                        }
                        break;
                    case 16:
                        {
                            _pixels = ConvertImage(wPixels, PlaneCount, Width, Height, rot, flip);
                        }
                        break;
                }
                //回転時の横幅高さ入れ替え
                switch (rot)
                {
                    case 90:
                    case 270:
                        {
                            var tmp = Width;
                            _width = Height;
                            _height = tmp;
                        }
                        break;
                }
            }
        }

        static SemaphoreSlim semaphore;
        static ImageUtil()
        {
            semaphore = new SemaphoreSlim(8);
        }

        //hosp
        public static void GetJpeg(string file, int frameNumber, int level, int cx, int cy, int cw, int ch, double wc, double ww, int rot, int flipX, out byte[] image)
        {
            try
            {
                image = null;
                //lock (typeof(ImageUtil))
                semaphore.Wait();
                try
                {
                    var data = ImageCache.GetData(file, frameNumber);
                    if (data != null)
                    {
                        DicomSplitLevel lvl;
                        if (level == 0)
                            lvl = data.splitLevel;
                        else
                            lvl = data.splitLevel.CreateLevel(level, true);

                        var ic = new ImageControl(lvl.GetImage(cx, cy, cw, ch), AppUtil.CELL_SIZE * cw, AppUtil.CELL_SIZE * ch, lvl.ImageControl.PixelSize);

                        ic.Revers = lvl.ImageControl.Revers;
                        ic.IsSign = lvl.ImageControl.IsSign;
                        ic.RescaleIntercept = lvl.ImageControl.RescaleIntercept;
                        ic.RescaleSlope = lvl.ImageControl.RescaleSlope;
                        ic.WindowCenter = wc;
                        ic.WindowWidth = ww;

                        var ic2 = new MyImageControl(ic);
                        ic2.Rotate(rot, flipX != 0);
                        image = ic2.ToJpeg();
                    }
                }
                finally
                {
                    semaphore.Release();
                }
            }
            catch
            {
                LogUtil.Error(string.Format("GetJpeg({0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10})", file, frameNumber, level, cx, cy, cw, ch, wc, ww, rot, flipX));
                throw;
            }
        }

        public static void GetRoi(string file, int frameNumber, Point p1, Point p2, out RoiItem roi)
        {
            roi = new RoiItem();

            double minvalue = double.MaxValue;
            double maxvalue = double.MinValue;
            double ave = 0;
            double areasize = 0;
            double stddev = 0;
            double total = 0;

            double x1, y1, x2, y2, w, h, cx, cy;
            x1 = p1.X < p2.X ? p1.X : p2.X;
            x2 = p1.X < p2.X ? p2.X : p1.X;
            y1 = p1.Y < p2.Y ? p1.Y : p2.Y;
            y2 = p1.Y < p2.Y ? p2.Y : p1.Y;
            w = x2 - x1;
            h = y2 - y1;
            cx = x1 + w / 2;
            cy = y1 + h / 2;

            //lock (typeof(ImageUtil))
            {
                var data = ImageCache.GetData(file, frameNumber);
                if (data != null)
                {
                    var ic = data.splitLevel.ImageControl;

                    if (ic.PixelSize == 24 || ic.PixelSize == 8)
                        return;

                    for (int x = x1 < 0 ? 0 : (int)x1; x < x2 && x < ic.Width; x++)
                    {
                        for (int y = y1 < 0 ? 0 : (int)y1; y < y2 && y < ic.Height; y++)
                        {
                            double px = Math.Abs(x - cx) / w;
                            double py = Math.Abs(y - cy) / h;
                            double len = Math.Sqrt(px * px + py * py);
                            if (len >= 0.5)
                                continue;
                            areasize++;
                            var val = ic.swPixels[y * ic.Width + x] * ic.RescaleSlope + ic.RescaleIntercept;
                            total += val;
                            if (minvalue > val)
                                minvalue = val;
                            if (maxvalue < val)
                                maxvalue = val;
                        }
                    }

                    if (areasize != 0)
                    {
                        ave = total / areasize;
                        double stdsum = 0;
                        for (int x = x1 < 0 ? 0 : (int)x1; x < x2 && x < ic.Width; x++)
                            for (int y = y1 < 0 ? 0 : (int)y1; y < y2 && y < ic.Height; y++)
                            {
                                double px = Math.Abs(x - cx) / w;
                                double py = Math.Abs(y - cy) / h;
                                double len = Math.Sqrt(px * px + py * py);
                                if (len >= 0.5)
                                    continue;
                                var val = ic.swPixels[y * ic.Width + x] * ic.RescaleSlope + ic.RescaleIntercept;
                                stdsum += ((float)val - ave) * ((float)val - ave);
                            }

                        stddev = (float)Math.Sqrt(stdsum / areasize);
                    }
                }
            }

            roi.Minimum = minvalue;
            roi.Maximum = maxvalue;
            roi.Average = ave;
            roi.Area = areasize;
            roi.StandardDeviation = stddev;
        }

        public static void ImageToThumb(string file, out byte[] thumb)
        {
            using (var bmp = new Bitmap(AppUtil.THUMB_SIZE, AppUtil.THUMB_SIZE))
            using (var g = Graphics.FromImage(bmp))
            using (var img = Image.FromFile(file))
            using (var ms = new MemoryStream())
            {
                g.Clear(Color.FromArgb(0, Color.Black));

                if (img.Width > AppUtil.THUMB_SIZE || img.Height > AppUtil.THUMB_SIZE)
                {
                    int width = AppUtil.THUMB_SIZE;
                    int height = AppUtil.THUMB_SIZE;

                    if (img.Width <= img.Height)
                    {
                        width = width * img.Width / img.Height;
                    }
                    else
                    {
                        height = height * img.Height / img.Width;
                    }

                    g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    g.DrawImage(img, (AppUtil.THUMB_SIZE - width) / 2, (AppUtil.THUMB_SIZE - height) / 2, width, height);
                }
                else
                {
                    g.DrawImage(img, (AppUtil.THUMB_SIZE - img.Width) / 2, (AppUtil.THUMB_SIZE - img.Height) / 2);
                }

                bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                thumb = ms.GetBuffer();
            }
        }

        public static void PutImage(string file, int frameNumber, string[] trace, string outfile)
        {
            var data = ImageCache.GetData(file, frameNumber);
            if (data != null)
            {
                var ic = data.splitLevel.ImageControl;

                using (var img = TraceCapture.ToImage(trace, ic))
                {
                    ImageCodecInfo encoder = null;
                    foreach (var ici in ImageCodecInfo.GetImageEncoders())
                    {
                        if (ici.MimeType == "image/jpeg")
                        {
                            encoder = ici;
                            break;
                        }
                    }
                    var encoderParams = new EncoderParameters(1);
                    encoderParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, (long)90);
                    img.Save(outfile, encoder, encoderParams);
                }
            }
        }

        public static void GetGsps(GSPSKey key, out Dictionary<string, GSPSDataItem> items)
        {
            items = null;

            var tmpItems = new Dictionary<string, GSPSDataItem>();
            var tmpSeries = new Dictionary<string, string>();
            var delItems = new List<string>();  //マルチフレーム時の調整

            //GSPSのImageKey取得
            List<ImageKey> gspsImkeys;
            DbUtil.GetGsps(key, out gspsImkeys);

            foreach (var gspsImKey in gspsImkeys)
            {
                var file = FileUtil.GetDicomFile(gspsImKey);
                try
                {
                    using (var dcm = new DicomData(file, DicomTransferSyntax.LittleEndianImplicit))
                    {
                        var pr = new PRAnalyzer(dcm);

                        var tmpSop = new List<PRReferenceSOP>();

                        //ReferencedSeriesSequence
                        foreach (var seq in pr.References)
                        {
                            tmpSop.AddRange(seq.SopRefs);

                            //ReferencedImageSequence
                            foreach (var sop in seq.SopRefs)
                            {
                                if (!tmpSeries.ContainsKey(sop.SOPInstanceUID))
                                {
                                    tmpSeries.Add(sop.SOPInstanceUID, seq.SeriesInstanceUID);
                                }

                                var imkey = new ImageKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = seq.SeriesInstanceUID,
                                    SOPInstanceUID = sop.SOPInstanceUID,
                                    FrameNumber = sop.FrameNumber,
                                    StorageID = gspsImKey.StorageID
                                };

                                var imkey2 = ConvertUtil.Serialize(imkey);
                                tmpItems.Add(imkey2, new GSPSDataItem());

                                tmpItems[imkey2].Flip = pr.Flip.ToString().ToLower();
                                tmpItems[imkey2].Rotate = pr.Rotate.ToString();
                            }
                        }

                        //SoftcopyVOILUTSequence
                        foreach (var seq in pr.VoiLuts)
                        {
                            if (seq.SopRefs.Length == 0)
                                seq.SopRefs = tmpSop.ToArray();

                            //ReferencedImageSequence
                            foreach (var sop in seq.SopRefs)
                            {
                                var imkey = new ImageKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = tmpSeries[sop.SOPInstanceUID],
                                    SOPInstanceUID = sop.SOPInstanceUID,
                                    FrameNumber = sop.FrameNumber,
                                    StorageID = gspsImKey.StorageID
                                };

                                var imkey2 = ConvertUtil.Serialize(imkey);

                                if (!tmpItems.ContainsKey(imkey2))
                                {
                                    tmpItems.Add(imkey2, new GSPSDataItem());
                                }

                                tmpItems[imkey2].VoiLut = seq.ToString();
                            }
                        }

                        //GraphicAnnotationSequence
                        foreach (var seq in pr.Infos)
                        {
                            //ReferencedImageSequence
                            foreach (var sop in seq.Reference.SopRefs)
                            {
                                var imkey = new ImageKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = tmpSeries[sop.SOPInstanceUID],
                                    SOPInstanceUID = sop.SOPInstanceUID,
                                    FrameNumber = sop.FrameNumber,
                                    StorageID = gspsImKey.StorageID
                                };

                                var imkey2 = ConvertUtil.Serialize(imkey);

                                if (!tmpItems.ContainsKey(imkey2))
                                {
                                    tmpItems.Add(imkey2, new GSPSDataItem());
                                }

                                tmpItems[imkey2].Info = seq.ToString();
                            }
                        }

                        //DisplayedAreaSelectionSequence
                        foreach (var seq in pr.DisplayAreas)
                        {
                            if (seq.SopRefs.Length == 0)
                                seq.SopRefs = tmpSop.ToArray();
                            
                            //ReferencedImageSequence
                            foreach (var sop in seq.SopRefs)
                            {
                                var imkey = new ImageKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = tmpSeries[sop.SOPInstanceUID],
                                    SOPInstanceUID = sop.SOPInstanceUID,
                                    FrameNumber = sop.FrameNumber,
                                    StorageID = gspsImKey.StorageID
                                };

                                var imkey2 = ConvertUtil.Serialize(imkey);

                                if (!tmpItems.ContainsKey(imkey2))
                                {
                                    tmpItems.Add(imkey2, new GSPSDataItem());
                                }

                                tmpItems[imkey2].DisplayArea = seq.ToString();

                                //マルチフレーム時の調整
                                if (sop.FrameNumber > 0)
                                {
                                    var imkey3 = new ImageKey()
                                    {
                                        StudyInstanceUID = key.StudyInstanceUID,
                                        SeriesInstanceUID = tmpSeries[sop.SOPInstanceUID],
                                        SOPInstanceUID = sop.SOPInstanceUID,
                                        FrameNumber = 0,
                                        StorageID = gspsImKey.StorageID
                                    };

                                    var imkey4 = ConvertUtil.Serialize(imkey3);

                                    if (tmpItems.ContainsKey(imkey4))
                                    {
                                        if (tmpItems[imkey2].Flip == "")
                                            tmpItems[imkey2].Flip = tmpItems[imkey4].Flip;

                                        if (tmpItems[imkey2].Rotate == "")
                                            tmpItems[imkey2].Rotate = tmpItems[imkey4].Rotate;

                                        if (!delItems.Contains(imkey4))
                                        {
                                            delItems.Add(imkey4);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                catch
                {
                    LogUtil.Error1("PR Error [{0}]", file);
                    throw;
                }
            }

            //マルチフレーム時の調整
            if (delItems.Count > 0)
            {
                foreach(var delItem in delItems)
                {
                    tmpItems.Remove(delItem);
                }
            }

            items = tmpItems;
        }
    }
}
