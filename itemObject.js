import chalk from 'chalk';
import { GridObject } from './gridObject.js';

class ItemObject extends GridObject {
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
      chalk.blue(
        `Sword's Stats: Health: ${this.#stats.HP} Attack: ${
          this.#stats.ATK
        } Defence: ${this.#stats.DEF}`
      )
    );
  }

  showMessage() {
    return console.log(
      chalk.black.bgGreen(`${this.sprite} You found a sword!`)
    );
  }
}

export { ItemObject };
