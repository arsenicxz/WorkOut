using System;

namespace ServerClass
{
    public class myRemoteClass: MarshalByRefObject
    {
        public bool SetString(String sTemp)
        {
            try
            {
                Console.WriteLine("This string '{0}' has a length of {1}", sTemp, sTemp.Length);
                return sTemp != "";
            }
            catch
            {
                return false;
            }
        }
    }
}
