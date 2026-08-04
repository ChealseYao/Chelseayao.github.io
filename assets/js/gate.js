// 页面密码门（防君子级别：前端 SHA-256 校验，内容本身未加密）
// 用法：在受保护页面 </body> 前加
//   <script src="../assets/js/gate.js" data-hash="<密码的sha256>"></script>
// 生成哈希：node -e "const c=require('crypto');console.log(c.createHash('sha256').update('你的密码').digest('hex'))"
// 同一浏览器标签页内输对一次即免重输（sessionStorage）
(function(){
  const HASH = document.currentScript.dataset.hash;
  const KEY = "gate:" + location.pathname;

  // 先立刻遮住整页，避免内容闪现
  const style = document.createElement("style");
  style.textContent = `
    #gate{position:fixed;inset:0;background:var(--bg,#1c1e22);z-index:99;
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;}
    #gate .lock{font-size:44px;}
    #gate .tip{font-family:Georgia,"Songti SC",serif;color:#9aa1ab;font-size:14px;letter-spacing:1px;}
    #gate input{background:#282b31;border:1px solid #3a3f48;border-radius:10px;color:#e8eaed;
      font-size:16px;padding:10px 16px;width:220px;text-align:center;outline:none;}
    #gate input:focus{border-color:#4a505a;}
    #gate input.err{border-color:#e06c75;animation:shake .3s;}
    @keyframes shake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  `;
  document.head.appendChild(style);

  const sha = async s => {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  };

  if (sessionStorage.getItem(KEY) === HASH) return;

  const gate = document.createElement("div");
  gate.id = "gate";
  gate.innerHTML = `<div class="lock">🔒</div><div class="tip">This page is private. Enter password</div>
    <input type="password" autofocus>`;
  document.body.appendChild(gate);
  const input = gate.querySelector("input");
  input.focus();

  input.addEventListener("keydown", async e => {
    if (e.key !== "Enter") return;
    if (await sha(input.value) === HASH){
      sessionStorage.setItem(KEY, HASH);
      gate.remove();
    } else {
      input.classList.add("err");
      input.value = "";
      setTimeout(() => input.classList.remove("err"), 350);
    }
  });
})();
