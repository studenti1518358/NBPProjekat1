

using back.entities;
using back.Helpers;
using backend.dtos;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;
using Neo4j.Driver;
using System.Collections.Generic;
using System.Text;
using System.Reflection;
//sve sto ima veze sa autentifikacijom: registracija, login, logout
namespace back
{

    [ApiController]
    [Route("api/[controller]")]

    public class AuthController : ControllerBase
    {

        private readonly IConnectionMultiplexer _redis;
        private readonly IDriver _neo4jDriver;

        private JwtService _jwtService;
        public AuthController(IConnectionMultiplexer redis, JwtService jwtService)
        {
            _redis = redis;
            _jwtService = jwtService;
            _neo4jDriver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
        }

        [HttpPost]
        [Route("registerUser")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterAttributes user)
        {
            try
            {
                long userId = await this.generateUserId();
                user.OsnovneInformacije.Password = BCrypt.Net.BCrypt.HashPassword(user.OsnovneInformacije.Password);
                await this.RegisterToRedis(user.OsnovneInformacije, userId);
                await this.RegisterToNeo4j(user, userId);
                return Ok("User successfully created");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("loginUser")]
        public async Task<IActionResult> Login([FromBody] LoginDto user)
        {
            if (user == null)
                return BadRequest("Invalid credentials");

            var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{user.Username}") == false)
                return BadRequest("Invalid credentials");
            string usernameKey = $"username:{user.Username}";
            int userId = (int)await db.StringGetAsync(usernameKey);
            string hashedPassword = await db.HashGetAsync($"user:{userId}", "password");
          
            if (!BCrypt.Net.BCrypt.Verify(user.Password, hashedPassword))
                return BadRequest("Invalid credentials");

            var jwt = _jwtService.GenerateJwtToken(userId);
            Response.Cookies.Append("jwt", jwt, new Microsoft.AspNetCore.Http.CookieOptions
            {
                HttpOnly = true
            });
            return Ok("Successful login");

        }

        [HttpGet]
        [Route("getUser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];
                var token = _jwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);

                string key = $"user:{userId}";
                var db = _redis.GetDatabase();
                User user=new User();
                user.Id = userId;
                user.Username = await db.HashGetAsync(key, "username");
                user.Password= await db.HashGetAsync(key, "password");
                user.isOnline= (bool)await db.HashGetAsync(key, "isOnline");
                user.Email=await db.HashGetAsync(key, "username");
                user.ProfilnaSrc=await db.HashGetAsync(key, "ProfilnaSrc");
                user.NaslovnaSrc=await db.HashGetAsync(key, "NaslovnaSrc");

                return Ok(user);
            }
            catch (Exception e)
            {
                return Unauthorized();
            }
           // return Ok();
        }



        [HttpPost]
        [Route("logoutUser")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok("logout success");
        }

        private async Task<bool> RegisterToRedis(UserInfo user,long id)
        {
             var db = _redis.GetDatabase();
             string usernameKey = $"username:{user.Username}";
            // string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
             if (await db.KeyExistsAsync(usernameKey))
             {
                throw new Exception("User already exists");
             }
             //var nextId = await db.StringIncrementAsync("total_users");
             string userKey = $"user:{id}";
             await db.StringSetAsync(usernameKey,id);
             await db.HashSetAsync(userKey, new HashEntry[]
             {
                     new HashEntry("username",user.Username),
                     new HashEntry("password",user.Password),
                     new HashEntry("email",user.Email),
                     new HashEntry("isOnline",true)
             });
            return true;
        }

        private async Task<bool> RegisterToNeo4j(RegisterAttributes user, long id)
        {
            //upisuvanje osnovnih podataka o korisniku
            var userInfo = user.OsnovneInformacije;
            var statementText = new StringBuilder();
            statementText.Append("CREATE (user:User {username: $username,password:$password,id:$id,email:$email,ime:$ime,prezime:$prezime,godine:$godine,mesto:$mesto,bracniStatus:$bracniStatus,zanimanje:$zanimanje,pol:$pol,godineOd:$godineOd,godineDo:$godineDo,polPartnera:$polPartnera,tipVeze:$tipVeze})");
            var statementParameters = new Dictionary<string, object>
        {
            {"username", userInfo.Username },
            {"password",userInfo.Password },
             {"id",id.ToString() },
             {"email",userInfo.Email },
                {"ime",userInfo.Ime },
                {"prezime",userInfo.Prezime },
                {"godine",userInfo.Godine },
                {"mesto",userInfo.MestoStanovanja },
                {"bracniStatus",userInfo.BracniStatus },
                {"zanimanje",userInfo.Zanimanje },
                {"pol",userInfo.Pol},
                {"godineOd",user.TrazimKodPartnera.GodineOd },
                {"godineDo",user.TrazimKodPartnera.GodineDo },
                {"polPartnera",user.TrazimKodPartnera.Pol },
                {"tipVeze",user.TrazimKodPartnera.TipVeze }

        };
            var session = this._neo4jDriver.AsyncSession();
            var result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
            //upisivanje podataka o izgledu korisnika
            Izgled izgledKorisnika = user.MojIzgled;
            PropertyInfo[] properties = izgledKorisnika.GetType().GetProperties();
            foreach (PropertyInfo pi in properties)
            {
                if ((pi.PropertyType == typeof(double) && (double)pi.GetValue(izgledKorisnika) != 0) || (pi.PropertyType == typeof(string) && (string)pi.GetValue(izgledKorisnika) != ""))
                {
                    statementText = new StringBuilder();
                    statementText.Append($"MERGE (atribut:Osobina {{name:$name,value:$value}})");
                    statementParameters = new Dictionary<string, object>
                {
                    { "value",pi.GetValue(izgledKorisnika) },
                    {"name",pi.Name}
                };
                    session = this._neo4jDriver.AsyncSession();
                    result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));

                    statementText = new StringBuilder();
                    statementText.Append($"MATCH (a: User), (b:Osobina) WHERE a.username = $username AND b.value = $value AND b.name=$name CREATE(a) -[r: POSEDUJE]->(b) RETURN type(r)");
                    statementParameters = new Dictionary<string, object>
                {
                    { "username",userInfo.Username },
                    { "value",pi.GetValue(izgledKorisnika) },
                      {"name",pi.Name}

                };
                    session = this._neo4jDriver.AsyncSession();
                    result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
                }

            }
            //upisivanje podataka o izgledu partnera
            Izgled izgledPartnera = user.IzgledPartnera;
            properties = izgledPartnera.GetType().GetProperties();
            foreach (PropertyInfo pi in properties)
            {
                if ((pi.PropertyType == typeof(double) && (double)pi.GetValue(izgledPartnera) != 0) || (pi.PropertyType == typeof(string) && (string)pi.GetValue(izgledPartnera) != ""))
                {
                    statementText = new StringBuilder();
                    statementText.Append($"MERGE (atribut:Osobina {{value:$value,name:$name}})");
                    statementParameters = new Dictionary<string, object>
                {
                    { "value",pi.GetValue(izgledPartnera) },
                      {"name",pi.Name}
                };
                    session = this._neo4jDriver.AsyncSession();
                    result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));

