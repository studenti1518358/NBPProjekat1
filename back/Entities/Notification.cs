using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.MediaServices.Client;

namespace back.entities
{
    public class Notification : BaseEntity
    {
        public long ObjectId { get; set; }
        public string Text { get; set; }

        public string Date { get; set; }


        //comment,like or follow
        public string Type { get; set; }

       

    }
}