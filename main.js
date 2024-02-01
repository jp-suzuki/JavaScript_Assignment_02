let displayFormula = "";
let lastInput = "default";  //
let hasPoint = false;
let lastChar = "";
let nowTermLength = 0;

//数値表示領域の更新
function refreshDisplay(){
  $(".calculator-display").text(displayFormula);
}
//数値表示領域の初期化
function resetDisplay(){
  displayFormula = "";
  lastInput = "default";
  hasPoint = false;
  $(".calculator-display").text("0");
}
//引数である文字列のうち、一番最後の文字を返す
function getLastChar(displayStrings){
  return displayStrings.charAt(displayStrings.length - 1);
}
//displayFormula変数内にある文字列の最後の文字を削除する
function deleteLastChar(){
  displayFormula = displayFormula.substring(0, displayFormula.length - 1);
}
//displayFormula変数内にある文字列を数式に見立て、最後の項に当たる部分を削除する（電卓の挙動再現）
function deleteLastTerm(){
  for(i = 0; i < nowTermLength; i += 1){
    deleteLastChar();
  }
  nowTermLength = 0;
  if(displayFormula == ""){
    resetDisplay();
  }else{
    lastInput = "operator";
    refreshDisplay();
  }
}
//displayFormula変数内にある文字列の長さと引数の値を比較しbooleanで返す
function checkFormulaLength(maxFormulaLength){
  if(displayFormula.length < maxFormulaLength){
    return false;
  }else{
    return true;
  }
}
//displayFormulaの計算結果を出力し、リセットする
function executeCalculation(){
  if(lastInput == "operator"){
    deleteLastChar();
    console.log('true');
  }
  displayFormula = displayFormula.replaceAll("×", "*");
  displayFormula = displayFormula.replaceAll("÷", "/");
  displayFormula = eval(displayFormula);
  refreshDisplay();
  displayFormula = "";
  lastInput = "default";
  hasPoint = false;
}

function addInputNumber(inputContents){
  //evalで16桁以上の整数値(BigInt)は扱えない(らしい)ため、桁数を制限
  if(checkFormulaLength(15)){
    ; //何もしない
  }else{
    displayFormula += inputContents;
    lastInput = "number";
    nowTermLength += 1;
    refreshDisplay();
  }
}
function addInputZero(inputContents){
  if(checkFormulaLength(15) || lastInput == "default" || lastInput == "operator"){
    ; //何もしない
  }else if(inputContents == "00"){
    //00ボタンを押したときに14桁から16桁にならないよう制限
    if(checkFormulaLength(14)){
      displayFormula += inputContents;
      deleteLastChar();
      nowTermLength += 1;
    }else{
      displayFormula += inputContents;
      nowTermLength += 2;
    }
    lastInput = "number";
    refreshDisplay();
  }else{
    displayFormula += inputContents;
    lastInput = "number";
    nowTermLength += 1;
    refreshDisplay();
  }
}
function addInputPoint(inputContents){
  if(checkFormulaLength(15) || hasPoint){
    ; //何もしない
  }
  //整数を省略して小数点を押したとき、自動で[0.]に補正する（電卓の挙動再現）
  else if(lastInput == "default" || lastInput == "operator"){
    displayFormula += "0" + inputContents;
    lastInput = "point";
    hasPoint = true;
    nowTermLength += 2;
    refreshDisplay();
  }else{
    displayFormula += inputContents;
    lastInput = "point";
    hasPoint = true;
    nowTermLength += 1;
    refreshDisplay();
  }
}
function addInputOperator(inputContents){
  lastChar = getLastChar(displayFormula);
  if(checkFormulaLength(14) || lastInput == "default"){
    ; //何もしない
  }
  //四則演算子を連続で入力したとき、最後の入力のみを適用する（電卓の挙動再現）
  else if(lastInput == "operator"){
    deleteLastChar();
    displayFormula += inputContents;
    lastInput = "operator";
    hasPoint = false;
    refreshDisplay();
  }else {
    if(hasPoint && lastChar == 0){
      //小数点以下の最後の入力が0の時、その0を削除する。小数以下がすべて0の時は小数点も削除する
      while(lastChar == 0 || lastChar == "."){
        deleteLastChar();
        lastChar = getLastChar(displayFormula);
      }
    }else if(hasPoint && lastChar == "."){
      deleteLastChar();
    }
    displayFormula += inputContents;
    lastInput = "operator";
    hasPoint = false;
    nowTermLength = 0;
    refreshDisplay();
  }
}