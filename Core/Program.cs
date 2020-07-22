using System;
using ElectronCgi.DotNet;

namespace Core
{
    class Program
    {
        static void Main(string[] args)
        {
            var connection = new ConnectionBuilder()
                .WithLogging()
                .Build();

            connection.On<string, string>("greeting", (string name) =>
            {
                return $"Hello, {name}!";
            });

            connection.Listen();
        }
    }
}
