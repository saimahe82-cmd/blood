import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

/* 🔥 FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyBmxir3BhXwb78OywXR2UJYl-GVhAnV-mM",
  authDomain: "blood-3d815.firebaseapp.com",
  projectId: "blood-3d815",
  storageBucket: "blood-3d815.appspot.com",
  messagingSenderId: "1009580408362",
  appId: "1:1009580408362:web:e5dbaf68260c9736f00d53"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 🔒 OFFLINE + REFRESH SAFE */
enableIndexedDbPersistence(db).catch(() => {
  console.log("Offline persistence already enabled");
});

/* ELEMENTS */
const home = document.getElementById("home");
const donationForm = document.getElementById("donationForm");
const needForm = document.getElementById("needForm");
const results = document.getElementById("results");

/* NAVIGATION */
window.showDonation = () => {
  hideAll();
  donationForm.classList.remove("hidden");
};

window.showNeed = () => {
  hideAll();
  needForm.classList.remove("hidden");
};

window.goHome = () => {
  hideAll();
  home.classList.remove("hidden");
};

function hideAll() {
  home.classList.add("hidden");
  donationForm.classList.add("hidden");
  needForm.classList.add("hidden");
}

/* DATE TOGGLE */
window.toggleDate = (show) => {
  document.getElementById("donationDate")
    .classList.toggle("hidden", !show);
};

/* REGISTER DONOR */
window.registerDonor = async () => {
  await addDoc(collection(db, "donors"), {
    name: donorName.value,
    blood: donorBlood.value.toUpperCase(),
    mobile: donorMobile.value,
    district: donorDistrict.value.toLowerCase(),
    donatedBefore: document.querySelector('input[name="prev"]:checked')?.nextSibling?.textContent || "No",
    date: donationDate.value || "First Time",
    createdAt: serverTimestamp()
  });

  alert("Thank you for donating ❤️");
  goHome();
};

/* SEARCH DONORS */
window.searchDonors = async () => {
  results.innerHTML = "";

  const q = query(
    collection(db, "donors"),
    where("blood", "==", searchBlood.value.toUpperCase()),
    where("district", "==", searchDistrict.value.toLowerCase())
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    results.innerHTML = "<p>No donors found.</p>";
    return;
  }

  snapshot.forEach(doc => {
    const d = doc.data();
    results.innerHTML += `
      <div class="donor">
        <strong>${d.name}</strong><br>
        📞 <a href="tel:${d.mobile}">${d.mobile}</a><br>
        🩸 ${d.blood}
      </div>
    `;
  });
};
