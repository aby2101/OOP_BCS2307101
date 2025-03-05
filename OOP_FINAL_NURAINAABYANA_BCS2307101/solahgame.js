const prayers = document.querySelectorAll('.prayer-list li');
const message = document.getElementById('message');
const pointsDisplay = document.getElementById('points');
const avatarsContainer = document.getElementById('avatars');
const doneButton = document.getElementById('doneButton');
let completedCount = 0;
let points = localStorage.getItem('points') ? parseInt(localStorage.getItem('points')) : 0;
let avatarUnlocked = localStorage.getItem('avatarUnlocked') ? parseInt(localStorage.getItem('avatarUnlocked')) : 0;

// Update points display on page load
pointsDisplay.textContent = `Points: ${points}`;

// Load avatar on page load
loadAvatar();

prayers.forEach(prayer => {
    prayer.addEventListener('click', () => {
        if (prayer.classList.contains('completed')) {
            prayer.classList.remove('completed');
            completedCount--;
        } else {
            prayer.classList.add('completed');
            completedCount++;
        }
    });
});

doneButton.addEventListener('click', () => { 
    if (completedCount >= 5) {
        points += 10; //point increase by 10
        message.textContent = "Great job! You earned 10 points! 🌟";
        message.className = "success";
    } else {
        points -= 10; //point decrease by 10
        if (points < 0) points = 0; // Prevent negative points
        message.textContent = "You missed some prayers! 10 points deducted. 🙁";
        message.className = "error";
    }
    localStorage.setItem('points', points); // Store updated points
    checkAvatarReward();
    pointsDisplay.textContent = `Points: ${points}`;
    completedCount = 0;
    prayers.forEach(prayer => prayer.classList.remove('completed'));
});

function checkAvatarReward() {
    let newAvatarUnlocked = 0;
    let avatarSize = 0;
    
    if (points >= 200) {
        newAvatarUnlocked = 6; //number for the avatar api
        avatarSize = 60;
    } else if (points >= 150) {
        newAvatarUnlocked = 14;//number for the avatar api
        avatarSize = 50;
    } else if (points >= 100) {
        newAvatarUnlocked = 26;//number for the avatar api
        avatarSize = 40;
    } else if (points >= 50) {
        newAvatarUnlocked = 19;//number for the avatar api
        avatarSize = 30;
    }
    
    avatarUnlocked = newAvatarUnlocked;
    localStorage.setItem('avatarUnlocked', avatarUnlocked);
    localStorage.setItem('avatarSize', avatarSize);
    loadAvatar();
}

function loadAvatar() {
    avatarsContainer.innerHTML = "";
    if (avatarUnlocked > 0) {
        let avatarSize = localStorage.getItem('avatarSize') ? parseInt(localStorage.getItem('avatarSize')) : 0;
        let avatar = document.createElement('img');
        avatar.classList.add('avatar');
        avatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=Avatar${avatarUnlocked}`; //avatar api
        avatar.style.width = `${avatarSize}px`;
        avatarsContainer.appendChild(avatar);
    }
}
