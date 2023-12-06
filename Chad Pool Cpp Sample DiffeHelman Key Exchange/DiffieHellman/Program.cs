using System;
using System.Collections.Generic;

namespace DiffieHellman
{
    class Header {
        public string To;
        public string From;
        public Header(String To_,String From_) {
            To = To_;
            From = From_;
        }
    }
    class Datagram 
    {
        public Header header;
        public int payload;

        public Datagram(string To, string From, int message)
        {
            payload = message;
            header = new Header(To,From);
        }

        public void printDatagram() {
            Console.Write("To:" + header.To + " From:" + header.From + " Msg:" + payload);
        }

    }


    class person
    {
        public string Name { get; private set; }
        


        private Random rnd = new Random();
        
        private int baseCpy = 0;
        protected int primeCpy = 0;
        protected int private_key = 0;

        private int SharedSecret = 0; 


        public person(string name, int prime, int bass)
        {
            primeCpy = prime;
            baseCpy = bass;

            private_key = rnd.Next(2,bass);
            Name = name;
        }

        public int BigPowMod(int bass, int pow, int prime)
        {
            int mod = bass;
            //This code does the following operation but avoids an overflow becuase of the big power
            //mod = (int)(Math.Pow(number, i)) % prime

            for (int j = 0; j < pow - 1; j++)
            {
                mod = (mod * bass) % prime;
            }
            return mod;
        }

        public void postMsg(Router R , string Address)
        {
            int msg = BigPowMod(baseCpy, private_key, primeCpy); // (D.payload ^ private_key) % primeCpy;
            Datagram packet = new Datagram(Address, Name,  msg);  

            Console.WriteLine("Person" + Name + "Posted Packet This Packet:");
            Console.Write("   ");
            packet.printDatagram();
            Console.WriteLine("");
                
            R.route(packet);
        }

        public virtual void receveMsg( Datagram D) {
            SharedSecret = BigPowMod(D.payload, private_key, primeCpy); // (D.payload ^ private_key) % primeCpy;
        }

        public virtual void PrintSharedSecret() {
            Console.WriteLine("Person" + Name + "Has Shared Secret " + SharedSecret);
        }

        public void PublishNameToRouter(Router r) {
            r.AddToRouteTable(this , Name);
        }

    };

    class MaliciousPerson : person {
        public string intersept1;
        public string intersept2;

        public int interseptPK1;
        public int interseptPK2;

        
        public MaliciousPerson(string name, string intersept1_, string intersept2_, int prime, int bass ) : base(name, prime, bass) {
            intersept1 = intersept1_;
            intersept2 = intersept2_;
        }

        public void reRoutePackets(Router R) {

            person Person1;
            for (int i = 0; i < R.address.Count; i++)
            {
                if (intersept1 == R.address[i])
                {
                    Person1 = R.destination[i];
                    R.RemoveFromRouteTable(Person1.Name);
                    R.AddToRouteTable(Person1,"Real"+Person1.Name);
                    R.AddToRouteTable(this, Person1.Name);
                    break;
                }
            }

            person Person2;
            for (int i = 0; i < R.address.Count; i++)
            {
                if (intersept2 == R.address[i])
                {
                    Person2 = R.destination[i];
                    R.RemoveFromRouteTable(Person2.Name);
                    R.AddToRouteTable(Person2, "Real" + Person2.Name);
                    R.AddToRouteTable(this, Person2.Name);
                    break;
                }
            }
        }

        public override void receveMsg(Datagram D)
        {
            if (D.header.To == intersept1)
            {
                interseptPK1 = BigPowMod(D.payload, private_key, primeCpy); // (D.payload ^ private_key) % primeCpy;
            }
            if (D.header.To == intersept2)
            {
                interseptPK2 = BigPowMod(D.payload, private_key, primeCpy); // (D.payload ^ private_key) % primeCpy;
            }
        }


        public override void PrintSharedSecret()
        {
            Console.WriteLine("Person " + Name + " Intersepted From " + intersept1 + " And Has Shared Secret" + interseptPK1);
            Console.WriteLine("Person " + Name + " Intersepted From " + intersept2 + " And Has Shared Secret" + interseptPK2);
        }

    }



    class Router {

        public List<string> address = new List<string>();
        public List<person> destination = new List<person>();

