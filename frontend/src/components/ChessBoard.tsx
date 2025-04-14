import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";

const ChessBoard = ({
  setBoard,
  board,
  socket,
  chess,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  setBoard: any;
  chess: any;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = (
                String.fromCharCode(97 + j) + (8 - i)
              ) as Square;

              const isDarkSquare = (i + j) % 2 === 0;

              const pieceImageSrc = square
                ? `/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()} copy`}.png`
                : null;

              return (
                <div
                  key={j}
                  className={`w-16 h-16 ${isDarkSquare ? "bg-green-500" : "bg-slate-500"}`}
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRepresentation);
                    } else {
                      socket.send(
                        JSON.stringify({
                          type: "move",
                          payload: {
                            move: {
                              from,
                              to: squareRepresentation,
                            },
                          },
                        })
                      );
                      chess.move({
                        from,
                        to: squareRepresentation,
                      });
                      setFrom(null);
                      setBoard(chess.board()); // Optional: update on message only
                    }
                  }}
                >
                  <div className="w-full justify-center flex h-full">
                    <div className="h-full justify-center flex flex-col">
                      {pieceImageSrc && (
                        <img className="w-16" src={pieceImageSrc} alt="" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;
