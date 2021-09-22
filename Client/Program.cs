using System;
using System.Collections.Generic;
using System.Net.Http;

namespace Client
{
    class Person
    {
        public string login = "";
        public string password = "";
    }
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

            var content = new FormUrlEncodedContent(new[]{
                new KeyValuePair<string,string>("mod","registration"),
                new KeyValuePair<string,string>("login",login),
                new KeyValuePair<string,string>("password",password),
            });
            var result = httpClient.PostAsync("http://localhost:8714/", content).Result;

            string resultContent = result.Content.ReadAsStringAsync().Result;
            Console.WriteLine(resultContent+"\n");

            bool isUnSucces = true;
            while (isUnSucces)
            {
                Console.WriteLine("Autorization\n");
                System.Console.WriteLine("Login");
                login = System.Console.ReadLine();
                System.Console.WriteLine("Password");
                password = System.Console.ReadLine();

                content = new FormUrlEncodedContent(new[]{
                    new KeyValuePair<string,string>("mod","autorization"),
                    new KeyValuePair<string,string>("login",login),
                    new KeyValuePair<string,string>("password",password),
                });
                result = httpClient.PostAsync("http://localhost:8714/", content).Result;

                resultContent = result.Content.ReadAsStringAsync().Result;
                isUnSucces = !(resultContent == "success");
                Console.WriteLine(resultContent + "\n");
            }
            
        }
    }
}
