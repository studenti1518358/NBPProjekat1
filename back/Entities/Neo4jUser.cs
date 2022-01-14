namespace back.entities
{
    public class Neo4jUser
    {
        public string BracniStatus { get; set; }

        public string Email { get; set; }
        public int Godine { get; set; }
        public string Id { get; set; }

        public string Ime { get; set; }

        public string Mesto { get; set; }
       
     
        public string Password { get; set; }
        public string Pol { get; set; }

        public string Prezime { get; set; }
     
    
      
        public string Zanimanje { get; set; }
        public string Username { get; set; }
        public string PolPartnera { get; set; }

        public int GodineOd { get; set; }

        public int GodineDo { get; set; }

        public string ProfilnaSrc { get; set; }

        public string NaslovnaSrc { get; set; }

        public string Opis { get; set; }

        public string TipVeze { get; set; }

        public bool IsOnline { get; set; }
        public string LastSeen { get; set; }

    }
}
