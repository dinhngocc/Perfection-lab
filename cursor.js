new p5((p) => {
  let knifeImg;

  p.preload = () => {
    // Đảm bảo ảnh đã tách nền và đặt đúng chỗ
    knifeImg = p.loadImage("./assets/knife.svg");
  };

  p.setup = () => {
    let container = document.getElementById("cursor-container");
    let c = p.createCanvas(container.offsetWidth, container.offsetHeight);
    c.parent("cursor-container");
    p.noCursor();
  };

  p.draw = () => {
    p.clear();

    let x = p.mouseX;
    let y = p.mouseY;

    p.push();
    p.translate(x, y);

    // --- VẼ ẢNH ---
    p.imageMode(p.CENTER);

    p.image(knifeImg, 0, 0, 60, 60);

    p.pop();
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
});
