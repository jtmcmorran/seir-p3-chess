import Piece from './piece.js';

export default class King extends Piece {
  constructor(player){
    super(player, (player === 1? "https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_klt60.png" : "https://commons.wikimedia.org/wiki/Category:PNG_chess_pieces/Standard_transparent#/media/File:Chess_kdt60.png"));
  }
  isMovePossible(src, dest){
    return (src - 9 === dest ||
      src - 8 === dest ||
      src - 7 === dest ||
      src + 1 === dest ||
      src + 9 === dest ||
      src + 8 === dest ||
      src + 7 === dest ||
      src - 1 === dest);
  }
  getPath(src, dest){
    return [];
  }
}
