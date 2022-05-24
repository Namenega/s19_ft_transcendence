Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
 * If the object exists and has a property called `__esModule` that is true, return the object.
 * Otherwise, return the object's `default` property
 * @param {any} obj - any - The object to be checked.
 * @returns The default export of the module.
 */
function _interopRequireDefault(obj: any) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Define a property on an object, and make it enumerable, configurable, and writable.
 * @param {any} obj - The object to define the property on.
 * @param {string} key - The name of the property to be defined or modified.
 * @param {string} value - The value of the property.
 */
function _defineProperty(obj: any, key: string, value: string) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports['default'] = _react2['default'].createClass({
  displayName: 'pong',

  propTypes: {
    height: _react2['default'].PropTypes.number,
    width: _react2['default'].PropTypes.number,
    upArrow: _react2['default'].PropTypes.number,
    downArrow: _react2['default'].PropTypes.number,
    ballSize: _react2['default'].PropTypes.number,
    paddleHeight: _react2['default'].PropTypes.number,
    paddleWidth: _react2['default'].PropTypes.number,
    paddleSpeed: _react2['default'].PropTypes.number
  },
  /* Getting the default props for the component. */
  getDefaultProps: function getDefaultProps() {
    return {
      height: 600,
      width: 700,
      upArrow: 38,
      downArrow: 40,
      paddleHeight: 100,
      paddleWidth: 20,
      paddleSpeed: 5,
      ballSize: 10
    };
  },
  /* Getting the initial state of the game. */
  getInitialState: function getInitialState() {
    return {
      ballx: 100,
      bally: 100,
      ballSpeed: 2,
      velx: 0,
      vely: 0,
      aix: 670,
      aiy: 100,
      playerx: 10,
      playery: 100,
      playerScore: 0,
      aiScore: 0
    };
  },
  /* This is the function that is called when the component is mounted. */
  componentDidMount: function componentDidMount() {
    this._setupCanvas();
    this._context.font = '30px Arial';
    this._context.fillText('Starting Game', this.props.width / 2, this.props.height / 2);

	/* This is setting up the game to start after 1 second. */
    setTimeout(this._startGame, 1000);
  },
  _keystate: {},
  _canvas: undefined,
  _context: undefined,
  _ball: require('./ball'),
  _player: require('./player'),
  _ai: require('./ai'),
  _loop: null,
  _canvasStyle: {
    display: 'block',
    position: 'absolute',
    margin: 'auto',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0'
  },
  /* Setting up the game. */
  _startGame: function _startGame() {
    var _this = this;

    if (this._loop) {
      return;
    }

	/* This is setting up the keyboard and touch events. */
    var keystate = this._keystate;
    document.addEventListener('keydown', function (evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function (evt) {
      delete keystate[evt.keyCode];
    });
    document.addEventListener('ontouchstart', function (e) {
      e.preventDefault();
    }, false);
    document.addEventListener('ontouchmove', function (e) {
      e.preventDefault();
    }, false);

	/* This is setting up the game loop. */
    this._loop = setInterval(function () {
      _this._update();
      _this._draw();
    }, 1);
    this._ball().serve(1);
  },
  /* Stopping the game. */
  _stopGame: function _stopGame() {
    var _this2 = this;

    clearInterval(this._loop);
    this._loop = null;
    setTimeout(function () {
      _this2._context.clearRect(0, 0, _this2._canvas.width, _this2._canvas.height);
    }, 0);
  },
  /* Setting up the canvas. */
  _setupCanvas: function _setupCanvas() {
    this._canvas = this.getDOMNode();
    this._context = this._canvas.getContext('2d');
  },
  /* A function that is called when a player scores. */
  _score: function _score(name: string) {
    var _this3 = this;

    var state = this.state;
    var scorer = ({ player: 'ai', ai: 'player' } as any)[name];
    this.setState(_defineProperty({}, scorer + 'Score', state[scorer + 'Score'] + 1));
    this._stopGame();
	/* Setting the font and text to be displayed when a player scores. */
    setTimeout(function () {
      _this3._context.font = '30px Arial';
      _this3._context.fillText(scorer + ' score!', _this3.props.width / 2, _this3.props.height / 2);
      _this3._context.restore();
    }, 0);

	/* Setting up the canvas and starting the game after 1 second. */
    setTimeout(function () {
      _this3._setupCanvas();
      _this3._startGame();
    }, 1000);
  },
  _draw: function _draw() {
    /* Setting the background color to white. */
    var state = this.state;
    this._context.fillRect(0, 0, this.props.width, this.props.height);
    this._context.save();
    this._context.fillStyle = '#fff';

    /* This is setting the font and text to be displayed when a player scores. */
    this._context.font = '10px Arial';
    this._context.fillText('Player: ' + state.playerScore, 10, 10);
    this._context.fillText('CPU: ' + state.aiScore, 500, 10);

    /* Calling the draw function in the ball.ts file. */
    this._ball().draw();

    /* This is calling the draw function in the player.ts and ai.ts files. */
    this._player().draw();
    this._ai().draw();

    /* This is drawing the net in the middle of the canvas. */
    var w = 4;
    var x = (this.props.width - w) * 0.5;
    var y = 0;
    var step = this.props.height / 20; // how many net segments
    while (y < this.props.height) {
      this._context.fillRect(x, y + step * 0.25, w, step * 0.5);
      y += step;
    }

	/* This is restoring the canvas to its original state. */
    this._context.restore();
  },
  /* This is updating the position of the player and ai. */
  _update: function _update() {
    this._player().update();
    this._ai().update();
    this._ball().update();
  },
  /* This is a function that is called when the user touches the screen. */
  _touch: function _touch(evt: any) {
    console.log(evt);
    var yPos = (evt as any).touches[0].pageY - evt.touches[0].target.offsetTop - this.props.paddleHeight / 2;
    this._player().position(yPos);
  },
  /* Returning the canvas element. */
  render: function render() {
    return _react2['default'].createElement('canvas', {
      onTouchStart: this._touch,
      onTouchMove: this._touch,
      style: this._canvasStyle,
      width: this.props.width,
      height: this.props.height });
  }
});
module.exports = exports['default'];