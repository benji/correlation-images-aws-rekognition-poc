function td(innerElement) {
  const td = $('<td></td>');
  if (innerElement) td.append(innerElement);
  return td;
}

function img(i) {
  return $('<img src="images/' + files[i] + '"/>');
}

function tdImg(i) {
  return td(img(i));
}

function tdText(t) {
  return td($('<span>' + t + '</span>'));
}

function tdStat(v, i, j, cssClass) {
  const a = $('<a href="javascript:showStats(' + i + ',' + j + ')"></a>');
  a.text(v);
  const e = td(a);
  e.addClass(cssClass);
  return e;
}

function showStats(i, j) {
  const s = $('#stats');
  s.empty();
  s.append(img(i));
  s.append(img(j));

  $('#myModalLabel').empty();
  $('#myModalLabel').append(data[i][j] + '%');

  $('#myModal').modal('show')
}

let files;
let data;

$(document).ready(function () {
  $.getJSON('rmatrix.json', function (res) {
    files = res.filenames;
    data = res.similarities_matrix;
    console.log(data);

    const table = $('table#matrix');

    // first line of labels
    const trVLabels = $('<tr></tr>');
    trVLabels.append(td()); // top left empty
    for (let j = 0; j < data.length; j++) trVLabels.append(tdImg(j));
    table.append(trVLabels);

    for (let i = 0; i < data.length; i++) {
      const tr = $('<tr></tr>');
      tr.append(tdImg(i));

      for (let j = 0; j < data.length; j++) {
        let v = data[i][j];
        let cssClass = '';
        if (v) {
          v = Math.floor(v);
          if (v < 25) cssClass = 'color-red2'
          else if (v < 50) cssClass = 'color-red1'
          else if (v < 75) cssClass = 'color-green1'
          else cssClass = 'color-green2'
        }
        if (i == j) v = 100;
        tr.append(tdStat(v, i, j, cssClass));
      }
      table.append(tr);
    }
  });
});