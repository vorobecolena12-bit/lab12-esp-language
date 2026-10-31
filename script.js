$(document).ready(function () {
    const easyWords = [
        { es: "hola", ua: "привіт" }, { es: "gracias", ua: "дякую" },
        { es: "sol", ua: "сонце" }, { es: "agua", ua: "вода" },
        { es: "gato", ua: "кіт" }, { es: "pan", ua: "хліб" },
        { es: "casa", ua: "дім" }, { es: "día", ua: "день" },
        { es: "madre", ua: "мати" }, { es: "padre", ua: "батько" },
        { es: "perro", ua: "собака" }, { es: "noche", ua: "ніч" }
    ];
    const mediumWords = [
        { es: "desarrollo", ua: "розвиток" }, { es: "gobierno", ua: "уряд" },
        { es: "naturaleza", ua: "природа" }, { es: "seguridad", ua: "безпека" },
        { es: "conocimiento", ua: "знання" }, { es: "experiencia", ua: "досвід" },
        { es: "tecnología", ua: "технологія" }, { es: "habilidad", ua: "навичка" },
        { es: "sociedad", ua: "суспільство" }, { es: "resultado", ua: "результат" },
        { es: "actividad", ua: "діяльність" }, { es: "dirección", ua: "напрямок" },
        { es: "oportunidad", ua: "можливість" }, { es: "población", ua: "населення" },
        { es: "esperanza", ua: "надія" }, { es: "educación", ua: "освіта" }
    ];
    const hardWords = [
        { es: "resiliencia", ua: "життєстійкість" }, { es: "paradigma", ua: "парадигма" },
        { es: "altruismo", ua: "альтруїзм" }, { es: "pragmatismo", ua: "прагматизм" },
        { es: "dicotomía", ua: "дихотомія" }, { es: "sinergia", ua: "синергія" },
        { es: "eufemismo", ua: "евфемізм" }, { es: "hegemonía", ua: "гегемонія" },
        { es: "ambigüedad", ua: "двозначність" }, { es: "empirismo", ua: "емпіризм" },
        { es: "perspicaz", ua: "проникливий" }, { es: "benevolencia", ua: "доброзичливість" },
        { es: "inexorable", ua: "невблаганний" }, { es: "contingencia", ua: "випадковість" },
        { es: "omnipresente", ua: "всюдисущий" }, { es: "pleonasmo", ua: "плеоназм" },
        { es: "idiosincrasia", ua: "ідіосинкразія" }, { es: "metódico", ua: "методичний" },
        { es: "efímero", ua: "швидкоплинний" }, { es: "inefable", ua: "невимовний" },
        { es: "procrastinación", ua: "прокрастинація" }
    ];
    const adBanners = [
        { img: "espan.jpg", text: "Педро Санчез не проти таких закордонних спеціалістів,а ти?"},
        { img: "pedro.jpg", text: "Фанат мароканських терористів!" },
        { img: "tur.jpg", text: "Найдешевші тури в Іспанію((044) 585-10-34)"}
    ];
    let dictionary = [];
    let currentIndex = 0, correctCount = 0, wrongCount = 0;
    let cardStates = [], adShownAtSteps = []; 
    let currentStreak = 0;
    let currentLevel = "easy";
    let totalSteps = 10; 
    let timeLimit = null; 
    let timerInterval = null;
    $(".diff-tab").click(function () {
       if ($(this).hasClass("disabled")) return; 
        $(".diff-tab").removeClass("active");
        $(this).addClass("active");
        currentLevel = $(this).data("level");
        if (currentLevel === "easy") {
            totalSteps = 10;
            timeLimit = null; 
        } else if (currentLevel === "medium") {
            totalSteps = 15;
            timeLimit = 10; 
        } else if (currentLevel === "hard") {
            totalSteps = 20;
            timeLimit = 5; 
        }
        startGame(); 
    });
    function startGame() {
        $(".diff-tab").removeClass("disabled");
        clearInterval(timerInterval);
        currentIndex = 0;
        correctCount = 0;
        wrongCount = 0;
        currentStreak = 0; 
        $("#combo-badge").removeClass("show combo-x5 combo-x10");
        cardStates = new Array(totalSteps).fill(null); 
        adShownAtSteps = []; 
        let pool = [];
        if (currentLevel === "easy") pool = [...easyWords];
        else if (currentLevel === "medium") pool = [...mediumWords];
        else if (currentLevel === "hard") pool = [...hardWords];
        dictionary = pool.sort(() => Math.random() - 0.5).slice(0, totalSteps);
        $("#correct-count").text(correctCount);
        $("#wrong-count").text(wrongCount);
        $("#result-modal").fadeOut();
        $("#political-ad").fadeOut(); 
        showWord();
    }
    function showWord() {
        clearInterval(timerInterval); 
        let currentWord = dictionary[currentIndex];
        $("#current-word").text(currentWord.es);
        $("#step-counter").text((currentIndex + 1) + "/" + totalSteps);
        $("#validation-error").text(""); 
        $("#word-card").removeClass("card-correct card-wrong"); 
        if (cardStates[currentIndex] === null) {
            $("#translation-input").val("").prop("disabled", false).focus();
            startTimer(); 
        } else {
            $("#translation-input").prop("disabled", true);
            $("#timer-display").hide();
            if (cardStates[currentIndex] === true) {
                $("#word-card").addClass("card-correct");
            } else {
                $("#word-card").addClass("card-wrong");
                $("#validation-error").text("Правильно: " + currentWord.ua);
            }
        }
        showAdRandomly();
    }
    function startTimer() {
        if (timeLimit === null) {
            $("#timer-display").hide(); 
            return;
        }
        let timeLeft = timeLimit;
        $("#timer-display").show();
        $("#time-left").text(timeLeft + "с");
        timerInterval = setInterval(() => {
            timeLeft--;
            $("#time-left").text(timeLeft + "с");
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeout(); 
            }
        }, 1000);
    }
    function handleTimeout() {
        if (cardStates[currentIndex] !== null) return;
        $(".diff-tab").addClass("disabled");
        currentStreak = 0;
        wrongCount++;
        $("#wrong-count").text(wrongCount);
      $("#word-card").addClass("card-wrong shake");
        setTimeout(() => $("#word-card").removeClass("shake"), 400);
        $("#validation-error").text("Час вийшов! Правильно: " + dictionary[currentIndex].ua);
        cardStates[currentIndex] = false; 
        $("#translation-input").prop("disabled", true);
        setTimeout(moveToNext, 1500);
    }
    $("#word-card").click(function () {
        if (cardStates[currentIndex] !== null) return;
        let answer = $("#translation-input").val().trim().toLowerCase();
        if (answer === "") {
            $("#validation-error").text("Введіть переклад!");
            return;
        }
        let ukrainianRegex = /^[а-щьюяіїєґ' -]+$/i;
        if (!ukrainianRegex.test(answer)) {
            $("#validation-error").text("Тільки українські літери!");
            return;
        }
        $(".diff-tab").addClass("disabled");
        clearInterval(timerInterval); 
        $("#translation-input").prop("disabled", true);
        $("#validation-error").text("");
        if (answer === dictionary[currentIndex].ua) {
            correctCount++;
            currentStreak++;
            $("#correct-count").text(correctCount);
            $("#word-card").addClass("card-correct");
            cardStates[currentIndex] = true; 
            let badge = $("#combo-badge");
            badge.removeClass("show combo-x5 combo-x10");
            if (currentStreak === 3) {
                badge.text("🔥 Комбо x3!").addClass("show");
            } else if (currentStreak === 5) {
                badge.text("⚡ Вогонь x5!").addClass("show combo-x5");
            } else if (currentStreak === 10) {
                badge.text("👑 БОГ МОВИ x10!").addClass("show combo-x10");
            }
            if ([3, 5, 10].includes(currentStreak)) {
                setTimeout(() => badge.removeClass("show"), 1500);
            }
        } else {
            currentStreak = 0;
            wrongCount++;
            $("#wrong-count").text(wrongCount);
            $("#word-card").addClass("card-wrong shake");
            setTimeout(() => $("#word-card").removeClass("shake"), 400);
            $("#validation-error").text("Правильно: " + dictionary[currentIndex].ua);
            cardStates[currentIndex] = false; 
        }
        $("#political-ad").fadeOut(300);
        setTimeout(moveToNext, 1000); 
    });
    function moveToNext() {
        if (!cardStates.includes(null)) {
            showResults();
        } else if (currentIndex < totalSteps - 1) {
            currentIndex++;
            showWord();
        }
    }
    $("#translation-input").on("keydown", function (e) {
        if (e.key === "Enter") $("#word-card").click();
    });
    $("#next-btn").click(function () {
        if (currentIndex < totalSteps - 1) {
            $("#political-ad").fadeOut(300);
            currentIndex++;
            showWord();
        }
    });
    $("#prev-btn").click(function () {
        if (currentIndex > 0) {
            $("#political-ad").fadeOut(300);
            currentIndex--;
            showWord();
        }
    });
    $("#close-ad").click(function () { $("#political-ad").fadeOut(300); });
    function showAdRandomly() {
        if (adShownAtSteps.includes(currentIndex)) return;
        const chanceToShow = 0.3; 
        const lastAdStep = adShownAtSteps.length > 0 ? adShownAtSteps[adShownAtSteps.length - 1] : -3;
        if ((currentIndex - lastAdStep >= 3) && (Math.random() < chanceToShow)) {
            const randomAd = adBanners[Math.floor(Math.random() * adBanners.length)];
            $("#ad-content-wrapper").html(`
                <img src="${randomAd.img}" alt="Реклама" class="ad-image">
                <p class="ad-text">${randomAd.text}</p> `);
            $("#political-ad").fadeIn(600);
            adShownAtSteps.push(currentIndex);
        }
    }
    function showResults() {
        $("#modal-score").text("Вірно: " + correctCount + " з " + totalSteps);
        let percentage = correctCount / totalSteps;
        let gifUrl = ""; 
        if (percentage >= 0.8) {
            $("#modal-level").text("ХАКЕР").css("color", "#4caf50");
            gifUrl = "lamine-yamal-lamine-yamal-bailando.gif";
        } else if (percentage >= 0.5) {
            $("#modal-level").text("ПРО").css("color", "#FFC107");
            gifUrl = "spain-different-speedball.gif"; 
        } else {
            $("#modal-level").text("НУБ").css("color", "#f44336");
            gifUrl = "spain-moving-to-spain.gif"; 
        }       
        $("#modal-gif").attr("src", gifUrl).show();
        $("#result-modal").css("display", "flex").hide().fadeIn(300);
    }
    $("#restart-btn").click(startGame);
    startGame();
});