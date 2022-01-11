namespace backend.dtos
{
    public class MessageDto
    {
         public string Message { get; set; }

        //vreme slanja
        public string Date { get; set; }
        //username posiljioca
        public string UsernameTo { get; set; }

        //username primaoca
        public string UsernameFrom { get; set; }
		//slika sagovornika
		public string SlikaSrc{get;set;}


    }
}
