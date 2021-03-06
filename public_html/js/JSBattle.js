
var battleState = 0;

var playerJSON = {"name": "Player", "TotalHP": 100, "CurrentHP": 100, "AttackScore": 10, "DefenseScore": 10};
var playerAbilitiesJSON = [{"name": "Super Attack", "type": "damage", "timer": 0, "cooldown": 2, "amount": 25}];


var goblinJSON = {"name": "Goblin", "TotalHP": 50, "CurrentHP": 50, "AttackScore": 10, "DefenseScore": 10, "WeaponDmg": 5, "coin": 10, "ItemList": "goblinItemList"};
var dragonJSON = {"name": "Dragon", "TotalHP": 200, "CurrentHP": 200, "AttackScore": 75, "DefenseScore": 55, "WeaponDmg": 50, "coin": 500, "ItemList": "dragonItemList"};
var enemyList = ["goblinJSON", "dragonJSON"];


//-------  Item Lists ----------

var store1ItemList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

var playerItemList = [1, 1, 3];

var goblinItemList = [1, 1, 4];
var dragonItemList = [2, 2, 2, 2, 7, 9, 12];

var player;
var playerEquipment = [];
var playerItems = [];
var playerAbilities = [];
var playerMoney;

var enemy;
var enemyItems;

var combatStatus = "";

var battleTimer;

var battleID;
var logID;

var sellList;

var masterItemList;

function initGame(battleID, logID)
{
    this.battleID = battleID;
    this.logID = logID;

    resetGame();

}

function resetGame()
{
    combatStatus = "";
    var battleElement = document.getElementById(logID);
    battleElement.innerHTML = combatStatus;

    masterItemList = loadItemsFromCSV('js/ItemList.csv');
    player = JSON.parse(JSON.stringify(playerJSON));
    playerItems = GetItemListFromIDList(playerItemList);
    playerAbilities = JSON.parse(JSON.stringify(playerAbilitiesJSON));
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
    enemy = JSON.parse(JSON.stringify(enemyJSON));
    enemyItems = GetItemListFromIDList(this[enemy.ItemList]);

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
    if (enemy.CurrentHP <= 0)
    {
        battleState = 3;
    }
    if (player.CurrentHP <= 0)
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
    var attackRatio = (attackerValue - defenderValue) / (attackerValue + defenderValue);
    attackRatio = (attackRatio + 1) / 2;
    
    return attackRatio * 100;
}

