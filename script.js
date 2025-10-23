 const heart1 = document.getElementById("heart1");
    const heart2 = document.getElementById("heart2");
    const heart3 = document.getElementById("heart3");
    const hintbtn = document.getElementById("hintbtn");
    const nextbtn = document.getElementById("nxtlvl");
    const level1 = document.getElementById("lvl1");
    const level2 = document.getElementById("lvl2");
    const level3 = document.getElementById("lvl3");
    const restartbtn = document.getElementById("restart");
    const windiv = document.getElementById("win");
    const loosediv = document.getElementById("loose");
    const diediv = document.getElementById("died");
    const gamewondiv = document.getElementById("gamewon");
    const timerid = document.getElementById("timer");
    const cards = document.querySelectorAll(".card");
    const board = document.querySelector(".game-board");
    const startbt=document.getElementById("startbtn");
    const startdiv=document.getElementById("gamestart");
    const uname=document.getElementById('username');
    let firstCard = null;
    let secondCard = null;
    let lockBoard = true;
    let score = 0;
    let timer = 30;
    let lvlcompleted = 0;
    let currentlvl = 1;
    let lives = 4;

    const gamewonsound = new Audio("gamewon.mp3");
    const lvlcompletesound = new Audio("levelcomplete.mp3");
    const cardsmatchedsound = new Audio("cardsmatch.mp3");
    const hintsound = new Audio("hintsound.mp3");
    const lostsound = new Audio("loosesound.mp3");
    const restartsound = new Audio("restartsound.mp3");

    
    let countdown = 0; 

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (lockBoard) return;
        if (card === firstCard) return;
        card.classList.add("flipped");
        card.style.backgroundImage = "none";
        card.style.backgroundColor = "white";
        card.innerHTML = `<img src="${card.dataset.img}" alt="${card.dataset.id}">`;
        if (!firstCard) {
          firstCard = card;
          return;
        }
        secondCard = card;
        MatchCheck();
      });
    });

    function MatchCheck() {
      if (firstCard.dataset.id === secondCard.dataset.id) {
        score++;
        cardsmatchedsound.play();
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        reset();
        const pairs = document.querySelectorAll(".card").length / 2;
        if (score === pairs) {
          if (currentlvl < 3) lvlcompletesound.play();
          lvlcompleted++;
          currentlvl++;
          clearInterval(countdown);
          nextbtn.style.display = "block";
          windiv.style.display = "block";
          if (lvlcompleted === 1 && currentlvl === 2) {
            level1.style.backgroundColor = "green";
            level2.style.backgroundColor = "yellow";
          }
          if (lvlcompleted === 2) {
            level2.style.backgroundColor = "green";
            level3.style.backgroundColor = "yellow";
          }
          if (lvlcompleted === 3) {
            level3.style.backgroundColor = "green";
            gamewondiv.style.display = "block";
            nextbtn.style.display = "none";
            gamewonsound.play();
          }

          score = 0;
        }
      } else {
        lockBoard = true;
        setTimeout(() => {
          if (!firstCard.classList.contains("matched")) {
            firstCard.style.backgroundImage = "url('blackcardbg.jpg')";
            firstCard.innerHTML = "❓";
            firstCard.classList.remove("flipped");
          }
          if (!secondCard.classList.contains("matched")) {
            secondCard.style.backgroundImage = "url('blackcardbg.jpg')";
            secondCard.innerHTML = "❓";
            secondCard.classList.remove("flipped");
          }
          reset();
          lives--;
          if (lives === 3) heart4.style.display = "none";
          if (lives === 2) heart3.style.display = "none";
          if (lives === 1) heart2.style.display = "none";
          if (lives === 0) {
            heart1.style.display = "none";
            diediv.style.display = "block";
            restartbtn.style.display = "block";
            lockBoard = true;
            clearInterval(countdown);
            lostsound.play();
          }
        }, 1000);
      }
    }

    let hintused = false;
    restartbtn.addEventListener("click", () => {
      if (currentlvl === 1) restart(30);
      else if (currentlvl === 2) restart(20);
      else if (currentlvl === 3) restart(15);
      resethearts();
      restartsound.play();
    });

    startbt.addEventListener("click", () => {
      if(uname.value==="")
      alert("enter username");
    else{
      lockBoard=false;
      startdiv.style.display="none";
      countdown = setInterval(() => {
      timerid.textContent = timer;
      timer--;
      if (timer < 0) {
        restartbtn.style.display = "flex";
        clearInterval(countdown);
        loosediv.style.display = "flex";
        lockBoard = true;
        lostsound.play();
      }
    }, 1000);
   }   });

    nextbtn.addEventListener("click", () => {
      if (currentlvl === 2) next(20);
      else if (currentlvl === 3) next(15);
      resethearts();
    });

    hintbtn.addEventListener("click", () => {
      usehint();
      hintsound.play();
      hintbtn.classList.add("disabled");
      hintbtn.disabled = true;
      hintbtn.textContent = "X";
    });

    function reset() {
      lockBoard = false;
      firstCard = null;
      secondCard = null;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function shuffleCardsInBoard() {
      const cardsArray = Array.from(board.children);
      shuffleArray(cardsArray);
      cardsArray.forEach((card) => board.appendChild(card));
    }

    shuffleCardsInBoard();

    function restart(t) {
      score = 0;
      timer = t;
      lockBoard = false;
      firstCard = null;
      secondCard = null;
      diediv.style.display = "none";
      timerid.textContent = timer;
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("matched");
        card.classList.remove("flipped");
        card.style.backgroundImage = "url('blackcardbg.jpg')";
        card.innerHTML = "❓";
      });
      shuffleCardsInBoard();
      windiv.style.display = "none";
      loosediv.style.display = "none";
      restartbtn.style.display = "none";
      clearInterval(countdown);
      countdown = setInterval(() => {
        timerid.textContent = timer;
        timer--;
        if (timer < 0) {
          restartbtn.style.display = "flex";
          clearInterval(countdown);
          loosediv.style.display = "flex";
          lockBoard = true;
        }
      }, 1000);
    }

    function next(time) {
      nextbtn.style.display = "none";
      score = 0;
      timer = time;
      lockBoard = false;
      firstCard = null;
      secondCard = null;
      timerid.textContent = timer;
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("matched");
        card.classList.remove("flipped");
        card.style.backgroundImage = "url('blackcardbg.jpg')";
        card.innerHTML = "❓";
      });
      shuffleCardsInBoard();
      windiv.style.display = "none";
      loosediv.style.display = "none";
      restartbtn.style.display = "none";
      clearInterval(countdown);
      countdown = setInterval(() => {
        timerid.textContent = timer;
        timer--;
        if (timer < 0) {
          clearInterval(countdown);
          restartbtn.style.display = "flex";
          loosediv.style.display = "flex";
          lockBoard = true;
        }
      }, 1000);
    }

    function usehint() {
      cards.forEach((card) => {
        if (!card.classList.contains("matched")) {
          card.classList.add("flipped");
          card.style.backgroundImage = "none";
          card.style.backgroundColor = "white";
          card.innerHTML = `<img src="${card.dataset.img}" alt="${card.dataset.id}">`;
        }
      });
      setTimeout(() => {
        cards.forEach((card) => {
          if (!card.classList.contains("matched")) {
            card.classList.remove("flipped");
            card.style.backgroundImage = "url('blackcardbg.jpg')";
            card.innerHTML = "❓";
          }
        });
      }, 500);
    }

    function resethearts() {
      lives = 4;
      heart1.style.display = "inline-block";
      heart2.style.display = "inline-block";
      heart3.style.display = "inline-block";
      heart4.style.display = "inline-block";
      if (currentlvl === 3) {
        lives = 3;
        heart4.style.display = "none";
      }
    }