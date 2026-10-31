import type { RegionId } from './regions';

/** A picture tile on a state card. Tapping it says the word out loud. */
export interface Thing {
  /** An emoji, or 'ARCH' for the custom Gateway Arch drawing. */
  icon: string;
  word: string;
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
    things: [{ icon: '🦞', word: 'lobster' }, { icon: '🫎', word: 'moose' }, { icon: '🌲', word: 'forest' }],
    fact: 'Maine catches the most lobsters, and moose live in its big forests!',
  },
  {
    fips: '33', code: 'NH', name: 'New Hampshire', capital: 'Concord', region: 'northeast',
    things: [{ icon: '⛰️', word: 'Mount Washington' }, { icon: '💨', word: 'wind' }, { icon: '🍁', word: 'fall leaves' }],
    fact: 'New Hampshire has Mount Washington, where the wind blows super hard! Whoosh!',
  },
  {
    fips: '50', code: 'VT', name: 'Vermont', capital: 'Montpelier', region: 'northeast',
    things: [{ icon: '🍁', word: 'maple tree' }, { icon: '🥞', word: 'pancakes with maple syrup' }, { icon: '🐄', word: 'cow' }],
    fact: 'Vermont makes more maple syrup than any other state! Yum, pancakes!',
  },
  {
    fips: '25', code: 'MA', name: 'Massachusetts', capital: 'Boston', region: 'northeast',
    things: [{ icon: '🏀', word: 'basketball' }, { icon: '🐋', word: 'whale' }, { icon: '⛵', word: 'sailboat' }],
    fact: 'Basketball was invented in Massachusetts! People go on boats there to watch whales.',
  },
  {
    fips: '44', code: 'RI', name: 'Rhode Island', capital: 'Providence', region: 'northeast',
    things: [{ icon: '🐔', word: 'Rhode Island Red chicken' }, { icon: '⛵', word: 'sailboat' }, { icon: '🌊', word: 'ocean' }],
    fact: 'Rhode Island is the smallest state! It is called the Ocean State.',
  },
  {
    fips: '09', code: 'CT', name: 'Connecticut', capital: 'Hartford', region: 'northeast',
    things: [{ icon: '🐋', word: 'sperm whale' }, { icon: '🍕', word: 'pizza' }, { icon: '⛵', word: 'ship' }],
    fact: "Connecticut's state animal is the sperm whale, a giant whale! It is famous for yummy pizza too.",
  },
  {
    fips: '36', code: 'NY', name: 'New York', capital: 'Albany', region: 'northeast',
    things: [{ icon: '🗽', word: 'Statue of Liberty' }, { icon: '🍎', word: 'the Big Apple' }, { icon: '🏙️', word: 'skyscrapers' }],
    fact: 'New York has the Statue of Liberty, and a giant city nicknamed the Big Apple!',
  },
  {
    fips: '34', code: 'NJ', name: 'New Jersey', capital: 'Trenton', region: 'northeast',
    things: [{ icon: '💡', word: 'light bulb' }, { icon: '🍅', word: 'tomatoes' }, { icon: '🏖️', word: 'beach' }],
    fact: 'New Jersey is the Garden State! Thomas Edison made his famous light bulb there.',
  },
  {
    fips: '42', code: 'PA', name: 'Pennsylvania', capital: 'Harrisburg', region: 'northeast',
    things: [{ icon: '🔔', word: 'Liberty Bell' }, { icon: '🍫', word: 'chocolate' }, { icon: '🥨', word: 'pretzel' }],
    fact: 'Pennsylvania has the Liberty Bell, and a whole town that makes chocolate!',
  },
  {
    fips: '10', code: 'DE', name: 'Delaware', capital: 'Dover', region: 'northeast',
    things: [{ icon: '🥇', word: 'first place' }, { icon: '🐔', word: 'Blue Hen chicken' }, { icon: '🏖️', word: 'beach' }],
    fact: 'Delaware was the very first state! Its state bird is a chicken called the Blue Hen.',
  },
  {
    fips: '24', code: 'MD', name: 'Maryland', capital: 'Annapolis', region: 'northeast',
    things: [{ icon: '🦀', word: 'blue crab' }, { icon: '⛵', word: 'sailboat' }, { icon: '🌊', word: 'Chesapeake Bay' }],
    fact: 'Maryland is famous for blue crabs that live in the Chesapeake Bay! Pinch pinch!',
  },

  // ── Southeast ────────────────────────────────────────────────
  {
    fips: '54', code: 'WV', name: 'West Virginia', capital: 'Charleston', region: 'southeast',
    things: [{ icon: '⛰️', word: 'mountains' }, { icon: '🐻', word: 'black bear' }, { icon: '🛶', word: 'river rafting' }],
    fact: 'West Virginia is the Mountain State! It is full of mountains and forests where black bears live.',
  },
  {
    fips: '51', code: 'VA', name: 'Virginia', capital: 'Richmond', region: 'southeast',
    things: [{ icon: '🐴', word: 'wild pony' }, { icon: '🎩', word: 'presidents' }, { icon: '🏖️', word: 'beach' }],
    fact: 'Virginia has wild ponies that live on an island by the beach! Eight presidents were born there.',
  },
  {
    fips: '21', code: 'KY', name: 'Kentucky', capital: 'Frankfort', region: 'southeast',
    things: [{ icon: '🐎', word: 'racehorse' }, { icon: '🦇', word: 'cave bat' }, { icon: '🔦', word: 'cave' }],
    fact: 'Kentucky has the longest cave in the whole world, called Mammoth Cave! It is famous for fast racehorses too.',
  },
  {
    fips: '47', code: 'TN', name: 'Tennessee', capital: 'Nashville', region: 'southeast',
    things: [{ icon: '🎸', word: 'guitar' }, { icon: '🎤', word: 'singing' }, { icon: '⛰️', word: 'Smoky Mountains' }],
    fact: 'Tennessee has Nashville, called Music City, where people play guitars and sing!',
  },
  {
    fips: '37', code: 'NC', name: 'North Carolina', capital: 'Raleigh', region: 'southeast',
    things: [{ icon: '✈️', word: 'airplane' }, { icon: '🍠', word: 'sweet potato' }, { icon: '🏖️', word: 'beach' }],
    fact: 'The very first airplane flight happened in North Carolina! Zoom!',
  },
  {
    fips: '45', code: 'SC', name: 'South Carolina', capital: 'Columbia', region: 'southeast',
    things: [{ icon: '🌴', word: 'palmetto tree' }, { icon: '🐢', word: 'sea turtle' }, { icon: '🏖️', word: 'beach' }],
    fact: 'South Carolina has palm trees called palmettos, and sea turtles lay their eggs on its beaches!',
  },
  {
    fips: '13', code: 'GA', name: 'Georgia', capital: 'Atlanta', region: 'southeast',
    things: [{ icon: '🍑', word: 'peach' }, { icon: '🥜', word: 'peanuts' }, { icon: '🏙️', word: 'Atlanta' }],
    fact: 'Georgia is called the Peach State because it grows so many yummy peaches!',
  },
  {
    fips: '12', code: 'FL', name: 'Florida', capital: 'Tallahassee', region: 'southeast',
    things: [{ icon: '🐊', word: 'alligator' }, { icon: '🍊', word: 'orange' }, { icon: '🚀', word: 'rocket' }],
    fact: 'Florida has alligators, sunny beaches, and rockets that blast off into space!',
  },
  {
    fips: '01', code: 'AL', name: 'Alabama', capital: 'Montgomery', region: 'southeast',
    things: [{ icon: '🚀', word: 'rocket' }, { icon: '🌙', word: 'the Moon' }, { icon: '🥜', word: 'peanuts' }],
    fact: 'Alabama helped build the giant rockets that flew people to the Moon!',
  },
  {
    fips: '28', code: 'MS', name: 'Mississippi', capital: 'Jackson', region: 'southeast',
    things: [{ icon: '🌊', word: 'Mississippi River' }, { icon: '🐟', word: 'catfish' }, { icon: '🎸', word: 'blues music' }],
    fact: 'Mississippi is named after a giant river, the Mississippi River! Catfish swim there.',
  },
  {
    fips: '22', code: 'LA', name: 'Louisiana', capital: 'Baton Rouge', region: 'southeast',
    things: [{ icon: '🎺', word: 'jazz trumpet' }, { icon: '🐊', word: 'alligator' }, { icon: '🦐', word: 'shrimp' }],
    fact: 'Jazz music began in Louisiana, in the city of New Orleans! It has swamps with alligators too.',
  },
  {
    fips: '05', code: 'AR', name: 'Arkansas', capital: 'Little Rock', region: 'southeast',
    things: [{ icon: '💎', word: 'diamond' }, { icon: '🦆', word: 'duck' }, { icon: '🍚', word: 'rice' }],
    fact: 'In Arkansas there is a park where you can dig for real diamonds!',
  },

  // ── Midwest ──────────────────────────────────────────────────
  {
    fips: '39', code: 'OH', name: 'Ohio', capital: 'Columbus', region: 'midwest',
    things: [{ icon: '👨‍🚀', word: 'astronaut' }, { icon: '🌙', word: 'the Moon' }, { icon: '🎢', word: 'roller coaster' }],
    fact: 'Neil Armstrong, the first person to walk on the Moon, was from Ohio!',
  },
  {
    fips: '18', code: 'IN', name: 'Indiana', capital: 'Indianapolis', region: 'midwest',
    things: [{ icon: '🏎️', word: 'race car' }, { icon: '🏁', word: 'finish flag' }, { icon: '🌽', word: 'corn' }],
    fact: 'Indiana has a famous race called the Indy 500, where race cars zoom super fast! Vroom!',
  },
  {
    fips: '26', code: 'MI', name: 'Michigan', capital: 'Lansing', region: 'midwest',
    things: [{ icon: '🧤', word: 'mitten' }, { icon: '🚗', word: 'car' }, { icon: '🍒', word: 'cherries' }],
    fact: 'Michigan is shaped like a mitten! It touches four of the five Great Lakes.',
  },
  {
    fips: '17', code: 'IL', name: 'Illinois', capital: 'Springfield', region: 'midwest',
    things: [{ icon: '🏙️', word: 'skyscrapers' }, { icon: '🌭', word: 'hot dog' }, { icon: '🌊', word: 'Lake Michigan' }],
    fact: 'Illinois has Chicago, a big city with super tall buildings next to a giant lake!',
  },
  {
    fips: '55', code: 'WI', name: 'Wisconsin', capital: 'Madison', region: 'midwest',
    things: [{ icon: '🧀', word: 'cheese' }, { icon: '🦡', word: 'badger' }, { icon: '🐄', word: 'cow' }],
    fact: 'Wisconsin makes lots and lots of cheese! It is called the Badger State.',
  },
  {
    fips: '27', code: 'MN', name: 'Minnesota', capital: 'Saint Paul', region: 'midwest',
    things: [{ icon: '🦆', word: 'loon' }, { icon: '🎣', word: 'fishing' }, { icon: '🛶', word: 'canoe' }],
    fact: 'Minnesota is the Land of Ten Thousand Lakes! That is lots of places to swim and fish.',
  },
  {
    fips: '19', code: 'IA', name: 'Iowa', capital: 'Des Moines', region: 'midwest',
    things: [{ icon: '🐷', word: 'pig' }, { icon: '🌽', word: 'corn' }, { icon: '🚜', word: 'tractor' }],
    fact: 'Iowa has more pigs than any other state, and lots and lots of corn! Oink!',
  },
  {
    fips: '29', code: 'MO', name: 'Missouri', capital: 'Jefferson City', region: 'midwest',
    things: [{ icon: 'ARCH', word: 'Gateway Arch' }, { icon: '🍦', word: 'ice cream cone' }, { icon: '🌊', word: 'river' }],
    fact: 'Missouri has the Gateway Arch, the tallest arch in the whole world!',
  },
  {
    fips: '38', code: 'ND', name: 'North Dakota', capital: 'Bismarck', region: 'midwest',
    things: [{ icon: '🌻', word: 'sunflower' }, { icon: '🦬', word: 'bison' }, { icon: '🌾', word: 'wheat' }],
    fact: 'North Dakota grows more sunflowers than any other state!',
  },
  {
    fips: '46', code: 'SD', name: 'South Dakota', capital: 'Pierre', region: 'midwest',
    things: [{ icon: '🗿', word: 'Mount Rushmore' }, { icon: '🦬', word: 'bison' }, { icon: '⛰️', word: 'Black Hills' }],
    fact: "South Dakota has Mount Rushmore, where four presidents' giant faces are carved into a mountain!",
  },
  {
    fips: '31', code: 'NE', name: 'Nebraska', capital: 'Lincoln', region: 'midwest',
    things: [{ icon: '🌽', word: 'corn' }, { icon: '🐦', word: 'sandhill crane' }, { icon: '🐄', word: 'cattle' }],
    fact: 'Nebraska is the Cornhusker State! Every spring, big birds called sandhill cranes come to visit.',
  },
  {
    fips: '20', code: 'KS', name: 'Kansas', capital: 'Topeka', region: 'midwest',
    things: [{ icon: '🌻', word: 'sunflower' }, { icon: '🌾', word: 'wheat' }, { icon: '🍞', word: 'bread' }],
    fact: 'Kansas is the Sunflower State! It grows lots of wheat to make bread.',
  },

  // ── Southwest ────────────────────────────────────────────────
  {
    fips: '40', code: 'OK', name: 'Oklahoma', capital: 'Oklahoma City', region: 'southwest',
    things: [{ icon: '🤠', word: 'cowboy' }, { icon: '🦬', word: 'bison' }, { icon: '🌾', word: 'prairie' }],
    fact: 'Oklahoma is a land of cowboys and wide open prairies where bison roam!',
  },
  {
    fips: '48', code: 'TX', name: 'Texas', capital: 'Austin', region: 'southwest',
    things: [{ icon: '🤠', word: 'cowboy' }, { icon: '🐂', word: 'longhorn' }, { icon: '👩‍🚀', word: 'astronaut' }],
    fact: 'Texas is the second biggest state! It has cowboys, longhorn cattle, and the place that talks to astronauts in space.',
  },
  {
    fips: '35', code: 'NM', name: 'New Mexico', capital: 'Santa Fe', region: 'southwest',
    things: [{ icon: '🎈', word: 'hot air balloon' }, { icon: '🌶️', word: 'chile pepper' }, { icon: '🏜️', word: 'desert' }],
    fact: 'New Mexico has a huge festival where hundreds of hot air balloons float up into the sky!',
  },
  {
    fips: '04', code: 'AZ', name: 'Arizona', capital: 'Phoenix', region: 'southwest',
    things: [{ icon: '🌵', word: 'cactus' }, { icon: '🏞️', word: 'Grand Canyon' }, { icon: '🦎', word: 'lizard' }],
    fact: 'Arizona has the Grand Canyon, a giant canyon carved by a river! And tall cactuses with arms.',
  },

  // ── West ─────────────────────────────────────────────────────
  {
    fips: '08', code: 'CO', name: 'Colorado', capital: 'Denver', region: 'west',
    things: [{ icon: '🏔️', word: 'Rocky Mountains' }, { icon: '🐏', word: 'bighorn sheep' }, { icon: '⛷️', word: 'skiing' }],
    fact: 'Colorado has the Rocky Mountains, where bighorn sheep climb and people ski in the snow!',
  },
  {
    fips: '56', code: 'WY', name: 'Wyoming', capital: 'Cheyenne', region: 'west',
    things: [{ icon: '⛲', word: 'Old Faithful geyser' }, { icon: '🦬', word: 'bison' }, { icon: '🤠', word: 'cowboy' }],
    fact: 'Wyoming has Yellowstone, the very first national park, where a geyser called Old Faithful shoots water high into the sky!',
  },
  {
    fips: '30', code: 'MT', name: 'Montana', capital: 'Helena', region: 'west',
    things: [{ icon: '🦖', word: 'T. rex' }, { icon: '🐻', word: 'grizzly bear' }, { icon: '🏔️', word: 'mountains' }],
    fact: 'In Montana, people found the very first T. rex dinosaur bones! Roar!',
  },
  {
    fips: '16', code: 'ID', name: 'Idaho', capital: 'Boise', region: 'west',
    things: [{ icon: '🥔', word: 'potato' }, { icon: '🐴', word: 'horse' }, { icon: '🏔️', word: 'mountains' }],
    fact: 'Idaho grows more potatoes than any other state!',
  },
  {
    fips: '49', code: 'UT', name: 'Utah', capital: 'Salt Lake City', region: 'west',
    things: [{ icon: '🐝', word: 'bee' }, { icon: '🏜️', word: 'red rock arches' }, { icon: '🦕', word: 'dinosaur' }],
    fact: 'Utah is the Beehive State! It has red rock arches and lots of dinosaur bones.',
  },
  {
    fips: '32', code: 'NV', name: 'Nevada', capital: 'Carson City', region: 'west',
    things: [{ icon: '🐎', word: 'wild horse' }, { icon: '🏜️', word: 'desert' }, { icon: '✨', word: 'bright lights' }],
    fact: 'Nevada has more wild horses than any other state! It has a big desert and a city full of bright lights.',
  },
  {
    fips: '06', code: 'CA', name: 'California', capital: 'Sacramento', region: 'west',
    things: [{ icon: '🌲', word: 'redwood tree' }, { icon: '🌉', word: 'Golden Gate Bridge' }, { icon: '🍊', word: 'orange' }],
    fact: 'California has the tallest trees in the world, called redwoods, and the Golden Gate Bridge!',
  },
  {
    fips: '41', code: 'OR', name: 'Oregon', capital: 'Salem', region: 'west',
    things: [{ icon: '🦫', word: 'beaver' }, { icon: '💧', word: 'Crater Lake' }, { icon: '🌲', word: 'forest' }],
    fact: 'Oregon is the Beaver State! It has Crater Lake, the deepest lake in our whole country.',
  },
  {
    fips: '53', code: 'WA', name: 'Washington', capital: 'Olympia', region: 'west',
    things: [{ icon: '🍎', word: 'apple' }, { icon: '🐋', word: 'orca whale' }, { icon: '🌋', word: 'Mount Rainier' }],
    fact: 'Washington grows more apples than any other state! Orca whales swim in its waters.',
  },

  // ── Alaska & Hawaii ──────────────────────────────────────────
  {
    fips: '02', code: 'AK', name: 'Alaska', capital: 'Juneau', region: 'faraway',
    things: [{ icon: '🐻', word: 'bear' }, { icon: '🐟', word: 'salmon' }, { icon: '🏔️', word: 'Denali' }],
    fact: 'Alaska is the biggest state of all! It has the tallest mountain in North America, called Denali.',
  },
  {
    fips: '15', code: 'HI', name: 'Hawaii', capital: 'Honolulu', region: 'faraway',
    things: [{ icon: '🌋', word: 'volcano' }, { icon: '🐢', word: 'sea turtle' }, { icon: '🍍', word: 'pineapple' }],
    fact: 'Hawaii is made of islands in the ocean! It has real volcanoes, sea turtles, and surfing.',
  },
];

export const STATE_BY_FIPS: Record<string, UsState> = Object.fromEntries(
  STATES.map((s) => [s.fips, s]),
);

export const STATE_BY_CODE: Record<string, UsState> = Object.fromEntries(
  STATES.map((s) => [s.code, s]),
);
