"use strict";
const huPlayer = "O"; // 人間
const aiPlayer = "X"; // コンピュータ
const h1 = document.querySelector("h1");
const h3 = document.querySelector("h2");
const btn = document.getElementById("btn");
btn.addEventListener("click", start);
const mainGame = document.getElementById("mainGame");
let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// ゲーム画面作成
function init() {
  for (let i = 0; i < board.length; i++) {
    const field = document.createElement("div");
    field.classList.add("field");
    field.id = i;
    field.addEventListener("click", playerClick);
    mainGame.appendChild(field);
  }
}
init();

// スタート画面で先手後手が選択された時の処理
function start(e) {
  if (e.target.id === "first") {
    turn_action(huPlayer);
    mainGame.classList.toggle("disable");
  } else {
    turn_action(aiPlayer);
    bestSpot();
  }
  btn.removeEventListener("click", start);
  h1.textContent = "三目並べ対戦中";
  h3.classList.toggle("hide");
}

// コンピュータの指し手
function bestSpot() {
  let bestSpot;
  setTimeout(() => {
    // コンピュータが先手の場合は初手だけランダムで指す
    if (emptyIndexies(board).length === 9) {
      bestSpot = Math.floor(Math.random() * 9);
    } else {
      bestSpot = minimax(board, aiPlayer).index;
    }
    mainGame.children[bestSpot].classList.add("com");
    board[bestSpot] = aiPlayer;
    turn_action(huPlayer);
    if (winning(board, aiPlayer)) {
      h1.textContent = "コンピュータの勝ちです";
      end();
      return;
    } else if (checkTie(board)) {
      h1.textContent = "引き分けです";
      end();
      return;
    }
    mainGame.classList.toggle("disable");
  }, 1000);
}

// ゲーム終了画面
function end() {
  h3.classList.toggle("hide");
  first.textContent = "もう一度対戦する";
  first.addEventListener("click", () => {
    document.location.reload();
  });
  second.textContent = "HOMEへ戻る";
  second.addEventListener("click", () => {
    location.href = "https://bubudoufu.com/webapp/";
  });
}

// 空いているマスを探す
function emptyIndexies(board) {
  return board.filter((s) => s != "O" && s != "X");
}

// 手番表示
function turn_action(player) {
  if (player === huPlayer) {
    h3.textContent = "あなたの番です";
  } else {
    h3.textContent = "コンピューターの番です";
  }
}

// 人間の指し手
function playerClick(e) {
  mainGame.classList.toggle("disable");
  let num = Number(e.target.id);
  if (board.includes(num)) {
    e.target.classList.add("player");
    board[num] = huPlayer;
  }
  if (winning(board, huPlayer)) {
    h1.textContent = "あなたの勝ちです";
    end();
    return;
  } else if (checkTie(board)) {
    h1.textContent = "引き分けです";
    end();
    return;
  }
  turn_action(aiPlayer);
  bestSpot();
}

// 勝敗を調べる
function winning(board, player) {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
}

//　引き分けか調べる
function checkTie(board) {
  if (emptyIndexies(board).length === 0) {
    return true;
  }
}

// ミニマックス関数
function minimax(board, player) {
  // 空いているマスを探す
  let emptyIndex = emptyIndexies(board);
  // 一番いい差し手と点数を保持
  let best = {};
  // 勝敗がついた時の点数を保持
  let result = {};
  // 初期値設定
  if (player == aiPlayer) {
    best.score = -1000;
  } else {
    best.score = 1000;
  }

  // 勝ち、負け、引き分けなどに応じて評価値を付ける
  if (winning(board, huPlayer)) {
    return { score: -10 };
  } else if (winning(board, aiPlayer)) {
    return { score: 10 };
  } else if (emptyIndex.length === 0) {
    return { score: 0 };
  }

  emptyIndex.forEach(function (cell) {
    // マスに置く
    board[cell] = player;
    // 手番を変えて再度minimax関数を実行する
    if (player == aiPlayer) {
      result = minimax(board, huPlayer);
    } else {
      result = minimax(board, aiPlayer);
    }
    // 置いたマスを空にする
    board[cell] = cell;
    // 置いた場所を保持
    result.index = cell;

    // minimax
    if (player == aiPlayer) {
      if (result.score > best.score) best = result;
    } else {
      if (result.score < best.score) best = result;
    }
  });

  return best;
}

