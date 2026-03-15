const { cmd } = require("../command");
const axios = require("axios");

const games = {}
const guessGames = {}
const rpsGames = {}
const slotGames = {}
const rpgGames = {}
const triviaGames = {}
const scrambleGames = {}
const globalCoins = {}
const globalXP = {}
const dailyClaim = {}
const LEVEL_XP = 100
const shopItems = {
  "extra_attempt": {name:"Extra Attempt", price:50, desc:"Add 1 extra attempt for Guess/Trivia/Word Scramble"},
  "bonus_damage": {name:"Bonus Damage", price:100, desc:"Increase your attack damage by +10 in RPG Battle"},
  "auto_win_ttt": {name:"Auto Win TicTacToe", price:200, desc:"Instantly win your next TicTacToe game"},
  "hint_trivia": {name:"Trivia Hint", price:30, desc:"Get a hint for your Trivia question"},
}
const userInventory = {}

//------------------HELPER FUNCTIONS--------------------
function randomXP(min,max){ return Math.floor(Math.random()*(max-min+1))+min }
function checkWinner(board){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  for(let [a,b,c] of wins) if(board[a] && board[a]===board[b] && board[a]===board[c]) return board[a]
  if(board.every(x=>x)) return "draw"
  return null
}
function minimax(board,isAI){
  let winner=checkWinner(board)
  if(winner==="⭕") return 10
  if(winner==="❌") return -10
  if(winner==="draw") return 0
  let bestScore=isAI?-Infinity:Infinity
  for(let i=0;i<9;i++){
    if(!board[i]){
      board[i]=isAI?"⭕":"❌"
      let score=minimax(board,!isAI)
      board[i]=null
      bestScore=isAI?Math.max(score,bestScore):Math.min(score,bestScore)
    }
  }
  return bestScore
}
function aiMove(board){
  let bestScore=-Infinity, move
  for(let i=0;i<9;i++){
    if(!board[i]){
      board[i]="⭕"
      let score=minimax(board,false)
      board[i]=null
      if(score>bestScore){ bestScore=score; move=i }
    }
  }
  return move
}

//--------------------------------------------------------
cmd({
  pattern:"use",
  react:"🛠️",
  desc:"Use an item from your inventory",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{from,sender,args})=>{
  if(!args[0]) return await conn.sendMessage(from,{text:"❌ Use .use <item_key>"},{quoted:m})
  const itemKey = args[0].toLowerCase()
  if(!userInventory[sender] || !userInventory[sender][itemKey] || userInventory[sender][itemKey]<=0){
    return await conn.sendMessage(from,{text:"❌ You don't own this item"},{quoted:m})
  }

  let applied=false
  if(itemKey==="extra_attempt"){
    if(guessGames[sender]) guessGames[sender].attempts+=1, applied=true
    if(triviaGames[sender]) triviaGames[sender].attempts+=1, applied=true
    if(scrambleGames[sender]) scrambleGames[sender].attempts+=1, applied=true
    if(applied) await conn.sendMessage(from,{text:"✅ Extra Attempt applied!"},{quoted:m})
    else await conn.sendMessage(from,{text:"❌ No active game to apply Extra Attempt"},{quoted:m})
  }

  if(itemKey==="bonus_damage"){
    if(rpgGames[sender]){ rpgGames[sender].playerBonusDamage=(rpgGames[sender].playerBonusDamage||0)+10; applied=true }
    if(applied) await conn.sendMessage(from,{text:"✅ Bonus Damage applied! +10 in RPG battle"},{quoted:m})
    else await conn.sendMessage(from,{text:"❌ No active RPG battle"},{quoted:m})
  }

  if(itemKey==="auto_win_ttt"){
    if(games[sender]){ delete games[sender]; globalCoins[sender]+=(globalCoins[sender]||0)+50; applied=true }
    if(applied) await conn.sendMessage(from,{text:"🎉 Instantly won TicTacToe! +50 coins"},{quoted:m})
    else await conn.sendMessage(from,{text:"❌ No active TicTacToe game"},{quoted:m})
  }

  if(itemKey==="hint_trivia"){
    if(triviaGames[sender]){
      const answer=triviaGames[sender].answer
      const hint=answer[0]+"*".repeat(answer.length-1)
      await conn.sendMessage(from,{text:`💡 Trivia Hint: ${hint}`},{quoted:m})
      applied=true
    } else await conn.sendMessage(from,{text:"❌ No active Trivia game"},{quoted:m})
  }

  if(applied) userInventory[sender][itemKey]-=1
})

