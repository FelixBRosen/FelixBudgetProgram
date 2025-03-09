let inkomster = {};
let utgifter = {};
let pieChart = null;
let barChart = null;
let nextMonthPieChart = null;
let fullNamn = "";
let bitcoinClicks = 0;
let timerInterval = null;
let isMuted = false;
let leetIncomeAdded = false;
let leetExpenseAdded = false;

const colors = ["#E74C3C", "#3498DB", "#2ECC71", "#9B59B6", "#F1C40F", "#E67E22", "#7F8C8D"];

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const shootSound = document.getElementById("shootSound");
const hitSound = document.getElementById("hitSound");
const fpsBackgroundSound = document.getElementById("fpsBackgroundSound");
const bossBackgroundSound = document.getElementById("bossBackgroundSound");
const bossShootSound = document.getElementById("bossShootSound");
const bossHitSound = document.getElementById("bossHitSound");
const playerHitSound = document.getElementById("playerHitSound");

function setWelcomeBackground() {
    const welcomeScreen = document.getElementById("welcome-screen");
    welcomeScreen.style.background = "linear-gradient(135deg, #3498DB, #ECF0F1)";
    document.getElementById("welcome-title").textContent = "Välkommen till Felix, helt värdelösa, budget program!";
}

function startBudget() {
    const fornamn = document.getElementById("fornamn").value.trim();
    const efternamn = document.getElementById("efternamn").value.trim();
    if (fornamn && efternamn) {
        fullNamn = `${fornamn} ${efternamn}`;
        document.getElementById("budget-title").textContent = `${fullNamn}s Budget`;
        const welcomeScreen = document.getElementById("welcome-screen");
        const budgetContainer = document.getElementById("budget-container");
        welcomeScreen.style.opacity = "0";
        setTimeout(() => {
            welcomeScreen.style.display = "none";
            budgetContainer.style.display = "block";
            budgetContainer.style.opacity = "0";
            setTimeout(() => budgetContainer.style.opacity = "1", 50);
        }, 500);
        playClickSound();
    } else {
        Toastify({ text: "Fyll i förnamn och efternamn!", duration: 3000, style: { background: "#E74C3C" } }).showToast();
    }
}

function addInkomst() {
    const namn = document.getElementById("inkomst-namn").value;
    const belopp = parseFloat(document.getElementById("inkomst-belopp").value);
    if (namn && !isNaN(belopp) && belopp >= 0) {
        inkomster[namn] = belopp;
        updateList();
        clearInputs("inkomst");
        playClickSound();
        startMoneyRain(belopp);
        if (bitcoinClicks > 0 && belopp === 1337) leetIncomeAdded = true, checkLeetEasterEgg();
        if (belopp === 777) checkBossEasterEgg();
    } else {
        Toastify({ text: "Ange giltig inkomst!", duration: 3000, style: { background: "#E74C3C" } }).showToast();
    }
}

function addUtgift() {
    const namn = document.getElementById("utgift-namn").value;
    const belopp = parseFloat(document.getElementById("utgift-belopp").value);
    if (namn && !isNaN(belopp) && belopp >= 0) {
        utgifter[namn] = belopp;
        updateList();
        clearInputs("utgift");
        playClickSound();
        if (bitcoinClicks > 0 && belopp === 1337) leetExpenseAdded = true, checkLeetEasterEgg();
        if (belopp === 777) checkBossEasterEgg();
    } else {
        Toastify({ text: "Ange giltig utgift!", duration: 3000, style: { background: "#E74C3C" } }).showToast();
    }
}

function deleteItem(type, key) {
    if (type === "inkomst") delete inkomster[key];
    else delete utgifter[key];
    updateList();
    playClickSound();
}

function editItem(type, key) {
    const newAmount = prompt(`Nytt belopp för ${key} (SEK):`, type === "inkomst" ? inkomster[key] : utgifter[key]);
    if (newAmount !== null && !isNaN(newAmount) && newAmount >= 0) {
        if (type === "inkomst") inkomster[key] = parseFloat(newAmount);
        else utgifter[key] = parseFloat(newAmount);
        updateList();
        playClickSound();
    }
}

function clearInputs(type) {
    document.getElementById(`${type}-namn`).value = "";
    document.getElementById(`${type}-belopp`).value = "";
}

