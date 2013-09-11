
var battleState = 0;

var playerJSON = {"name": "Player", "TotalHP": 100, "CurrentHP": 100, "AttackScore": 10, "DefenseScore": 10, "WeaponDmg": 10};
var playerItemJSON = {"Items": [{"name": "Healing Potion", "type": "heal", "amount": 100}, {"name": "Healing Potion", "type": "heal", "amount": 100}, {"name": "Grenade", "type": "damage", "amount": 50}]};
var playerAbilitiesJSON = {"Abilities": [{"name": "Super Attack", "type": "damage", "timer": 0, "cooldown": 2, "amount": 25}]};
var playerWeaponJSON = {"Weapons": [{"name": "Bent Dagger", "damage": 10, "equipped": true}]};

var goblinJSON = {"name": "Goblin", "TotalHP": 50, "CurrentHP": 50, "AttackScore": 10, "DefenseScore": 10, "WeaponDmg": 5};
var dragonJSON = {"name": "Dragon", "TotalHP": 200, "CurrentHP": 200, "AttackScore": 75, "DefenseScore": 55, "WeaponDmg": 50};
var enemyList = ["goblinJSON", "dragonJSON"];


var enemyItemJSON = {"Items": [{"name": "Healing Potion"}, {"name": "Rusty Dagger"}, {"name": "Copper Key"}]};

var sellItemJSON = {"Items": [{"name": "Healing Potion", "cost": 10},{"name": "Huge Sword", "cost": 100} ]};

var player;
var playerItems;
var playerAbilities;
var playerMoney;
var enemy;

var combatStatus = "";

var battleTimer;

var battleID;
var logID;

var sellList;

function initGame(battleID, logID)
{
    this.battleID = battleID;
    this.logID = logID;

    player = playerJSON;
    playerItems = playerItemJSON;
    playerAbilities = playerAbilitiesJSON;
    playerMoney = 1000;

    DisplayGameWorld();
}

function initBattleWithEnemy(enemy)
{
    var enemyJSON = this[enemy];
    initBattle(enemyJSON);
}

function initBattle(enemyJSON)
{
    enemy = enemyJSON;
    combatStatus = "";

    battleState = 0;

    //set up the loop timer
    battleTimer = setInterval(function() {
        BattleLoop();
    }, 1000);

    UpdateDisplay();

}

function UpdateDisplay()
{
    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = printBattle();
    var battleElement = document.getElementById(logID);
    battleElement.innerHTML = combatStatus;
}

function BattleLoop()
{

    checkBattleStatus();
    UpdateDisplay();

    switch (battleState)
    {
        case 0:
            combatStatus += "Let the battle begin! <br>";
            battleState = 1;
            break;
        case 1:
            //do nothing, wait for player input
            break;
        case 2:
            UpdateAbilityTick(); //best spot for this?
            enemyAttack();
            break;
        case 3:
            clearInterval(battleTimer);
            DisplayGameWorld();
            break;
        case 4:
            clearInterval(battleTimer);
            DisplayGameWorld();
            break;
        default:
            break;

    }

}

function checkBattleStatus()
{
    if(enemy.CurrentHP <= 0)
        {
            battleState = 3;
        }
        if(player.CurrentHP <=0)
            {
                battleState = 4;
            }
}

function playerHeal(amount)
{
    player.CurrentHP += amount;
    if (player.CurrentHP > player.TotalHP)
    {
        player.CurrentHP = player.TotalHP;
    }
    combatStatus += player.name + " healed for " + amount + "<br>";
    battleState = 2;
}

function playerDamageEnemy(amount)
{
    enemy.CurrentHP = enemy.CurrentHP - amount;
    combatStatus += player.name + " damaged " + enemy.name + " for " + amount + " damage" + "<br>";
    if (enemy.CurrentHP <= 0)
    {
        WinBattle();
    }
    else
    {
        battleState = 2;
    }
}

