let enteredValue = prompt("Enter Max Life value", "100");
let chosenMaxLife = parseInt(enteredValue);
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}
const ATTACK_VALUE = 10; //we made it capital to mean it as global var.
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "ATTACK STRONG";
let battleLog = [];
const LOG_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_GAME_OVER = "GAME_OVER";
let currentMonsterhealth = chosenMaxLife;
let currentPlayerhealth = chosenMaxLife;
let hasBonusLife = true;
adjustHealthBars(chosenMaxLife);
function writeTolog(event, value, monsterHealth, playerHealth) {
  logEntry = {
    event: event,
    value: value,
    target: "MONSTER",
    finalMonsterhealth: monsterHealth,
    finalPlayerhealth: playerHealth,
  };

  switch (event) {
    case LOG_PLAYER_ATTACK: //using ===
      logEntry.target = "MONSTER";
      break;
    case LOG_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "MONSTER",
        finalMonsterhealth: monsterHealth,
        finalPlayerhealth: playerHealth,
      };

      break;
    case LOG_MONSTER_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "PLAYER",
        finalMonsterhealth: monsterHealth,
        finalPlayerhealth: playerHealth,
      };
      break;
    case LOG_PLAYER_HEAL:
      logEntry = {
        event: event,
        value: value,
        target: "PLAYER",
        finalMonsterhealth: monsterHealth,
        finalPlayerhealth: playerHealth,
      };
      break;
    case LOG_GAME_OVER:
      logEntry = {
        event: event,
        value: value,
        finalMonsterhealth: monsterHealth,
        finalPlayerhealth: playerHealth,
      };
      break;
    default:
      logEntry = {};
  }
  // if (event === LOG_PLAYER_ATTACK) {
  //   logEntry.target = "MONSTER"; //add target to the object
  // } else if (event === LOG_PLAYER_STRONG_ATTACK) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "MONSTER",
  //     finalMonsterhealth: monsterHealth,
  //     finalPlayerhealth: playerHealth,
  //   };
  // } else if (event === LOG_MONSTER_ATTACK) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "PLAYER",
  //     finalMonsterhealth: monsterHealth,
  //     finalPlayerhealth: playerHealth,
  //   };
  // } else if (event === LOG_PLAYER_HEAL) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "PLAYER",
  //     finalMonsterhealth: monsterHealth,
  //     finalPlayerhealth: playerHealth,
  //   };
  // } else if (event === LOG_GAME_OVER) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     finalMonsterhealth: monsterHealth,
  //     finalPlayerhealth: playerHealth,
  //   };
  // }
  battleLog.push(logEntry);
}
function reset() {
  currentMonsterhealth = chosenMaxLife;
  currentPlayerhealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}
function endRound() {
  const initialPlayerHealth = currentPlayerhealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerhealth -= playerDamage;
  writeTolog(
    LOG_MONSTER_ATTACK,
    playerDamage,
    currentMonsterhealth,
    currentPlayerhealth
  );
  if (currentPlayerhealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerhealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("Bonus life saved you");
  }

  if (currentMonsterhealth <= 0 && currentPlayerhealth > 0) {
    alert("You Won");
    writeTolog(
      LOG_GAME_OVER,
      "PLAYER WON",
      currentMonsterhealth,
      currentPlayerhealth
    );
  } else if (currentPlayerhealth <= 0 && currentMonsterhealth > 0) {
    alert("You Lost");
    writeTolog(
      LOG_GAME_OVER,
      "MONSTER WON",
      currentMonsterhealth,
      currentPlayerhealth
    );
  } else if (currentMonsterhealth <= 0 && currentPlayerhealth <= 0) {
    alert("You have draw!");
    writeTolog(
      LOG_GAME_OVER,
      "DRAW",
      currentMonsterhealth,
      currentPlayerhealth
    );
  }
  if (
    (currentMonsterhealth <= 0 && currentPlayerhealth > 0) ||
    (currentPlayerhealth <= 0 && currentMonsterhealth > 0) ||
    (currentMonsterhealth <= 0 && currentPlayerhealth <= 0)
  ) {
    reset();
  }
}
function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK ? LOG_PLAYER_ATTACK : LOG_PLAYER_STRONG_ATTACK;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_PLAYER_ATTACK;
  // } else {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterhealth -= damage;
  writeTolog(logEvent, damage, currentMonsterhealth, currentPlayerhealth);

  endRound();
}

function attckHandler() {
  attackMonster(MODE_ATTACK);
}
function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healvalue;
  if (currentPlayerhealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You cannot heal more than this");
    healvalue = chosenMaxLife - currentPlayerhealth;
  } else {
    healvalue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerhealth += HEAL_VALUE;
  writeTolog(
    LOG_PLAYER_HEAL,
    healvalue,
    currentMonsterhealth,
    currentPlayerhealth
  );

  endRound();
}
function printLogHandler() {
  for (let i=0; i<battleLog.length;i++){
  console.log(battleLog[i]);
  }
}
attackBtn.addEventListener("click", attckHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
