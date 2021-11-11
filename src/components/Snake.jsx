import React from 'react';
import './Snake.css'

export default class Snake extends React.Component {
  constructor() {
    super();
    this.state = {
      snake: [[10, 10],[10, 9],[10, 8]],
      fruit: [2, 2],
    }
    this.mapSize = 20;
    this.blockSize = 1;
    this.teclado = this.teclado.bind(this);
    this.move = this.move.bind(this);
    
  }

  componentDidMount() {
    window.addEventListener("keydown", (e) => this.teclado(e, true));
    window.addEventListener("keyup", (e) => this.teclado(e, false));
  }

  move(prevSnake, dir) {
    let ps = prevSnake;
    let d = '';
    
    switch (dir) {
      case 'w': d = [0, -1]; break;
      case 's': d = [0, 1]; break;
      case 'a': d = [-1, 0]; break;
      case 'd': d = [1, 0]; break;
      default: return prevSnake;
    }

    // falta teste pra não andar pra tras
    // falta teste pra bater no corpo
    // falta teste pra bater na parede

    let [x, y] = prevSnake[0];
    let [hx, hy] = [x+d[0], y+d[1]]
    if(!(hx === this.state.fruit[0] && hy === this.state.fruit[1])) ps.pop(); //reposiciona fruta
    ps.unshift([hx, hy]);
    return ps;
  }

  teclado(e, p) {
    if(!p){this.setState(({snake}) => ({snake: this.move(snake, e.key),}));}
  }

  render() {
    const { snake, fruit } = this.state;
    return (
      <section className="Snake">
        <div className="fruta" style={{left: `${fruit[0]}rem`, top: `${fruit[1]}rem`}}></div>
        {snake.map(([x, y],id) => <div key={id} className="serpenteCorpo" style={{left: `${x}rem`, top: `${y}rem`}}></div>)}
      </section>
    );
  }
}