                    statementText = new StringBuilder();
                    statementText.Append($"MATCH (a: User), (b:Osobina) WHERE a.username = $username AND b.value = $value AND b.name=$name CREATE(a) -[r: TRAZIM]->(b) RETURN type(r)");
                    statementParameters = new Dictionary<string, object>
                {
                    { "username",userInfo.Username },
                    { "value",pi.GetValue(izgledPartnera) },
                      {"name",pi.Name}
                };
                    session = this._neo4jDriver.AsyncSession();
                    result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
                }

            }

            //upisivanje podataka o interesovanjima

            Interesovanja interesovanja = user.Interesovanja;
            properties = interesovanja.GetType().GetProperties();
            foreach (PropertyInfo pi in properties)
            {
                if ((pi.PropertyType == typeof(double) && (double)pi.GetValue(interesovanja) != 0) || (pi.PropertyType == typeof(string) && (string)pi.GetValue(interesovanja) != ""))
                {
                    statementText = new StringBuilder();
                    statementText.Append($"MERGE (atribut:Osobina {{value:$value,name:$name}})");
                    statementParameters = new Dictionary<string, object>
                {
                    { "value",pi.GetValue(interesovanja) },
                      {"name",pi.Name}
                };
                    session = this._neo4jDriver.AsyncSession();
                    result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));

                    statementText = new StringBuilder();
                    statementText.Append($"MATCH (a: User), (b:Osobina) WHERE a.username = $username AND b.value = $value AND b.name=$name CREATE(a) -[r: INTERESUJEME]->(b) RETURN type(r)");
                    statementParameters = new Dictionary<string, object>
                {
                    { "username",userInfo.Username },
                    { "value",pi.GetValue(interesovanja) },
                      {"name",pi.Name}
                };
                    session = this._neo4jDriver.AsyncSession();
                    result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
                }

            }
            //upisivanje tipa veze koji se trazi
            if (user.TrazimKodPartnera.TipVeze!="")
            {
                statementText = new StringBuilder();
                statementText.Append($"MERGE (atribut:Osobina {{value:$value,name:$name}})");
                statementParameters = new Dictionary<string, object>
                {
                    { "value",user.TrazimKodPartnera.TipVeze },
                    {"name","tipVeze" }
                    
                };
                session = this._neo4jDriver.AsyncSession();
                result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));

                statementText = new StringBuilder();
                statementText.Append($"MATCH (a: User), (b:Osobina) WHERE a.username = $username AND b.value = $value AND b.name=$name  CREATE(a) -[r: INTERESUJEME]->(b) RETURN type(r)");
                statementParameters = new Dictionary<string, object>
                {
                    { "username",userInfo.Username },
                    { "value",user.TrazimKodPartnera.TipVeze },
                    {"name","tipVeze" }
                      
                };
                session = this._neo4jDriver.AsyncSession();
                result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
            }
            //dodavanje cvora za mesto stanovanja
            if (user.OsnovneInformacije.MestoStanovanja != "")
            {
                statementText = new StringBuilder();
                statementText.Append($"MERGE (atribut:Osobina {{value:$value,name:$name}})");
                statementParameters = new Dictionary<string, object>
                {
                    { "value",user.OsnovneInformacije.MestoStanovanja },
                    {"name","mesto" }

                };
                session = this._neo4jDriver.AsyncSession();
                result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));

                statementText = new StringBuilder();
                statementText.Append($"MATCH (a: User), (b:Osobina) WHERE a.username = $username AND b.value = $value AND b.name=$name  CREATE(a) -[r: ZIVIM]->(b) RETURN type(r)");
                statementParameters = new Dictionary<string, object>
                {
                    { "username",userInfo.Username },
                    { "value",user.OsnovneInformacije.MestoStanovanja },
                    {"name","mesto"}

                };
                session = this._neo4jDriver.AsyncSession();
                result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
            }



            return true;
        }

        private async Task<long> generateUserId()
        {
              var db = _redis.GetDatabase();
            var nextId = await db.StringIncrementAsync("total_users");
            return nextId;

        }

    }
}
