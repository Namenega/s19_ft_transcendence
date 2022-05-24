module.exports = function () {
  var pi = Math.PI;
  var that: any = this;
  var context = that._context;
  var state = that.state;
  var props = that.props;
  var player = that._player();
  var score = that._score;
  var ai = that._ai();
  var r = Math.random();

  return {
	/* Setting the ball's initial position and velocity. */
    serve: function serve(side: number) {
      var phi = 0.1 * pi * (1 - 2 * r);
      that.setState({
        ballx: side === 1 ? state.playerx + props.paddleWidth : state.aix - props.ballSize,
        bally: (props.height - props.ballSize) * r,
        velx: state.ballSpeed * Math.cos(phi) * side,
        vely: state.ballSpeed * Math.sin(phi)
      });
    },
	/* Updating the ball's position. */
    update: function update() {
      var bx = state.ballx;
      var by = state.bally;
      var vx = state.velx;
      var vy = state.vely;

      that.setState({
        ballx: bx + vx,
        bally: by + vy
      });

	  /* Checking if the ball is hitting the top or bottom of the canvas. If it is, it is reversing the
	  direction of the ball. */
      if (0 > by || by + props.ballSize > props.height) {
        var offset = state.vely < 0 ? 0 - state.bally : props.height - (state.bally + props.ballSize);
        that.setState({
          bally: by + 2 * offset,
          vely: vy * -1
        });
      }

	  /* Checking if the ball is moving to the left or right. If it is moving to the left, it is
	  assigning the player to the variable pdle. If it is moving to the right, it is assigning the
	  ai to the variable pdle. */
      var pdle = state.velx < 0 ? player : ai;

      var AABBIntersect = function AABBIntersect(paddleX: number, paddleY: number, pWidth: any, pHeight: any, bx: number, by: number, bw: any, bh: any) {
        return paddleX < bx + bw && paddleY < by + bh && bx < paddleX + pWidth && by < paddleY + pHeight;
      };

	  /* Checking if the ball is hitting the paddle. */
      if (AABBIntersect(pdle.position().x, pdle.position().y, props.paddleWidth, props.paddleHeight, state.ballx, state.bally, props.ballSize, props.ballSize)) {

		/* Calculating the angle of the ball when it hits the paddle. */
        var dir = state.velx < 0 ? 1 : -1;
        var n = (state.bally + props.ballSize - pdle.position().y) / (props.paddleHeight + props.ballSize);
        var ydir = (n > 0.5 ? -1 : 1) * dir;
        var phi = 0.25 * pi * (2 * n + dir) + r;
        var smash = Math.abs(phi) > 0.2 * pi ? 1.1 : 1;

        that.setState({
          ballx: pdle === player ? state.playerx + props.paddleWidth : state.aix - props.ballSize,
          velx: smash * -1 * state.velx,
          vely: smash * ydir * state.velx * Math.sin(phi)
        });
      }

	  if (0 > state.ballx + props.ballSize || state.ballx > props.width) {
        score(pdle.name());
        this.serve(pdle.name() === player.name() ? 1 : -1);
      }
    },
	/**
	 * "Draw a circle with a radius of props.ballSize at the coordinates state.ballx and state.bally."
	 * 
	 * The first line of the function is a call to the beginPath() method. This method tells the canvas
	 * that we're about to start drawing a new shape
	 */
    draw: function draw() {
      context.beginPath();
      context.arc(state.ballx, state.bally, props.ballSize, 0, 2 * Math.PI);
      context.fill();
      context.lineWidth = 0;
      context.strokeStyle = '#fff';
      context.stroke();
    }
  };
};