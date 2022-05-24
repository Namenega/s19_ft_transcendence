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
      /* Checking if the up arrow is pressed. If it is, then it sets the playery to the current playery
	  minus the paddle speed. */
	  if (keystate[props.upArrow]){
        py = state.playery - props.paddleSpeed;
        that.setState({playery: py});
      }
      /* Checking if the down arrow is pressed. If it is, then it sets the playery to the current
	  playery plus the paddle speed. */
	  if (keystate[props.downArrow]){
        py = state.playery + props.paddleSpeed;
        that.setState({playery: py});
      }
      /* Making sure that the paddle does not go off the screen. */
	  py = Math.max(Math.min(py, props.height - props.paddleHeight), 0);
      that.setState({playery: py});
    },
    /* Drawing the paddle. */
	draw(){
      context.fillRect(state.playerx, state.playery,
        props.paddleWidth, props.paddleHeight);
    },
    /* Returning the name of the player. */
	name(){
      return 'player';
    },
	/* A function that takes in a parameter of y. If y is true, then it sets the state of playery to y. If
	y is false, then it returns an object with the x and y coordinates of the player. */
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