const canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  canvasContainer = document.getElementById("canvas-container"),
  dropdown = document.getElementsByClassName("dropdown")[0],
  pickASort = document.getElementById("pick-a-sort"),
  DPI = window.devicePixelRatio,
  dropdownContent = document.getElementById("dropdown-content");

let array,
  drawVis,
  animations,
  width = canvasContainer.clientWidth,
  height = canvasContainer.clientHeight,
  navbtn = [...document.getElementsByClassName("nav-btn")],
  resizeEnd,
  resizing = false,
  generate = false;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

window.addEventListener("resize", () => {
  resizing = true;
  navbtn = [...document.getElementsByClassName("nav-btn")];

  //Change resizing to false once resize is done firing
  clearTimeout(resizeEnd);
  resizeEnd = setTimeout(() => {
    resizing = false;
    width = canvasContainer.clientWidth;
    height = canvasContainer.clientHeight;
    init();
  }, 500);
});

dropdown.addEventListener("mouseleave", () => {
  dropdownContent.className = "hidden";
});

document.getElementById("canvas-container").addEventListener("click", () => {
  console.log("click");
  dropdownContent.className = "hidden";
});

navbtn.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id === "gen-new-arr") {
      generate = true;
      init();
    } else if (button.id === "pick-a-sort") {
      toggleDropdownContent();
    } else {
      pickASort.disabled = true;

      generate = false;
      toggleDropdownContent();
      setSortAnimations(button.id);
    }
  });
});

function init() {
  pickASort.disabled = false;

  array = getArray();
  setCanvasSize();
  drawArrayBars();
}

function setCanvasSize() {
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  canvas.width = Math.floor(width * DPI);
  canvas.height = Math.floor(height * DPI);

  width = width;
  height = height;

  ctx.scale(DPI, DPI);
}

function getArraySize() {
  let arraySize = Math.floor(width / 18);

  return arraySize < 50 ? arraySize : 50;
}

function getArray() {
  const arr = [];

  for (let i = 0; i < getArraySize(); i++) {
    arr.push(this.getRandomInt(5, 100));
  }

  const MAX = Math.max(...arr),
    hMult = Number(((height - 10) / MAX).toFixed(2));

  return arr.map((x) => Math.floor(x * hMult));
}

function drawArrayBars() {
  const size = array.length;

  let startingPoint = (width - size * 18 + 6) / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#29a382";

  let x = startingPoint;
  for (let i = 0; i < size; i++) {
    roundRect(ctx, x, height - array[i], 12, array[i], 4, true);
    x += 18;
  }
}

function setSortAnimations(choice) {
  let animations;

  if (choice === "bubble-sort") {
    animations = bubbleSort(array);
  } else if (choice === "selection-sort") {
    animations = selectionSort(array);
  } else if (choice === "insertion-sort") {
    animations = insertionSort(array);
  } else if (choice === "quick-sort") {
    animations = animateQuickSort(array);
  } else if (choice === "merge-sort") {
    animations = animateMergeSort(array);
  } else if (choice === "bead-sort") {
    animations = beadSort(array);
  } else if (choice === "heap-sort") {
    animations = heapSort(array);
  } else if (choice === "radix-sort") {
    animations = radixSort(array);
  }

  visualize(animations);
}

function visualize(animations) {
  let counter = 0,
    l = array.length,
    startingPoint = (width - l * 18 + 6) / 2;

  const draw = () => {
    if (counter === animations.length) {
      setTimeout(init, 1000);
      return;
    }

    if (resizing === true) {
      return;
    }

    if (generate === true) {
      generate = false;
      init();
      return;
    }

    let x = startingPoint;

    setTimeout(() => {
      requestAnimationFrame(draw);

      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < l; i++) {
        if (i === animations[counter][2] && counter < animations.length - 1) {
          ctx.fillStyle = "#38316a";
        } else if (
          (i === animations[counter][1] || i === animations[counter][3]) &&
          counter < animations.length - 1
        ) {
          ctx.fillStyle = "red";
        } else {
          ctx.fillStyle = "#29a382";
        }

        roundRect(
          ctx,
          x,
          height - animations[counter][0][i],
          12,
          animations[counter][0][i],
          4,
          true
        );
        x += 18;
      }

      counter++;
    }, 10000 / animations.length);
  };

  draw();
}

function toggleDropdownContent() {
  if (dropdownContent.className === "hidden") {
    dropdownContent.className = "show";
  } else {
    dropdownContent.className = "hidden";
  }
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} radius 
 * @param {Number} [radius.tl = 0]
 * @param {Number} [radius.tr = 0] 
 * @param {Number} [radius.br = 0]
 * @param {Number} [radius.bl = 0]
 * @param {boolean} fill 
 */
function roundRect(ctx, x, y, width, height, radius, fill) {
  radius = { tl: radius, tr: radius, br: radius, bl: radius };
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  ctx.stroke();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
