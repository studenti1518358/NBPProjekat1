using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.MediaServices.Client;

namespace back.entities
{
    public class Objava: BaseEntity
    {
        public int Id { get; set; }
        public string Author { get; set; }

        public double Date { get; set; }

        public string Text { get; set; }

        public List<string> LikesIds { get; set; }

        public List<Comment> Comments { get; set; }

    }
}