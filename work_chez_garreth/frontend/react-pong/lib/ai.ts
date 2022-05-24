module.exports = function () {
  var that: any = this;
  var context = that._context;
  var state = that.state;
  var props = that.props;
  var py = undefined;

  return {
	/* Updating the position of the paddle. */
    update: function update() {
      py = state.aiy;
      var desty = state.bally - (props.paddleHeight - props.ballSize) * 0.5;
      py = py + (desty - py) * 0.1;
      that.setState({ aiy: py });
    },
    /* Drawing the paddle. */
	draw: function draw() {
      context.fillRect(state.aix, state.aiy, props.paddleWidth, props.paddleHeight);
    },
    /* Returning the name of the paddle. */
	name: function name() {
      return 'ai';
    },
    /* Returning the position of the paddle. */
	position: function position() {
      return {
        x: state.aix,
        y: state.aiy
      };
    }
  };
};