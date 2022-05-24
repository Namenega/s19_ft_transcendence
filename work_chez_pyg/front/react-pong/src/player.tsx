module.exports = function(){
  const that: any = this;
  const context = that._context;
  const state = that.state;
  const props = that.props;
  const keystate = that._keystate;
  let py;

  return {
    update() {
      py = state.playery;
      if (keystate[props.upArrow]){
        py = state.playery - props.paddleSpeed;
        that.setState({playery: py});
      }
      if (keystate[props.downArrow]){
        py = state.playery + props.paddleSpeed;
        that.setState({playery: py});
      }
      // keep the paddle inside of the canvas
      py = Math.max(Math.min(py, props.height - props.paddleHeight), 0);
      that.setState({playery: py});

    },
    draw(){
      context.fillRect(state.playerx, state.playery,
        props.paddleWidth, props.paddleHeight);
    },
    name(){
      return 'player';
    },
    position(y: any){
      if(y) {
        that.setState({playery: y});
      }
      return{
        x: state.playerx,
        y: state.playery
      }
    }
  };
};