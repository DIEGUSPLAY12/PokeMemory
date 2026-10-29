import "./styles/main.css";
import { getProfile, saveProfile, clearProfile } from "./storage/sessionStore.js";
import { initProfileView, resetProfileView } from "./ui/profileView.js";
import { renderPlayerHeader, initGameSetup } from "./ui/gameView.js";
import { renderRanking } from "./ui/rankingView.js";
import { startGame, cancelGame } from "./game/gameController.js";

const profileSection = document.getElementById("profile-section");
const gameSection = document.getElementById("game-section");
const logoutButton = document.getElementById("logout-btn");

function showGameScreen(profile) {
  renderPlayerHeader(profile);
  profileSection.hidden = true;
  gameSection.hidden = false;
}

function showProfileScreen() {
  gameSection.hidden = true;
  profileSection.hidden = false;
}

logoutButton?.addEventListener("click", () => {
  cancelGame();
  clearProfile();
  resetProfileView();
  showProfileScreen();
});

initProfileView((profile) => {
  saveProfile(profile);
  showGameScreen(profile);
});

initGameSetup(startGame);
renderRanking();

const currentProfile = getProfile();
if (currentProfile) {
  showGameScreen(currentProfile);
} else {
  showProfileScreen();
}
