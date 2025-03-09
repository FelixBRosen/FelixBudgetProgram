@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #2C3E50, #4CA1AF);
    min-height: 100vh;
    transition: background 1s ease-in-out;
    position: relative;
}

.welcome-screen, .container {
    max-width: 900px;
    margin: 20px auto;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: opacity 0.5s ease-in-out;
}

.welcome-screen {
    text-align: center;
    background: linear-gradient(135deg, #3498DB, #ECF0F1);
}

h1, h2 {
    color: #2C3E50;
    margin: 10px 0;
}

h1 {
    text-align: center;
    font-size: 2em;
}

h2 {
    font-size: 1.5em;
    margin-top: 20px;
}

.input-section, .settings-section {
    margin-bottom: 20px;
}

input[type="text"], input[type="number"], select {
    padding: 10px;
    margin: 5px;
    border: 1px solid #BDC3C7;
    border-radius: 5px;
    font-size: 14px;
    width: calc(100% - 22px);
    max-width: 250px;
}

input:invalid {
    border-color: #E74C3C;
}

button {
    padding: 10px 20px;
    background-color: #2C3E50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin: 5px;
    transition: background-color 0.3s, transform 0.2s;
}

button:hover {
    background-color: #4CA1AF;
    transform: scale(1.05);
}

.confirm-btn {
    width: 50px;
    height: 50px;
    font-size: 24px;
    margin: 20px auto;
    background-color: #3498DB;
    border-radius: 50%;
}

.confirm-btn:hover {
    background-color: #2980B9;
}

.calculate-btn {
    background-color: #2196F3;
}

.calculate-btn:hover {
    background-color: #1E88E5;
}

.save-btn {
    background-color: #E67E22;
}

.save-btn:hover {
    background-color: #F39C12;
}

.load-btn {
    background-color: #7F8C8D;
}

.load-btn:hover {
    background-color: #95A5A6;
}

.export-btn {
    background-color: #27AE60;
}

.export-btn:hover {
    background-color: #2ECC71;
}

.clear-btn {
    background-color: #E74C3C;
}

.clear-btn:hover {
    background-color: #C0392B;
}

.restart-btn {
    background-color: #8E44AD;
}

.restart-btn:hover {
    background-color: #9B59B6;
}

.mute-btn {
    background-color: #34495E;
}

.mute-btn.muted {
    background-color: #E74C3C;
}

.button-group {
    text-align: center;
}

.list-section ul {
    list-style: none;
    padding: 0;
}

.list-section li {
    padding: 10px;
    border-bottom: 1px solid #ECF0F1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #F9F9F9;
    margin: 5px 0;
    border-radius: 5px;
}

.delete-btn, .edit-btn {
    padding: 5px 10px;
    font-size: 12px;
}

.delete-btn {
    background-color: #E74C3C;
}

.delete-btn:hover {
    background-color: #C0392B;
}

.edit-btn {
    background-color: #3498DB;
}

.edit-btn:hover {
    background-color: #2980B9;
}

.currency-section, .settings-section {
    text-align: center;
    margin: 10px 0;
}

.result-section {
    margin: 20px 0;
    padding: 15px;
    background: #ECF0F1;
    border-radius: 8px;
}

.result-section p {
    white-space: pre-wrap;
    line-height: 1.6;
    color: #333;
}

.chart-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.chart-container {
    width: 100%;
    max-width: 350px;
    height: 350px;
    margin: 20px 0;
}

.bitcoin-sprite {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 100px;
    height: 100px;
    background: url('https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg') no-repeat center;
    background-size: contain;
    animation: rotateCoin 2s linear infinite;
    cursor: pointer;
}

@keyframes rotateCoin {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
}

.money-rain {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.dollar {
    position: absolute;
    width: 50px;
    height: 30px;
    background: #00FF00 url('https://upload.wikimedia.org/wikipedia/commons/0/0b/US-Dollar-Bill-Background.png') no-repeat center;
    background-size: cover;
    opacity: 0.8;
    animation: fall 8s linear forwards;
}

@keyframes fall {
    0% { transform: translateY(-100px) rotate(0deg); }
    100% { transform: translateY(100vh) rotate(360deg); }
}

.timer {
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 16px;
    display: none;
}

.easter-egg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.easter-egg img {
    width: 300px;
    height: auto;
}

.easter-egg p {
    color: #E74C3C;
    font-size: 48px;
    font-weight: bold;
    text-shadow: 2px 2px 4px #000;
    margin-top: 20px;
}

.fps-game {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #333;
    z-index: 2000;
}

#fps-canvas {
    width: 100%;
    height: 100%;
}

.fps-score {
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 2px 2px 4px #000;
}

.fps-timer {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 2px 2px 4px #000;
}

.fps-result {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 10px;
    font-size: 36px;
    text-align: center;
}

@media (max-width: 600px) {
    .container {
        padding: 15px;
    }
    input[type="text"], input[type="number"], select {
        width: calc(100% - 22px);
        max-width: none;
    }
    button {
        width: 100%;
        max-width: 150px;
    }
    .bitcoin-sprite {
        width: 60px;
        height: 60px;
    }
}

.mobile-controls {
    display: none; /* Dölj som standard på datorer */
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 2500; /* Över canvas */
}

.mobile-btn {
    width: 60px;
    height: 60px;
    margin: 5px;
    background-color: #3498DB;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.mobile-btn:hover {
    background-color: #2980B9;
}

.arrow-left { left: 0; bottom: 70px; }
.arrow-right { left: 70px; bottom: 70px; }
.arrow-up { left: 70px; bottom: 135px; }
.arrow-down { left: 70px; bottom: 5px; }
.shoot-btn { right: 20px; bottom: 20px; position: absolute; }

/* Visa endast på mobila skärmar (max 600px bredd) */
@media (max-width: 600px) {
    .mobile-controls {
        display: flex;
        flex-wrap: wrap;
    }
}