//--------------------------------------------------------
cmd({
  pattern:"ttt",
  react:"❌",
  desc:"Play TicTacToe vs AI",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{from,sender})=>{
  let board=Array(9).fill(null)
  games[sender]={board}
  const boardText=board.map((c,i)=>c||i+1).reduce((acc,c,i)=>acc + (i%3===2? `${c}\n`:`${c} | `), "")
  await conn.sendMessage(from,{text:`🎮 *TIC TAC TOE vs AI*\n\n${boardText}\nYou are ❌\nSend a number (1-9) to play.`},{quoted:mek})
})

//--------------------------------------------------------
cmd({
  pattern:"rps",
  react:"✊",
  desc:"Play Rock Paper Scissors vs AI",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{from,sender,args})=>{
  if(!globalCoins[sender]) globalCoins[sender]=0
  if(!globalXP[sender]) globalXP[sender]=0
  let choices=["rock","paper","scissors"]
  let ai=choices[Math.floor(Math.random()*3)]
  let user=args[0]?.toLowerCase()
  if(!user || !choices.includes(user)) return conn.sendMessage(from,{text:"Use .rps rock/paper/scissors"},{quoted:mek})
  let result=""
  if(user===ai) result="🤝 Draw"
  else if((user==="rock"&&ai==="scissors")||(user==="paper"&&ai==="rock")||(user==="scissors"&&ai==="paper")){
    result="🎉 You win"
    globalCoins[sender]+=20
    globalXP[sender]+=randomXP(5,15)
  } else {
    result="🤖 AI wins"
    globalCoins[sender]-=10
    globalXP[sender]+=randomXP(2,10)
  }
  await conn.sendMessage(from,{text:`✊ *RPS vs AI*\n\n👤 You: ${user}\n🤖 AI: ${ai}\n\n${result}\n💰 Coins: ${globalCoins[sender]}\n🧠 XP: ${globalXP[sender]}`},{quoted:mek})
})

//--------------------------------------------------------
const guessScores = {}; // { senderId: { score: number, correct: number, wrong: number } }

