const tds = Array.from(document.querySelectorAll('td'));

tds.forEach((td) => {
  td.innerHTML = td.innerHTML.replace(/\.0$/, '');
});
