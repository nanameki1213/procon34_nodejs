import * as Papa from 'papaparse'
import { Mode, Direction, ActionData } from './common'
import { fetchCSV } from './api';

enum BIOMES {
  'NONE',
  'POND',
  'CASL',
}

enum STATES {
  'NONE',
  'ENCAMP1',
  'ENCAMP2',
  'OPENED_ENCAMP',
}

enum WALLS {
  'NONE',
  'WALL1',
  'WALL2',
}

enum AGENTS {
  'NONE',
  'AGENT1',
  'AGENT2',
}

export class Cell {
  biome_id: BIOMES;
  state_id: STATES = 0;
  wall_id: WALLS;
  agent_id: AGENTS;
  
  x_coord:  number;
  y_coord:  number;

  constructor(x_coord: number, y_coord:number, biome_id: BIOMES, agent_id: AGENTS = AGENTS.NONE, wall_id: WALLS = WALLS.NONE) {
    this.biome_id = biome_id;
    this.agent_id = agent_id;
    this.wall_id = wall_id;
    this.x_coord = x_coord;
    this.y_coord = y_coord;
  }
}

export class Agent {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Board {
  height: number = 0;
  width: number = 0;
  board: Cell[][] = [];
  agents: Agent[] = [];
  opponent: Agent[] = [];
  currentAgent: Agent = this.agents[0];
  currentAgentIndex: number = 0;

  async loadBoard(boardKind: string, is_agent1: boolean) {
    const path = '/api/field-datas/' + boardKind + '.csv';
    // APIサーバにボードを問い合わせ
    const CSVData = await fetchCSV(path);

    console.log(`GET ${path}`);
    
    // 取得したCSVファイルをパースし、オブジェクトに当てはめる
    const parse_csv = <Papa.ParseResult<string>>Papa.parse(CSVData, {
      header: false,
    });
    const field_data = parse_csv.data;
    this.height = field_data.length - 1;
    this.width = field_data[0].length;

    for (let i:number = 0; i < this.height; i++) {
      this.board[i] = [];
      for(let j:number = 0; j < this.width; j++) {
        switch (field_data[i][j]) {
          case '0':
            this.board[i][j] = new Cell(j, i, 0);
            break;
          case '1':
            this.board[i][j] = new Cell(j, i, 1);
            break;
          case '2':
            this.board[i][j] = new Cell(j, i, 2);
            break;
          case 'a':
            this.board[i][j] = new Cell(j, i, 0, 1);
            if (is_agent1) {
              this.agents[this.agents.length] = new Agent(j, i);
            } else {
              this.opponent[this.opponent.length] = new Agent(j, i);
            }
            break;
          case 'b':
            this.board[i][j] = new Cell(j, i, 0, 2);
            if (!is_agent1) {
              this.agents[this.agents.length] = new Agent(j, i);
            } else {
              this.opponent[this.opponent.length] = new Agent(j, i);
            }
            break;
          default:
            break;
        }
      }
    }

    console.log(this.agents);

    this.currentAgent = this.agents[this.currentAgentIndex++];
  }

  move_enable(x: number, y: number, is_agent1: boolean) {
    const target_wall = (is_agent1) ? WALLS.WALL2 : WALLS.WALL1;
    if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
      return false;
    }
    if (this.board[y][x].agent_id != AGENTS.NONE || this.board[y][x].wall_id == target_wall || 
        this.board[y][x].biome_id == BIOMES.POND) {
      return false;
    }
    return true;
  }

