import "./styles/main.css";
import { initProfileView } from "./ui/profileView.js";
import { saveProfile } from "./storage/sessionStore.js";

initProfileView(saveProfile);
