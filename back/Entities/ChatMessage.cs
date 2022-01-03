using System;

using Microsoft.WindowsAzure.MediaServices.Client;

namespace back.entities
{
    public class ChatMessage 
    {
      
        
        //tekst poruke
        public string Message { get; set; }

        //vreme slanja
        public int Date { get; set; }
        //username posiljioca
        public string UsernameTo { get; set; }

        //username primaoca
        public string UsernameFrom { get; set; }
    }
}
