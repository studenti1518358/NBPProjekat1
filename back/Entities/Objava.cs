using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.MediaServices.Client;

namespace back.entities
{
    public class Objava: BaseEntity
    {
         public long Id { get; set; }
        public long AuthorId { get; set; }

        public string AuthorUsername { get; set; }

        public string AutorSrc { get; set; }

        public string Date { get; set; }

        public string Text { get; set; }

        public string SlikaSrc { get; set; }

        public Like[] Likes { get; set; }

        public List<Comment> Comments { get; set; }


    }
}