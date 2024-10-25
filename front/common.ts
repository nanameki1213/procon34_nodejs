export enum Mode {
  MOVE,
  ACTION,
};

export enum Direction {
  RIGHT,
  DownRIGHT,
  DOWN,
  DownLEFT,
  LEFT,
  UpLEFT,
  UP,
  UpRIGHT,
  Direction_Max,
}

export class ActionData {
  mode: Mode = Mode.MOVE;
  direction: Direction = Direction.UP;
}