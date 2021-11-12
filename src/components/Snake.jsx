import React from 'react';
import './Snake.css'

const H = 20;
const V = 20;

export default class Snake extends React.Component {
  constructor() {
    super();
    this.state = {
      snake: [[10, 8],[10, 9],[10, 10]],
      fruit: [2, 2],
      dir: 'a',
      run: false,
      score: 0,
      best: 0,
    }
    this.teclado = this.teclado.bind(this);
    this.move = this.move.bind(this);
    this.reiniciar = this.reiniciar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.sorteiaPos = this.sorteiaPos.bind(this);
    this.sorteiaFruta = this.sorteiaFruta.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", (e) => this.teclado(e, true));
    window.addEventListener("keyup", (e) => this.teclado(e, false));
    this.timer = setInterval(this.atualizar, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  move(prevSnake) {
    let ps = [...prevSnake];
    let d = [0,0];
    
    switch (this.state.dir) {
      case 'w': d = [0, -1]; break;
      case 's': d = [0, 1]; break;
      case 'a': d = [-1, 0]; break;
      case 'd': d = [1, 0]; break;
      default: d = [0, 0]; break;
    }

    let [x, y] = prevSnake[0];
    let [hx, hy] = [x+d[0], y+d[1]]

    ps.unshift([hx, hy]);
    return ps;
  }

  teclado(e, p) {
    const t = e.key.toLowerCase();
    if('wasd'.includes(t)) {
      // a seguir a logica que impede voltar // TEM QUE REVISAR
      // o correto é comparar snake[0] e snake[1];
      if(!('ad'.includes(t) && 'ad'.includes(this.state.dir))
      && !('ws'.includes(t) && 'ws'.includes(this.state.dir))) {
        this.setState({
          dir: t,
          run: true,
        })
      }
    }
  }

  reiniciar() {
    console.log('reiniciar');
    if(this.state.score > this.state.best) this.setState(({score, best})=>({best: score}));
    if(this.state.run) {
      this.setState({
        snake: [[10, 8],[10, 9],[10, 10]],
        fruit: [2, 2],
        dir: 'a',
        run: false,
        score: 0,
      });
    }
  }

  atualizar() {
    console.log('atualizar');
    if(this.state.run) {
      this.setState(({snake}) => ({
        snake: this.move(snake),
      }),this.sensores);
    }
  }

  sensores() {
    const {snake} = this.state;
    const [hx, hy] = snake[0];
    // fruta
    if(( hx === this.state.fruit[0] && hy === this.state.fruit[1])) {
      this.setState(({score, snake}) => ({
        score: score + 1,
        // TODO: sorteia fruta
        fruit: this.sorteiaFruta(H, V, snake)
      }));
      
    } else { 
      this.setState(({snake}) => {
        let ps = [...snake];
        ps.pop();
        return {snake: ps}
      });
    }
    // corpo
    // parede
  }

  sorteiaPos(x, y) {
    return [Math.ceil(x*Math.random()-1), Math.ceil(y*Math.random()-1)]
  }

  sorteiaFruta(x, y, a) {
    let ok = false;
    let pos = [];
    while(!ok) {
      pos = this.sorteiaPos(H, V);
      if (!a.includes(pos)) ok = true;
    }
    return pos;
  }

  render() {
    const { snake, fruit, score, best } = this.state;
    return (
      <section className="Snake">
        <div className="fruta" style={{left: `${fruit[0]}rem`, top: `${fruit[1]}rem`}}></div>
        {snake.map(([x, y],id) => <div key={id} className="serpenteCorpo" style={{left: `${x}rem`, top: `${y}rem`}}></div>)}
        <button id="reiniciar" type="button" onClick={this.reiniciar}>Reiniciar</button>
        <p id="score">Score:{score}</p>
        { best ? <p id="best">Best:{best}</p> : null}
      </section>
    );
  }
}