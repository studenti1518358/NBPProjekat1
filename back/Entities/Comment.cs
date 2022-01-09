using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.MediaServices.Client;

namespace back.entities
{
    public class Comment : BaseEntity
    {
       public long Id { get; set; }
        public long ObjavaId { get; set; }

        public long AuthorId { get; set; }

        public string AuthorUsername { get; set; }

        public string AutorSrc { get; set; }

        public string Date { get; set; }

        public string Text { get; set; }

        public Like[] Likes { get; set; }

    }
}
