using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace RemoteServer
{
    public class User
    {
        public string Login = "";
        public string Password = "";
        public int Id;

        public User(string _login, string _password)
        {
            Login = _login;
            Password = _password;
        }
    }

    public class Place
    {
        public string Name = "";
        public string Adress = "";
        public int MaxUsers = 0;
        public int Id = 0;
        public List<User> UsersOnPlace = new List<User>();
        public List<User> UsersINQueue = new List<User>();

        public Place(string _name, string _adress, int _maxUsers)
        {
            Name = _name;
            Adress = _adress;
            MaxUsers = _maxUsers;
            List<User> UsersOnPlace = new List<User>();
            List<User> UsersINQueue = new List<User>();
        }
    }

    public class Server
    {
        private Dictionary<string, User> usersData = new Dictionary<string, User>();
        private List<User> users = new List<User>();
        private List<Place> places = new List<Place>();

        public Server()
        {

        }

        public void Run()
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
                            var reader = new StreamReader(body, request.ContentEncoding);
                            string bodyStr = reader.ReadToEnd();
                            System.Console.WriteLine(bodyStr);
                            text = ParceRequest(bodyStr);
                            break;
                        }
                    default:
                        {
                            text = "Error this is not Post or Get Request";
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

        private string ParceRequest(string body)
        {
            string[] subs = body.Split('&');
            if (subs[0].Contains("registration"))
            {
                string login = subs[1].Split('=')[1];
                string password = subs[2].Split('=')[1];
                if (usersData.ContainsKey(login))
                {
                    return "error";
                }
                else
                {
                    User newUser = new User(login, password);
                    newUser.Id = users.Count;
                    users.Add(newUser);
                    usersData.Add(login, newUser);
                    return "success id="+(newUser.Id);
                }
            }

            if (subs[0].Contains("authorization"))
            {
                string login = subs[1].Split('=')[1];
                string password = subs[2].Split('=')[1];
                if (usersData.ContainsKey(login) && usersData[login].Password == password)
                {
                    
                    User currentUser = usersData[login];
                    return "succes id=" + currentUser.Id;
                }
                else
                {
                    return "error";
                }
            }

            if (subs[0].Contains("placeGenerating"))
            {
                string name = subs[1].Split('=')[1];
                string adress = subs[2].Split('=')[1];
                int maxCount = Int32.Parse(subs[3].Split('=')[1]);
                Place newPlace = new Place(name, adress, maxCount);
                newPlace.Id = places.Count;
                places.Add(newPlace);
                return "success";
            }

            if (subs[0].Contains("tryToStart"))
            {
                int userId = Int32.Parse(subs[1].Split('=')[1]);
                int placeId = Int32.Parse(subs[2].Split('=')[1]);
                if(places[placeId].MaxUsers<= places[placeId].UsersOnPlace.Count)
                {
                    return "alreadyMax";
                }
                else
                {
                    return "canStart";
                }
            }

            if (subs[0].Contains("start"))
            {
                int userId = Int32.Parse(subs[1].Split('=')[1]);
                int placeId = Int32.Parse(subs[2].Split('=')[1]);
                if (places[placeId].MaxUsers <= places[placeId].UsersOnPlace.Count)
                {
                    return "alreadyMax";
                }
                else
                {
                    AddUserInPlace(userId, placeId);
                    return "success";
                }
            }

            if (subs[0].Contains("goToQueue"))
            {
                int userId = Int32.Parse(subs[1].Split('=')[1]);
                int placeId = Int32.Parse(subs[2].Split('=')[1]);
                places[placeId].UsersINQueue.Add(users[userId]);
                return "success "+(places[placeId].UsersINQueue.Count-1);
            }

            return "unfinded mod";
        }

        private void AddUserInPlace(int userId, int placeId)
        {
            places[placeId].UsersOnPlace.Add(users[userId]);
            Wait30Min(users[userId], placeId);
        }

        private async void Wait30Min(User user, int placeId)
        {
            await Task.Run(() => Thread.Sleep(1000 * 60 * 30));
            places[placeId].UsersOnPlace.Remove(user);
            RefreshPlace(placeId);
        }

        private void RefreshPlace(int placeId)
        {
            if(places[placeId].UsersINQueue.Count != 0)
            {
                int n = places[placeId].MaxUsers - places[placeId].UsersOnPlace.Count;
                for(int i = 0; i < n; i++)
                {
                    AddUserInPlace(places[placeId].UsersINQueue[i].Id,placeId);
                    //отправить сообщение что теперь вы не в очереди
                }
            }
        }
    }

    class Program
    {
        public static void Main()
        {
            var server = new Server();
            server.Run();
        }
    }
}