cmd({
  pattern: "guess",
  react: "🎯",
  desc: "Guess a number 1-10 with scoring",
  category: "games",
  filename: __filename,
}, async (conn, mek, m, { from, sender }) => {
  try {
    // Generate random number 1-10
    const number = Math.floor(Math.random() * 10) + 1;
    guessGames[sender] = { number, attempts: 3 };

    await conn.sendMessage(from, {
      text: "🎯 Guess a number between 1-10. You have 3 attempts!"
    }, { quoted: mek });

    // Handler for user guesses
    const handler = async (chatUpdate) => {
      const keySender = chatUpdate.key.fromMe ? conn.user.jid : chatUpdate.key.participant;
      if (keySender !== sender) return;

      const text = chatUpdate.message?.conversation?.trim();
      if (!text) return;

      const game = guessGames[sender];
      if (!game) return;

      const guess = parseInt(text);
      if (isNaN(guess) || guess < 1 || guess > 10) {
        await conn.sendMessage(from, { text: "❌ Invalid input! Reply with a number between 1 and 10." }, { quoted: chatUpdate });
        return;
      }

      // Initialize user score if not exists
      if (!guessScores[sender]) guessScores[sender] = { score: 0, correct: 0, wrong: 0 };

      if (guess === game.number) {
        guessScores[sender].score += 5;
        guessScores[sender].correct += 1;

        await conn.sendMessage(from, { text: `🎉 Correct! The number was ${game.number}.\n✅ Your score: ${guessScores[sender].score} points` }, { quoted: chatUpdate });
        delete guessGames[sender];
        conn.ev.off("messages.upsert", handler);
      } else {
        game.attempts--;
        guessScores[sender].wrong += 1;

        if (game.attempts <= 0) {
          await conn.sendMessage(from, { text: `❌ Out of attempts! The number was ${game.number}.\n✅ Your score: ${guessScores[sender].score} points` }, { quoted: chatUpdate });
          delete guessGames[sender];
          conn.ev.off("messages.upsert", handler);
        } else {
          const hint = guess < game.number ? "Too low!" : "Too high!";
          await conn.sendMessage(from, { text: `❌ ${hint} Attempts left: ${game.attempts}` }, { quoted: chatUpdate });
        }
      }
    };

    conn.ev.on("messages.upsert", handler);

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Failed to start the game. Try again later." }, { quoted: mek });
  }
});
//--------------------------------------------------------
cmd({
  pattern:"slot",
  react:"🎰",
  desc:"Play Slot Machine vs AI",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{from,sender})=>{
  if(!globalCoins[sender]) globalCoins[sender]=100
  if(!globalXP[sender]) globalXP[sender]=0
  const items=["🍒","🍋","💎","7️⃣","🍀"]
  const a=items[Math.floor(Math.random()*items.length)]
  const b=items[Math.floor(Math.random()*items.length)]
  const c=items[Math.floor(Math.random()*items.length)]
  let coinsChange=0,xpGain=5,resultText=""
  if(a===b && b===c){ resultText="🎉 Jackpot! All match!"; coinsChange=100; xpGain+=randomXP(10,20) }
  else if(a===b || b===c || a===c){ resultText="✨ Two match!"; coinsChange=30; xpGain+=randomXP(5,15) }
  else{ resultText="❌ No match"; coinsChange=-10 }
  globalCoins[sender]+=coinsChange
  globalXP[sender]+=xpGain
  await conn.sendMessage(from,{text:`🎰 *SLOT MACHINE*\n\n${a} | ${b} | ${c}\n\n${resultText}\n💰 Coins: ${globalCoins[sender]}\n🧠 XP: ${globalXP[sender]}`},{quoted:mek})
})

//--------------------------------------------------------
cmd({
  pattern:"rpg",
  react:"⚔️",
  desc:"Start RPG battle vs AI",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{from,sender})=>{
  rpgGames[sender]={playerHP:100, aiHP:100, turn:"player"}
  await conn.sendMessage(from,{text:`⚔️ *RPG Battle Started!*\n👤 Your HP: 100 ❤️\n🤖 AI HP: 100 ❤️\n🚀 Send .attack to attack the AI.`},{quoted:mek})
})

cmd({
  pattern:"attack",
  react:"🔥",
  desc:"Attack AI in RPG",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{from,sender})=>{
  if(!rpgGames[sender]) return await conn.sendMessage(from,{text:"❌ Not in battle. Start .rpg"},{quoted:mek})
  let game=rpgGames[sender]
  if(game.turn!=="player") return await conn.sendMessage(from,{text:"⏳ Wait your turn!"},{quoted:mek})
  let playerDamage=Math.floor(Math.random()*20)+10+(game.playerBonusDamage||0)
  game.aiHP-=playerDamage
  let msg=`⚔️ You attack AI for ${playerDamage} damage!\n🤖 AI HP: ${Math.max(game.aiHP,0)} ❤️`
  if(game.aiHP<=0){
    let coins=50,xp=randomXP(20,50)
    globalCoins[sender]+=(globalCoins[sender]||0)+coins
    globalXP[sender]+=(globalXP[sender]||0)+xp
    delete rpgGames[sender]
    msg+=`\n🎉 You defeated AI! +${coins} coins, +${xp} XP`
    return await conn.sendMessage(from,{text:msg},{quoted:mek})
  }
  game.turn="ai"
  let aiDamage=Math.floor(Math.random()*15)+5
  game.playerHP-=aiDamage
  msg+=`\n🤖 AI attacks you for ${aiDamage} damage!\n👤 Your HP: ${Math.max(game.playerHP,0)} ❤️`
  if(game.playerHP<=0){
    let coins=-20,xp=randomXP(5,20)
    globalCoins[sender]+=(globalCoins[sender]||0)+coins
    globalXP[sender]+=(globalXP[sender]||0)+xp
    delete rpgGames[sender]
    msg+=`\n💀 You were defeated! ${coins} coins, +${xp} XP`
  } else game.turn="player"
  await conn.sendMessage(from,{text:msg},{quoted:mek})
})

