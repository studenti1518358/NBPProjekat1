using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.MediaServices.Client;

namespace back.entities
{
    public class ChatRoom : BaseEntity
    {
        public int Id { get; set; }
        public IEnumerable<string> Names { get; set; }
       
    }
}