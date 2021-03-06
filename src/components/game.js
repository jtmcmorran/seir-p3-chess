import React from 'react';
import '../index.css';
import Board from './board.js';
import { io } from "socket.io-client";
import initialiseChessBoard from '../initializer.js';
const socket = io();
export default class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      squares: initialiseChessBoard(),
      player: 1,
      sourceSelection: -1,
      status: '',
      turn: 'white'
    }
  }
  handleClick(i){
    const squares = this.state.squares.slice();
    if(this.state.sourceSelection === -1){
      if(squares[i] && squares[i].player === this.state.player){
        this.setState({
          status: "Choose destination",
          sourceSelection: i
        });
      }
    }
    else if(this.state.sourceSelection > -1){
      if(squares[i] && squares[i].player === this.state.player){
        this.setState({
          status: "Illegal move, try again",
          sourceSelection: -1,
        });
      }
      else{
        const squares = this.state.squares.slice();
        const isDestEnemyOccupied = squares[i]? true : false;
        const isMovePossible = squares[this.state.sourceSelection].isMovePossible(this.state.sourceSelection, i, isDestEnemyOccupied);
        const srcToDestPath = squares[this.state.sourceSelection].getPath(this.state.sourceSelection, i);
        const isMoveLegal = this.isMoveLegal(srcToDestPath);
        if(isMovePossible && isMoveLegal){
          squares[i] = squares[this.state.sourceSelection];
          squares[this.state.sourceSelection] = null;
          let player = this.state.player === 1? 2: 1;
          let turn = this.state.turn === 'white'? 'black' : 'white';
          this.setState({
            sourceSelection: -1,
            squares: squares,
            player: player,
            status: '',
            turn: turn
          });
          socket.emit('send', this.state);
        }
        else{
          this.setState({
            status: "Illegal move, try again",
            sourceSelection: -1,
          });
        }
      }
    }
  }
  isMoveLegal(srcToDestPath){
    let isLegal = true;
    for(let i = 0; i < srcToDestPath.length; i++){
      if(this.state.squares[srcToDestPath[i]] !== null){
        isLegal = false;
      }
    }
    return isLegal;
  }
  async componentDidMount(){
    socket.on('receive', board => {

      this.setState(board);
    });
  }

  render() {
    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board
            squares = {this.state.squares}
            onClick = {(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <h3>Turn</h3>
            <div id="player-turn-box" style={{backgroundColor: this.state.turn}}>
            </div>
            <div className="game-status">{this.state.status}</div>
            </div>
          </div>
        </div>
      );
  }
}
