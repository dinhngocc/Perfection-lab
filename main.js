// --- 1. DOM ELEMENTS ---
const btnStart = document.getElementById("btnStart");
const landingContent = document.getElementById("landing-content");
const modalName = document.getElementById("modalName");
const nameInput = document.getElementById("nameInput");
const modalConfirm = document.getElementById("modalConfirm");
const displayName = document.getElementById("displayName");
const btnYes = document.querySelectorAll(".js-btn-yes");

const sceneClinic = document.getElementById("scene-clinic");
const imgLamp = document.querySelector(".img-lamp");
const imgLight = document.querySelector(".img-light");
const imgKnifePlate = document.querySelector(".img-knife-plate");

// Person Elements
const personWrapper = document.querySelector(".person-wrapper");
const personFull = document.getElementById("person-full");
const editableFace = document.getElementById("editable-face");
const faceZones = document.querySelectorAll(".face-zone");

// Modals
const modalInstruction = document.querySelector("#modalInstruction");
const modalOverlay = document.querySelector("#modalOverlay");
const btnDismissInstruction = document.querySelector("#btnDismissInstruction");
const modalSuccess = document.querySelector("#modalSuccess");
const nextLevelBtns = document.querySelectorAll(".js-btn-continue");

const modalFinal = document.getElementById("modalFinal");
const restartBtns = document.querySelectorAll(".js-btn-restart");

// State Variables
let isLampTurnedOn = false;
let isPlateClicked = false;

// --- GAME STATE ---
let currentLevel = 1;
const maxLevels = 3;

// Theo dõi tiến độ
let progressTracker = {
  face: false,
  "brows-nose": false,
  eyes: false,
  mouth: false,
};

// --- 2. LOGIC SỰ KIỆN CƠ BẢN ---

// START GAME
btnStart.addEventListener("click", () => {
  landingContent.classList.add("fade-out");
  setTimeout(() => {
    landingContent.style.display = "none";
    modalName.classList.remove("hidden");
    nameInput.focus();
  }, 500);
});

// NHẬP TÊN
nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const userName = nameInput.value.trim();
    if (userName !== "") {
      displayName.textContent = userName;
      modalName.classList.add("hidden");
      modalConfirm.classList.remove("hidden");
    }
  }
});

// XÁC NHẬN VÀO PHÒNG
btnYes.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalConfirm.classList.add("hidden");
    sceneClinic.classList.remove("hidden");
    setTimeout(() => {
      sceneClinic.classList.add("fade-in");
    }, 50);
  });
});

// BẬT ĐÈN
imgLamp.addEventListener("click", () => {
  if (isLampTurnedOn) return;
  isLampTurnedOn = true;

  // Hiệu ứng đèn hỏng
  imgLight.classList.add("reveal");
  imgLight.classList.add("flicker-active");
  imgLamp.classList.add("lamp-clicked");

  // Sau 1.5s thì hiện người
  setTimeout(() => {
    personWrapper.classList.add("reveal");
    imgKnifePlate.classList.add("reveal");
  }, 1500);

  imgLamp.style.animation = "none";
});

// BẤM KHAY -> HƯỚNG DẪN
imgKnifePlate.addEventListener("click", () => {
  if (!isPlateClicked) {
    modalOverlay.classList.remove("hidden");
    modalInstruction.classList.remove("hidden");
    setTimeout(() => {
      modalOverlay.classList.add("fade-in");
      modalInstruction.classList.add("fade-in");
    }, 10);
    isPlateClicked = true;
  }
});

// TẮT HƯỚNG DẪN -> VÀO CHẾ ĐỘ CHỈNH SỬA
btnDismissInstruction.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
  modalInstruction.classList.add("hidden");

  personFull.classList.add("transparent-mode");
  editableFace.classList.remove("hidden");
});

// --- 3. LOGIC GAMEPLAY (BIẾN HÌNH) ---

// Map tên vùng chọn sang tên file ảnh
function mapPartKeyToFilename(key) {
  if (key === "brows-nose") return "brow_nose";
  if (key === "eyes") return "eye";
  return key;
}

function handlePartClick(partKey) {
  if (progressTracker[partKey] === true) return;

  // 1. Đổi ảnh
  const filePrefix = mapPartKeyToFilename(partKey);
  const filename = `${filePrefix}_style_${currentLevel}.svg`;

  const imgElement = document.getElementById(`current-${partKey}`);
  if (imgElement) {
    imgElement.src = `./assets/${filename}`;
  }

  // 2. Cập nhật trạng thái
  progressTracker[partKey] = true;

  // 3. Kiểm tra xem xong hết chưa
  checkLevelCompletion();
}

function checkLevelCompletion() {
  const allDone = Object.values(progressTracker).every(
    (status) => status === true,
  );

  if (allDone) {
    if (currentLevel === maxLevels) {
      setTimeout(() => {
        triggerFinalMelting();
      }, 500);
    } else {
      setTimeout(() => {
        modalSuccess.classList.remove("hidden");
      }, 500);
    }
  }
}

// Sự kiện Click vào các vùng mặt
faceZones.forEach((zone) => {
  zone.addEventListener("click", (e) => {
    e.stopPropagation();
    const partKey = zone.getAttribute("data-part");
    handlePartClick(partKey);
  });
});

// --- 4. SỰ KIỆN 2 NÚT YES (NEXT LEVEL) ---
nextLevelBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modalSuccess.classList.add("hidden");

    if (currentLevel < maxLevels) {
      currentLevel++;

      // Reset tiến độ về false
      for (let key in progressTracker) {
        progressTracker[key] = false;
      }
    } else {
      alert("Perfection Achieved.");
      location.reload();
    }
  });
});

function triggerFinalMelting() {
  // 1. Tắt hết các tương tác click
  faceZones.forEach((zone) => (zone.style.display = "none"));

  // 2. Lấy tất cả các layer ảnh trên mặt
  const allParts = document.querySelectorAll(".changed-part, .img-person-base");

  // 3. Thêm class animation cho từng bộ phận
  allParts.forEach((part, index) => {
    setTimeout(() => {
      part.classList.add("melting-active");
    }, index * 100);
  });

  // 4. Sau khi tan chảy hết thì hiện modal final
  setTimeout(() => {
    modalFinal.classList.remove("hidden");
  }, 6000);
}

restartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    location.reload();
  });
});
