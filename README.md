# arcade-commander-cli

![Arcade Commander demo](https://raw.githubusercontent.com/andrewjensen/arcade-commander-cli/master/demos/images/testing.gif)

Arcade Commander is a command-line task runner triggered by retro arcade
buttons. It will run any bash command, which means you could do all of these
special things with the satisfying press of an arcade button:

- Run automated tests
- Build and deploy your code
- Perform a DoS attack on a website (multiple buttons required for DDoS)
- Make repetitive CLI stuff fun!

## Installation

### The Hardware

I used a Teensy LC microcontroller and loaded `arcade-commander-basic.ino` onto
the device with USB mode set to RawHID. You could tweak the `.ino` file for
use with Arduino too.

### The Software

NPM Package coming soon. In the meantime, do this:
```
cd /your/workspace/directory/
git clone https://github.com/andrewjensen/arcade-commander-cli.git
cd arcade-commander-cli
ln -s index.js /usr/local/bin/arcade-commander
```

Now you can run `arcade-commander` from your command line.

## Usage
```
arcade-commander <COMMAND> [OPTIONS]
```

Example:
```
arcade-commander 'npm test'
```

See the other options with `arcade-commander -h`.
