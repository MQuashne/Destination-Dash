export const Crises = [
{
  id: "crisis_fuel_leak",
  title: "Fuel Leak",
  type: "crisis",
  body: "Roll the die twice. Remove fuel from the fuel tank equal to or more than the sum of the results.",
  version: "base"
},
{
  id: "crisis_misguided_bird",
  title: "Misguided Bird",
  type: "crisis",
  body: "Your plane gets destroyed",
  version: "base"
},
{
  id: "crisis_attack_on_karen",
  title: "Attack on Karen",
  type: "crisis",
  body: "Double the number of passengers on your plane",
  version: "base"
},
{
  id: "crisis_sabotaged",
  title: "Sabotaged",
  type: "crisis",
  body: "Discard all cards in your hand (including crises)",
  version: "base"
},
{
  id: "crisis_temporal_anomaly",
  title: "Temporal Anomaly",
  type: "crisis",
  body: "Put the most recently cleared destination onto the top of the Map face up",
  version: "base"
},
{
  id: "crisis_bad_weather",
  title: "Bad Weather",
  type: "crisis",
  body: "You cannot fly this turn",
  version: "base"
},
{
  id: "crisis_switcheroo",
  title: "Switcheroo",
  type: "crisis",
  body: "If the scrapyard is not empty, swap the cards in the scrapyard and the boneyard. Place the boneyard face down and shuffle it.",
  version: "base"
},
{
  id: "crisis_out_of_bounds",
  title: "Out of Bounds",
  type: "crisis",
  body: "If there is more than one destination open, flip over the one that requires the most fuel. You can't fly there until a flight has been made.",
  version: "base"
},
{
  id: "crisis_forced_contract",
  title: "Forced Contract",
  type: "crisis",
  body: "On your next turn, skip the draw phase and discard cards from your hand equal to the number of cards you played this turn",
  version: "dlc"
},
{
  id: "crisis_full_metal_alchemist",
  title: "Full Metal Alchemist",
  type: "crisis",
  body: "Set the number of passengers in your plane to the value of fuel in the fuel tank",
  version: "dlc"
}]

export const Cards = [
{
  id: "fortune_good_riddance",
  title: "Good Riddance",
  type: "fortune",
  body: "Lose up to 6 passengers",
  version: "base"
},
{
  id: "fortune_crisis_averted",
  title: "Crisis Averted",
  type: "fortune",
  body: "Ignore the current crisis. This card can only be played during the resolution phase and doing so does not count as an action.",
  version: "base"
},
{
  id: "fortune_reroute",
  title: "Reroute",
  type: "fortune",
  body: "Put a card from the itinerary at the bottom of the map and open a new destination. If the map is empty, discard the Fuel Tank and lose all passengers instead.",
  version: "base"
},
{
  id: "fortune_garbage_collector",
  title: "Garbage Collector",
  type: "fortune",
  body: "Add a fuel canister from the scrapyard to your hand",
  version: "base"
},
{
  id: "fortune_overdrive",
  title: "Overdrive",
  type: "fortune",
  body: "You have an unlimited number of actions this turn.",
  version: "base"
},
{
  id: "fortune_hack_the_system",
  title: "Hack the System",
  type: "fortune",
  body: "Instead of rolling the die, gain up to six passengers at the end of this turn",
  version: "base"
},
{
  id: "fortune_crystal_ball",
  title: "Crystal Ball",
  type: "fortune",
  body: "Look at all of the cards in the boneyard and pick one. If it is a crisis, discard it. Otherwise, add it to your hand. Shuffle the boneyard.",
  version: "base"
},
{
  id: "fortune_a_pound_in_flesh",
  title: "A Pound in Flesh",
  type: "fortune",
  body: "When you play your next fuel canister this turn, double its value and place it sideways, and lose passengers equal to its original value",
  version: "base"
},
{
  id: "fortune_20_20_vision",
  title: "20/20 Vision",
  type: "fortune",
  body: "Look at the top 5 cards in the Boneyard. You may reorder them before placing them back face up",
  version: "dlc"
},
{
  id: "fortune_avarice",
  title: "Avarice",
  type: "fortune",
  body: "During the draw phase of the next turn, draw until you have up to 8 cards. After the resolution phase, discard as many cards as needed until you have 5 left.",
  version: "dlc"
},
{
  id: "fuel_2",
  title: "Fuel 2",
  type: "fuel",
  fuel_value: 2
},
{
  id: "fuel_3",
  title: "Fuel 3",
  type: "fuel",
  fuel_value: 3
},
{
  id: "fuel_4",
  title: "Fuel 4",
  type: "fuel",
  fuel_value: 4
},
{
  id: "fuel_5",
  title: "Fuel 5",
  type: "fuel",
  fuel_value: 5
},
{
  id: "fuel_6",
  title: "Fuel 6",
  type: "fuel",
  fuel_value: 6
},
{
  id: "fuel_7",
  title: "Fuel 7",
  type: "fuel",
  fuel_value: 7
},
{
  id: "fuel_8",
  title: "Fuel 8",
  type: "fuel",
  fuel_value: 8
},
{
  id: "fuel_2",
  title: "Fuel 2",
  type: "fuel",
  fuel_value: 2
},
{
  id: "fuel_3",
  title: "Fuel 3",
  type: "fuel",
  fuel_value: 3
},
{
  id: "fuel_4",
  title: "Fuel 4",
  type: "fuel",
  fuel_value: 4
},
{
  id: "fuel_5",
  title: "Fuel 5",
  type: "fuel",
  fuel_value: 5
},
{
  id: "fuel_6",
  title: "Fuel 6",
  type: "fuel",
  fuel_value: 6
},
{
  id: "fuel_7",
  title: "Fuel 7",
  type: "fuel",
  fuel_value: 7
},
{
  id: "fuel_8",
  title: "Fuel 8",
  type: "fuel",
  fuel_value: 8
},
{
  id: "fuel_1",
  title: "Fuel 1",
  type: "fuel",
  fuel_value: 1
},
{
  id: "fuel_1",
  title: "Fuel 1",
  type: "fuel",
  fuel_value: 2
}]

