using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
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

        public string ProfilnaSrc { get;set;}

        public string NaslovnaSrc { get;set;}

        public List<string> Fotografije { get; set; }

    }
}