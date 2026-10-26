import "./styles/main.css";
import { getProfile, saveProfile, clearProfile } from "./storage/sessionStore.js";
import { initProfileView, resetProfileView } from "./ui/profileView.js";
import { renderPlayerHeader } from "./ui/gameView.js";

const profileSection = document.getElementById("profile-section");
const gameSection = document.getElementById("game-section");
const logoutBtn = document.getElementById("logout-btn");

function showGameScreen(profile) {
  renderPlayerHeader(profile);
  profileSection.hidden = true;
  gameSection.hidden = false;
}

function showProfileScreen() {
  gameSection.hidden = true;
  profileSection.hidden = false;
}

logoutBtn?.addEventListener("click", () => {
  clearProfile();
  resetProfileView();
  showProfileScreen();
});

initProfileView((profile) => {
  saveProfile(profile);
  showGameScreen(profile);
});

const currentProfile = getProfile();
if (currentProfile) {
  showGameScreen(currentProfile);
} else {
  showProfileScreen();
}
