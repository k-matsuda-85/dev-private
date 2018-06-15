using System;
using System.IO;

namespace ProRadServiceLib
{
    class FileUtil
    {
        public static bool Copy(string srcFile, string dstFile)
        {
            try
            {
                if (Directory.Exists(dstFile))
                    dstFile = Path.Combine(dstFile, Path.GetFileName(srcFile));

                File.Copy(srcFile, dstFile, true);
                return true;
            }
            catch (Exception ex)
            {
                LogUtil.Error3("{0} [{1}][{2}]", ex.ToString(), srcFile, dstFile);
                return false;
            }
        }

        public static bool Delete(string path, bool delayDelete = false)
        {
            try
            {
                if (Directory.Exists(path))
                {
                    Directory.Delete(path, true);
                }
                else
                {
                    File.Delete(path);
                }
                return true;
            }
            catch (Exception ex)
            {
                if (delayDelete && AppUtil.DeletePath != "")
                {
                    try
                    {
                        if (!Directory.Exists(AppUtil.DeletePath))
                            Directory.CreateDirectory(AppUtil.DeletePath);

                        while (true)
                        {
                            var file = Path.Combine(AppUtil.DeletePath, DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".go");
                            if (!File.Exists(file))
                            {
                                File.WriteAllText(file, path);
                                return false;
                            }
                            System.Threading.Thread.Sleep(1);
                        }
                    }
                    catch (Exception ex2)
                    {
                        LogUtil.Error2("{0} [{1}]", ex2.Message, path);
                    }
                }

                LogUtil.Error2("{0} [{1}]", ex.Message, path);
                return false;
            }
        }

        //DICOMファイルを返す
        public static string GetDicomFile(SeriesKey key)
        {
            if (AppUtil.DbType == AppUtil.DB_RS)
            {
                return Path.Combine(RS.server[Int32.Parse(key.StorageID)], key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID + RS.EXT_DICOM);
            }
            else
            {
                var sto = DbCacheUtil.GetStorage(key.StorageID);
                return Path.Combine(sto.DicomPath, key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID + AppUtil.DicomExt);
            }
        }
        public static string GetDicomFile(ImageKey key)
        {
            if (AppUtil.DbType == AppUtil.DB_RS)
            {
                return Path.Combine(RS.server[Int32.Parse(key.StorageID)], key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID + RS.EXT_DICOM);
            }
            else if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                var sto = DbCacheUtil.GetStorage();
                return Path.Combine(sto.DicomPath, key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID + AppUtil.DicomExt);
            }
            else
            {
                var sto = DbCacheUtil.GetStorage(key.StorageID);
                return Path.Combine(sto.DicomPath, key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID + AppUtil.DicomExt);
            }
        }

        //THUMBファイルを返す
        public static string GetThumbFile(SeriesKey key)
        {
            if (key.IsImage)
            {
                return Path.Combine(AppUtil.ThumbPath, key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID + AppUtil.EXT_THUMB);
            }
            else
            {
                return Path.Combine(AppUtil.ThumbPath, key.StudyInstanceUID, key.SeriesInstanceUID + AppUtil.EXT_THUMB);
            }
        }
        public static string GetThumbFile(ImageKey key)
        {
            return Path.Combine(AppUtil.ThumbPath, key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID + AppUtil.EXT_THUMB);
        }
    }
}
