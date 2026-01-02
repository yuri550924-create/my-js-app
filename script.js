// 設問文（各設問の選択肢4つ）
const questions = [
  [
    "①心にしみる感じがあるかどうかで決める（腑に落ちる感じ）",
    "②どちらが「聞いた感じがよいか」で決める",
    "③どちらが「見た感じがよいか」で決める",
    "④その内容をよく調べて、検討してから決める"
  ],
  [
    "①相手の声の大きさや、トーンである",
    "②相手の表情や見た感じ、論点が見えているかである",
    "③相手の内容に論理性があるかどうかである",
    "④相手の気持ちと本当にコンタクトがとれているかどうかである"
  ],
  [
    "①着る服や外見で、最もよく表現している",
    "②感情を表すことで、最もよく表現している",
    "③言葉の選び方で、最もよく表現している",
    "④声の調子で、最もよく表現している"
  ],
  [
    "①与えられた情況に合う音楽を選ぶことが得意である",
    "②興味深いテーマに関係した知的な話題を選ぶことが得意である",
    "③座り心地がよいイスを選ぶことが得意である",
    "④魅力的で豊かな色の組み合わせを選ぶことが得意である"
  ],
  [
    "①周りの音に敏感である",
    "②新しい事実やデータを理解することが得意である",
    "③衣服の着心地に敏感である",
    "④色使いや、部屋の外見に敏感である"
  ]
];

//質問の内容
const naiyou = [
"決断を下すときには",
"人と議論をするとき、最も影響されるのは？",
"自分の気持ちは",
"私はどちらかというと",
"私は",
];

// 設問ごとの グループ割り当て（順番通り）
const groupMap = [
  ["K", "A", "V", "AD"],   // 設問1
  ["A", "V", "AD", "K"],   // 設問2
  ["V", "K", "AD", "A"],   // 設問3
  ["A", "AD", "K", "V"],   // 設問4
  ["A", "AD", "K", "V"]    // 設問5
];

//最初の記入中はカーソル移動しない
let autoMoveEnabled = false;

// ▼ radioボタン生成
function createSelect(name) {
  return `
      <label><input type="radio" name="${name}" value="1">1</label>
      <label><input type="radio" name="${name}" value="2">2</label>
      <label><input type="radio" name="${name}" value="3">3</label>
      <label><input type="radio" name="${name}" value="4">4</label>
  `;
}

// ▼ 設問の描画
function renderForm() {
  const area = document.getElementById("form-area");
  area.innerHTML = "";

  questions.forEach((items, qi) => {
    const div = document.createElement("div");
    div.className = "question";

    let html = `<p><b>【質問 ${qi + 1}】</b> ${naiyou[qi]}</p>`;

    items.forEach((text, i) => {
      const name = `q${qi}-a${i}`;
      html += `
        <div class="select-row">
          ${text}<br>
          ${createSelect(name)}
        </div>
      `;
    });

    div.innerHTML = html;
    area.appendChild(div);
  });
  //次の未入力箇所にカーソルを動かす
  setupAutoMove();
}
renderForm();

//次の未入力箇所にカーソルを動かす
function setupAutoMove() {
  const radios = document.querySelectorAll('input[type="radio"]');

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
    showMessage("", ""); // ← メッセージ消去

    // ★ ここで赤表示を解除
  	const row = radio.closest(".select-row");
  	row.classList.remove("unanswered");
    // ★ フラグがONのときだけ動かす
    if (autoMoveEnabled) {
         const hasNext = moveToNextUnanswered();
    if (!hasNext) {
		showMessage("すべての項目が入力されました！", "success");
	}

    }
  });
  });
}

//アラートでなくメッセージ表示にする
function showMessage(text, type = "error") {
  const area = document.getElementById("messageArea");
  area.textContent = text;
  area.className = `message fixed ${type}`;
  area.style.display = "block";
}
//メッセージ非表示にする
function hideMessage() {
  const area = document.getElementById("messageArea");
  area.style.display = "none";
}

function moveToNextUnanswered() {
  const rows = document.querySelectorAll(".select-row");

  for (const row of rows) {
    const radios = row.querySelectorAll('input[type="radio"]');
    const checked = Array.from(radios).some(r => r.checked);

    // 未入力のブロックを見つけたら
    if (!checked) {
      radios[0].focus();
      radios[0].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return true;  //←未入力がまだある
    }
  }
  return false;  // ←すべて入力済み
  }