//==================== TRIVIA COMMAND ====================//
// In-memory score tracker
const triviaScores = {}; // { senderId: { score: number, correct: number, wrong: number } }

cmd({
  pattern: "trivia",
  react: "🧠",
  desc: "Start Trivia Quiz with category, difficulty & scoring",
  category: "games",
  filename: __filename,
}, async (conn, mek, m, { from, sender }) => {
  try {
    // Step 1: Category selection
    const categories = {
      1: "General Knowledge",
      2: "Science & Nature",
      3: "Sports",
      4: "History",
      5: "Geography",
      6: "Entertainment: Film"
    };

    const categoryText = Object.entries(categories)
      .map(([id, name]) => `${id}. ${name}`)
      .join("\n");

    await conn.sendMessage(from, {
      text: `🧠 *Trivia Quiz Setup*\n\nChoose a category by replying with the number:\n${categoryText}`
    }, { quoted: mek });

    const categoryHandler = async (catReply) => {
      const keySender = catReply.key.fromMe ? conn.user.jid : catReply.key.participant;
      if (keySender !== sender) return;

      const choice = parseInt(catReply.message?.conversation?.trim());
      if (!choice || !categories[choice]) {
        await conn.sendMessage(from, { text: "❌ Invalid category number. Try again." }, { quoted: catReply });
        return;
      }

      const selectedCategory = choice;
      conn.ev.off("messages.upsert", categoryHandler);

      // Step 2: Difficulty selection
      const difficulties = ["easy", "medium", "hard"];
      await conn.sendMessage(from, {
        text: `🔹 Selected category: *${categories[choice]}*\n\nChoose difficulty:\n1. Easy\n2. Medium\n3. Hard`
      }, { quoted: catReply });

      const difficultyHandler = async (diffReply) => {
        const keySenderDiff = diffReply.key.fromMe ? conn.user.jid : diffReply.key.participant;
        if (keySenderDiff !== sender) return;

        const diffChoice = parseInt(diffReply.message?.conversation?.trim());
        if (!diffChoice || diffChoice < 1 || diffChoice > 3) {
          await conn.sendMessage(from, { text: "❌ Invalid difficulty number. Try again." }, { quoted: diffReply });
          return;
        }

        const selectedDifficulty = difficulties[diffChoice - 1];
        conn.ev.off("messages.upsert", difficultyHandler);

        // Step 3: Fetch question
        const url = `https://opentdb.com/api.php?amount=1&category=${selectedCategory + 8}&difficulty=${selectedDifficulty}&type=multiple`;
        const response = await fetch(url);
        const json = await response.json();

        if (!json.results || json.results.length === 0) {
          return conn.sendMessage(from, { text: "❌ Could not fetch a question. Try again later." }, { quoted: diffReply });
        }

        const item = json.results[0];
        const decode = (str) => str.replace(/&quot;/g, '"')
                                   .replace(/&#039;/g, "'")
                                   .replace(/&amp;/g, "&")
                                   .replace(/&lt;/g, "<")
                                   .replace(/&gt;/g, ">");
        const question = decode(item.question);
        const correctAnswer = decode(item.correct_answer);
        const incorrect = item.incorrect_answers.map(ans => decode(ans));

        const options = [correctAnswer, ...incorrect].sort(() => Math.random() - 0.5);
        const correctIndex = options.findIndex(o => o === correctAnswer);

        // Save game
        triviaGames[sender] = { correctIndex, options, attempts: 2 };

        // Send question
        await conn.sendMessage(from, {
          text: `🧠 *Trivia Question!*\nCategory: *${categories[choice]}*\nDifficulty: *${selectedDifficulty}*\n\n${question}\n\nOptions:\n${options.map((o, i) => `${i + 1}. ${o}`).join("\n")}\n\nReply with option number (1-${options.length}). You have 2 attempts.`
        }, { quoted: diffReply });

        // Step 4: Handle answers
        const answerHandler = async (chatUpdate) => {
          const keySenderAns = chatUpdate.key.fromMe ? conn.user.jid : chatUpdate.key.participant;
          if (keySenderAns !== sender) return;

          const text = chatUpdate.message?.conversation?.trim();
          if (!text) return;

          const game = triviaGames[sender];
          if (!game) return;

          const chosen = parseInt(text) - 1;

          if (isNaN(chosen) || chosen < 0 || chosen >= game.options.length) {
            await conn.sendMessage(from, { text: `❌ Invalid option. Reply with a number between 1 and ${game.options.length}.` }, { quoted: chatUpdate });
            return;
          }

          // Initialize user score if not exists
          if (!triviaScores[sender]) triviaScores[sender] = { score: 0, correct: 0, wrong: 0 };

          if (chosen === game.correctIndex) {
            triviaScores[sender].score += 10; // 10 points per correct
            triviaScores[sender].correct += 1;

            await conn.sendMessage(from, { text: `🎉 Correct! The answer was *${game.options[game.correctIndex]}*.\n\n✅ Your score: ${triviaScores[sender].score} points` }, { quoted: chatUpdate });

            delete triviaGames[sender];
            conn.ev.off("messages.upsert", answerHandler);
          } else {
            game.attempts--;
            triviaScores[sender].wrong += 1;

            if (game.attempts <= 0) {
              await conn.sendMessage(from, { text: `❌ Out of attempts! The correct answer was *${game.options[game.correctIndex]}*.\n\n✅ Your score: ${triviaScores[sender].score} points` }, { quoted: chatUpdate });
              delete triviaGames[sender];
              conn.ev.off("messages.upsert", answerHandler);
            } else {
              await conn.sendMessage(from, { text: `❌ Wrong answer! Attempts left: ${game.attempts}` }, { quoted: chatUpdate });
            }
          }
        };

        conn.ev.on("messages.upsert", answerHandler);
      };

      conn.ev.on("messages.upsert", difficultyHandler);
    };

    conn.ev.on("messages.upsert", categoryHandler);

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Failed to start trivia. Try again later." }, { quoted: mek });
  }
});
//--------------------------------------------------------
cmd({
  pattern:"scramble",
  react:"🧩",
  desc:"Play Word Scramble",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{from,sender})=>{
  const words=["javascript","whatsapp","shadow","technology","computer","programming","bot","discord","python","algorithm"]
  const word=words[Math.floor(Math.random()*words.length)]
  const scrambled=word.split('').sort(()=>Math.random()-0.5).join('')
  scrambleGames[sender]={answer:word.toLowerCase(), attempts:3}
  await conn.sendMessage(from,{text:`🧩 *Word Scramble!*\n\nUnscramble: ${scrambled}\nYou have 3 attempts.`},{quoted:mek})
})

//--------------------------------------------------------
cmd({
  pattern:"coins",
  react:"🪙",
  desc:"Check your coins and XP",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{from,sender})=>{
  const coins=globalCoins[sender]||0
  const xp=globalXP[sender]||0
  const level=Math.floor(xp/LEVEL_XP)+1
  await conn.sendMessage(from,{text:`🪙 Coins: ${coins}\n🧠 XP: ${xp}\n⭐ Level: ${level}`},{quoted:mek})
})

//--------------------------------------------------------
cmd({
  pattern:"leaderboard",
  react:"🏆",
  desc:"Show top players",
  category:"games",
  filename:__filename
}, async(conn,mek,m)=>{
  const lb=Object.entries(globalCoins).sort((a,b)=>b[1]-a[1]).slice(0,10)
  let text="🏆 *Leaderboard - Top 10 Players*\n\n"
  lb.forEach(([user,coins],i)=>{
    const xp=globalXP[user]||0
    const level=Math.floor(xp/LEVEL_XP)+1
    text+=`${i+1}. @${user.split("@")[0]} - 💰 ${coins} | 🧠 XP ${xp} | ⭐ Lv ${level}\n`
  })
  await conn.sendMessage(m.chat,{text,mentions:lb.map(e=>e[0])},{quoted:mek})
})

//--------------------------------------------------------
cmd({
  pattern:"daily",
  react:"🎁",
  desc:"Claim daily coins reward",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{from,sender})=>{
  const now=Date.now()
  if(dailyClaim[sender] && now-dailyClaim[sender]<24*60*60*1000){
    const remain=24*60*60*1000-(now-dailyClaim[sender])
    const hrs=Math.floor(remain/3600000)
    const mins=Math.floor((remain%3600000)/60000)
    return await conn.sendMessage(from,{text:`⏳ Already claimed! Try again in ${hrs}h ${mins}m`},{quoted:mek})
  }
  const reward=Math.floor(Math.random()*50)+50
  globalCoins[sender]=(globalCoins[sender]||0)+reward
  globalXP[sender]=(globalXP[sender]||0)+randomXP(10,30)
  dailyClaim[sender]=now
  await conn.sendMessage(from,{text:`🎁 Daily reward claimed!\n💰 Coins: +${reward}\n🧠 XP: +${randomXP(10,30)}`},{quoted:mek})
})

//--------------------------------------------------------
cmd({
  pattern:"shop",
  react:"🛒",
  desc:"Show shop items",
  category:"games",
  filename:__filename
}, async(conn,mek,m)=>{
  let text="🛒 *Shop Items*\n\n"
  Object.entries(shopItems).forEach(([key,item],i)=>{
    text+=`${i+1}. ${item.name} - 💰 ${item.price} coins\n   ${item.desc}\n`
  })
  text+="\nUse .buy <item_key> to purchase."
  await conn.sendMessage(m.chat,{text},{quoted:mek})
})

//--------------------------------------------------------
cmd({
  pattern:"buy",
  react:"💵",
  desc:"Buy an item from the shop",
  category:"games",
  filename:__filename
}, async(conn,mek,m,{sender,args})=>{
  if(!args[0]) return await conn.sendMessage(m.chat,{text:"❌ Use .buy <item_key>"},{quoted:m})
  const itemKey = args[0].toLowerCase()
  const item = shopItems[itemKey]
  if(!item) return await conn.sendMessage(m.chat,{text:"❌ Invalid item key"},{quoted:m})
  if(!globalCoins[sender] || globalCoins[sender]<item.price) return await conn.sendMessage(m.chat,{text:"❌ Not enough coins"},{quoted:m})
  globalCoins[sender]-=item.price
  if(!userInventory[sender]) userInventory[sender]={}
  userInventory[sender][itemKey]=(userInventory[sender][itemKey]||0)+1
  await conn.sendMessage(m.chat,{text:`🎉 Purchased ${item.name}! You now have ${userInventory[sender][itemKey]} of this item.`},{quoted:m})
})
//--------------------------------------------------------
cmd({
  pattern: "truth",
  react: "🤫",
  desc: "Get a random Truth question",
  category: "games",
  filename: __filename
}, async (conn, mek, m, { from, sender }) => {
  try {
    // Example Truth API
    const response = await axios.get("https://api.truthordarebot.xyz/v1/truth");
    const truthQuestion = response.data.question || "Hmm... no truth found!";
    
    conn.sendMessage(from, { text: `🤔 Truth:\n\n${truthQuestion}` }, { quoted: mek });
  } catch (err) {
    console.error(err);
    conn.sendMessage(from, { text: "❌ Failed to fetch a truth question!" }, { quoted: mek });
  }
});

//--------------------------------------------------------
cmd({
  pattern: "dare",
  react: "🔥",
  desc: "Get a random Dare challenge",
  category: "games",
  filename: __filename
}, async (conn, mek, m, { from, sender }) => {
  try {
    // Example Dare API
    const response = await axios.get("https://api.truthordarebot.xyz/v1/dare");
    const dareChallenge = response.data.question || "Hmm... no dare found!";
    
    conn.sendMessage(from, { text: `😈 Dare:\n\n${dareChallenge}` }, { quoted: mek });
  } catch (err) {
    console.error(err);
    conn.sendMessage(from, { text: "❌ Failed to fetch a dare challenge!" }, { quoted: mek });
  }
});