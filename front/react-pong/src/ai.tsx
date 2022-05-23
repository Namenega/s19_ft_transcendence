module.exports = function(){
  var that: any = this;
  const context = that._context;
  const state = that.state;
  const props = that.props;
  let py;

  return {
    update: function() {
      py = state.aiy
      const desty = state.bally - (props.paddleHeight - props.ballSize)*0.5;
      py = py + (desty - py) * 0.1
      that.setState({aiy: py})
    },
    draw(){
      context.fillRect( state.aix, state.aiy,
        props.paddleWidth, props.paddleHeight);
    },
    name(){
      return 'ai';
    },
    position(){
      return{
        x: state.aix,
        y: state.aiy
      }
    }
  };
};