// ▼ 集計
function calculate() {
 let hasUnanswered = false;
 let firstUnansweredRadio = null;
 
  questions.forEach((q, qi) => {
    q.forEach((_, i) => {
      const name = `q${qi}-a${i}`;
      const radios = document.querySelectorAll(`input[name="${name}"]`);
      const row = radios[0].closest(".select-row");

      // いったん未回答クラスを外す
      row.classList.remove("unanswered");

      // この①～④ブロックに1つでもチェックがあるか？
      const checked = Array.from(radios).some(r => r.checked);

      if (!checked) {
        row.classList.add("unanswered");
        hasUnanswered = true;
      if (!firstUnansweredRadio) {
          firstUnansweredRadio = radios[0];
        }
      }
    });
  });

  if (hasUnanswered) {
	showMessage(
  		"未選択の項目があります。赤く表示された部分を選択してください。",
  		"error"
	);

    
    // ★ ここで自動移動を有効化
   autoMoveEnabled = true;

    //未入力部分の最初にフォーカスする
    firstUnansweredRadio.focus();

    firstUnansweredRadio.scrollIntoView({
      behavior: "smooth",
      block: "center"
  });

  return;
  }

  const score = { V: 0, A: 0, K: 0, AD: 0 };

 questions.forEach((q, qi) => {
  for (let i = 0; i < 4; i++) {
      const name = `q${qi}-a${i}`;
      const selected = document.querySelector(`input[name="${name}"]:checked`);
      const v = selected ? Number(selected.value) : 0;
      const group = groupMap[qi][i];
      score[group] += v;
    }
  });

  // 最大点を取得
  const maxScore = Math.max(score.V, score.A, score.K, score.AD);
  const resultTypes = Object.keys(score).filter(key => score[key] === maxScore);

  // 結果出力
  const r = document.getElementById("result");
  r.innerHTML = `
    <table class = "score-table">
    	<colgroup class ="zokusei" span ="1">
    	</colgroup>
    	<tr>
    		<th>属性</th>
    		<th>点数</th>
    	</tr>
    	<tr>
    		<th><div class="result">V</div></th>
    		<td>${score.V}点</td>
    	</tr>	
    	<tr>	
    		<th><div class="result">A</div></th>
    		<td>${score.A}点</td>
    	</tr>	
    	<tr>
    		<th><div class="result">K</div></th>
    		<td>${score.K}点</td>
    	</tr>	
    	<tr>
    		<th><div class="result">AD</div></th>
    		<td>${score.AD}点</td>
    	</tr>
    </table>
    
    <hr>
    
    <div id="resultType"><b>あなたのタイプ：</b> ${resultTypes.join("・")}</div>
	`;
	
	// 画像＋説明文の表示 ----------
  const imageMap = {
    V: "images/かわいい目.png",
    A: "images/かわいい耳.png",
    K: "images/かわいい手.png",
    AD: "images/かわいい口.png",
  };

  const descriptionMap = {
    V: "視覚優位の人：思考を画面にして考えるので、話の進みが早いタイプです。",
    A: "聴覚優位の人：音や声のトーンに敏感なタイプです。",
    K: "身体感覚優位の人：情熱的に身体感覚を使った言葉で説明するタイプです。",
    AD: "言語優位の人：頭の中で論理的に考えるタイプです。",
  };

  const imageArea = document.getElementById("resultImages");
  imageArea.innerHTML = "";

  resultTypes.forEach(type => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("result-card");

    const img = document.createElement("img");
    img.src = imageMap[type];
    img.classList.add("result-img");

    const desc = document.createElement("p");
    desc.classList.add("result-desc");
    desc.textContent = descriptionMap[type];

    wrapper.appendChild(img);
    wrapper.appendChild(desc);
    imageArea.appendChild(wrapper);
  });

// ★ 判定結果エリアを表示（②）
	document.getElementById("resultArea").style.display = "flex";
	
// ★ 判定結果エリアへスクロール（おすすめ位置）
	document.getElementById("resultType").scrollIntoView({
  	behavior: "smooth",
  	block: "center"
	});
}

//最初からボタンを押すと入力がリセットされる
function reset() {
  // ① ラジオボタンのチェックをすべて外す
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.checked = false;
  });

  // ② 赤表示（未入力）をすべて解除
  document.querySelectorAll(".select-row").forEach(row => {
    row.classList.remove("unanswered");
  });

  // ③ 結果表示をクリア
  document.getElementById("result").innerHTML = "";
  document.getElementById("resultImages").innerHTML = "";

  // ④ メッセージを消す
  hideMessage();

  // ⑤ 自動カーソル移動をOFFに戻す
  autoMoveEnabled = false;

  // ⑥ ページ上部へ戻す（任意）
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

