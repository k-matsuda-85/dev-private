using DicomAnalyzer;
using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

namespace ProRadServiceLib
{
    public class PRAnalyzer
    {
        public PRAnalyzer(DicomData dcm)
        {
            var dic = DicomTagDictionary.Open(dcm,
                0x81115,//参照シリーズシーケンス
                0x700001,//図形シーケンス
                0x283110,//ソフトコピーＶＯＩ ＬＵＴシーケンス
                0x700041,//画像水平フリップ
                0x700042,//画像回転
                0x70005A//表示領域選択シーケンス
                );
            var tag = dic[0x700001];
            if (tag == null)
                return;

            if (dic[0x700041] != null)
            {
                Flip = dic[0x700041].ToString() == "Y";
            }
            if (dic[0x700042] != null)
            {
                Rotate = dic[0x700042].ToValue(0d);
            }

            List<PRDisplayArea> displayareas = new List<PRDisplayArea>();
            var displayareatag = dic[0x70005A];
            if (displayareatag != null)
            {
                foreach (var t in displayareatag)
                {
                    if (t.Tag != 0xfffee000)
                        continue;
                    PRDisplayArea refobj = new PRDisplayArea();
                    var dic2 = DicomTagDictionary.Open(t,
                        0x81140,//参照画像シーケンス
                        0x700052,//表示領域上左手コーナ
                        0x700053,//表示領域下右手コーナ
                        0x700100,//提示寸法モード
                        0x700101//提示画素間隔
                        );
                    var seriesuid = dic2[0x20000E];
                    if (dic2[0x700052] != null && dic2[0x700053] != null)
                    {
                        refobj.PointLU = new PRPoint(dic2[0x700052].ToArray(new double[] { 0, 0 }));
                        refobj.PointRD = new PRPoint(dic2[0x700053].ToArray(new double[] { 0, 0 }));
                    }
                    else continue;
                    if (dic2[0x700100] != null)
                    {
                        refobj.SizeMode = dic2[0x700100].ToString();
                    }
                    if (dic2[0x700101] != null)
                    {
                        refobj.PixelSpacing = new PRPoint(dic2[0x700101].ToArray(new double[] { 0, 0 }));
                    }
                    List<PRReferenceSOP> referencesop = new List<PRReferenceSOP>();
                    var imageseq = dic2[0x81140];
                    if (imageseq != null)
                    {
                        foreach (var t2 in imageseq)
                        {
                            if (t2.Tag != 0xfffee000)
                                continue;
                            var dic3 = DicomTagDictionary.Open(t2, 0x81150, 0x81155, 0x81160);
                            var cuid = dic3[0x81150];
                            var uid = dic3[0x81155];
                            var frame = dic3[0x81160];
                            if (cuid != null && uid != null)
                            {
                                PRReferenceSOP refobjsop = new PRReferenceSOP() { SOPClassUID = cuid.ToString(), SOPInstanceUID = uid.ToString() };
                                if (frame != null)
                                {
                                    refobjsop.FrameNumber = frame.ToValue(0);
                                }
                                referencesop.Add(refobjsop);
                            }
                        }
                    }
                    refobj.SopRefs = referencesop.ToArray();
                    displayareas.Add(refobj);
                }
            }
            DisplayAreas = displayareas.ToArray();

            List<PRVoiLut> voiluts = new List<PRVoiLut>();
            var voiluttag = dic[0x283110];
            if (voiluttag != null)
            {
                foreach (var t in voiluttag)
                {
                    if (t.Tag != 0xfffee000)
                        continue;
                    PRVoiLut refobj = new PRVoiLut();
                    var dic2 = DicomTagDictionary.Open(t,
                        0x81140,//参照画像シーケンス
                        0x281050,//ウィンドウ中心
                        0x281051//ウィンドウ幅
                        );
                    var seriesuid = dic2[0x20000E];
                    if (dic2[0x281050] != null && dic2[0x281051] != null)
                    {
                        refobj.WindowCenter = dic2[0x281050].ToValue(0d);
                        refobj.WindowWidth = dic2[0x281051].ToValue(0d);
                    }
                    else continue;
                    List<PRReferenceSOP> referencesop = new List<PRReferenceSOP>();
                    var imageseq = dic2[0x81140];
                    if (imageseq != null)
                    {
                        foreach (var t2 in imageseq)
                        {
                            if (t2.Tag != 0xfffee000)
                                continue;
                            var dic3 = DicomTagDictionary.Open(t2, 0x81150, 0x81155, 0x81160);
                            var cuid = dic3[0x81150];
                            var uid = dic3[0x81155];
                            var frame = dic3[0x81160];
                            if (cuid != null && uid != null)
                            {
                                PRReferenceSOP refobjsop = new PRReferenceSOP() { SOPClassUID = cuid.ToString(), SOPInstanceUID = uid.ToString() };
                                if (frame != null)
                                {
                                    refobjsop.FrameNumber = frame.ToValue(0);
                                }
                                referencesop.Add(refobjsop);
                            }
                        }
                    }
                    refobj.SopRefs = referencesop.ToArray();
                    voiluts.Add(refobj);
                }
            }
            VoiLuts = voiluts.ToArray();

            List<PRReference> reference = new List<PRReference>();
            var refseriestag = dic[0x81115];
            if (refseriestag != null)
            {
                foreach (var t in refseriestag)
                {
                    if (t.Tag != 0xfffee000)
                        continue;
                    PRReference refobj = new PRReference();
                    var dic2 = DicomTagDictionary.Open(t,
                        0x81140,//参照画像シーケンス
                        0x20000E//シリーズインスタンスＵＩＤ
                        );
                    var seriesuid = dic2[0x20000E];
                    if (dic2[0x81140] != null)
                    {
                        refobj.SeriesInstanceUID = dic2[0x81140].ToString();
                    }
                    List<PRReferenceSOP> referencesop = new List<PRReferenceSOP>();
                    var imageseq = dic2[0x81140];
                    if (imageseq != null)
                    {
                        foreach (var t2 in imageseq)
                        {
                            if (t2.Tag != 0xfffee000)
                                continue;
                            var dic3 = DicomTagDictionary.Open(t2, 0x81150, 0x81155, 0x81160);
                            var cuid = dic3[0x81150];
                            var uid = dic3[0x81155];
                            var frame = dic3[0x81160];
                            if (cuid != null && uid != null)
                            {
                                PRReferenceSOP refobjsop = new PRReferenceSOP() { SOPClassUID = cuid.ToString(), SOPInstanceUID = uid.ToString() };
                                if (frame != null)
                                {
                                    refobjsop.FrameNumber = frame.ToValue(0);
                                }
                                referencesop.Add(refobjsop);
                            }
                        }
                    }
                    if (seriesuid != null)
                    {
                        refobj.SeriesInstanceUID = seriesuid.ToString();
                    }
                    refobj.SopRefs = referencesop.ToArray();
                    reference.Add(refobj);
                }

            }
            References = reference.ToArray();
            List<PRInfo> infos = new List<PRInfo>();
            foreach (var t in tag)
            {
                if (t.Tag != 0xfffee000)
                    continue;
                PRInfo info = new PRInfo();
                List<PRReferenceSOP> refs = new List<PRReferenceSOP>();
                var dic2 = DicomTagDictionary.Open(t,
                    0x81140, 0x700002, 0x700008, 0x700009);
                var reftag = dic2[0x81140];
                var layertag = dic2[0x700002];
                var txtobjtag = dic2[0x700008];
                var shapeobjtag = dic2[0x700009];
                foreach (var r in reftag)
                {
                    var dic3 = DicomTagDictionary.Open(r, 0x81150, 0x81155, 0x81160);
                    var cuid = dic3[0x81150];
                    var uid = dic3[0x81155];
                    var frame = dic3[0x81160];
                    if (cuid != null && uid != null)
                    {
                        PRReferenceSOP refobj = new PRReferenceSOP() { SOPClassUID = cuid.ToString(), SOPInstanceUID = uid.ToString() };
                        if (frame != null)
                        {
                            refobj.FrameNumber = frame.ToValue(0);
                        }
                        refs.Add(refobj);
                    }
                }
                info.Reference.SopRefs = refs.ToArray();
                info.Layer = layertag.ToString();
                List<PRDrawItem> drawitems = new List<PRDrawItem>();
                if (txtobjtag != null)
                {
                    foreach (var r in txtobjtag)
                    {
                        if (r.Tag != 0xfffee000)
                            continue;
                        var dic4 = DicomTagDictionary.Open(r,
                            0x700006,//Text
                            0x700010,//LU
                            0x700011,//RD
                            0x700012,//Format
                            0x711001,//Type
                            //                            0x41051005,//色
                            0x00700014,//アンカー点
                            0x00700015//アンカー点可視
                            );
                        PRDrawItem item = new PRDrawItem();
                        item.Text = dic4[0x700006].ToString();
                        if (dic4[0x700010] != null && dic4[0x700011] != null)
                        {
                            item.Points.Add(new PRPoint(dic4[0x700010].ToArray(new double[] { 0, 0 })));
                            item.Points.Add(new PRPoint(dic4[0x700011].ToArray(new double[] { 0, 0 })));
                        }
                        else
                            continue;
                        if (dic4[0x41051005] != null)
                        {
                            StringBuilder sb = new StringBuilder();
                            var c = dic4[0x41051005].ToArray(new int[] { 255, 0, 0 });//デフォルトカラー
                            if (c.Length == 3)
                            {
                                sb.AppendFormat("#{0:X2}{1:X2}{2:X2}", c[0], c[1], c[2]);//#RGBを構成
                                item.Color = sb.ToString();
                            }
                        }
                        if (dic4[0x00700014] != null && dic4[0x00700015] != null)
                        {
                            item.AnchorPoint = new PRPoint(dic4[0x00700014].ToArray(new double[] { 0, 0 }));
                            item.AnchorVisible = dic4[0x00700015].ToString() == "Y";
                        }
                        if (dic4[0x711001] != null)
                        {
                            item.DrawType = dic4[0x711001].ToString();
                        }
                        else
                        {
                            item.DrawType = "TEXT";
                        }
                        if (dic4[0x700012] != null)
                        {
                            item.TextFormat = dic4[0x700012].ToString();
                        }
                        drawitems.Add(item);
                    }
                }
                if (shapeobjtag != null)
                {
                    foreach (var r in shapeobjtag)
                    {
                        if (r.Tag != 0xfffee000)
                            continue;
                        var dic4 = DicomTagDictionary.Open(r,
                            0x700022,//図形データ
                            0x700023//図形タイプ
                            //,0x41051005//色
                            //,0x41051001//図形タイプ拡張
                            //,0x41051002//図形文字
                            );
                        PRDrawItem item = new PRDrawItem();
                        if (dic4[0x700022] != null)
                        {
                            var p = dic4[0x700022].ToArray(new double[0]);
                            for (int i = 0; i < p.Length; i += 2)
                            {
                                item.Points.Add(new PRPoint(p, i));
                            }
                        }
                        else
                            continue;
                        if (dic4[0x700023] != null)
                        {
                            item.DrawType = dic4[0x700023].ToString();
                        }
                        if (dic4[0x41051005] != null)
                        {
                            StringBuilder sb = new StringBuilder();
                            var c = dic4[0x41051005].ToArray(new int[] { 255, 0, 0 });//デフォルトカラー
                            if (c.Length == 3)
                            {
                                sb.AppendFormat("#{0:X2}{1:X2}{2:X2}", c[0], c[1], c[2]);//#RGBを構成
                                item.Color = sb.ToString();
                            }
                        }
                        if (dic4[0x41051001] != null)
                        {
                            item.DrawTypeEx = dic4[0x41051001].ToString();
                        }
                        if (dic4[0x41051002] != null)
                        {
                            item.Text = dic4[0x41051002].ToString();
                        }
                        drawitems.Add(item);
                    }
                }
                info.DrawItems = drawitems.ToArray();
                infos.Add(info);
            }
            Infos = infos.ToArray();
        }
        public PRDisplayArea[] DisplayAreas = new PRDisplayArea[0];
        public PRVoiLut[] VoiLuts = new PRVoiLut[0];
        public PRReference[] References = new PRReference[0];
        public PRInfo[] Infos = new PRInfo[0];
        public bool Flip;
        public double Rotate;
    }
    public class PRInfo
    {
        public PRReference Reference = new PRReference();
        public string Layer;
        public PRDrawItem[] DrawItems;
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("[");
            //sb.AppendLine(Reference.SeriesInstanceUID);
            //foreach (var r in Reference.SopRefs)
            //{
            //    sb.AppendLine(r.SOPClassUID);
            //    sb.AppendLine(r.SOPInstanceUID);
            //}
            //sb.AppendLine(Layer);
            foreach (var item in DrawItems)
            {
                sb.Append(item.ToString());
                sb.Append(",");
            }
            if (sb.Length > 1)
            {
                sb.Length--;
            }
            sb.AppendLine("]");
            return sb.ToString();
        }

    }
    public class PRDisplayArea
    {
        public PRPoint PointLU;
        public PRPoint PointRD;
        public string SizeMode;
        public PRPoint PixelSpacing;
        public PRReferenceSOP[] SopRefs;
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\"PointLU\":" + PointLU.ToString());
            sb.Append(",\"PointRD\":" + PointRD.ToString());
            sb.Append(",\"SizeMode\":\"" + SizeMode.ToString() + "\"");
            sb.Append(",\"PixelSpacing\":" + PixelSpacing.ToString());
            //sb.Append(",SopRefs:[");
            //foreach (var sop in SopRefs)
            //{
            //    sb.Append(sop.ToString());
            //    sb.Append(',');
            //}
            //if (sb[sb.Length - 1] == ',')
            //    sb.Length -= 1;
            //sb.Append("]");
            sb.Append("}");
            return sb.ToString();
        }
    }
    public class PRVoiLut
    {
        public double WindowCenter;
        public double WindowWidth;
        public PRReferenceSOP[] SopRefs;
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\"WindowCenter\":" + WindowCenter);
            sb.Append(",\"WindowWidth\":" + WindowWidth);
            //sb.Append(",SopRefs:[");
            //foreach (var sop in SopRefs)
            //{
            //    sb.Append(sop.ToString());
            //    sb.Append(',');
            //}
            //if (sb[sb.Length - 1] == ',')
            //    sb.Length -= 1;
            //sb.Append("]");
            sb.Append("}");
            return sb.ToString();
        }
    }
    public class PRReference
    {
        public string SeriesInstanceUID = "";
        public PRReferenceSOP[] SopRefs;
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\"SeriesInstanceUID\":" + SeriesInstanceUID);
            //sb.Append(",SopRefs:[");
            //foreach (var sop in SopRefs)
            //{
            //    sb.Append(sop.ToString());
            //    sb.Append(',');
            //}
            //if (sb[sb.Length - 1] == ',')
            //    sb.Length -= 1;
            //sb.Append("]");
            sb.Append("}");
            return sb.ToString();
        }
    }
    public class PRReferenceSOP
    {
        public string SOPClassUID;
        public string SOPInstanceUID;
        public int FrameNumber;
        public override string ToString()
        {
            return "{\"SOPClassUID\":" + SOPClassUID + ",\"SOPInstanceUID\":" + SOPInstanceUID + ",\"FrameNumber\":" + FrameNumber.ToString() + "}";
        }
    }
    public struct PRPoint
    {
        public PRPoint(double[] pos)
        {
            X = pos[0];
            Y = pos[1];
        }
        public PRPoint(double[] pos, int index)
        {
            X = pos[index + 0];
            Y = pos[index + 1];
        }
        public double X;
        public double Y;
        public override string ToString()
        {
            return "{\"x\":" + X.ToString() + ",\"y\":" + Y.ToString() + "}";
        }
    }
    public class PRDrawItem
    {
        public List<PRPoint> Points = new List<PRPoint>();
        public string DrawType = "";
        public string DrawTypeEx = "";
        public PRPoint AnchorPoint;
        public bool AnchorVisible = true;
        public string TextFormat = "";
        public string Text = "";
        public string Color = null;
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            var txt = "";
            if (Text != null)
            {
                txt = Text;
                txt = HttpUtility.HtmlEncode(txt);
                txt = txt.Replace("\n", "<BR>").Replace("\r", "");
            }
            if (DrawType == "TEXT")
            {
                sb.AppendFormat("\"Type\":\"{0}\",\"P\":[{1}],\"AV\":{2},\"AP\":{3},\"TF\":\"{4}\",\"TXT\":\"{5}\"",
                    DrawType,
                    ToPointString(),
                    AnchorVisible.ToString().ToLower(),
                    AnchorPoint,
                    TextFormat,
                    txt
                    );
            }
            else
            {
                sb.AppendFormat("\"Type\":\"{0}\",\"P\":[{1}],\"AV\":{2},\"AP\":{3}",
                    DrawType,
                    ToPointString(),
                    AnchorVisible.ToString().ToLower(),
                    AnchorPoint
                    );
                if (Color != null)
                {
                    sb.AppendFormat(",\"COL\":\"{0}\"", Color);
                }
                if (!String.IsNullOrEmpty(Text))
                {
                    sb.AppendFormat(",\"TXT\":\"{0}\"", txt);
                }
            }
            sb.Append("}");
            return sb.ToString();
        }
        string ToPointString()
        {
            StringBuilder sb = new StringBuilder();
            foreach (var p in Points)
            {
                sb.Append(p.ToString());
                sb.Append(',');
            }
            if (sb.Length > 0)
            {
                sb.Length--;
            }
            return sb.ToString();
        }
    }
}
