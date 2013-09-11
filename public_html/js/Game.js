

var playerJSON = {"name": "Player", "TotalHP": 100, "CurrentHP": 100, "AttackScore": 10, "DefenseScore": 10, "WeaponDmg": 10};
var playerItemJSON = {"Items": [{"name": "Healing Potion", "type": "Heal", "amount": 10}, {"name": "Healing Potion", "type": "Heal", "amount": 10}]};
var playerAbilitiesJSON = {"Abilities": [{"name": "Super Attack", "type": "damage", "timer": 0, "cooldown": 2, "amount": 25}]};
var playerWeaponJSON = {"Weapons": [{"name": "Bent Dagger", "damage": 10, "equipped": true}]};

var player;
var playerInventory;
var playerAbilities;
var playerWeapons;

function initGame()
{
    player = playerJSON;
    playerAbilities = playerAbilitiesJSON;
    addWeapon(playerWeaponJSON.Weapons[0]);

}

//Battles



//Weapons

function addWeapon(weapon)
{
    playerWeapons.push(weapon);
}

function removeWeapon(weapon)
{
    var index;
    if ((index = playerWeapons.indexOf(weapon)) !== -1)
    {
        playerWeapons.split(index, 1);
    }
}

function equipWeapon(weapon)
{
    //unequip current weapon
    for (var w in playerWeapons)
    {
        playerWeapons[w].equipped = false;
    }
    //equip given weapon, if found
    if ((index = playerWeapons.indexOf(weapon)) !== -1)
    {
        playerWeapons[index].equipped = true;
    }
    else
    {
        weapon.equipped = true;
        addWeapon(weapon);
    }

    //set player damage
    player.WeaponDmg = weapon.damage;
}