import inquirer from 'inquirer';
import chalk from 'chalk';
import { GridObject } from './gridObject.js';
import { PlayerObject } from './playerObject.js';
import { ItemObject } from './itemObject.js';
import { EnemyObject } from './enemyObject.js';

class Grid {
  constructor(width, height, playerX = 0, playerY = height - 1) {
    this.width = width;
    this.height = height;

    this.player = new PlayerObject(
      'player',
      { HP: 20, ATK: 6, DEF: 2 },
      '\u{1F98A}'
    );
    this.playerX = playerX;
    this.playerY = playerY;
    this.endX = width - 1;
    this.endY = 0;
    this.previousPlayerX;
    this.previousPlayerY;

    this.undiscoveredIcon;
    this.newIcon;

    this.gridObject = new GridObject('grid');
    this.isGameEnd = false;

    this.setUpGrid();
  }

  #gridMap = [];

  setUpGrid() {
    for (let row = 0; row < this.height; row++) {
      this.#gridMap[row] = []; // [[], [], [], [], []]
      for (let col = 0; col < this.width; col++) {
        this.#gridMap[row][col] =
          this.gridObject.treeIcons[
            this.randomIndex(this.gridObject.treeIcons)
          ];
      }
    }

    this.#gridMap[this.playerY][this.playerX] = this.player.icon;
    this.#gridMap[this.endY][this.endX] = this.gridObject.endIcon;

    this.startGame();
  }

