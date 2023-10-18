export const getCommandDiIdentifier = (command: string): symbol => Symbol.for(`strategy:${command}`);
