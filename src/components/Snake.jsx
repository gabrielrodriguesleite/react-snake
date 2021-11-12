import React from 'react';
import './Snake.css'

const H = 20;
const V = 20;
const sorteiaPos = (x, y) => [Math.ceil(x*Math.random()-1), Math.ceil(y*Math.random()-1)];

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
      dead: false,
    }
    this.teclado = this.teclado.bind(this);
    this.move = this.move.bind(this);
    this.reiniciar = this.reiniciar.bind(this);
    this.atualizar = this.atualizar.bind(this);
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
    if ('wasd'.includes(t)) { // agora ficou redundante mas vou deixar assim por enquanto
      let s = [...this.state.snake]
      let [hx, hy] = s[0];
      let [nx, ny] = s[1];

      if (( t === 'a' ) && hx -1 === nx) return;
      if (( t === 'd' ) && hx +1 === nx) return;
      if (( t === 'w' ) && hy -1 === ny) return;
      if (( t === 's' ) && hy +1 === ny) return;

      this.setState(({dead})=>({
        dir: t,
        run: dead ? false : true,
      }));
    }
  }

  reiniciar() {
    console.log('reiniciar');
    if(this.state.dead && this.state.score > this.state.best) this.setState(({score, best})=>({best: score}));
    if(!this.state.run) {
      this.setState({
        snake: [[10, 8],[10, 9],[10, 10]],
        fruit: [2, 2],
        dir: 'a',
        run: false,
        score: 0,
        dead: false,
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
    // parede
    if (( hx+1 > H || hx < 0) || (hy+1 > V || hy < 0)) this.setState({
      dead: true,
      run: false,
    })

    // corpo
    let s = [...snake];
    s.shift();
    s = JSON.stringify(s);
    const h = JSON.stringify([hx , hy]);
    if ( s.indexOf(h) !== -1) this.setState({dead: true, run: false});

    // fruta
    if(( hx === this.state.fruit[0] && hy === this.state.fruit[1])) {
      this.setState(({score, snake}) => ({
        score: score + 1,
        fruit: this.sorteiaFruta(H, V, snake)
      }));
    } else { // nenhum || morreu
      this.setState(({snake, dead}) => {
        let ps = [...snake];
        if(dead) ps.shift();
        else ps.pop();
        return {snake: ps}
      });
    }
  }

  sorteiaFruta(x, y, a) {
    let ok = false;
    let pos = [];
    while(!ok) {
      pos = sorteiaPos(H, V);
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