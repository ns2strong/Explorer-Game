import type { RegionId } from './regions';

/** A picture tile on a state card. Tapping it says the word and its detail out loud. */
export interface Thing {
  /** An emoji, or 'ARCH' for the custom Gateway Arch drawing. */
  icon: string;
  word: string;
  /** One or two short sentences about this picture, spoken when Ava taps it. */
  detail: string;
}

export interface UsState {
  /** FIPS code; matches the feature ids in us-atlas. */
  fips: string;
  code: string;
  name: string;
  capital: string;
  region: RegionId;
  /** Three picture tiles: usually an animal, a food or thing, and a landmark. */
  things: [Thing, Thing, Thing];
  /** One or two short sentences, spoken aloud. Written for a 4-year-old. */
  fact: string;
}

export const STATES: UsState[] = [
  // ── Northeast ────────────────────────────────────────────────
  {
    fips: '23', code: 'ME', name: 'Maine', capital: 'Augusta', region: 'northeast',
    things: [
      { icon: '🦞', word: 'lobster', detail: "Lobsters have big claws and live on the bottom of the ocean. Fishermen catch them in traps!" },
      { icon: '🫎', word: 'moose', detail: "Moose are the biggest deer in the world, with giant antlers. Lots of moose live in Maine's forests." },
      { icon: '🌲', word: 'forest', detail: "Most of Maine is covered in trees! That's why it's called the Pine Tree State." },
    ],
    fact: 'Maine catches the most lobsters, and moose live in its big forests!',
  },
  {
    fips: '33', code: 'NH', name: 'New Hampshire', capital: 'Concord', region: 'northeast',
    things: [
      { icon: '⛰️', word: 'Mount Washington', detail: "Mount Washington is the tallest mountain in the Northeast. It's famous for wild, snowy weather!" },
      { icon: '💨', word: 'wind', detail: "A long time ago, scientists on top of Mount Washington measured one of the fastest winds ever. Whoosh!" },
      { icon: '🍁', word: 'fall leaves', detail: "In the fall, New Hampshire's trees turn bright red, orange, and yellow. People come from far away to see them!" },
    ],
    fact: 'New Hampshire has Mount Washington, where the wind blows super hard! Whoosh!',
  },
  {
    fips: '50', code: 'VT', name: 'Vermont', capital: 'Montpelier', region: 'northeast',
    things: [
      { icon: '🍁', word: 'maple tree', detail: "Maple trees have sweet sap inside. Farmers collect the sap in early spring." },
      { icon: '🥞', word: 'pancakes with maple syrup', detail: "Farmers boil maple sap for a long time until it turns into sticky, sweet maple syrup. Yum!" },
      { icon: '🐄', word: 'cow', detail: "Vermont has lots of dairy farms with cows that give milk for cheese and ice cream." },
    ],
    fact: 'Vermont makes more maple syrup than any other state! Yum, pancakes!',
  },
  {
    fips: '25', code: 'MA', name: 'Massachusetts', capital: 'Boston', region: 'northeast',
    things: [
      { icon: '🏀', word: 'basketball', detail: "A teacher named James Naismith invented basketball in Springfield, Massachusetts. The first hoops were peach baskets!" },
      { icon: '🐋', word: 'whale', detail: "Humpback whales swim near Massachusetts in the summer. Sometimes they jump right out of the water!" },
      { icon: '⛵', word: 'sailboat', detail: "Long ago, the Pilgrims sailed to Massachusetts on a ship called the Mayflower." },
    ],
    fact: 'Basketball was invented in Massachusetts! People go on boats there to watch whales.',
  },
  {
    fips: '44', code: 'RI', name: 'Rhode Island', capital: 'Providence', region: 'northeast',
    things: [
      { icon: '🐔', word: 'Rhode Island Red chicken', detail: "The Rhode Island Red is a chicken that was first raised in Rhode Island. It's the state bird!" },
      { icon: '⛵', word: 'sailboat', detail: "Rhode Island has so many sailboats that the city of Newport is called the Sailing Capital of the World!" },
      { icon: '🌊', word: 'ocean', detail: "Rhode Island is small, but it has lots of beaches along the Atlantic Ocean." },
    ],
    fact: 'Rhode Island is the smallest state! It is called the Ocean State.',
  },
  {
    fips: '09', code: 'CT', name: 'Connecticut', capital: 'Hartford', region: 'northeast',
    things: [
      { icon: '🐋', word: 'sperm whale', detail: "Sperm whales have giant square heads! They dive super deep to hunt for squid." },
      { icon: '🍕', word: 'pizza', detail: "New Haven, Connecticut is famous for pizza baked in very hot ovens. People wait in long lines for a slice!" },
      { icon: '⛵', word: 'ship', detail: "At Mystic Seaport in Connecticut, you can climb aboard a real old wooden whaling ship!" },
    ],
    fact: "Connecticut's state animal is the sperm whale, a giant whale! It is famous for yummy pizza too.",
  },
  {
    fips: '36', code: 'NY', name: 'New York', capital: 'Albany', region: 'northeast',
    things: [
      { icon: '🗽', word: 'Statue of Liberty', detail: "The Statue of Liberty was a gift from France. She holds a torch up high to welcome people to America!" },
      { icon: '🍎', word: 'the Big Apple', detail: "New York City's nickname is the Big Apple. It's the biggest city in the whole country!" },
      { icon: '🏙️', word: 'skyscrapers', detail: "New York City has lots and lots of tall buildings. The Empire State Building is one of the most famous!" },
    ],
    fact: 'New York has the Statue of Liberty, and a giant city nicknamed the Big Apple!',
  },
  {
    fips: '34', code: 'NJ', name: 'New Jersey', capital: 'Trenton', region: 'northeast',
    things: [
      { icon: '💡', word: 'light bulb', detail: "Thomas Edison had his workshop in New Jersey. He made a light bulb that could glow for a long time." },
      { icon: '🍅', word: 'tomatoes', detail: "New Jersey farms grow juicy red tomatoes. That's why it's called the Garden State!" },
      { icon: '🏖️', word: 'beach', detail: "The Jersey Shore has long sandy beaches and boardwalks with rides and games!" },
    ],
    fact: 'New Jersey is the Garden State! Thomas Edison made his famous light bulb there.',
  },
  {
    fips: '42', code: 'PA', name: 'Pennsylvania', capital: 'Harrisburg', region: 'northeast',
    things: [
      { icon: '🔔', word: 'Liberty Bell', detail: "The Liberty Bell is very old and has a big crack in it! You can visit it in the city of Philadelphia." },
      { icon: '🍫', word: 'chocolate', detail: "In Hershey, Pennsylvania, even the streetlights are shaped like chocolate kisses!" },
      { icon: '🥨', word: 'pretzel', detail: "Pennsylvania makes more pretzels than any other state. Crunchy and salty!" },
    ],
    fact: 'Pennsylvania has the Liberty Bell, and a whole town that makes chocolate!',
  },
  {
    fips: '10', code: 'DE', name: 'Delaware', capital: 'Dover', region: 'northeast',
    things: [
      { icon: '🥇', word: 'first place', detail: "A long, long time ago, Delaware was the first state to join the United States. That makes it state number one!" },
      { icon: '🐔', word: 'Blue Hen chicken', detail: "The Blue Hen chicken has bluish gray feathers. It's Delaware's state bird!" },
      { icon: '🏖️', word: 'beach', detail: "Delaware has sunny beaches like Rehoboth Beach, with a boardwalk by the ocean." },
    ],
    fact: 'Delaware was the very first state! Its state bird is a chicken called the Blue Hen.',
  },
  {
    fips: '24', code: 'MD', name: 'Maryland', capital: 'Annapolis', region: 'northeast',
    things: [
      { icon: '🦀', word: 'blue crab', detail: "Blue crabs have blue claws and walk sideways! People in Maryland love to eat them." },
      { icon: '⛵', word: 'sailboat', detail: "The Chesapeake Bay is the biggest bay in the country. Rivers flow into it and mix with salty ocean water." },
      { icon: '🌊', word: 'Chesapeake Bay', detail: "Annapolis, Maryland's capital city, is full of sailboats. Sailors for the Navy go to school there!" },
    ],
    fact: 'Maryland is famous for blue crabs that live in the Chesapeake Bay! Pinch pinch!',
  },

  // ── Southeast ────────────────────────────────────────────────
  {
    fips: '54', code: 'WV', name: 'West Virginia', capital: 'Charleston', region: 'southeast',
    things: [
      { icon: '⛰️', word: 'mountains', detail: "West Virginia is the only state that is all inside the Appalachian Mountains!" },
      { icon: '🐻', word: 'black bear', detail: "The black bear is West Virginia's state animal. Bears love to eat berries and nuts in the forest." },
      { icon: '🛶', word: 'river rafting', detail: "People ride rubber rafts down the bumpy, splashy New River. Splash!" },
    ],
    fact: 'West Virginia is the Mountain State! It is full of mountains and forests where black bears live.',
  },
  {
    fips: '51', code: 'VA', name: 'Virginia', capital: 'Richmond', region: 'southeast',
    things: [
      { icon: '🐴', word: 'wild pony', detail: "Wild ponies live on Assateague Island. Every summer, they swim across the water and people cheer!" },
      { icon: '🎩', word: 'presidents', detail: "Eight presidents were born in Virginia, including George Washington, the very first president!" },
      { icon: '🏖️', word: 'beach', detail: "Virginia Beach has a long, sandy beach and a boardwalk by the Atlantic Ocean. You can see dolphins there!" },
    ],
    fact: 'Virginia has wild ponies that live on an island by the beach! Eight presidents were born there.',
  },
  {
    fips: '21', code: 'KY', name: 'Kentucky', capital: 'Frankfort', region: 'southeast',
    things: [
      { icon: '🐎', word: 'racehorse', detail: "The Kentucky Derby is a famous horse race. People wear big, fancy hats to watch it!" },
      { icon: '🦇', word: 'cave bat', detail: "Bats live in Kentucky's caves. They sleep upside down all day long!" },
      { icon: '🔦', word: 'cave', detail: "Mammoth Cave has more than four hundred miles of tunnels under the ground. That's the longest cave anyone has found!" },
    ],
    fact: 'Kentucky has the longest cave in the whole world, called Mammoth Cave! It is famous for fast racehorses too.',
  },
  {
    fips: '47', code: 'TN', name: 'Tennessee', capital: 'Nashville', region: 'southeast',
    things: [
      { icon: '🎸', word: 'guitar', detail: "Nashville is called Music City because so many people play and record music there, especially country music." },
      { icon: '🎤', word: 'singing', detail: "The Grand Ole Opry is a famous show in Nashville where singers have performed for about one hundred years!" },
      { icon: '⛰️', word: 'Smoky Mountains', detail: "The Great Smoky Mountains look smoky because of a blue fog that floats over the trees. Lots of black bears live there!" },
    ],
    fact: 'Tennessee has Nashville, called Music City, where people play guitars and sing!',
  },
  {
    fips: '37', code: 'NC', name: 'North Carolina', capital: 'Raleigh', region: 'southeast',
    things: [
      { icon: '✈️', word: 'airplane', detail: "The Wright brothers flew the very first airplane at Kitty Hawk, North Carolina. The first flight lasted just twelve seconds!" },
      { icon: '🍠', word: 'sweet potato', detail: "North Carolina grows more sweet potatoes than any other state!" },
      { icon: '🏖️', word: 'beach', detail: "North Carolina has long, skinny islands called the Outer Banks, with sandy beaches and tall lighthouses." },
    ],
    fact: 'The very first airplane flight happened in North Carolina! Zoom!',
  },
  {
    fips: '45', code: 'SC', name: 'South Carolina', capital: 'Columbia', region: 'southeast',
    things: [
      { icon: '🌴', word: 'palmetto tree', detail: "The palmetto tree is on South Carolina's flag! Its spongy wood helped protect a fort long ago." },
      { icon: '🐢', word: 'sea turtle', detail: "Loggerhead sea turtles crawl onto the beach at night to lay eggs. Then the babies scurry to the sea!" },
      { icon: '🏖️', word: 'beach', detail: "Myrtle Beach in South Carolina has a giant Ferris wheel right by the ocean!" },
    ],
    fact: 'South Carolina has palm trees called palmettos, and sea turtles lay their eggs on its beaches!',
  },
  {
    fips: '13', code: 'GA', name: 'Georgia', capital: 'Atlanta', region: 'southeast',
    things: [
      { icon: '🍑', word: 'peach', detail: "Georgia peaches are fuzzy on the outside and juicy on the inside. Yum!" },
      { icon: '🥜', word: 'peanuts', detail: "Georgia grows more peanuts than any other state. Peanuts grow under the ground!" },
      { icon: '🏙️', word: 'Atlanta', detail: "Atlanta is Georgia's biggest city. It has a giant aquarium with whale sharks!" },
    ],
    fact: 'Georgia is called the Peach State because it grows so many yummy peaches!',
  },
  {
    fips: '12', code: 'FL', name: 'Florida', capital: 'Tallahassee', region: 'southeast',
    things: [
      { icon: '🐊', word: 'alligator', detail: "More than a million alligators live in Florida's swamps, lakes, and rivers!" },
      { icon: '🍊', word: 'orange', detail: "Florida grows lots of oranges. Orange juice is even Florida's state drink!" },
      { icon: '🚀', word: 'rocket', detail: "Rockets blast off into space from Kennedy Space Center in Florida. Three, two, one, liftoff!" },
    ],
    fact: 'Florida has alligators, sunny beaches, and rockets that blast off into space!',
  },
  {
    fips: '01', code: 'AL', name: 'Alabama', capital: 'Montgomery', region: 'southeast',
    things: [
      { icon: '🚀', word: 'rocket', detail: "In Huntsville, Alabama, people built the giant Saturn Five rocket that took astronauts to the Moon!" },
      { icon: '🌙', word: 'the Moon', detail: "You can see a real Moon rocket at the Space and Rocket Center in Alabama. It's longer than a football field!" },
      { icon: '🥜', word: 'peanuts', detail: "Alabama farmers grow lots of peanuts, and the town of Dothan has a big peanut festival every year!" },
    ],
    fact: 'Alabama helped build the giant rockets that flew people to the Moon!',
  },
  {
    fips: '28', code: 'MS', name: 'Mississippi', capital: 'Jackson', region: 'southeast',
    things: [
      { icon: '🌊', word: 'Mississippi River', detail: "The Mississippi River is one of the longest rivers in North America. Big boats called barges carry things up and down it!" },
      { icon: '🐟', word: 'catfish', detail: "Mississippi raises more catfish than any other state. Catfish have whiskers, just like a cat!" },
      { icon: '🎸', word: 'blues music', detail: "Blues music began in Mississippi. Singers played guitars and sang about their feelings." },
    ],
    fact: 'Mississippi is named after a giant river, the Mississippi River! Catfish swim there.',
  },
  {
    fips: '22', code: 'LA', name: 'Louisiana', capital: 'Baton Rouge', region: 'southeast',
    things: [
      { icon: '🎺', word: 'jazz trumpet', detail: "Jazz is happy, bouncy music played with trumpets, drums, and pianos. In New Orleans, bands play right in the street!" },
      { icon: '🐊', word: 'alligator', detail: "Louisiana has lots of alligators living in its slow, swampy rivers, called bayous!" },
      { icon: '🦐', word: 'shrimp', detail: "Louisiana fishermen catch lots of shrimp. People cook them in a yummy stew called gumbo!" },
    ],
    fact: 'Jazz music began in Louisiana, in the city of New Orleans! It has swamps with alligators too.',
  },
  {
    fips: '05', code: 'AR', name: 'Arkansas', capital: 'Little Rock', region: 'southeast',
    things: [
      { icon: '💎', word: 'diamond', detail: "At Crater of Diamonds State Park, people have found real diamonds just lying on the ground! Finders keepers!" },
      { icon: '🦆', word: 'duck', detail: "Every winter, lots of ducks fly to Arkansas. The town of Stuttgart even has a duck calling contest! Quack quack!" },
      { icon: '🍚', word: 'rice', detail: "Arkansas grows more rice than any other state!" },
    ],
    fact: 'In Arkansas there is a park where you can dig for real diamonds!',
  },

  // ── Midwest ──────────────────────────────────────────────────
  {
    fips: '39', code: 'OH', name: 'Ohio', capital: 'Columbus', region: 'midwest',
    things: [
      { icon: '👨‍🚀', word: 'astronaut', detail: "Neil Armstrong grew up in Ohio. He was the very first person to step onto the Moon!" },
      { icon: '🌙', word: 'the Moon', detail: "When Neil Armstrong stepped on the Moon, he said, That's one small step for a man!" },
      { icon: '🎢', word: 'roller coaster', detail: "Cedar Point in Ohio has lots of super fast, super tall roller coasters. Wheee!" },
    ],
    fact: 'Neil Armstrong, the first person to walk on the Moon, was from Ohio!',
  },
  {
    fips: '18', code: 'IN', name: 'Indiana', capital: 'Indianapolis', region: 'midwest',
    things: [
      { icon: '🏎️', word: 'race car', detail: "In the Indy 500, race cars zoom around a giant oval track two hundred times!" },
      { icon: '🏁', word: 'finish flag', detail: "The winner of the Indy 500 drinks a bottle of milk! That's a special tradition." },
      { icon: '🌽', word: 'corn', detail: "Indiana farmers grow lots of corn in their big, flat fields." },
    ],
    fact: 'Indiana has a famous race called the Indy 500, where race cars zoom super fast! Vroom!',
  },
  {
    fips: '26', code: 'MI', name: 'Michigan', capital: 'Lansing', region: 'midwest',
    things: [
      { icon: '🧤', word: 'mitten', detail: "Michigan is shaped like a mitten! People hold up their hand to show where they live." },
      { icon: '🚗', word: 'car', detail: "Detroit, Michigan is called the Motor City because so many cars are made there." },
      { icon: '🍒', word: 'cherries', detail: "Michigan grows lots of tart cherries. Traverse City has a big cherry festival every summer!" },
    ],
    fact: 'Michigan is shaped like a mitten! It touches four of the five Great Lakes.',
  },
  {
    fips: '17', code: 'IL', name: 'Illinois', capital: 'Springfield', region: 'midwest',
    things: [
      { icon: '🏙️', word: 'skyscrapers', detail: "Chicago has some of the tallest buildings in America. Willis Tower has a glass box where you can look straight down!" },
      { icon: '🌭', word: 'hot dog', detail: "A Chicago hot dog has pickles, tomatoes, onions, and mustard, but no ketchup!" },
      { icon: '🌊', word: 'Lake Michigan', detail: "Lake Michigan is so big, it looks like an ocean! Chicago has beaches right in the city." },
    ],
    fact: 'Illinois has Chicago, a big city with super tall buildings next to a giant lake!',
  },
  {
    fips: '55', code: 'WI', name: 'Wisconsin', capital: 'Madison', region: 'midwest',
    things: [
      { icon: '🧀', word: 'cheese', detail: "Wisconsin makes more cheese than any other state. Some fans even wear foam cheese hats!" },
      { icon: '🦡', word: 'badger', detail: "Badgers are strong animals that dig tunnels with their claws. The badger is Wisconsin's state animal." },
      { icon: '🐄', word: 'cow', detail: "Wisconsin is called America's Dairyland because it has so many dairy cows." },
    ],
    fact: 'Wisconsin makes lots and lots of cheese! It is called the Badger State.',
  },
  {
    fips: '27', code: 'MN', name: 'Minnesota', capital: 'Saint Paul', region: 'midwest',
    things: [
      { icon: '🦆', word: 'loon', detail: "The loon is Minnesota's state bird. It makes a beautiful, spooky call across the lakes." },
      { icon: '🎣', word: 'fishing', detail: "In winter, Minnesota lakes freeze so hard that people put little houses on the ice and fish through a hole!" },
      { icon: '🛶', word: 'canoe', detail: "People paddle canoes on Minnesota's lakes. The Mississippi River starts there as a tiny stream you can walk across!" },
    ],
    fact: 'Minnesota is the Land of Ten Thousand Lakes! That is lots of places to swim and fish.',
  },
  {
    fips: '19', code: 'IA', name: 'Iowa', capital: 'Des Moines', region: 'midwest',
    things: [
      { icon: '🐷', word: 'pig', detail: "Iowa has way more pigs than people! Oink oink!" },
      { icon: '🌽', word: 'corn', detail: "Iowa grows tons of corn. The corn fields stretch as far as you can see!" },
      { icon: '🚜', word: 'tractor', detail: "Farmers drive big tractors to plant seeds and pick crops in Iowa's fields." },
    ],
    fact: 'Iowa has more pigs than any other state, and lots and lots of corn! Oink!',
  },
  {
    fips: '29', code: 'MO', name: 'Missouri', capital: 'Jefferson City', region: 'midwest',
    things: [
      { icon: 'ARCH', word: 'Gateway Arch', detail: "The Gateway Arch in Saint Louis is taller than a sixty story building! You can ride a tiny tram all the way to the top." },
      { icon: '🍦', word: 'ice cream cone', detail: "People say the ice cream cone became famous at a giant fair in Saint Louis, Missouri, a long time ago!" },
      { icon: '🌊', word: 'river', detail: "Two big rivers, the Mississippi and the Missouri, meet near Saint Louis!" },
    ],
    fact: 'Missouri has the Gateway Arch, the tallest arch in the whole world!',
  },
  {
    fips: '38', code: 'ND', name: 'North Dakota', capital: 'Bismarck', region: 'midwest',
    things: [
      { icon: '🌻', word: 'sunflower', detail: "Young sunflowers turn to face the sun! North Dakota has fields full of them." },
      { icon: '🦬', word: 'bison', detail: "Bison are big, shaggy animals. You can see them in Theodore Roosevelt National Park!" },
      { icon: '🌾', word: 'wheat', detail: "North Dakota grows lots of wheat, which is used to make bread and pasta!" },
    ],
    fact: 'North Dakota grows more sunflowers than any other state!',
  },
  {
    fips: '46', code: 'SD', name: 'South Dakota', capital: 'Pierre', region: 'midwest',
    things: [
      { icon: '🗿', word: 'Mount Rushmore', detail: "Mount Rushmore has the faces of four presidents. Each face is as tall as a six story building!" },
      { icon: '🦬', word: 'bison', detail: "Custer State Park has a big herd of bison. Every fall, cowboys round them up!" },
      { icon: '⛰️', word: 'Black Hills', detail: "The Black Hills look dark from far away because they are covered in thick pine trees." },
    ],
    fact: "South Dakota has Mount Rushmore, where four presidents' giant faces are carved into a mountain!",
  },
  {
    fips: '31', code: 'NE', name: 'Nebraska', capital: 'Lincoln', region: 'midwest',
    things: [
      { icon: '🌽', word: 'corn', detail: "Nebraska is the Cornhusker State. Husking means pulling the leaves off an ear of corn!" },
      { icon: '🐦', word: 'sandhill crane', detail: "Every spring, hundreds of thousands of sandhill cranes stop by the Platte River to rest and dance!" },
      { icon: '🐄', word: 'cattle', detail: "Nebraska has lots of cattle ranches, with way more cows than people!" },
    ],
    fact: 'Nebraska is the Cornhusker State! Every spring, big birds called sandhill cranes come to visit.',
  },
  {
    fips: '20', code: 'KS', name: 'Kansas', capital: 'Topeka', region: 'midwest',
    things: [
      { icon: '🌻', word: 'sunflower', detail: "The sunflower is Kansas's state flower. Some sunflowers grow taller than a grown up!" },
      { icon: '🌾', word: 'wheat', detail: "Kansas grows so much wheat that it's called the Breadbasket of the World!" },
      { icon: '🍞', word: 'bread', detail: "Wheat is ground into flour, and flour is baked into bread, cookies, and crackers!" },
    ],
    fact: 'Kansas is the Sunflower State! It grows lots of wheat to make bread.',
  },

  // ── Southwest ────────────────────────────────────────────────
  {
    fips: '40', code: 'OK', name: 'Oklahoma', capital: 'Oklahoma City', region: 'southwest',
    things: [
      { icon: '🤠', word: 'cowboy', detail: "Oklahoma City has a big museum all about cowboys and the Old West!" },
      { icon: '🦬', word: 'bison', detail: "The bison is Oklahoma's state animal. Big herds roam the Tallgrass Prairie Preserve!" },
      { icon: '🌾', word: 'prairie', detail: "A prairie is a big, wide grassland. Oklahoma's prairie grass can grow taller than a person!" },
    ],
    fact: 'Oklahoma is a land of cowboys and wide open prairies where bison roam!',
  },
  {
    fips: '48', code: 'TX', name: 'Texas', capital: 'Austin', region: 'southwest',
    things: [
      { icon: '🤠', word: 'cowboy', detail: "Texas has lots of ranches where cowboys ride horses and take care of cattle. Yee-haw!" },
      { icon: '🐂', word: 'longhorn', detail: "Longhorn cattle have giant horns that can stretch wider than a car!" },
      { icon: '👩‍🚀', word: 'astronaut', detail: "Mission Control in Houston, Texas talks to astronauts while they are up in space!" },
    ],
    fact: 'Texas is the second biggest state! It has cowboys, longhorn cattle, and the place that talks to astronauts in space.',
  },
  {
    fips: '35', code: 'NM', name: 'New Mexico', capital: 'Santa Fe', region: 'southwest',
    things: [
      { icon: '🎈', word: 'hot air balloon', detail: "At the Albuquerque Balloon Fiesta, hundreds of colorful hot air balloons float up into the sky together!" },
      { icon: '🌶️', word: 'chile pepper', detail: "New Mexico grows red and green chile peppers. People there like to ask, red or green?" },
      { icon: '🏜️', word: 'desert', detail: "White Sands in New Mexico has giant sand dunes that are bright white, like snow!" },
    ],
    fact: 'New Mexico has a huge festival where hundreds of hot air balloons float up into the sky!',
  },
  {
    fips: '04', code: 'AZ', name: 'Arizona', capital: 'Phoenix', region: 'southwest',
    things: [
      { icon: '🌵', word: 'cactus', detail: "The saguaro cactus can grow taller than a house and live for more than one hundred and fifty years!" },
      { icon: '🏞️', word: 'Grand Canyon', detail: "The Grand Canyon is super deep and super long. The Colorado River carved it, little by little!" },
      { icon: '🦎', word: 'lizard', detail: "The Gila monster is a big lizard with bumpy orange and black skin. It lives in Arizona's desert!" },
    ],
    fact: 'Arizona has the Grand Canyon, a giant canyon carved by a river! And tall cactuses with arms.',
  },

  // ── West ─────────────────────────────────────────────────────
  {
    fips: '08', code: 'CO', name: 'Colorado', capital: 'Denver', region: 'west',
    things: [
      { icon: '🏔️', word: 'Rocky Mountains', detail: "Colorado has more than fifty mountains that are over fourteen thousand feet tall! People call them Fourteeners." },
      { icon: '🐏', word: 'bighorn sheep', detail: "Bighorn sheep have big curly horns and are amazing climbers on steep, rocky cliffs!" },
      { icon: '⛷️', word: 'skiing', detail: "In winter, people zoom down Colorado's snowy mountains on skis and snowboards!" },
    ],
    fact: 'Colorado has the Rocky Mountains, where bighorn sheep climb and people ski in the snow!',
  },
  {
    fips: '56', code: 'WY', name: 'Wyoming', capital: 'Cheyenne', region: 'west',
    things: [
      { icon: '⛲', word: 'Old Faithful geyser', detail: "Old Faithful is a geyser that shoots hot water high into the air about every hour or two!" },
      { icon: '🦬', word: 'bison', detail: "Yellowstone has one of the biggest herds of wild bison in the country. Bison can run super fast!" },
      { icon: '🤠', word: 'cowboy', detail: "Wyoming's license plate shows a cowboy riding a bucking horse! Yee-haw!" },
    ],
    fact: 'Wyoming has Yellowstone, the very first national park, where a geyser called Old Faithful shoots water high into the sky!',
  },
  {
    fips: '30', code: 'MT', name: 'Montana', capital: 'Helena', region: 'west',
    things: [
      { icon: '🦖', word: 'T. rex', detail: "Scientists found the first T. rex bones in Montana. T. rex had teeth as long as bananas!" },
      { icon: '🐻', word: 'grizzly bear', detail: "Grizzly bears live in Montana's mountains. The grizzly is Montana's state animal!" },
      { icon: '🏔️', word: 'mountains', detail: "Glacier National Park in Montana has big mountains, blue lakes, and fluffy white mountain goats!" },
    ],
    fact: 'In Montana, people found the very first T. rex dinosaur bones! Roar!',
  },
  {
    fips: '16', code: 'ID', name: 'Idaho', capital: 'Boise', region: 'west',
    things: [
      { icon: '🥔', word: 'potato', detail: "Idaho has great soil for growing potatoes. French fries, anyone?" },
      { icon: '🐴', word: 'horse', detail: "The Appaloosa horse has a spotted coat, like polka dots! It's Idaho's state horse." },
      { icon: '🏔️', word: 'mountains', detail: "Idaho has lots of mountains and rivers, where people go camping and fishing." },
    ],
    fact: 'Idaho grows more potatoes than any other state!',
  },
  {
    fips: '49', code: 'UT', name: 'Utah', capital: 'Salt Lake City', region: 'west',
    things: [
      { icon: '🐝', word: 'bee', detail: "Utah is called the Beehive State because its people worked hard together, like busy bees! Bzzz." },
      { icon: '🏜️', word: 'red rock arches', detail: "Arches National Park has more than two thousand stone arches, made by wind and water!" },
      { icon: '🦕', word: 'dinosaur', detail: "At Dinosaur National Monument in Utah, you can see a whole wall full of real dinosaur bones!" },
    ],
    fact: 'Utah is the Beehive State! It has red rock arches and lots of dinosaur bones.',
  },
  {
    fips: '32', code: 'NV', name: 'Nevada', capital: 'Carson City', region: 'west',
    things: [
      { icon: '🐎', word: 'wild horse', detail: "Wild horses called mustangs run free across Nevada's open land!" },
      { icon: '🏜️', word: 'desert', detail: "Most of Nevada is desert. Desert tortoises and jackrabbits live there, and spiky Joshua trees grow there!" },
      { icon: '✨', word: 'bright lights', detail: "Las Vegas, in Nevada, has so many bright lights that the city glows at night like a giant night light!" },
    ],
    fact: 'Nevada has more wild horses than any other state! It has a big desert and a city full of bright lights.',
  },
  {
    fips: '06', code: 'CA', name: 'California', capital: 'Sacramento', region: 'west',
    things: [
      { icon: '🌲', word: 'redwood tree', detail: "Coast redwood trees can grow taller than a thirty story building! They're the tallest trees on Earth." },
      { icon: '🌉', word: 'Golden Gate Bridge', detail: "The Golden Gate Bridge in San Francisco is painted orange, not gold! Fog often rolls in underneath it." },
      { icon: '🍊', word: 'orange', detail: "California grows lots of fruits and veggies, like oranges, strawberries, and avocados!" },
    ],
    fact: 'California has the tallest trees in the world, called redwoods, and the Golden Gate Bridge!',
  },
  {
    fips: '41', code: 'OR', name: 'Oregon', capital: 'Salem', region: 'west',
    things: [
      { icon: '🦫', word: 'beaver', detail: "Beavers build dams out of sticks and mud with their strong teeth. The beaver is Oregon's state animal!" },
      { icon: '💧', word: 'Crater Lake', detail: "Crater Lake was made when a giant volcano fell in on itself. Now it's filled with super blue water!" },
      { icon: '🌲', word: 'forest', detail: "Oregon has huge green forests and lots of rain. It grows more Christmas trees than any other state!" },
    ],
    fact: 'Oregon is the Beaver State! It has Crater Lake, the deepest lake in our whole country.',
  },
  {
    fips: '53', code: 'WA', name: 'Washington', capital: 'Olympia', region: 'west',
    things: [
      { icon: '🍎', word: 'apple', detail: "Washington grows more apples than any other state. Crunch!" },
      { icon: '🐋', word: 'orca whale', detail: "Orcas are black and white whales that swim together in family groups called pods!" },
      { icon: '🌋', word: 'Mount Rainier', detail: "Mount Rainier is a giant volcano covered in snow. It's Washington's tallest mountain!" },
    ],
    fact: 'Washington grows more apples than any other state! Orca whales swim in its waters.',
  },

  // ── Alaska & Hawaii ──────────────────────────────────────────
  {
    fips: '02', code: 'AK', name: 'Alaska', capital: 'Juneau', region: 'faraway',
    things: [
      { icon: '🐻', word: 'bear', detail: "Brown bears in Alaska catch salmon right out of the rivers with their mouths!" },
      { icon: '🐟', word: 'salmon', detail: "Salmon swim all the way from the ocean up the rivers to lay their eggs!" },
      { icon: '🏔️', word: 'Denali', detail: "Denali is the tallest mountain in North America. Its top is covered in snow all year long!" },
    ],
    fact: 'Alaska is the biggest state of all! It has the tallest mountain in North America, called Denali.',
  },
  {
    fips: '15', code: 'HI', name: 'Hawaii', capital: 'Honolulu', region: 'faraway',
    things: [
      { icon: '🌋', word: 'volcano', detail: "Kilauea is one of the most active volcanoes in the world. Hot lava glows red and orange!" },
      { icon: '🐢', word: 'sea turtle', detail: "Green sea turtles, called honu in Hawaii, like to rest on the warm beaches!" },
      { icon: '🍍', word: 'pineapple', detail: "Pineapples grow on spiky plants close to the ground, not on trees!" },
    ],
    fact: 'Hawaii is made of islands in the ocean! It has real volcanoes, sea turtles, and surfing.',
  },
];

export const STATE_BY_FIPS: Record<string, UsState> = Object.fromEntries(
  STATES.map((s) => [s.fips, s]),
);

export const STATE_BY_CODE: Record<string, UsState> = Object.fromEntries(
  STATES.map((s) => [s.code, s]),
);
