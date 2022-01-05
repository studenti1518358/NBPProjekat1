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

        public double Date { get; set; }

        public string Text { get; set; }

        public string[] LikesIds { get; set; }

    }
}