function updateList() {
    const lista = document.getElementById("budget-lista");
    lista.innerHTML = "";
    for (let namn in inkomster) {
        const li = document.createElement("li");
        li.innerHTML = `Tjänar: ${namn} - ${inkomster[namn]} SEK 
            <button class="edit-btn" onclick="editItem('inkomst', '${namn}')"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick="deleteItem('inkomst', '${namn}')"><i class="fas fa-trash"></i></button>`;
        lista.appendChild(li);
    }
    for (let namn in utgifter) {
        const li = document.createElement("li");
        li.innerHTML = `Spenderar: ${namn} - ${utgifter[namn]} SEK 
            <button class="edit-btn" onclick="editItem('utgift', '${namn}')"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick="deleteItem('utgift', '${namn}')"><i class="fas fa-trash"></i></button>`;
        lista.appendChild(li);
    }
}

function showAddForm() {
    const existingForm = document.getElementById("add-form");
    if (existingForm) existingForm.remove();

    const form = document.createElement("div");
    form.id = "add-form";
    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.background = "#fff";
    form.style.padding = "20px";
    form.style.borderRadius = "10px";
    form.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    form.style.zIndex = "1000";

    form.innerHTML = `
        <h3>Lägg till</h3>
        <select id="add-type">
            <option value="inkomst">Inkomst</option>
 приобoption value="utgift">Utgift</option>
        </select>
        <input type="text" id="add-namn" placeholder="Namn">
        <input type="number" id="add-belopp" placeholder="Belopp (SEK)">
        <button onclick="submitAddForm()">Lägg till</button>
        <button onclick="document.getElementById('add-form').remove()">Avbryt</button>
    `;
    document.body.appendChild(form);
}

function submitAddForm() {
    const type = document.getElementById("add-type").value;
    const namn = document.getElementById("add-namn").value;
    const belopp = parseFloat(document.getElementById("add-belopp").value);
    if (namn && !isNaN(belopp) && belopp >= 0) {
        if (type === "inkomst") {
            inkomster[namn] = belopp;
            if (bitcoinClicks > 0 && belopp === 1337) leetIncomeAdded = true, checkLeetEasterEgg();
            if (belopp === 777) checkBossEasterEgg();
            startMoneyRain(belopp);
        } else {
            utgifter[namn] = belopp;
            if (bitcoinClicks > 0 && belopp === 1337) leetExpenseAdded = true, checkLeetEasterEgg();
            if (belopp === 777) checkBossEasterEgg();
        }
        updateList();
        document.getElementById("add-form").remove();
        playClickSound();
    } else {
        Toastify({ text: "Ange giltiga värden!", duration: 3000, style: { background: "#E74C3C" } }).showToast();
    }
}

