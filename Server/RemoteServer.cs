using System;
using System.Collections.Generic;
using System.Threading;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.IO;

namespace RemoteServer
{
    class Program
    {
        private Dictionary<string, string> LP;

        static void Main(string[] args)
        {
            var httpListener = new HttpListener();
            httpListener.Prefixes.Add("http://localhost:8714/");
            httpListener.Start();

            while (true)
            {
                var requestContext = httpListener.GetContext();
                var request = requestContext.Request;
                requestContext.Response.StatusCode = 200; //OK
                var text = "";
                var stream = requestContext.Response.OutputStream;
                switch (request.HttpMethod)
                {
                    case "GET":
                        {
                            text = "Get Request";
                            break;
                        }
                    case "POST":
                        {
                            var body = request.InputStream;
                            var reader = new StreamReader(body,request.ContentEncoding);
                            var a = reader.ReadToEnd();
                            System.Console.WriteLine(a);
                            text = "Post Request";
                            break;
                        }
                    case "PUT":
                        {
                            text = "Put Request";
                            break;
                        }
                    case "DELETE":
                        {
                            text = "Delete Request";
                            break;
                        }
                    case "PATH":
                        {
                            text = "Path Request";
                            break;
                        }
                    default:
                        {
                            text = "Nothing";
                            break;
                        }
                }
                var bytes = Encoding.UTF8.GetBytes(text);
                stream.Write(bytes, 0, bytes.Length);
                requestContext.Response.Close();
            }
            
            httpListener.Stop();
            httpListener.Close();
            System.Console.WriteLine(HttpListener.IsSupported);
        }
    }
}