//returns the percent that the attack will hit
function getAttackRatio(attackerValue, defenderValue)
{
    var attackRatio = ((attackerValue - defenderValue) / (attackerValue + defenderValue)) + 0.5;
    if (attackRatio <= 0)
    {
        attackRatio = 0.01;
    }
    if (attackRatio >= 1)
    {
        attackRatio = 0.99;
    }

    return attackRatio * 100;

}

function playerAttack()
{
    var attackRatio = getAttackRatio(player.AttackScore, enemy.DefenseScore);
    var roll = Math.random() * 100;
    if (roll < attackRatio)
    {

        var dmg = player.WeaponDmg;
        combatStatus += player.name + " hit (" + roll + ") " + enemy.name + " for " + dmg + " damage" + "<br>";
        enemy.CurrentHP = enemy.CurrentHP - dmg;

    }
    else
    {
        combatStatus += player.name + " missed (" + roll + ")" + enemy.name + "<br>";
    }

    if (enemy.CurrentHP <= 0)
    {
        WinBattle();
    }
    else
    {
        battleState = 2;
    }
}

function enemyAttack()
{
    var attackRatio = getAttackRatio(enemy.AttackScore, player.DefenseScore);
    var roll = Math.random() * 100;
    if (roll < attackRatio)
    {
        var dmg = enemy.WeaponDmg;
        combatStatus += enemy.name + " hit (" + roll + ") " + player.name + " for " + dmg + " damage" + "<br>";
        player.CurrentHP = player.CurrentHP - dmg;

    }
    else
    {
        combatStatus += enemy.name + " missed (" + roll + ") " + player.name + "<br>";
    }

    if (player.CurrentHP <= 0)
    {
        LoseBattle();
    }
    else
    {
        battleState = 1;
    }

}

function WinBattle()
{
    combatStatus += player.name + " defeated " + enemy.name + "<br>";
    battleState = 3;


}

function LoseBattle()
{
    combatStatus += player.name + " was defeated by " + enemy.name + "<br>";
    battleState = 4;
}

function fixAttackRatio(atkRatio)
{
    if (atkRatio > 75)
    {
        atkRatio = 75;
    }
    if (atkRatio < 25)
    {
        atkRatio = 25;
    }

    return atkRatio;
}


function fixDmgScale(dmgScale)
{
    if (dmgScale > 2)
    {
        dmgScale = 2;

    }
    if (dmgScale < .2)
    {
        dmgScale = .2;

    }
    if (dmgScale > 1)
    {
        return 1 + (Math.random() * dmgScale);
    }
    else
    {
        return .2 + (Math.random() * dmgScale);
    }
}

//print the stats of the player and enemy, along with button
function printBattle()
{
    var htmlStr = "";
    htmlStr += "<h1>Battle</h1>";
    htmlStr += "BattleState: " + battleState;
    htmlStr += "<table>";
    htmlStr += "<tr><td>Stat</td><td>" + player.name + "</td><td>" + enemy.name + "</td></tr>";
    htmlStr += "<tr><td>HP:</td><td>" + player.CurrentHP + " / " + player.TotalHP + "</td><td>" + enemy.CurrentHP + "/" + enemy.TotalHP + "</td></tr>";
    htmlStr += "<tr><td>Attack Score:</td><td> " + player.AttackScore + "</td><td>" + enemy.AttackScore + "</td></tr>";
    htmlStr += "<tr><td>Defense Score:</td><td>" + player.DefenseScore + "</td><td>" + enemy.DefenseScore + "</td></tr>";
    htmlStr += "<tr><td>Weapon Dmg:</td><td>" + player.WeaponDmg + "</td><td>" + enemy.WeaponDmg + "</td></tr>";
    htmlStr += "</table>";


    if (battleState === 1)
    {
        htmlStr += "<br><input type='button' onclick='playerAttack();'>Attack!</input>";
        //htmlStr += "<br><input type='button' onclick='playerHeal();'>Heal!</input>";
    }
    else
    {
        htmlStr += "<br><input type='button' onclick='playerAttack();' disabled>Attack!</input>";
        //htmlStr += "<br><input type='button' onclick='playerHeal();' disabled>Heal!</input>";
    }
    htmlStr += DisplayAbilities();
    htmlStr += DisplayItems();

    return htmlStr;

}

