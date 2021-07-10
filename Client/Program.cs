using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;

namespace Client
{
    class Program
    {
        static void Main(string[] args)
        {
            var httpClient = new HttpClient();

            System.Console.WriteLine("Registration\n");
            System.Console.WriteLine("Login");
            string login = System.Console.ReadLine();
            System.Console.WriteLine("Password");
            string password = System.Console.ReadLine();

            Dictionary<string, string> parametrs = new Dictionary<string, string>()
            {
                { "Login", login },
                { "Password", password },

            };
            var content = new FormUrlEncodedContent(parametrs);

            //var request = httpClient.GetAsync("http://localhost:8714/",content).Result;
            var request2 = httpClient.PostAsync("http://localhost:8714/", content).Result;
            var requestContent = request2.Content.ReadAsStringAsync().Result;
            File.WriteAllText("index.html", requestContent);
        }
    }
}
