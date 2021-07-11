using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace Client
{
    class Person
    {
        public string login = "";
        public string password = "";

        public Person(string _login, string _password)
        {
            login = _login;
            password = _password;
        }
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

            var jsonSerializerOptions = new JsonSerializerOptions() {PropertyNameCaseInsensitive = true };
            Person newPerson = new Person(login,password);
            var request2 = httpClient.PostAsJsonAsync<Person>("http://localhost:8714/",newPerson).Result;
            if (request2.IsSuccessStatusCode)
            {
                var requestContent = request2.Content.ReadAsStringAsync().Result;
                System.Console.Write("Content is " + requestContent);
                File.WriteAllText("index.html", requestContent);
                System.Console.ReadLine();
            }

            //var request = httpClient.GetAsync("http://localhost:8714/",content).Result;
            //var request2 = httpClient.PostAsync("http://localhost:8714/", content).Result;
        }
    }
}