export const Destinations = [
{
  id: "destination_glacial_mirror",
  title: "Glacial Mirror",
  body: "It was as if god had spilt his paint bucket onto the lucid ice, for it was doused with the colours of the rainbow, a reflection of the raging aurora in the otherwise pitchblack night sky.",
  fuel: 9,
  min_pax: 8,
  max_pax: 10,
  open: true
},
{
  id: "destination_sunset_island",
  title: "Sunset Island",
  body: "Forever bathed in the orange afterglow of the evening sun, this island promises a breathtaking view no matter when you drop by.",
  fuel: 3,
  min_pax: 6,
  max_pax: 9,
  open: true
},
{
  id: "destination_blackheart_moor",
  title: "Blackheart Moor",
  body: "Rumours of an elusive creature known as \"Bogmaw\" attracted many curious adventurers, though only a few who ventured into the dense, unforgiving swamp lived to tell the tale.",
  fuel: 10,
  min_pax: 13,
  max_pax: 16,
  open: true
},
{
  id: "destination_lonely_hills",
  title: "Lonely Hills",
  body: "You feel an irresistible urge to venture deeper and deeper into the labyrinth of valleys and tunnels, and you wonder why there hasn't been but a bird chirp or a mouse squeak.",
  fuel: 7,
  min_pax: 1,
  max_pax: 4,
  open: true
},
{
  id: "destination_dizzying_desert",
  title: "Dizzying Desert",
  body: "Don't stare at the whimsical cacti and careening tumbleweeds for too long, lest you get whisked away by the countless dust devils prowling the dunes!",
  fuel: 11,
  min_pax: 3,
  max_pax: 5,
  open: true
},
{
  id: "destination_outer_fields",
  title: "Outer Fields",
  body: "A place where flowers glow iridescently in colours the human eye cannot see, where animals carelessly moulded by god's left hand roam freely.",
  fuel: 12,
  min_pax: 11,
  max_pax: 14,
  open: true
},
{
  id: "destination_jurassic_jungle",
  title: "Jurassic Jungle",
  body: "A place where time seemed to have stood still, where giant lizards still ruled a world enveloped in towering canopies and lush undergrowth.",
  fuel: 5,
  min_pax: 9,
  max_pax: 13,
  open: true
},
{
  id: "destination_mount_ignis",
  title: "Mount Ignis",
  body: "The heart of the planet roars with the might of a thousand dragons as its blood bubbles and swells with the intent of a ravenous hyena.",
  fuel: 15,
  min_pax: 4,
  max_pax: 8,
  open: true
}]