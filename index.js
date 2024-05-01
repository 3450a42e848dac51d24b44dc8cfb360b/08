const canvas = document.getElementById("canvas").getContext("2d");

let plot = undefined;

const setup = () => {
  plot = new Chart(canvas, {
    type: "line",
    data: { datasets: [] },
  });

  const [lambda, n, d, L] = [630, 1, 0.12, 1];

  document.getElementById("lambda").value = lambda;
  document.getElementById("n").value = n;
  document.getElementById("d").value = d;
  document.getElementById("L").value = L;

  make_plot(make_data(lambda, n, d, L));
}

const make_plot = (data) => {
  plot.destroy();
  plot = new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Интенсивность",
          borderColor: "rgba(200, 77, 123, .8)",
          data: data,
          lineTension: 0.4,
          pointRadius: 0
        },
      ]
    },
    options: {
      bezierCurve: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "x, м" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "I, Вт / м^2" }
        }
      },
      layout: {
        padding: 50,
      },
    }
  });
}

const make_data = (lambda, n, d, L) => {
  const result = [];
  const i0 = 1;
  lambda = lambda / Math.pow(10, 9); // nano metre -> metre
  d = d / Math.pow(10, 3); // milli metre -> metre

  const deltaX = lambda * L / (n * d);
  const left_border = -deltaX * 5
  const right_border = deltaX * 5;
  const size = right_border - left_border;
  const step = size / 1000;

  for (let x = left_border; x < right_border; x += step) {
    const s1m = Math.sqrt(L * L + (x - d / 2) * (x - d / 2));
    const s2m = Math.sqrt(L * L + (x + d / 2) * (x + d / 2));
    const Delta = n * s1m - n * s2m;
    const delta = 2 * Math.PI * Delta / lambda;
    result.push({
      x: x,
      y: 2 * i0 * (1 + Math.cos(delta))
    });
  }

  return result;
}

const parse_input = () => {
  return [
    parseFloat(document.getElementById("lambda").value),
    parseFloat(document.getElementById("n").value),
    parseFloat(document.getElementById("d").value),
    parseFloat(document.getElementById("L").value),
  ]
}

const run = () => {
  const [lambda, n, d, L] = parse_input();
  if (isNaN(lambda) || isNaN(n) || isNaN(d) || isNaN(L)) {
    alert("Некорретный ввод!");
    return;
  }
  if (lambda <= 0 || n < 1 || d <= 0 || L <= 0) {
    alert("Некорретный ввод!");
    return;
  }
  make_plot(make_data(lambda, n, d, L));
}
