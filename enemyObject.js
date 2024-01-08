import { GridObject } from './gridObject.js';
import chalk from 'chalk';

class EnemyObject extends GridObject {
  constructor(name, stats, sprite) {
    super();
    this.#stats = stats;
    this.sprite = sprite;
  }

  #stats = { HP: 0, ATK: 0, DEF: 0 };

  getStats() {
    return {
      ...this.#stats,
    };
  }

  showStats() {
    return console.log(
      chalk.green(
        `Alien's Stats: Health: ${this.#stats.HP} Attack: ${
          this.#stats.ATK
        } Defence: ${this.#stats.DEF}`
      )
    );
  }

  setStats(obj) {
    this.#stats.HP = obj.HP;
    this.#stats.ATK = obj.ATK;
    this.#stats.DEF = obj.DEF;
  }

  showMessage() {
    return console.log(
      chalk.black.bgYellow(`${this.sprite} You encountered an alien!`)
    );
  }
}

export { EnemyObject };
