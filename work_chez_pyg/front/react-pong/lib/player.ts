module.exports = function () {
  var that: any = this;
  var context = that._context;
  var state = that.state;
  var props = that.props;
  var keystate = that._keystate;
  var py = undefined;

  return {
    update: function update() {
      py = state.playery;
      if (keystate[props.upArrow]) {
        py = state.playery - props.paddleSpeed;
        that.setState({ playery: py });
      }
      if (keystate[props.downArrow]) {
        py = state.playery + props.paddleSpeed;
        that.setState({ playery: py });
      }
      // keep the paddle inside of the canvas
      py = Math.max(Math.min(py, props.height - props.paddleHeight), 0);
      that.setState({ playery: py });
    },
    draw: function draw() {
      context.fillRect(state.playerx, state.playery, props.paddleWidth, props.paddleHeight);
    },
    name: function name() {
      return 'player';
    },
    position: function position(y: any) {
      if (y) {
        that.setState({ playery: y });
      }
      return {
        x: state.playerx,
        y: state.playery
      };
    }
  };
};