function DropItem(itemName)
{
    var index = playerItems.Items.indexOf(itemName);
    playerItems.Items.splice(index, 1);

}

function UseItem(itemName)
{
    //get the item from the item list
    var usedItem;

    for (var item in playerItems.Items)
    {
        if (playerItems.Items[item].name === itemName)
        {
            usedItem = playerItems.Items[item];
        }
    }

    combatStatus += player.name + " used " + usedItem.name + "<br>";

    if (usedItem.type === "heal")
    {
        playerHeal(usedItem.amount);
    }
    if (usedItem.type === "damage")
    {
        playerDamageEnemy(usedItem.amount);
    }

    //remove used item
    var index = playerItems.Items.indexOf(usedItem);
    playerItems.Items.splice(index, 1);
    battleState = 2;

}

function UseAbility(abName)
{
    //get the item from the item list
    var usedAbility;

    for (var ab in playerAbilities.Abilities)
    {
        if (playerAbilities.Abilities[ab].name === abName)
        {
            usedAbility = playerAbilities.Abilities[ab];
        }
    }

    combatStatus += player.name + " performed " + usedAbility.name + "<br>";

    if (usedAbility.type === "heal")
    {
        playerHeal(usedAbility.amount);
        battleState = 2;
    }
    if (usedAbility.type === "damage")
    {
        playerDamageEnemy(usedAbility.amount);
    }

    usedAbility.timer = usedAbility.cooldown;

    //remove used item
    //var index = playerAbilities.Abilities.indexOf(usedItem);
    //playerAbilities.Abilities.splice(index, 1);


}

//go through and update the counters on abilities
function UpdateAbilityTick()
{
    for (var ab in playerAbilities.Abilities)
    {
        var curAbility = playerAbilities.Abilities[ab];
        curAbility.timer = curAbility.timer - 1;
        if (curAbility.timer < 0)
        {
            curAbility.timer = 0;
        }
    }
}

function DisplayAbilities()
{
    var retval = "";
    for (var ab in playerAbilities.Abilities)
    {
        var functionCall = "UseAbility('" + playerAbilities.Abilities[ab].name + "');";
        if (playerAbilities.Abilities[ab].timer === 0)
        {
            retval += "<br><input type='button' onclick=\"" + functionCall + "\" >" + playerAbilities.Abilities[ab].name + "</input>";
        }
        else
        {
            retval += "<br><input type='button' onclick=\"" + functionCall + "\" disabled>" + playerAbilities.Abilities[ab].name
                    + "(" + playerAbilities.Abilities[ab].timer + ")" + "</input>";
        }
    }

    return retval;
}

function DisplayItems()
{
    var retval = "";
    for (var item in playerItems.Items)
    {
        var functionCall = "UseItem('" + playerItems.Items[item].name + "');";

        retval += "<br><input type='button' onclick=\"" + functionCall + "\" >" + playerItems.Items[item].name + "</input>";

    }

    return retval;
}

function DisplayGameWorld()
{
    var htmlStr = "";

    for (var e in enemyList)
    {
        var link = "initBattleWithEnemy(\"" + enemyList[e] + "\");";
        htmlStr += "<a href=\"javascript:void(0);\" onclick='" + link + "'>" + enemyList[e] + "</a><br>";

    }

    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayStats();'>View Stats</a>";
    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayInventory();'>View Inventory</a>";
    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayStore();'>Store</a>";

    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = htmlStr;

}

