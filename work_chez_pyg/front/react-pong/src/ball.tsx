module.exports = function(){
  const pi = Math.PI;
  const that: any = this;
  const context = that._context;
  const state = that.state;
  const props = that.props;
  const player = that._player();
  const score = that._score;
  const ai = that._ai();

  const r = Math.random();

  return {
    serve(side: number){
      const phi = 0.1*pi*(1 - 2*r);
      that.setState({
        ballx: side === 1 ? state.playerx + props.paddleWidth : state.aix - props.ballSize,
        bally: (props.height - props.ballSize) * r,
        velx: state.ballSpeed * Math.cos(phi) * side,
        vely: state.ballSpeed * Math.sin(phi)
      });
    },
    update() {
      const bx = state.ballx;
      const by = state.bally;
      const vx = state.velx;
      const vy = state.vely;

      that.setState({
        ballx: bx + vx,
        bally: by + vy
      });

      if (0 > by || by + props.ballSize > props.height) {
        const offset = state.vely < 0 ? 0 - state.bally : props.height - (state.bally+props.ballSize);
        that.setState({
          bally: by + 2 * offset,
          vely: vy * -1
        });
      }

      const pdle = state.velx < 0 ? player : ai;

      const AABBIntersect = (paddleX: number, paddleY: number, pWidth: any, pHeight: any, bx: number, by: number, bw: any, bh: any) => {
        return paddleX < bx + bw &&
          paddleY < by + bh &&
          bx < paddleX + pWidth &&
          by < paddleY + pHeight;
      };
      if (AABBIntersect(pdle.position().x, pdle.position().y, props.paddleWidth, props.paddleHeight,
          state.ballx, state.bally, props.ballSize, props.ballSize)) {

        const dir = state.velx < 0 ? 1 : -1;
        const n = ( state.bally + props.ballSize - pdle.position().y )/( props.paddleHeight + props.ballSize );
        const ydir = ( n > 0.5 ? -1 : 1 ) * dir;
        const phi = (0.25 * pi) * ( 2 * n + dir ) + r;
        const smash = Math.abs(phi) > 0.2 * pi ? 1.1 : 1;

        that.setState({
          ballx: pdle === player ?
          state.playerx + props.paddleWidth : state.aix - props.ballSize,
          velx: smash * -1 * state.velx,
          vely: smash * ydir * state.velx * Math.sin(phi)
        });
      }

      if (0 > state.ballx + props.ballSize || state.ballx > props.width) {
        score(pdle.name());
        this.serve( pdle.name() === player.name() ? 1 : -1);
      }
    },
    draw(){
      context.beginPath();
      context.arc(state.ballx, state.bally, props.ballSize, 0, 2 * Math.PI);
      context.fill();
      context.lineWidth = 0;
      context.strokeStyle = '#fff';
      context.stroke();
    }
  };
};