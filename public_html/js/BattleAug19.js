/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var battleState = 0;

var playerJSON = {"name": "Player", "TotalHP": 100, "CurrentHP": 100, "AttackScore": 150, "DefenseScore": 5, "WeaponDmg": 10};
var enemyJSON = {"name": "Goblin", "TotalHP": 50, "CurrentHP": 50, "AttackScore": 10, "DefenseScore": 100, "WeaponDmg": 5};

var player;
var enemy;

var combatStatus = "";

var battleTimer;

var battleID;
var logID;

function initBattle(battleID, logID)
{
    player = playerJSON;
    enemy = enemyJSON;

    battleState = 0;
    this.battleID = battleID;
    this.logID = logID;

    //set up the loop timer
    battleTimer = setInterval(function() {
        BattleLoop()
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

    UpdateDisplay()

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

function playerAttack()
{
    var attackRatio = 100 - (player.AttackScore / enemy.DefenseScore * 50);
    attackRatio = fixAttackRatio(attackRatio);
    if ((Math.random() * 100) > attackRatio)
    {
        var dmgScale = fixDmgScale(player.AttackScore / enemy.DefenseScore);
        var dmg = player.WeaponDmg * dmgScale;
        combatStatus += player.name + " hit " + enemy.name + " for " + dmg + " damage" + "<br>";
        enemy.CurrentHP = enemy.CurrentHP - dmg;

    }
    else
    {
        combatStatus += player.name + " missed " + enemy.name + "<br>";
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
    if ((Math.random() * 100) > attackRatio)
    {
        var dmgScale = fixDmgScale(enemy.AttackScore / player.DefenseScore);
        var dmg = enemy.WeaponDmg * dmgScale;
        combatStatus += enemy.name + " hit " + player.name + " for " + dmg + " damage" + "<br>";
        player.CurrentHP = player.CurrentHP - dmg;

    }
    else
    {
        combatStatus += enemy.name + " missed " + player.name + "<br>";
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
    if (atkRatio > 90)
    {
        atkRatio = 90;
    }
    if (atkRatio < 10)
    {
        atkRatio = 10;
    }

    return atkRatio;
}


function fixDmgScale(dmgScale)
{
    if (dmgScale > 2)
    {
        dmgScale = 2;
    }
    if (dmgScale < .1)
    {
        dmgScale = .1;
    }
    return dmgScale;
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
    }
    else
    {
        htmlStr += "<br><input type='button' onclick='playerAttack();' disabled>Attack!</input>";
    }

    return htmlStr;

}


