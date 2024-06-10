const eventPriorityPlayerValue = 1;

const eventPriorities =
{
  belowCharacters: 0,
  sameAsCharacters: 1,
  aboveCharacters: 2
};


const changeFaceParamIndex = 1;

const generateRandomNumberParam = 2;

const parallelTriggerValue = 4;

const autoRunTriggerValue = 3;


const actionButtonTriggerValue = 0;

const playerTouchTriggerValue = 1;

//Evals

const evalExpressionTypes = {
  button: 11,
};

//Update Frequencies
const lowerFrequency = 2;

// Move speeds

const slowestMoveSpeed = 1;


const textPositions = {
  bottom: 2,
  middle: 1,
  top: 0
};


/// Cardinal Directions

const directions = {
  up: 8,
  right: 6,
  left: 4,
  down: 2,
};

// eval compare codes

const itemCode = 8;

// operation type

const increase = 0;

const decrease = 1;

/// Event Codes

const changeFaceCode = 101;

const makeChoiceCode = 102;

const commentCode = 108;

const evalExpressionCode = 111;

const commonEventCode = 117;

const labelEventCode = 118;

const jumpToLabelEventCode = 119;

const controlSwitchCode = 121;

const controlVariablesCode = 122;

const controlSelfSwitchCode = 123;

const changeItemCode = 126;

const changePartyMemberCode = 129;

const transferPlayerCode = 201;

const moveRouteCode = 205;

const showAnimation = 212;

const waitEventCode = 230;

const showPictureCode = 231;

const playBGMCode = 241;

const playBGSCode = 245;

const playMeCode = 249;

const playSeCode = 250;

const playMovieCode = 261;

const changeTilesetCode = 282;

const changeParallaxCode = 284;

const changeActorImageCode = 322;

const showBattleAnimation = 337;

const pluginCommandCode = 356;

const addTextCode = 401;

const whenCode = 402;

const endChoicesCode = 404;

const nextLineCommentCode = 408;

const elseBlockCode = 411;

const runScriptCode = 655;

//Variable control codes
const changeByConstantCode = 0;

const incrementValueByAmountCode = 1;

module.exports = {
  evalExpressionCode,
  commentCode,
  playMovieCode,
  actionButtonTriggerValue,
  autoRunTriggerValue,
  parallelTriggerValue,
  directions,
  addTextCode,
  controlVariablesCode,
  changeFaceCode,
  waitEventCode,
  commonEventCode,
  runScriptCode,
  changeByConstantCode,
  incrementValueByAmountCode,
  changeParallaxCode,
  playSeCode,
  playBGMCode,
  playBGSCode,
  playMeCode,
  showPictureCode,
  changeTilesetCode,
  slowestMoveSpeed,
  lowerFrequency,
  controlSelfSwitchCode,
  nextLineCommentCode,
  pluginCommandCode,
  showAnimation,
  showBattleAnimation,
  changeActorImageCode,
  controlSwitchCode,
  elseBlockCode,
  itemCode,
  changeItemCode,
  increase,
  decrease,
  evalExpressionTypes,
  transferPlayerCode,
  makeChoiceCode,
  whenCode,
  moveRouteCode,
  eventPriorityPlayerValue,
  changeFaceParamIndex,
  generateRandomNumberParam,
  playerTouchTriggerValue,
  labelEventCode,
  jumpToLabelEventCode,
  textPositions,
  eventPriorities,
  changePartyMemberCode,
  endChoicesCode
};