function calculateBudget() {
    const currency = "SEK";
    const rate = 1;
    const totalInkomst = Object.values(inkomster).reduce((a, b) => a + b, 0) * rate;
    const totalUtgifter = Object.values(utgifter).reduce((a, b) => a + b, 0) * rate;
    const savingsGoal = parseFloat(document.getElementById("savings-goal").value) || 0;
    let kvar = totalInkomst - totalUtgifter;
    const procentKvar = totalInkomst > 0 ? (kvar / totalInkomst) * 100 : 0;

    updateBackground(procentKvar);

    if (pieChart) pieChart.destroy();
    const pieCtx = document.getElementById("pieChart").getContext("2d");
    const pieLabels = Object.keys(utgifter).concat("Kvar");
    const pieData = Object.values(utgifter).map(val => val * rate).concat(Math.max(0, kvar));
    const pieColors = Object.keys(utgifter).map((_, i) => colors[i % colors.length]).concat("#2196F3");
    pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: pieLabels,
            datasets: [{ data: pieData, backgroundColor: pieColors }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: `Denna månads utgifter (${currency})` } }
        }
    });

    if (barChart) barChart.destroy();
    const barCtx = document.getElementById("barChart").getContext("2d");
    barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: ["Tjänar", "Spenderar", "Kvar"],
            datasets: [{
                label: `Belopp (${currency})`,
                data: [totalInkomst, totalUtgifter, kvar],
                backgroundColor: ["#4CAF50", "#F44336", "#2196F3"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { title: { display: true, text: `Budget i staplar (${currency})` } }
        }
    });

    if (nextMonthPieChart) nextMonthPieChart.destroy();
    const nextMonthCtx = document.getElementById("nextMonthPieChart").getContext("2d");
    let nextMonthChartConfig = { type: "pie", data: { labels: [], datasets: [{}] }, options: {} };
    let resultText = `Här är din månadsbudget:\n`;
    resultText += `Total inkomst: ${totalInkomst.toFixed(2)} ${currency}\n`;
    resultText += `Totala utgifter: ${totalUtgifter.toFixed(2)} ${currency}\n`;
    resultText += `Kvar innan sparmål: ${kvar.toFixed(2)} ${currency}\n`;

    let savingsAchieved = 0;
    if (savingsGoal > 0) {
        resultText += `Sparingsmål: ${savingsGoal.toFixed(2)} ${currency}\n`;
        if (kvar >= savingsGoal) {
            savingsAchieved = savingsGoal;
            kvar -= savingsGoal;
            resultText += `Sparingsmål uppnått! ${savingsAchieved.toFixed(2)} ${currency} avsatt.\n`;
        } else {
            savingsAchieved = kvar;
            kvar = 0;
            resultText += `Sparingsmål ej uppnått. Avsatt ${savingsAchieved.toFixed(2)} ${currency}, saknar ${(savingsGoal - savingsAchieved).toFixed(2)} ${currency}.\n`;
        }
    }
    resultText += `Kvar att leva på efter sparmål: ${kvar.toFixed(2)} ${currency}\n\n`;
    resultText += "Tips:\n";

    if (kvar < 0) {
        resultText += `Varning: Dina utgifter överstiger dina inkomster!\n`;
        resultText += `Du behöver minska utgifterna med minst ${(-kvar).toFixed(2)} ${currency}.\n`;
    } else if (kvar < 500 * rate) {
        resultText += `Du har lite pengar kvar (${kvar.toFixed(2)} ${currency}) efter sparmål.\n`;
        resultText += `Tips: Försök spara detta belopp för oväntade utgifter!\n`;
    } else {
        resultText += `Bra jobbat! Du har pengar kvar (${kvar.toFixed(2)} ${currency}) efter sparmål!\n`;
        resultText += `Så här kan du använda pengarna istället för att de tappar värde:\n`;
        resultText += `- Investera i aktier eller fonder\n`;
        resultText += `- Sätt in på ett sparkonto med ränta\n`;
        resultText += `- Betala av eventuella lån snabbare\n\n`;

        const plan = {
            "Sparande": savingsAchieved,
            "Nöjen": Math.min(kvar * 0.2, 1000 * rate),
            "Transport": Math.min(kvar * 0.15, 750 * rate),
            "Mat": Math.min(kvar * 0.25, 1250 * rate),
            "Kläder": Math.min(kvar * 0.1, 500 * rate),
            "Övrigt": kvar - (kvar * 0.2 + kvar * 0.15 + kvar * 0.25 + kvar * 0.1)
        };
        resultText += `Här är en plan för nästa månads spending:\n`;
        for (let kategori in plan) {
            resultText += `- ${kategori}: ${plan[kategori].toFixed(2)} ${currency}\n`;
        }

        nextMonthChartConfig = {
            type: "pie",
            data: {
                labels: Object.keys(plan),
                datasets: [{
                    data: Object.values(plan),
                    backgroundColor: ["#00BCD4", "#FF9800", "#4CAF50", "#E91E63", "#9C27B0", "#2196F3"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { title: { display: true, text: `Nästa månads budget (${currency})` } }
            }
        };
    }

    nextMonthPieChart = new Chart(nextMonthCtx, nextMonthChartConfig);

    for (let namn in utgifter) {
        const namnLower = namn.toLowerCase();
        if (namnLower.includes("mat") && utgifter[namn] * rate > 250 * rate) {
            resultText += `\n- Hög matkostnad (${(utgifter[namn] * rate).toFixed(2)} ${currency})! Planera måltider och handla i bulk.\n`;
        }
        if (namnLower.includes("nöjen") && utgifter[namn] * rate > 100 * rate) {
            resultText += `- Hög nöjeskostnad (${(utgifter[namn] * rate).toFixed(2)} ${currency})! Testa gratis aktiviteter.\n`;
        }
    }

    document.getElementById("budget-result").textContent = resultText;
    playClickSound();
}

function updateBackground(procentKvar) {
    const body = document.body;
    if (procentKvar <= 12.5) body.style.background = "linear-gradient(135deg, #2C3E50, #34495E)";
    else if (procentKvar < 75) body.style.background = "linear-gradient(135deg, #E67E22, #F1C40F)";
    else body.style.background = "linear-gradient(135deg, #27AE60, #2ECC71)";
}

function saveBudget() {
    try {
        const budgetData = { inkomster, utgifter, fullNamn };
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(budgetData), "budgetKey").toString();
        localStorage.setItem("budgetData", encryptedData);
        Toastify({ text: "Budget sparad!", duration: 3000, style: { background: "#2ECC71" } }).showToast();
        playClickSound();
    } catch (error) {
        Toastify({ text: "Kunde inte spara budgeten!", duration: 3000, style: { background: "#E74C3C" } }).showToast();
    }
}

function loadBudget() {
    try {
        const encryptedData = localStorage.getItem("budgetData");
        if (encryptedData) {
            const bytes = CryptoJS.AES.decrypt(encryptedData, "budgetKey");
            const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            inkomster = data.inkomster || {};
            utgifter = data.utgifter || {};
            fullNamn = data.fullNamn || fullNamn;
            document.getElementById("budget-title").textContent = `${fullNamn}s Budget`;
            updateList();
            Toastify({ text: "Budget laddad!", duration: 3000, style: { background: "#2ECC71" } }).showToast();
            playClickSound();
        } else {
            Toastify({ text: "Ingen sparad budget hittades.", duration: 3000, style: { background: "#E74C3C" } }).showToast();
        }
    } catch (error) {
        Toastify({ text: "Kunde inte ladda budgeten!", duration: 3000, style: { background: "#E74C3C" } }).showToast();
    }
}

function exportToCSV() {
    const csv = [
        ["Typ", "Namn", "Belopp (SEK)"],
        ...Object.entries(inkomster).map(([namn, belopp]) => ["Inkomst", namn, belopp]),
        ...Object.entries(utgifter).map(([namn, belopp]) => ["Utgift", namn, belopp])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fullNamn}_budget.csv`;
    a.click();
    URL.revokeObjectURL(url);
    playClickSound();
}

function clearBudget() {
    inkomster = {};
    utgifter = {};
    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();
    if (nextMonthPieChart) nextMonthPieChart.destroy();
    updateList();
    document.getElementById("budget-result").textContent = "";
    leetIncomeAdded = false;
    leetExpenseAdded = false;
    bitcoinClicks = 0;
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById("timer").style.display = "none";
    Toastify({ text: "Budget rensad!", duration: 3000, style: { background: "#2ECC71" } }).showToast();
    playClickSound();
}

function restartBudget() {
    // Rensa all budgetdata
    clearBudget();

    // Hämta elementen
    const budgetContainer = document.getElementById("budget-container");
    const welcomeScreen = document.getElementById("welcome-screen");

    // Dölj budgetcontainern direkt
    budgetContainer.style.display = "none";

    // Visa och återställ välkomstskärmen
    welcomeScreen.style.display = "block";
    setWelcomeBackground();
    document.getElementById("fornamn").value = "";
    document.getElementById("efternamn").value = "";

    // Spela klickljud
    playClickSound();
}

function moveBitcoin() {
    const bitcoin = document.getElementById("bitcoin-sprite");
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;
    bitcoin.style.left = `${Math.floor(Math.random() * maxX)}px`;
    bitcoin.style.top = `${Math.floor(Math.random() * maxY)}px`;
    bitcoin.style.right = "auto";
    playClickSound();
    if (bitcoinClicks === 0 && !timerInterval) startEasterEggTimer();
    bitcoinClicks++;
    checkBossEasterEgg();
}

function startEasterEggTimer() {
    const timer = document.getElementById("timer");
    let timeLeft = 10;
    timer.style.display = "block";
    timer.textContent = `Tid kvar: ${timeLeft}s`;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = `Tid kvar: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timer.style.display = "none";
            checkFirstEasterEgg();
            resetLeetEasterEggFlags();
        }
    }, 1000);
}

