using back.entities;
using System.Collections.Generic;

namespace backend.dtos
{
    public class UserWithRelationships
    {
        public Neo4jUser User { get; set; }

        public List<Interesovanje> Osobine { get; set; }

        public List<Interesovanje> PozeljneOsobine { get; set; }
    }
}