// the main game engine
import React, { Component, PropTypes } from 'react';
import { Loop, World, Body } from 'react-game-kit';
import GameBackground from './GameBackground';
import Ship from './Ship';
import { tick } from '../Actions/tick';
import { spawnUFO } from '../Actions/ufo';
import connect from '../../Lib/connect';
import MouseCapture from './MouseCapture';
import UFO from './UFO';

const TEXT_STYLE = {
  position: 'absolute',
  top: 10,
  left: 0,
  right: 0,
  margin: 'auto',
  color: 'white',
  textAlign: 'center',
  fontSize: '24px',
};
const UFO_CONTAINER_STYLE = {
  position: 'absolute',
  top: 50,
  left: '50%',
  marginLeft: -91 / 2,
};
const SHIP_CONTAINER_STYLE = {
  position: 'absolute',
  bottom: 20,
  left: '50%',
  marginLeft: -98 / 2,
};

class Engine extends Component {
  static MAX_TICKS = 100;
  static contextTypes = {
    loop: PropTypes.object,
  };

  static propTypes = {
    ufos: PropTypes.objectOf(PropTypes.shape(UFO.propTypes)).isRequired,
    onTick: PropTypes.func.isRequired,
    spawnEnemy: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      tick: 1,
    };
  }

  update() {
    const tick = (this.state.tick + 1) % Engine.MAX_TICKS;
    this.setState({
      tick,
    });
    this.props.onTick();
  };

  componentDidMount() {
    this.context.loop.subscribe(this.update);

    this.props.spawnEnemy();
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update);
  }

  render() {
    const { tick } = this.state;
    const { ufos } = this.props;
    // place things like <World>, <Body>, etc here
    return (
      <MouseCapture>
        <World>
          <GameBackground src={'black.png'} repeat position={tick}>
            <div style={ TEXT_STYLE }>We are in the game! {tick}</div>
            <div style={ UFO_CONTAINER_STYLE }>
              {Object.keys(ufos).map((key) => {
                const ufo = ufos[key];
                return <UFO key={key} {...ufo} />;
              })}
            </div>
            <div style={ SHIP_CONTAINER_STYLE }>
              <Ship />
            </div>
          </GameBackground>
        </World>
      </MouseCapture>
    );
  }
  static mapStateToProps = (state, ownProps) => {
    const { ships } = state.ufo;
    return {
      ufos: ships,
      ...ownProps,
    };
  };
  static mapDispatchToProps = (dispatch, ownProps) => ({
    spawnEnemy: () => dispatch(spawnUFO()),
    onTick: (state) => dispatch(tick(state)),
  });
  static mergeProps = (state, dispatch, ownProps) => ({
    ...state,
    ...dispatch,
    onTick: () => dispatch.onTick(state),
    ...ownProps,
  });
}

export default connect(Engine);