function checkFirstEasterEgg() {
    if (bitcoinClicks >= 6) triggerFirstEasterEgg();
    bitcoinClicks = 0;
}

function triggerFirstEasterEgg() {
    if (!isMuted) winSound.play().catch(() => console.log("Vinstljud kunde inte spelas"));
    const easterEgg = document.getElementById("easter-egg");
    easterEgg.innerHTML = `<img src="https://media1.tenor.com/m/yXzP3X3x7AcAAAAd/horror-smiley-face.gif" alt="Läskig gubbe"><p>Jag ser dig</p>`;
    easterEgg.style.display = "flex";
    setTimeout(() => { easterEgg.style.display = "none"; easterEgg.innerHTML = ""; }, 2000);
}

function checkLeetEasterEgg() {
    if (leetIncomeAdded && leetExpenseAdded && bitcoinClicks > 0) triggerFPSGame();
}

function triggerFPSGame() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById("timer").style.display = "none";
    const fpsGame = document.getElementById("fps-game");
    fpsGame.style.display = "block";
    const canvas = document.getElementById("fps-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let targets = [];
    let arrows = [];
    let redHits = 0;
    let initialRedCount = 3;
    let timeLeft = 20;
    let gameActive = true;

    if (!isMuted) fpsBackgroundSound.play().catch(() => console.log("Bakgrundsljud kunde inte spelas"));

    for (let i = 0; i < initialRedCount; i++) {
        targets.push({ x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height - 50), radius: 25, dx: (Math.random() - 0.5) * 4, dy: (Math.random() - 0.5) * 4, color: "red", isYellow: false });
    }
    for (let i = 0; i < 2; i++) {
        targets.push({ x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height - 50), radius: 25, dx: (Math.random() - 0.5) * 4, dy: (Math.random() - 0.5) * 4, color: "yellow", isYellow: true });
    }

    const scoreElement = document.getElementById("fps-score");
    const timerElement = document.getElementById("fps-timer");
    const currentRedCount = () => targets.filter(t => !t.isYellow).length;
    scoreElement.textContent = `Träffar: ${redHits} / ${currentRedCount()}`;
    timerElement.textContent = `Tid kvar: ${timeLeft}s`;

    // Mobil skjutknapp
    const shootBtn = document.getElementById("mobile-shoot");
    shootBtn.addEventListener("touchstart", (e) => {
        if (!gameActive || isMuted) return;
        shootSound.play().catch(() => console.log("Skottljud kunde inte spelas"));
        const canvasRect = canvas.getBoundingClientRect();
        const touchX = canvas.width / 2; // Skjuter alltid från mitten
        const touchY = canvas.height / 2;
        const angle = Math.atan2(-canvas.height, 0); // Skjuter uppåt som standard
        arrows.push({ x: touchX, y: touchY, dx: Math.cos(angle) * 5, dy: Math.sin(angle) * 5 });
    });

    // Tangentbord/mus-kontroller
    canvas.addEventListener("click", (e) => {
        if (!gameActive || isMuted) return;
        shootSound.play().catch(() => console.log("Skottljud kunde inte spelas"));
        const angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
        arrows.push({ x: canvas.width / 2, y: canvas.height / 2, dx: Math.cos(angle) * 5, dy: Math.sin(angle) * 5 });
    }, { once: false });

    function updateGame() {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();

        targets.forEach(target => {
            ctx.beginPath();
            ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
            ctx.fillStyle = target.color;
            ctx.fill();
            ctx.closePath();
            target.x += target.dx;
            target.y += target.dy;
            if (target.x + target.radius > canvas.width || target.x - target.radius < 0) target.dx = -target.dx;
            if (target.y + target.radius > canvas.height || target.y - target.radius < 0) target.dy = -target.dy;
        });

        arrows.forEach((arrow, index) => {
            ctx.beginPath();
            ctx.moveTo(arrow.x, arrow.y);
            ctx.lineTo(arrow.x - 5, arrow.y + 2.5);
            ctx.lineTo(arrow.x - 5, arrow.y - 2.5);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.closePath();
            arrow.x += arrow.dx;
            arrow.y += arrow.dy;
            if (arrow.x < 0 || arrow.x > canvas.width || arrow.y < 0 || arrow.y > canvas.height) arrows.splice(index, 1);
        });

        arrows.forEach((arrow, arrowIndex) => {
            targets.forEach((target, targetIndex) => {
                const dist = Math.hypot(arrow.x - target.x, arrow.y - target.y);
                if (dist < target.radius) {
                    if (target.isYellow) {
                        targets.push({ x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height - 50), radius: 25, dx: (Math.random() - 0.5) * 4, dy: (Math.random() - 0.5) * 4, color: "red", isYellow: false });
                    } else {
                        targets.splice(targetIndex, 1);
                        redHits++;
                        if (!isMuted) hitSound.play().catch(() => console.log("Träffljud kunde inte spelas"));
                    }
                    arrows.splice(arrowIndex, 1);
                    scoreElement.textContent = `Träffar: ${redHits} / ${currentRedCount()}`;
                    if (currentRedCount() === 0) endGame(true);
                }
            });
        });

        if (gameActive) requestAnimationFrame(updateGame);
    }

    const gameTimer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Tid kvar: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            if (gameActive) endGame(false);
        }
    }, 1000);

    function endGame(won) {
        if (!gameActive) return;
        gameActive = false;
        clearInterval(gameTimer);
        if (!isMuted) fpsBackgroundSound.pause();
        const resultDiv = document.createElement("div");
        resultDiv.className = "fps-result";
        resultDiv.textContent = won ? "Du vann!" : "Du förlorade!";
        fpsGame.appendChild(resultDiv);
        setTimeout(() => {
            fpsGame.style.display = "none";
            fpsGame.removeChild(resultDiv);
            if (won) {
                leetIncomeAdded = false;
                leetExpenseAdded = false;
                bitcoinClicks = 0;
                timerInterval = null;
                startEasterEggTimer();
            } else {
                location.reload();
            }
        }, 2000);
    }

    updateGame();
}

