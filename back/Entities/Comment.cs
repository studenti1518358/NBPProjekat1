using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.MediaServices.Client;

namespace back.entities
{
    public class Comment : BaseEntity
    {
        public int Id { get; set; }
        public int ObjavaId { get; set; }

        public double Date { get; set; }

        public string Text { get; set; }

        public List<string> LikesIds { get; set; }

    }
}
