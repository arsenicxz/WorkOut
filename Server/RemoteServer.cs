using System;
using System.Threading;
using System.Net.Sockets;
using System.Net;

namespace ExampleTcpListener_Console
{
    class ExampleTcpListener
    {
        static void Main(string[] args)
        {
            TcpListener server = null;
            try
            {
                // Определим нужное максимальное количество потоков
                // Пусть будет по 4 на каждый процессор
                int MaxThreadsCount = Environment.ProcessorCount * 4;
                Console.WriteLine(MaxThreadsCount.ToString());
                // Установим максимальное количество рабочих потоков
                ThreadPool.SetMaxThreads(MaxThreadsCount, MaxThreadsCount);
                // Установим минимальное количество рабочих потоков
                ThreadPool.SetMinThreads(2, 2);


                // Устанавливаем порт для TcpListener = 9595.
                Int32 port = 9595;
                System.Net.IPAddress localAddr = IPAddress.Parse("127.0.0.1");
                int counter = 0;
                server = new TcpListener(IPAddress.Any, port);

                // Запускаем TcpListener и начинаем слушать клиентов.
                server.Start();

                // Принимаем клиентов в бесконечном цикле.
                while (true)
                {

                    Console.Write("\nWaiting for a connection... ");

                    // При появлении клиента добавляем в очередь потоков его обработку.
                    ThreadPool.QueueUserWorkItem(ObrabotkaZaprosa, server.AcceptTcpClient());
                    // Выводим информацию о подключении.
                    counter++;
                    Console.Write("\nConnection №" + counter.ToString() + "!");

                }
            }
            catch (SocketException e)
            {
                //В случае ошибки, выводим что это за ошибка.
                Console.WriteLine("SocketException: {0}", e);
            }
            finally
            {
                // Останавливаем TcpListener.
                server.Stop();
            }


            Console.WriteLine("\nHit enter to continue...");
            Console.Read();
        }

        static void ObrabotkaZaprosa(object client_obj)
        {
            // Буфер для принимаемых данных.
            Byte[] bytes = new Byte[256];
            String data = null;

            //Можно раскомментировать Thread.Sleep(1000); 
            //Запустить несколько клиентов
            //и наглядно увидеть как они обрабатываются в очереди. 
            //Thread.Sleep(1000);

            TcpClient client = client_obj as TcpClient;

            data = null;

            // Получаем информацию от клиента
            NetworkStream stream = client.GetStream();

            int i;

            // Принимаем данные от клиента в цикле пока не дойдём до конца.
            while ((i = stream.Read(bytes, 0, bytes.Length)) != 0)
            {
                // Преобразуем данные в ASCII string.
                data = System.Text.Encoding.ASCII.GetString(bytes, 0, i);

                // Преобразуем строку к верхнему регистру.
                data = data.ToUpper();

                // Преобразуем полученную строку в массив Байт.
                byte[] msg = System.Text.Encoding.ASCII.GetBytes(data);

                // Отправляем данные обратно клиенту (ответ).
                stream.Write(msg, 0, msg.Length);

            }

            // Закрываем соединение.
            client.Close();


        }
    }
}
