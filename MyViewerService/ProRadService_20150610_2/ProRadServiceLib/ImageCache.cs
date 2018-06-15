using DicomAnalyzer;
using DicomSplitter;
using System;
using System.Collections.Generic;
using System.Threading;

namespace ProRadServiceLib
{
    class ImageCache
    {
        public DicomSplitLevel splitLevel;
        private TimeSpan accessDate = new TimeSpan(DateTime.Now.Ticks);
        public bool IsLoad { get; set; }

        private ImageCache()
        {
            IsLoad = false;
        }

        public void Load(DicomSplitLevel lvl)
        {
            splitLevel = lvl;
            IsLoad = true;
        }

        static Dictionary<string, ImageCache> dict = new Dictionary<string, ImageCache>();
        static object syncImage = new object();

        public static ImageCache GetData(string file, int frameNumber)
        {
            ImageCache cache = null;

            if (AppUtil.ImageCacheMax > 0)
            {
                var key = string.Format("{0}:{1}", file, frameNumber);
                if (dict.ContainsKey(key))
                {
                    dict[key].accessDate = new TimeSpan(DateTime.Now.Ticks);
                    cache = dict[key];
                }
                else
                {
                    lock (dict)
                    {
                        if (dict.ContainsKey(key))
                        {
                            dict[key].accessDate = new TimeSpan(DateTime.Now.Ticks);
                            cache = dict[key];
                        }
                        else
                        {
                            cache = new ImageCache();
                            dict.Add(key, cache);
                        }
                    }
                }

                if (cache.IsLoad)
                    return cache;
            }
            else
            {
                cache = new ImageCache();
            }

            lock (syncImage)
            {
                if (cache.IsLoad)
                    return cache;

                using (var dcm = new DicomData(file))
                {
                    if (!dcm.Images.Load())
                        return null;

                    var ctrl = dcm.Images.CreateImageControl(frameNumber);

                    var data = DicomSplitData.Open(dcm);
                    var lvl = data.CreateTopLevel(0, ctrl);

                    cache.Load(lvl);
                }

                return cache;
            }
        }

        static TimeSpan delTime = TimeSpan.FromMinutes(AppUtil.ImageCacheTime);
        static int maxItem = AppUtil.ImageCacheMax;

        static Timer timer = new Timer(
            delegate(object state)
            {
                timer.Change(Timeout.Infinite, Timeout.Infinite);
                TimeSpan now = new TimeSpan(DateTime.Now.Ticks);
                
                if (AppUtil.ImageCacheMax > 0)
                {
                    lock (dict)
                    {
                        var removeList = new List<string>(dict.Count);
                        foreach (var key in dict.Keys)
                        {
                            if (now - dict[key].accessDate > delTime)
                            {
                                removeList.Add(key);
                            }
                        }
                        foreach (var key in removeList)
                        {
                            dict.Remove(key);
                            //LogUtil.Debug("REL:Time[{0}]", key);
                        }
                        removeList.Clear();

                        if (dict.Count > maxItem)
                        {
                            var list = new List<KeyValuePair<string, ImageCache>>(dict);
                            list.Sort(
                                delegate(KeyValuePair<string, ImageCache> kvp1, KeyValuePair<string, ImageCache> kvp2)
                                {
                                    return (int)(kvp2.Value.accessDate - kvp1.Value.accessDate).Ticks;
                                });

                            foreach (var key in dict.Keys)
                            {
                                removeList.Add(key);
                                if (dict.Count - removeList.Count <= maxItem)
                                    break;
                            }
                        }
                        foreach (var key in removeList)
                        {
                            dict.Remove(key);
                            //LogUtil.Debug("REL:Max[{0}]", key);
                        }
                    }
                }

                timer.Change(1000 * 60, 1000 * 60);
            });

        static ImageCache()
        {
            timer.Change(1000 * 60, 1000 * 60);
        }
    }
}
