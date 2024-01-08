import chalk from 'chalk';

class PlayerObject {
  constructor(name, stats, icon) {
    this.name = name;
    this.#stats = stats;
    this.icon = icon;
  }

  #stats = { HP: 0, ATK: 0, DEF: 0 };

  getStats() {
    return {
      ...this.#stats,
    };
  }

  setStats(obj) {
    this.#stats.HP = obj.HP;
    this.#stats.ATK = obj.ATK;
    this.#stats.DEF = obj.DEF;
  }

  showStats() {
    return console.log(
      chalk.magenta(
        `Player stats: Health: ${this.#stats.HP} Attack: ${
          this.#stats.ATK
        } Defence: ${this.#stats.DEF}`
      )
    );
  }
}

export { PlayerObject };
