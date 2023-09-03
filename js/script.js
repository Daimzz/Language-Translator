import { countries } from "./countries.js";
const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("button");
const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected =
      id == 0
        ? country_code == "en-GB"
          ? "selected"
          : ""
        : country_code == "ru-RU"
        ? "selected"
        : "";
    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});
//Меняем местами между собой тексты и языки местами по клику на иконке
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;
  let tempTag = selectTag[0].value;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempTag;
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value,
    translateFrom = selectTag[0].value, //Получаем значения кода страны из певого селекта, например en-GB
    translateTo = selectTag[1].value; //Получаем значения кода страны из второго селекта, например ru-RU
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  //Фетчим ответ на перевод текста с сервера
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        //По клику на иконку копируем текст в буфер обмена
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value; //Определяем каким языком будет читаться текст
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value; //Определяем каким языком будет читаться текст
      }
      speechSynthesis.speak(utterance); //Воспроизведение голоса
    }
  });
});