  showGrid() {
    console.log('');

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        process.stdout.write(this.#gridMap[row][col]);
        process.stdout.write('\t');
      }
      process.stdout.write('\n');
    }
    console.log('');
  }

  async startGame() {
    while (true) {
      //
      if (this.undiscoveredIcon === this.gridObject.endIcon) {
        this.isGameEnd = true;
        console.log(
          chalk.black.bgMagenta(
            `\n🎉 Congrats! You reached the end of the game! 🥳`
          )
        );
        process.exit();
      }

      if (this.isGameEnd) {
        process.exit();
      }

      this.player.showStats();
      console.log('-----------------------------------------------');

      this.showGrid();

      const question = await this.promptDirection();

      switch (question.direction) {
        case 'Left':
          this.movePlayer('Left');
          break;
        case 'Right':
          this.movePlayer('Right');
          break;
        case 'Up':
          this.movePlayer('Up');
          break;
        case 'Down':
          this.movePlayer('Down');
          break;
        default:
          console.log('Something went wrong, start again');
          this.isGameEnd = true;
          process.exit();
      }
    }
  }

  movePlayer(direction) {
    let directionX = 0;
    let directionY = 0;

    if (direction === 'Left') {
      this.playerX -= 1;
      directionX = 1;
      if (this.playerX < 0) {
        console.log("You can't go this way");
        this.playerX += 1;
        return;
      }
    }

    if (direction === 'Right') {
      this.playerX += 1;
      directionX = -1;
      if (this.playerX > this.width - 1) {
        console.log("You can't go this way");
        this.playerX -= 1;
        return;
      }
    }

    if (direction === 'Up') {
      this.playerY -= 1;
      directionY = 1;
      if (this.playerY < 0) {
        console.log("You can't go this way");
        this.playerY += 1;
        return;
      }
    }

    if (direction === 'Down') {
      this.playerY += 1;
      directionY = -1;
      if (this.playerY > this.height - 1) {
        console.log("You can't go this way");
        this.playerY -= 1;
        return;
      }
    }

    this.undiscoveredIcon = this.#gridMap[this.playerY][this.playerX];

    this.previousPlayerX = this.playerX + directionX;
    this.previousPlayerY = this.playerY + directionY;

    this.#gridMap[this.playerY][this.playerX] = this.player.icon;
    this.#gridMap[this.previousPlayerY][this.previousPlayerX] =
      this.gridObject.pawPrintIcon;

    this.checkNextMove();
  }

  async promptDirection() {
    return await inquirer.prompt({
      type: 'list',
      name: 'direction',
      message: 'Which direction would you like to travel?',
      choices: ['Left', 'Right', 'Up', 'Down'],
    });
  }

  checkNextMove() {
    if (this.undiscoveredIcon === this.gridObject.pawPrintIcon) {
      this.gridObject.showMessage();
      return;
    }

    if (this.gridObject.treeIcons.includes(this.undiscoveredIcon)) {
      this.createNewIcon();
    }
  }

  createNewIcon() {
    const item = new ItemObject('sword', { HP: 10, ATK: 2, DEF: 1 }, '\u2694');
    const alien = new EnemyObject(
      'alien',
      { HP: 6, ATK: 5, DEF: 1 },
      '\u{1F47D}'
    );

    let itemPercentage = 20;
    let enemyPercentage = 15;
    let treePercentage = 100 - (itemPercentage - enemyPercentage);

    const itemArray = Array(itemPercentage).fill(item.sprite);
    const enemyArray = Array(enemyPercentage).fill(alien.sprite);

    let treeArray = [];
    for (let i = 0; i < treePercentage; i++) {
      let randomIndex = this.randomIndex(this.gridObject.treeIcons);
      treeArray.push(this.gridObject.treeIcons[randomIndex]);
    }

    const mixedArray = [...itemArray, ...enemyArray, ...treeArray];

    for (let i = mixedArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let k = mixedArray[i];
      mixedArray[i] = mixedArray[j];
      mixedArray[j] = k;
    }

    this.newIcon = mixedArray[this.randomIndex(mixedArray)];

    if (this.gridObject.treeIcons.includes(this.newIcon)) {
      this.gridObject.showMessage();
      return;
    }

    if (this.newIcon === item.sprite) {
      this.pickUpItem(item);
    }

    if (this.newIcon === alien.sprite) {
      this.fightEnemy();
    }
  }

  pickUpItem(item) {
    item.showMessage();
    item.showStats();

    let newPlayerObj = this.player.getStats();
    let itemStats = item.getStats();

    newPlayerObj.ATK += itemStats.ATK;
    newPlayerObj.DEF += itemStats.DEF;

    this.player.setStats(newPlayerObj);
  }

  fightEnemy() {
    const alien = new EnemyObject(
      'alien',
      { HP: 6, ATK: 8, DEF: 4 },
      '\u{1F47D}'
    );
    alien.showMessage();
    alien.showStats();
    this.player.showStats();
    console.log('- - - - - - - - - - - - - - - - - - - - - - - -');

    let playerObj = this.player.getStats();
    let enemyObj = alien.getStats();

    while (true) {
      let damagePlayer = enemyObj.ATK - playerObj.DEF;
      let damageEnemy = playerObj.ATK - enemyObj.DEF;

      if (damagePlayer < 0) {
        damagePlayer = 0;
      }

      if (damageEnemy < 0) {
        damageEnemy = 0;
      }

      playerObj.HP -= damagePlayer;
      enemyObj.HP -= damageEnemy;

      if (playerObj.HP <= 0 && enemyObj.HP > playerObj.HP) {
        console.log(chalk.black.bgYellow('*** The enemy beat you ***'));
        alien.setStats(enemyObj);
        alien.showStats();
        this.player.setStats(playerObj);
        this.player.showStats();
        this.isGameEnd = true;
        console.log(chalk.black.bgRed('You lost the game'));
        process.exit();
      }

      if (enemyObj.HP <= 0) {
        console.log(chalk.black.bgYellow('*** You defeated the alien! ***'));
        alien.setStats(enemyObj);
        alien.showStats();
        this.player.setStats(playerObj);
        return;
      }
    }
  }

  randomIndex(arr) {
    return Math.floor(Math.random() * arr.length);
  }
}

const grid = new Grid(5, 8);