  build_enable(x: number, y: number, is_agent1: boolean) {
    const target_agent = (is_agent1) ? AGENTS.AGENT2: AGENTS.AGENT1;
    if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1 || this.board[y][x].agent_id == target_agent) {
      return false;
    }
    if (this.board[y][x].wall_id != WALLS.NONE || this.board[y][x].biome_id == BIOMES.CASL ||
        this.board[y][x].agent_id == AGENTS.AGENT2) {
      return false;
    }
    return true;
  }

  // エージェント操作汎用API
  moveAgent(agent: Agent, act: ActionData, is_agent1: boolean) {
    let move_x = agent.x;
    let move_y = agent.y;

    const direction = act.direction;
    if (direction == Direction.UP) {
      move_y--;
    } else if (direction == Direction.DOWN) {
      move_y++;
    } else if (direction == Direction.RIGHT) {
      move_x++;
    } else if (direction == Direction.LEFT) {
      move_x--;
    } else if (direction == Direction.UpLEFT) {
      move_y--;
      move_x--;
    } else if (direction == Direction.UpRIGHT) {
      move_y--;
      move_x++;
    } else if (direction == Direction.DownLEFT) {
      move_y++;
      move_x--;
    } else if (direction == Direction.DownRIGHT) {
      move_y++;
      move_x++;
    }

    if (!this.move_enable(move_x, move_y, is_agent1)) {
      console.error('can\'t move to {' + move_x + ',' + move_y + '}');
      return false;
    }

    this.board[agent.y][agent.x].agent_id = AGENTS.NONE;

    this.board[move_y][move_x].agent_id = is_agent1 ? AGENTS.AGENT1: AGENTS.AGENT2;

    // カレントエージェントを動かした場合
    if (this.currentAgent === agent) {
      this.currentAgent.x = move_x;
      this.currentAgent.y = move_y;
    }

    return true;
  }

  actionAgent(agent: Agent, act: ActionData, is_agent1: boolean) {

  }

  moveCurrentAgent(direction: Direction): boolean {
    let move_x = this.currentAgent.x;
    let move_y = this.currentAgent.y;

    if (direction == Direction.UP) {
      move_y--;
    } else if (direction == Direction.DOWN) {
      move_y++;
    } else if (direction == Direction.RIGHT) {
      move_x++;
    } else if (direction == Direction.LEFT) {
      move_x--;
    } else if (direction == Direction.UpLEFT) {
      move_y--;
      move_x--;
    } else if (direction == Direction.UpRIGHT) {
      move_y--;
      move_x++;
    } else if (direction == Direction.DownLEFT) {
      move_y++;
      move_x--;
    } else if (direction == Direction.DownRIGHT) {
      move_y++;
      move_x++;
    }

    if (!this.move_enable(move_x, move_y)) {
      console.error('can\'t move to {' + move_x + ',' + move_y + '}');
      return false;
    }

    this.board[this.currentAgent.y][this.currentAgent.x].agent_id = AGENTS.NONE;

    this.board[move_y][move_x].agent_id = AGENTS.AGENT1;

    this.currentAgent.x = move_x;
    this.currentAgent.y = move_y;

    // カーソルを同期
    // console.log('currentAgent: ', + this.currentAgent.x + ',', + this.currentAgent.y);

    return true;
  }

  actionCurrentAgent(direction: Direction) {
    let target_x = this.currentAgent.x;
    let target_y = this.currentAgent.y;

    if (direction == Direction.UP) {
      target_y--;
    } else if (direction == Direction.DOWN) {
      target_y++;
    } else if (direction == Direction.RIGHT) {
      target_x++;
    } else if (direction == Direction.LEFT) {
      target_x--;
    } else {
      console.error('direction is illegal.');
    }

    if (this.board[target_y][target_x].wall_id == WALLS.NONE) {
      return this.buildWall(target_x, target_y);
    } else {
      return this.removeWall(target_x, target_y);
    }
  }

  buildWall(x: number, y: number): boolean {
    if (!this.build_enable(x, y)) {
      console.error('can\'t build to {' + x + ',' + y + '}');
      return false;
    }

    this.board[y][x].wall_id = WALLS.WALL1;

    return true;
  }

  removeWall(x: number, y: number): boolean {
    this.board[y][x].wall_id = WALLS.NONE;

    return true;
  }

  nextCursor(): boolean {
    if (this.currentAgentIndex > this.agents.length - 1) {
      return false;
    }
    this.currentAgent = this.agents[this.currentAgentIndex++];
    return true;
  }

  applyAgentAction(act: ActionData) {
    if (act.mode == Mode.MOVE) {
      if (!this.actionCurrentAgent(act.direction)) {
        return;
      }
    } else {
      if (!this.moveCurrentAgent(act.direction)) {
        return;
      }
    }
  }

  synchronizeOpponent(act: ActionData[]) {
    for (let i = 0; i < this.opponent.length; i++) {
      let move_x = this.opponent[i].x;
      let move_y = this.opponent[i].y;

      const direction = act[i].direction;

      if (direction == Direction.UP) {
        move_y--;
      } else if (direction == Direction.DOWN) {
        move_y++;
      } else if (direction == Direction.RIGHT) {
        move_x++;
      } else if (direction == Direction.LEFT) {
        move_x--;
      } else if (direction == Direction.UpLEFT) {
        move_y--;
        move_x--;
      } else if (direction == Direction.UpRIGHT) {
        move_y--;
        move_x++;
      } else if (direction == Direction.DownLEFT) {
        move_y++;
        move_x--;
      } else if (direction == Direction.DownRIGHT) {
        move_y++;
        move_x++;
      }

      if (!this.move_enable(move_x, move_y)) {
        console.error('can\'t move to {' + move_x + ',' + move_y + '}');
        return false;
      }

      this.board[this.currentAgent.y][this.currentAgent.x].agent_id = AGENTS.NONE;

      this.board[move_y][move_x].agent_id = AGENTS.AGENT1;

      this.currentAgent.x = move_x;
      this.currentAgent.y = move_y;
    }
    let target_x = this.opponent.x;
    let target_y = this.opponent.y;

    if (direction == Direction.UP) {
      target_y--;
    } else if (direction == Direction.DOWN) {
      target_y++;
    } else if (direction == Direction.RIGHT) {
      target_x++;
    } else if (direction == Direction.LEFT) {
      target_x--;
    } else {
      console.error('direction is illegal.');
    }

    if (this.board[target_y][target_x].wall_id == WALLS.NONE) {
      return this.buildWall(target_x, target_y);
    } else {
      return this.removeWall(target_x, target_y);
    }
  }

  createBoard() {
    const table = document.getElementById('board');

    if (!table) {
      console.error('table is not defined or not found.');
      return;
    }

    table.innerHTML = '';

    for(let i:number = 0; i < this.height; i++) {
      const column = document.createElement("tr");
      for(let j:number = 0; j < this.width; j++) {
        const cell = this.board[i][j];
        const row = document.createElement("td");
        row.classList.add('table-cell');
        if (cell.biome_id == BIOMES.POND) {
          row.classList.add('field-pond');
        } else if(cell.biome_id == BIOMES.CASL) {
          row.classList.add('field-castle');
          row.innerText = '🏰';
        }  else if (cell.wall_id == WALLS.WALL1) {
          row.classList.add('field-wall');
          row.innerHTML = "&#129521";
        }
        if(cell.agent_id != AGENTS.NONE) {
          const agent = document.createElement('div');
          if (cell.agent_id == AGENTS.AGENT1) {
            agent.classList.add('agent1');
          } else if (cell.agent_id == AGENTS.AGENT2) {
            agent.classList.add('agent2');
          } else {
            console.error('Illegal string value for agent_str.');
          }
          if (this.currentAgent.x == j && this.currentAgent.y == i) {
            row.classList.add('cursorAgent');
          }
          row.appendChild(agent);
        }
        column.appendChild(row);
      }
      table.appendChild(column);
    }
  }
}