function checkBossEasterEgg() {
    if (bitcoinClicks >= 5 && Object.values(inkomster).includes(777) && Object.values(utgifter).includes(777)) triggerBudgetBoss();
}

function triggerBudgetBoss() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById("timer").style.display = "none";
    const fpsGame = document.getElementById("fps-game");
    fpsGame.style.display = "block";
    const canvas = document.getElementById("fps-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let player = { x: canvas.width / 2 - 25, y: canvas.height / 2 - 25, width: 50, height: 50, hp: 4, maxHp: 4, dx: 0, dy: 0 };
    let boss = { x: canvas.width / 2 - 82.5, y: 50, width: 165, height: 165, hp: 30, maxHp: 30, dx: (Math.random() - 0.5) * 4, dy: (Math.random() - 0.5) * 4 };
    let arrows = [];
    let bossShots = [];
    let fireballs = [];
    let gameActive = true;
    let lastFireballTime = Date.now();

    const bossImage = new Image();
    bossImage.src = "https://png.pngtree.com/png-clipart/20210810/ourlarge/pngtree-evil-samurai-ghost-mask-png-image_3794643.jpg";
    bossImage.onerror = () => { boss.width = 110; boss.height = 110; };
    bossImage.onload = () => { boss.width = 165; boss.height = 165; boss.x = canvas.width / 2 - boss.width / 2; boss.y = 50; };

    if (!isMuted) bossBackgroundSound.play().catch(() => console.log("Boss bakgrundsljud kunde inte spelas"));

    // Mobilkontroller
    const leftBtn = document.getElementById("mobile-left");
    const rightBtn = document.getElementById("mobile-right");
    const upBtn = document.getElementById("mobile-up");
    const downBtn = document.getElementById("mobile-down");
    const shootBtn = document.getElementById("mobile-shoot");

    // Hantera knapptryckningar för rörelse
    function updateMovement() {
        leftBtn.addEventListener("touchstart", () => player.dx = -5);
        leftBtn.addEventListener("touchend", () => player.dx = 0);
        rightBtn.addEventListener("touchstart", () => player.dx = 5);
        rightBtn.addEventListener("touchend", () => player.dx = 0);
        upBtn.addEventListener("touchstart", () => player.dy = -5);
        upBtn.addEventListener("touchend", () => player.dy = 0);
        downBtn.addEventListener("touchstart", () => player.dy = 5);
        downBtn.addEventListener("touchend", () => player.dy = 0);
    }

    // Hantera skjutning
    shootBtn.addEventListener("touchstart", () => {
        if (gameActive) {
            arrows.push({ x: player.x + player.width / 2, y: player.y, dy: -7 });
            if (!isMuted) bossShootSound.play().catch(() => console.log("Boss skottljud kunde inte spelas"));
        }
    });

    // Tangentbordshanterare
    document.addEventListener("keydown", (e) => {
        if (!gameActive) return;
        switch (e.key) {
            case "ArrowLeft": case "a": case "A": player.dx = -5; break;
            case "ArrowRight": case "d": case "D": player.dx = 5; break;
            case "ArrowUp": case "w": case "W": player.dy = -5; break;
            case "ArrowDown": case "s": case "S": player.dy = 5; break;
            case " ": 
                arrows.push({ x: player.x + player.width / 2, y: player.y, dy: -7 });
                if (!isMuted) bossShootSound.play().catch(() => console.log("Boss skottljud kunde inte spelas"));
                break;
        }
    });

    document.addEventListener("keyup", (e) => {
        if (!gameActive) return;
        switch (e.key) {
            case "ArrowLeft": case "a": case "A": if (player.dx < 0) player.dx = 0; break;
            case "ArrowRight": case "d": case "D": if (player.dx > 0) player.dx = 0; break;
            case "ArrowUp": case "w": case "W": if (player.dy < 0) player.dy = 0; break;
            case "ArrowDown": case "s": case "S": if (player.dy > 0) player.dy = 0; break;
        }
    });

    // Kör rörelseuppdatering för mobilen
    updateMovement();

    function drawHpBar(x, y, width, height, hp, maxHp, color) {
        const hpWidth = (hp / maxHp) * width;
        ctx.fillStyle = "#333";
        ctx.fillRect(x, y - 15, width, 10);
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 15, hpWidth, 10);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(x, y - 15, width, 10);
    }

    function updateGame() {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.width, player.height);
        drawHpBar(player.x, player.y, player.width, player.height, player.hp, player.maxHp, "green");

        if (bossImage.complete && bossImage.naturalWidth !== 0) {
            ctx.drawImage(bossImage, boss.x, boss.y, boss.width, boss.height);
        } else {
            ctx.fillStyle = "purple";
            ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        }
        drawHpBar(boss.x, boss.y, boss.width, boss.height, boss.hp, boss.maxHp, "red");

        player.x += player.dx;
        player.y += player.dy;
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        if (player.y < 0) player.y = 0;
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

        boss.x += boss.dx;
        boss.y += boss.dy;
        if (boss.x < 0 || boss.x + boss.width > canvas.width) boss.dx = -boss.dx;
        if (boss.y < 0 || boss.y + boss.height > canvas.height - 100) boss.dy = -boss.dy;
        if (Math.random() < 0.05) {
            boss.dx = (Math.random() - 0.5) * 4;
            boss.dy = (Math.random() - 0.5) * 4;
        }

        arrows.forEach((arrow, index) => {
            ctx.fillStyle = "yellow";
            ctx.fillRect(arrow.x - 5, arrow.y, 10, 20);
            arrow.y += arrow.dy;
            if (arrow.y < 0) arrows.splice(index, 1);
            if (arrow.x > boss.x && arrow.x < boss.x + boss.width && arrow.y > boss.y && arrow.y < boss.y + boss.height) {
                arrows.splice(index, 1);
                boss.hp--;
                if (!isMuted) bossHitSound.play().catch(() => console.log("Boss träffljud kunde inte spelas"));
                if (boss.hp <= 0) endGame(true);
            }
        });

        if (Math.random() < 0.03) {
            const angle = Math.atan2(player.y - (boss.y + boss.height / 2), player.x - (boss.x + boss.width / 2));
            bossShots.push({ x: boss.x + boss.width / 2, y: boss.y + boss.height / 2, dx: Math.cos(angle) * 4, dy: Math.sin(angle) * 4, size: 10 });
        }
        bossShots.forEach((shot, index) => {
            ctx.fillStyle = "red";
            ctx.fillRect(shot.x - shot.size / 2, shot.y, shot.size, shot.size);
            shot.x += shot.dx;
            shot.y += shot.dy;
            if (shot.x < 0 || shot.x > canvas.width || shot.y < 0 || shot.y > canvas.height) bossShots.splice(index, 1);
            if (shot.x > player.x && shot.x < player.x + player.width && shot.y > player.y && shot.y < player.y + player.height) {
                bossShots.splice(index, 1);
                player.hp--;
                if (!isMuted) playerHitSound.play().catch(() => console.log("Spelare träffljud kunde inte spelas"));
                if (player.hp <= 0) endGame(false);
            }
        });

        const currentTime = Date.now();
        if (currentTime - lastFireballTime >= 5000) {
            const angle = Math.atan2(player.y - (boss.y + boss.height / 2), player.x - (boss.x + boss.width / 2));
            fireballs.push({ x: boss.x + boss.width / 2, y: boss.y + boss.height / 2, dx: Math.cos(angle) * 3, dy: Math.sin(angle) * 3, size: 30 });
            lastFireballTime = currentTime;
        }
        fireballs.forEach((fireball, index) => {
            ctx.beginPath();
            ctx.arc(fireball.x, fireball.y, fireball.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = "orange";
            ctx.fill();
            ctx.closePath();
            fireball.x += fireball.dx;
            fireball.y += fireball.dy;
            if (fireball.x < 0 || fireball.x > canvas.width || fireball.y < 0 || fireball.y > canvas.height) fireballs.splice(index, 1);
            if (fireball.x > player.x && fireball.x < player.x + player.width && fireball.y > player.y && fireball.y < player.y + player.height) {
                fireballs.splice(index, 1);
                player.hp--;
                if (!isMuted) playerHitSound.play().catch(() => console.log("Spelare träffljud kunde inte spelas"));
                if (player.hp <= 0) endGame(false);
            }
        });

        document.getElementById("fps-score").textContent = `Boss HP: ${boss.hp} | Ditt HP: ${player.hp}`;
        if (gameActive) requestAnimationFrame(updateGame);
    }

    function endGame(won) {
        if (!gameActive) return;
        gameActive = false;
        if (!isMuted) bossBackgroundSound.pause();
        const resultDiv = document.createElement("div");
        resultDiv.className = "fps-result";
        resultDiv.textContent = won ? "Bossen är besegrad!" : "Budgetbossen vann!";
        fpsGame.appendChild(resultDiv);
        setTimeout(() => {
            fpsGame.style.display = "none";
            fpsGame.removeChild(resultDiv);
            if (won) {
                const lastIncome = Object.values(inkomster).pop() || 0;
                inkomster["Bossbelöning"] = lastIncome * 2;
                updateList();
                leetIncomeAdded = false;
                leetExpenseAdded = false;
                bitcoinClicks = 0;
                timerInterval = null;
                startEasterEggTimer();
            } else {
                location.reload();
            }
        }, 2000);
    }

    updateGame();
}

function startMoneyRain(amount) {
    const rainContainer = document.getElementById("money-rain");
    rainContainer.innerHTML = "";
    let numDollars = amount <= 500 ? 5 : amount <= 5000 ? 10 : amount <= 10000 ? 20 : amount <= 20000 ? 30 : 50;
    for (let i = 0; i < numDollars; i++) {
        const dollar = document.createElement("div");
        dollar.className = "dollar";
        dollar.style.left = `${Math.random() * 100}vw`;
        dollar.style.animationDelay = `${Math.random() * 2}s`;
        rainContainer.appendChild(dollar);
    }
    setTimeout(() => rainContainer.innerHTML = "", 8000);
}

function playClickSound() {
    if (!isMuted) clickSound.play().catch(() => console.log("Ljud kunde inte spelas"));
}

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById("mute-btn");
    muteBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    muteBtn.classList.toggle("muted", isMuted);
    if (isMuted) {
        bossBackgroundSound.pause();
        fpsBackgroundSound.pause();
    }
}

window.onload = setWelcomeBackground;