function DisplayInventory()
{

    var htmlStr = "<h1>Player Inventory</h1>";
    for (var item in playerItems.Items)
    {
        htmlStr += "<br>" + playerItems.Items[item].name + ": ";

        var functionCall = "UseItem('" + playerItems.Items[item].name + "'); DisplayInventory();";

        htmlStr += "<input type='button' onclick=\"" + functionCall + "\" value='Use'></input>";

        functionCall = "DropItem('" + playerItems.Items[item].name + "'); DisplayInventory();";

        htmlStr += "<input type='button' onclick=\"" + functionCall + "\" value='X'></input>";

    }

    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayGameWorld();'>Back to Game World</a>";

    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = htmlStr;


}

function DisplayStats()
{
    var htmlStr = "";
    htmlStr += "<h1>Player</h1>";
    htmlStr += "<table>";
    htmlStr += "<tr><td>Stat</td><td>" + player.name + "</td></tr>";
    htmlStr += "<tr><td>HP:</td><td>" + player.CurrentHP + " / " + player.TotalHP + "</td></tr>";
    htmlStr += "<tr><td>Attack Score:</td><td> " + player.AttackScore + "</td></tr>";
    htmlStr += "<tr><td>Defense Score:</td><td>" + player.DefenseScore + "</td></tr>";
    htmlStr += "<tr><td>Weapon Dmg:</td><td>" + player.WeaponDmg + "</td></tr>";
    htmlStr += "</table>";

    htmlStr += "<h2>Items</h2>";
    for (var item in playerItems.Items)
    {
        htmlStr += "<br>" + playerItems.Items[item].name;
    }
    htmlStr += "<h2>Abilities</h2>";
    for (var ab in playerAbilities.Abilities)
    {
        htmlStr += "<br>" + playerAbilities.Abilities[ab].name;
    }

    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayGameWorld();'>Back to Game World</a>";

    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = htmlStr;
}

function SellItem(index)
{
    var item = playerItems.Items[index];
    playerMoney += item.cost;
    sellList.Items.push(item);
    playerItems.Items.splice(index,1);
}


function BuyItem(index)
{
    
    var item = sellList.Items[index];
    if(playerMoney >= item.cost)
        {
            playerMoney -= item.cost;
            playerItems.Items.push(item);
            sellList.Items.splice(index, 1);
            return true;
        }
        else
        {
            return false;
        }
}

function DisplayStore()
{
    sellList = JSON.parse(JSON.stringify(sellItemJSON)); 
  
    var htmlStr = "<h1>Store</h2>";
    htmlStr += "Player Money: " + playerMoney + "<br>";
    htmlStr += "Buy: <br>";
    htmlStr += "<table><tr><td></td><td>Name</td><td>Price</td></tr>";
    for (var item in sellList.Items)
        {
            htmlStr += "<tr>";
            var buttonOnClick = "BuyItem(" + item + "); DisplayStore();";
            htmlStr += "<td><input type='Button' onClick='"+buttonOnClick+"' value='Buy'></input></td>";
            htmlStr += "<td>" + sellList.Items[item].name + "</td>";
            htmlStr += "<td>" + sellList.Items[item].cost + "</td>";
            htmlStr += "</tr>";
           
        }
    htmlStr +="</table><br><br>";
    
    htmlStr += "Sell: <br>";
    htmlStr += "<table><tr><td></td><td>Name</td><td>Price</td></tr>";
    for (var item in playerItems.Items)
        {
            if(playerItems.Items[item].hasOwnProperty("cost"))
                {
                        htmlStr += "<tr>";
                        var buttonOnClick = "SellItem(" + item + "); DisplayStore();";
                        htmlStr += "<td><input type='Button' onClick='"+buttonOnClick+"' value='Sell'></input></td>";
                        htmlStr += "<td>" + playerItems.Items[item].name + "</td>";
                        htmlStr += "<td>" + playerItems.Items[item].cost + "</td>";
                        htmlStr += "</tr>";
                }
           
        }
    htmlStr +="</table><br><br>";
    
     
    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayGameWorld();'>Back to Game World</a>";
    
    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = htmlStr;
    
}