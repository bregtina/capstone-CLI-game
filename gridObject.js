class GridObject {
  constructor(name) {
    this.name = name;
  }

  endIcon = '\u{1F3C1}';
  treeIcons = ['\u{1F332}', '\u{1F333}', '\u{1F334}', '\u{1F335}'];
  pawPrintIcon = '\u{1F43E}';

  message = [
    'These surroundings are similar',
    'Nothing to see here',
    'Just some branches and leaves',
  ];

  showMessage() {
    return console.log(
      this.message[Math.floor(Math.random() * this.message.length)]
    );
  }
}

export { GridObject };
