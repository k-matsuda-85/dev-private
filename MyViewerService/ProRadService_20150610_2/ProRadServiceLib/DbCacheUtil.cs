using System;
using System.Collections.Generic;
using System.Threading;

namespace ProRadServiceLib
{
    class DbCacheUtil
    {
        //有効期限(min)
        const int LIMIT = 30;

        static DateTime stoLimit = DateTime.Now.AddMinutes(-1);
        static ReaderWriterLockSlim stoLock = new ReaderWriterLockSlim();
        static List<StorageItem> stoItems = new List<StorageItem>();

        //ストレージ情報の取得
        public static StorageItem GetStorage(string StorageID = "")
        {
            if (stoLimit < DateTime.Now)
            {
                //ライターロック
                stoLock.EnterWriteLock();
                try
                {
                    if (stoLimit < DateTime.Now)
                    {
                        DbUtil.GetStorageList(out stoItems);
                        stoLimit = DateTime.Now.AddMinutes(LIMIT);
                    }
                }
                finally
                {
                    stoLock.ExitWriteLock();
                }
            }

            //リーダーロック
            stoLock.EnterReadLock();
            try
            {
                if (StorageID == null || StorageID == "")
                {
                    foreach (var item in stoItems)
                    {
                        if (item.Priority > 0)
                        {
                            return item;
                        }
                    }
                }
                else
                {
                    foreach (var item in stoItems)
                    {
                        if (item.StorageID == StorageID)
                        {
                            return item;
                        }
                    }
                }

                return new StorageItem();
            }
            finally
            {
                stoLock.ExitReadLock();
            }
        }
    }
}
