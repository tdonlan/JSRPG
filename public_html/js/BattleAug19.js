
var battleState = 0;

var playerJSON = {"name": "Player", "TotalHP": 100, "CurrentHP": 100, "AttackScore": 50, "DefenseScore": 50, "WeaponDmg": 10};
var enemyJSON = {"name": "Goblin", "TotalHP": 50, "CurrentHP": 50, "AttackScore": 10, "DefenseScore": 10, "WeaponDmg": 5};

var playerItemJSON = {"Items": [{"name": "Healing Potion", "type": "Heal", "amount": 10},{"name": "Healing Potion", "type": "Heal", "amount": 10}]};
var playerAbilitiesJSON = {"Abilities": [{"name": "Super Attack", "type":"damage", "cooldown": 2, "amount": 25}]};

var enemyItemJSON = {"Items": [{"name": "Healing Potion"}, {"name": "Rusty Dagger"}, {"name": "Copper Key"}]};

var player;
var playerItems;
var playerAbilities;
var enemy;

var combatStatus = "";

var battleTimer;

var battleID;
var logID;

function initBattle(battleID, logID)
{
    player = playerJSON;
    playerItems = playerItemJSON;
    playerAbilities = playerAbilitiesJSON;

    enemy = enemyJSON;


    battleState = 0;
    this.battleID = battleID;
    this.logID = logID;

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
            enemyAttack();
            break;
        case 3:
            clearInterval(battleTimer);
            break;
        case 4:
            clearInterval(battleTimer);
            break;
        default:
            break;

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

function playerAttack()
{
    var attackRatio = 100 - (player.AttackScore / enemy.DefenseScore * 50);
    attackRatio = fixAttackRatio(attackRatio);
    var roll = Math.random() * 100;
    if (roll > attackRatio)
    {
        var dmgScale = fixDmgScale(player.AttackScore / enemy.DefenseScore);
        var dmg = Math.round(player.WeaponDmg * dmgScale);
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
    var attackRatio = 100 - (enemy.AttackScore / player.DefenseScore * 50);
    attackRatio = fixAttackRatio(attackRatio);
    var roll = Math.random() * 100;
    if (roll > attackRatio)
    {
        var dmgScale = fixDmgScale(enemy.AttackScore / player.DefenseScore);
        var dmg = Math.round(enemy.WeaponDmg * dmgScale);
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

    //remove used item
    //var index = playerAbilities.Abilities.indexOf(usedItem);
    //playerAbilities.Abilities.splice(index, 1);
   
    
}

function DisplayAbilities()
{
     var retval = "";
    for (var ab in playerAbilities.Abilities)
    {
        var functionCall = "UseAbility('" + playerAbilities.Abilities[ab].name + "');";
       
        retval += "<br><input type='button' onclick=\""+functionCall+"\" >" + playerAbilities.Abilities[ab].name + "</input>";
          
    }

    return retval;
}

function DisplayItems()
{
    var retval = "";
    for (var item in playerItems.Items)
    {
        var functionCall = "UseItem('" + playerItems.Items[item].name + "');";
       
        retval += "<br><input type='button' onclick=\""+functionCall+"\" >" + playerItems.Items[item].name + "</input>";
          
    }

    return retval;
}