function playerAttack()
{
    var attackRatio = getAttackRatio(getPlayerAttack(), enemy.DefenseScore);
    var roll = Math.random() * 100;
    if (roll < attackRatio)
    {

        var dmg = getPlayerDamage();
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
    var attackRatio = getAttackRatio(enemy.AttackScore, getPlayerDefense());
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
    combatStatus += "<br>Gold collected: " + enemy.coin;
    playerMoney += parseInt(enemy.coin, 10);
    combatStatus += "<br>Loot collected: " + PrintItemList(enemyItems);
    AddPlayerItemsFromList(enemyItems);
    battleState = 3;
}

function LoseBattle()
{
    combatStatus += player.name + " was defeated by " + enemy.name + "<br>";
    combatStatus += "You died! - Game Over";

    battleState = 4;

    combatStatus += "<br><a href='javascript:void(0)' onclick='resetGame();'>Restart Game</a>";

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

function getPlayerAttack()
{
    var bonusAttack = 0;
    for (var item in playerEquipment)
    {
        if (playerEquipment[item].effect === "attack")
        {
            bonusAttack += parseInt(playerEquipment[item].amount, 10);
        }
    }

    return player.AttackScore + bonusAttack;
}

function getPlayerDefense()
{
    var bonusDefense = 0;
    for (var item in playerEquipment)
    {
        if (playerEquipment[item].effect === "defense")
        {
            bonusDefense += parseInt(playerEquipment[item].amount, 10);
        }
    }

    return player.DefenseScore + bonusDefense;

}

function getPlayerDamage()
{
    var wepDamage = 1;

    for (var item in playerEquipment)
    {
        if (playerEquipment[item].type === "equip_weapon")
        {
            wepDamage = parseInt(playerEquipment[item].amount, 10);
        }
    }

    return wepDamage;
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
    htmlStr += "<tr><td>Attack Score:</td><td> " + getPlayerAttack() + "</td><td>" + enemy.AttackScore + "</td></tr>";
    htmlStr += "<tr><td>Defense Score:</td><td>" + getPlayerDefense() + "</td><td>" + enemy.DefenseScore + "</td></tr>";
    htmlStr += "<tr><td>Weapon Dmg:</td><td>" + getPlayerDamage() + "</td><td>" + enemy.WeaponDmg + "</td></tr>";
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

    for (var item in playerItems)
    {
        if (playerItems[item].name === itemName)
        {
            usedItem = playerItems[item];
        }
    }

    combatStatus += player.name + " used " + usedItem.name + "<br>";

    if (usedItem.effect === "heal")
    {
        playerHeal(usedItem.amount);
    }
    if (usedItem.effect === "damage")
    {
        playerDamageEnemy(usedItem.amount);
    }

    //remove used item
    var index = playerItems.indexOf(usedItem);
    playerItems.splice(index, 1);
    battleState = 2;

}

function UseAbility(abName)
{
    //get the item from the item list
    var usedAbility;

    for (var ab in playerAbilities)
    {
        if (playerAbilities[ab].name === abName)
        {
            usedAbility = playerAbilities[ab];
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

}

//go through and update the counters on abilities
function UpdateAbilityTick()
{
    for (var ab in playerAbilities)
    {
        var curAbility = playerAbilities[ab];
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
    for (var ab in playerAbilities)
    {
        var functionCall = "UseAbility('" + playerAbilities[ab].name + "');";
        var displayName = playerAbilities[ab].name;

        if (playerAbilities[ab].timer != 0)
        {
            displayName += "(" + playerAbilities[ab].timer + ")";
            retval += "<br><input type='button' onclick=\"" + functionCall + "\" disabled>" + displayName + "</input>";
        }
        else if (battleState === 1)
        {
            retval += "<br><input type='button' onclick=\"" + functionCall + "\" >" + displayName + "</input>";
        }
        else
        {
            retval += "<br><input type='button' onclick=\"" + functionCall + "\" disabled>" + displayName + "</input>";
        }
    }

    return retval;
}

function DisplayItems()
{
    var retval = "";
    for (var item in playerItems)
    {
        if (playerItems[item].type.indexOf("equip_") == -1)
        {
            var functionCall = "UseItem('" + playerItems[item].name + "');";

            retval += "<br><input type='button' onclick=\"" + functionCall + "\" >" + playerItems[item].name + "</input>";
        }

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
    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayEquipment();'>View Equipment</a>";
    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayInventory();'>View Inventory</a>";
    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayNewStore(" + "store1ItemList" + ");'>Store</a>";

    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = htmlStr;

}

function DisplayInventory()
{

    var htmlStr = "<h1>Player Inventory</h1>";
    for (var item in playerItems)
    {
        htmlStr += "<br>" + playerItems[item].name + ": ";

        var functionCall = "UseItem('" + playerItems[item].name + "'); DisplayInventory();";

        htmlStr += "<input type='button' onclick=\"" + functionCall + "\" value='Use'></input>";

        functionCall = "DropItem('" + playerItems[item].name + "'); DisplayInventory();";

        htmlStr += "<input type='button' onclick=\"" + functionCall + "\" value='X'></input>";

    }

    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayGameWorld();'>Back to Game World</a>";

    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = htmlStr;


}

//display weapons and equipment, let the player change out gear
function DisplayEquipment()
{
    var htmlStr = "<h1>Player Equipment</h1>";

    htmlStr += "<table>";
    htmlStr += "<tr><td>Name</td><td>Type</td><td>Effect</td><td>Amount</td></tr>";
    for (var item in playerEquipment)
    {
        htmlStr += "<tr><td>" + playerEquipment[item].name + "</td><td>" + playerEquipment[item].type
                + "</td><td>" + playerEquipment[item].effect + "</td><td>" + playerEquipment[item].amount + "</td></tr>";

    }

    htmlStr += "</table>";

    for (var item in playerItems)
    {
        if (playerItems[item].type.indexOf("equip_") != -1)
        {
            var functionCall = "EquipItem('" + item + "'); DisplayEquipment();";

            htmlStr += "<br><input type='button' onclick=\"" + functionCall + "\" value='Equip'></input>";
            htmlStr += playerItems[item].name;
        }

    }

    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayGameWorld();'>Back to Game World</a>";

    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = htmlStr;

}

function EquipItem(itemIndex)
{
    var item = playerItems[itemIndex];

    var type = item.type;
    for (var i in playerEquipment)
    {
        if (playerEquipment[i].type === type)
        {
            playerItems.push(playerEquipment[i]);
            playerEquipment.splice(i, 1);

        }
    }

    playerEquipment.push(item);
    playerItems.splice(itemIndex, 1);
}

function DisplayStats()
{
    var htmlStr = "";
    htmlStr += "<h1>Player</h1>";
    htmlStr += "<table>";
    htmlStr += "<tr><td>Stat</td><td>" + player.name + "</td></tr>";
    htmlStr += "<tr><td>HP:</td><td>" + player.CurrentHP + " / " + player.TotalHP + "</td></tr>";
    htmlStr += "<tr><td>Attack Score:</td><td> " + getPlayerAttack() + "</td></tr>";
    htmlStr += "<tr><td>Defense Score:</td><td>" + getPlayerDefense() + "</td></tr>";
    htmlStr += "<tr><td>Weapon Dmg:</td><td>" + getPlayerDamage() + "</td></tr>";
    htmlStr += "</table>";

    htmlStr += "<h2>Items</h2>";
    for (var item in playerItems.Items)
    {
        htmlStr += "<br>" + playerItems[item].name;
    }
    htmlStr += "<h2>Abilities</h2>";
    for (var ab in playerAbilities)
    {
        htmlStr += "<br>" + playerAbilities[ab].name;
    }

    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayGameWorld();'>Back to Game World</a>";

    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = htmlStr;
}

function SellItem(index)
{
    var item = playerItems[index];
    playerMoney += parseInt(item.cost, 10);
    sellList.push(item);
    playerItems.splice(index, 1);
}


function BuyItem(index)
{

    var item = sellList[index];
    if (playerMoney >= parseInt(item.cost, 10))
    {
        playerMoney -= parseInt(item.cost, 10);
        playerItems.push(item);
        sellList.splice(index, 1);
        return true;
    }
    else
    {
        return false;
    }
}

function DisplayNewStore(storeIDList)
{
    sellList = GetItemListFromIDList(storeIDList);
    DisplayStore();
}

function DisplayStore()
{

    var htmlStr = "<h1>Store</h2>";
    htmlStr += "Player Money: " + playerMoney + "<br>";
    htmlStr += "Buy: <br>";
    htmlStr += "<table><tr><td></td><td>Name</td><td>Price</td></tr>";
    for (var item in sellList)
    {
        htmlStr += "<tr>";
        var buttonOnClick = "BuyItem(" + item + "); DisplayStore();";
        htmlStr += "<td><input type='Button' onClick='" + buttonOnClick + "' value='Buy'></input></td>";
        htmlStr += "<td>" + sellList[item].name + "</td>";
        htmlStr += "<td>" + sellList[item].cost + "</td>";
        htmlStr += "</tr>";

    }
    htmlStr += "</table><br><br>";

    htmlStr += "Sell: <br>";
    htmlStr += "<table><tr><td></td><td>Name</td><td>Price</td></tr>";
    for (var item in playerItems)
    {
        if (playerItems[item].hasOwnProperty("cost"))
        {
            htmlStr += "<tr>";
            var buttonOnClick = "SellItem(" + item + "); DisplayStore();";
            htmlStr += "<td><input type='Button' onClick='" + buttonOnClick + "' value='Sell'></input></td>";
            htmlStr += "<td>" + playerItems[item].name + "</td>";
            htmlStr += "<td>" + playerItems[item].cost + "</td>";
            htmlStr += "</tr>";
        }

    }
    htmlStr += "</table><br><br>";


    htmlStr += "<br><a href='javascript:void(0)' onclick='DisplayGameWorld();'>Back to Game World</a>";

    var battleElement = document.getElementById(battleID);
    battleElement.innerHTML = htmlStr;

}

//--------------ITEM METHODS USING ID------------------------

function loadItemsFromCSV(name)
{
    var rawCSV =
            $.ajax(
            {
                type: 'GET',
                async: false,
                url: name
            }).responseText;

    return $.csv.toObjects(rawCSV);

}

//used to add an item to the player's item list, from the master item list
//(looting after battle, or pickup from in game)
function AddPlayerItemFromID(id)
{
    var item = GetItemFromID(id);
    playerItems.Items.push(item);

}


function GetItemFromID(id)
{
    var result = $.grep(masterItemList, function(e) {
        return e.id == id;
    });

    if (result.length == 0) {
        return null;
    }
    else
    {
        return result[0];

    }
}

//creates a runtime item object list given an array of master item ids
//used to build the player's Item list on loading, shop lists, enemy drops, etc
function GetItemListFromIDList(idList)
{
    var itemList = [];
    for (var id in idList)
    {
        var curItem = GetItemFromID(idList[id]);
        itemList.push(curItem);
    }
    return itemList;
}

function AddPlayerItemsFromList(itemList)
{
    playerItems = playerItems.concat(itemList);
}

function PrintItemList(itemList)
{
    var retval = "";
    for (var item in itemList)
    {
        retval += "" + itemList[item].name + ", ";
    }
    return retval;
}