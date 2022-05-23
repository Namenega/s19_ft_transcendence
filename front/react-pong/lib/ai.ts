module.exports = function () {
  var that: any = this;
  var context = that._context;
  var state = that.state;
  var props = that.props;
  var py = undefined;

  return {
    update: function update() {
      py = state.aiy;
      var desty = state.bally - (props.paddleHeight - props.ballSize) * 0.5;
      py = py + (desty - py) * 0.1;
      that.setState({ aiy: py });
    },
    draw: function draw() {
      context.fillRect(state.aix, state.aiy, props.paddleWidth, props.paddleHeight);
    },
    name: function name() {
      return 'ai';
    },
    position: function position() {
      return {
        x: state.aix,
        y: state.aiy
      };
    }
  };
};