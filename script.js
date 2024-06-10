let userData = {
    coins: 0,
    clickRate: 1,
    clickLimit: 5,
    clickValue: 1,
    upgradeCost: 100,
    upgradeValueCost: 100,
    clicks: 0,
    lastClickTime: Date.now(),
    upgradeClickLevel: 1,
    upgradeValueLevel: 1,
    maxUpgradeLevel: 50
};

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
            userData = { ...userData, ...data };
            updateDisplay();
        });
});

function saveState() {
    fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
}

function updateDisplay() {
    document.getElementById('coins').innerText = userData.coins;
    document.getElementById('clickRate').innerText = userData.clickRate;
    document.getElementById('clickValue').innerText = userData.clickValue;
    document.getElementById('upgradeCost').innerText = userData.upgradeCost;
    document.getElementById('upgradeValueCost').innerText = userData.upgradeValueCost;
    document.getElementById('clicks').innerText = userData.clicks;
    document.getElementById('upgradeClickLevel').innerText = userData.upgradeClickLevel;
    document.getElementById('upgradeValueLevel').innerText = userData.upgradeValueLevel;
}

function upgradeClick() {
    if (userData.upgradeClickLevel >= userData.maxUpgradeLevel) {
        alert("شما به حداکثر سطح ارتقا رسیده‌اید.");
        return;
    }
    
    if (userData.coins >= userData.upgradeCost) {
        userData.coins -= userData.upgradeCost;
        userData.clickRate++;
        userData.clickLimit++;
        userData.upgradeCost *= 2;
        userData.upgradeClickLevel++;
        updateDisplay();
        saveState();
    } else {
        alert("شما به اندازه کافی سکه برای ارتقا ندارید.");
    }
}

function upgradeClickValue() {
    if (userData.upgradeValueLevel >= userData.maxUpgradeLevel) {
        alert("شما به حداکثر سطح ارتقا رسیده‌اید.");
        return;
    }
    
    if (userData.coins >= userData.upgradeValueCost) {
        userData.coins -= userData.upgradeValueCost;
        userData.clickValue++;
        userData.upgradeValueCost *= 2;
        userData.upgradeValueLevel++;
        updateDisplay();
        saveState();
    } else {
        alert("شما به اندازه کافی سکه برای ارتقا ندارید.");
    }
}

function handleClick() {
    let now = Date.now();
    let elapsedTime = now - userData.lastClickTime;
    if (elapsedTime < 1000 / userData.clickLimit) {
        alert("شما به حداکثر تعداد کلیک در ثانیه رسیده‌اید.");
        return;
    }
    userData.clicks++;
    userData.coins += userData.clickValue;
    userData.lastClickTime = now;
    updateDisplay();

    const button = document.getElementById("coinButton");
    button.classList.add("button-clicked");

    button.addEventListener("animationend", () => {
        button.classList.remove("button-clicked");
    }, { once: true });

    saveState();
}