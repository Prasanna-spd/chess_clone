import { WebSocket } from "ws";
import { Chess, ChessInstance, ShortMove } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: ChessInstance;
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(JSON.stringify({
        type:INIT_GAME,
        payload:{
            color:"white"
        }
    }))
    this.player2.send(JSON.stringify({
        type:INIT_GAME,
        payload:{
            color:"black"
        }
    }))
  }
  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    // Ensure it's the correct player's turn
    if (this.board.turn() === 'w' && socket !== this.player1) return;
    if (this.board.turn() === 'b' && socket !== this.player2) return;
  
    try {
      console.log("make move");
      this.board.move(move as ShortMove);
    } catch (e) {
      console.error("Invalid move", e);
      return;
    }
  
    // Check game over
    if (this.board.game_over()) {
      const winner = this.board.turn() === "w" ? "black" : "white";
      const gameOverMessage = JSON.stringify({
        type: GAME_OVER,
        payload: { winner },
      });
      this.player1.send(gameOverMessage);
      this.player2.send(gameOverMessage);
      return;
    }
  
    // Send move to the opponent
    const moveMessage = JSON.stringify({ type: MOVE, payload: move });
    if (this.board.turn() === 'w') {
      console.log("sent player1");
      this.player1.send(moveMessage);
    } else {
      console.log("sent player2");
      this.player2.send(moveMessage);
    }
  }
  
}
