using System;

using Microsoft.WindowsAzure.MediaServices.Client;

namespace back.entities
{
    public class User:BaseEntity
    {
        public long Id { get; set; }
        public string Username { get; set; }

        public bool isOnline { get; set; }
        public string Password { get; set; }

        public string Email { get; set; }
    }
}