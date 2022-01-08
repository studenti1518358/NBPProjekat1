using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.MediaServices.Client;

namespace back.entities
{
    public class Objava: BaseEntity
    {
        public long Id { get; set; }
        public string Author { get; set; }

        public string Date { get; set; }

        public string Text { get; set; }

        public string[] LikesIds { get; set; }

        public string Slika {get; set;}

        public List<Comment> Comments { get; set; }

    }
}