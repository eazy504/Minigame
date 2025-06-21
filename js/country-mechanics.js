// country-mechanics.js

function reinforceTroops(country, amount) {
  country.properties.troops += amount;
}

function transferOwnership(country, newOwner) {
  country.properties.owner = newOwner;
}

function engageBattle(attacker, defender) {
  const attackerStrength = attacker.properties.troops;
  const defenderStrength = defender.properties.troops;
  const result = attackerStrength - defenderStrength;
  if (result > 0) {
    defender.properties.owner = attacker.properties.owner;
    defender.properties.troops = Math.floor(result * 0.5);
    attacker.properties.troops = Math.floor(attacker.properties.troops * 0.5);
    return `${attacker.properties.name} won the battle.`;
  } else {
    attacker.properties.troops = Math.floor(attacker.properties.troops * 0.3);
    return `${defender.properties.name} successfully defended.`;
  }
}