        public Router() {

        }

        public void printRouteTable() {

            Console.WriteLine(" ");
            Console.WriteLine("RouteTable");

            for (int i = 0; i < address.Count; i++)
            {
                Console.Write(address[i] + " ---> ");
                Console.Write(destination[i].Name + ".obj, ");
                Console.WriteLine(" ");
            }
        }

        public void AddToRouteTable(person p , string Name){
            address.Add(Name);
            destination.Add(p);
        }

        public void RemoveFromRouteTable(String RemAddr)
        {

            for (int i = 0; i < address.Count; i++)
            {
                if (address[i] == RemAddr) {
                    address.RemoveAt(i);
                    destination.RemoveAt(i);
                }
            }
        }

        public void route(Datagram D) {
            
            for (int i = 0; i < address.Count; i++)
            {
                if (D.header.To == address[i]) //find the address
                {
                    destination[i].receveMsg(D);
                }
            }
        }

    };


    class Program
    {
        static bool isPrime(int number)
        {

            if (number < 2) return false;
            if (number == 2) return true;
            if (number % 2 == 0) return false;
            for (int i = 3; (i * i) <= number; i += 2)
            {
                if (number % i == 0) return false;
            }
            return true;

        }

        static int BigPowMod(int bass,int pow,int prime) {
            int mod = bass;
            //This code does the following operation but avoids an overflow becuase of the big power
            //mod = (int)(Math.Pow(number, i)) % prime

            for (int j = 0; j < pow - 1; j++)
            {
                mod = (mod * bass) % prime;
            }
            return mod; 
        }

        static bool isPrimativeRoot(int number,int prime)
        {
            List<int> mods = new List<int>();
            for (int i = 1; prime - 2 >= i; i += 1)
            {
                mods.Add( BigPowMod(number,i,prime) );
            }

            var dupe = new HashSet<int>();
            for (var i = 0; i < mods.Count; ++i)
            {
                if (!dupe.Add(mods[i])) { return false; }
            }
            return true;
        }

        static void Main(string[] args)
        {
            Console.WriteLine("Add Malicious Person y/n");
            bool AddMaliciousPerson = (Console.ReadLine() == "y");
            Console.WriteLine("Add Malicious Person " + AddMaliciousPerson + " Has been selected");
            Console.WriteLine(" ");

            int prime = 54; //start at this large number
            while (!isPrime(prime))
            {
                prime += 1; //dig for primes untill Prime is acutaly prime
            }//now prime is a large prime

            Console.WriteLine("Prime Found:");
            Console.WriteLine(prime);

            int bass = prime-2; //base is c# a keyword so i use bass and base interchangably
            while(!isPrimativeRoot(bass,prime))
            { bass--; }
            Console.WriteLine("Base Found From largest Primative Root:");
            Console.WriteLine(bass);

            Console.WriteLine("");
            Console.WriteLine("The Packets and payload as seen by router:");

            Router R = new Router();

            person Alice = new person("Alice",prime, bass); // (MsgFrom , MsgTo, Prime, Base) 
            Alice.PublishNameToRouter(R);
            //Alice.SetPrivateKey(4);

            person Bob = new person("Bob", prime, bass); // (MsgFrom , MsgTo, Prime, Base) 
            Bob.PublishNameToRouter(R);
            //Bob.SetPrivateKey(4);


            MaliciousPerson Charlie = null;
            if (AddMaliciousPerson) {
                Charlie = new MaliciousPerson("Charlie", "Bob", "Alice", prime, bass);
                //Charlie.SetPrivateKey(3);
                Charlie.reRoutePackets(R);

                Charlie.postMsg(R, "Real" + Alice.Name);
                Charlie.postMsg(R, "Real" + Bob.Name);
            }

            Alice.postMsg(R , "Bob");
            Bob.postMsg(R , "Alice");


            Console.WriteLine(" ");
            Console.WriteLine("Key Exchange Has Concluded Each Parties Respective Private Keys Are As Follows");
            Alice.PrintSharedSecret();
            Bob.PrintSharedSecret();
            if (Charlie != null) { Charlie.PrintSharedSecret(); }
            Console.WriteLine(" ");
            R.printRouteTable();



            bool Exit = (Console.ReadLine() == "x");
        }
    }
}
