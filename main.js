(function (DOM) {
  'use strict';
function app () {
  return {
    init: function init () {
      this.bindEvents();
      this.getCompanyInfo();
    },

    getCompanyInfo: function getCompanyInfo () {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', 'company.json', true);
      //ajax.send();
      ajax.addEventListener('readystatechange', this.handleReadyStateChange, false);
    },

    handleReadyStateChange: function handleReadyStateChange () {
      if (app().isReady.call(this)) {
        app().populateCompanyInfo.call(this)
      }
    },

    populateCompanyInfo: function populateCompanyInfo () {
      var companyInfo = JSON.parse(this.responseText);
      new DOM('[data-js="company-name"]').get(0)[0].textContent = companyInfo.name;
      new DOM('[data-js="company-phone"]').get(0)[0].textContent = companyInfo.phone;
    },

    isReady: function isReady () {
      return this.readyState === 4 && this.status === 200;
    },

    bindEvents: function bindEvents () {
      var $formRegister = new DOM('[data-js="form-register"]');

      $formRegister.on('submit', this.handleSubmit);
    },

    handleSubmit: function handleSubmit (e) {
      e.preventDefault();

      var $tableCarsTbody = new DOM('[data-js="table-cars"] tbody').get(0)[0];

      var $fragment = app().createNewCar();
      $tableCarsTbody.appendChild($fragment);
      app().bindEventRemoveCar($fragment);
    },

    createNewCar: function createNewCar () {
      var $fragment = document.createDocumentFragment();
      var $tr = document.createElement('tr');
      var $tdImage = document.createElement('td');
      var $image = document.createElement('img');
      var $tdModel = document.createElement('td');
      var $tdYear = document.createElement('td');
      var $tdPlate = document.createElement('td');
      var $tdColor = document.createElement('td');
      var $tdAction = document.createElement('td');
      var $button = document.createElement('button');

      $image.src = new DOM('[data-js="image"]').get(0)[0].value;
      $tdImage.appendChild($image);

      $button.textContent = 'Remover';
      $button.classList.add('btn');
      $button.setAttribute('data-js', 'btn-remove');
      $tdAction.appendChild($button);

      $tdModel.textContent = new DOM('[data-js="model"]').get(0)[0].value;
      $tdYear.textContent = new DOM('[data-js="year"]').get(0)[0].value;
      $tdPlate.textContent = new DOM('[data-js="plate"]').get(0)[0].value;
      $tdColor.textContent = new DOM('[data-js="color"]').get(0)[0].value;

      $tr.appendChild($tdImage);
      $tr.appendChild($tdModel);
      $tr.appendChild($tdYear);
      $tr.appendChild($tdPlate);
      $tr.appendChild($tdColor);
      $tr.appendChild($tdAction);

      return $fragment.appendChild($tr);
    },

    bindEventRemoveCar: function bindEventRemoveCar ($fragment) {
      $fragment.querySelector('[data-js="btn-remove"]').addEventListener('click', app().handleRemove);
    },

    handleRemove: function handleRemove (e) {
      var $tableCarsTbody = new DOM('[data-js="table-cars"] tbody').get(0)[0];
      var $tr = this.parentNode.parentNode;

      $tableCarsTbody.removeChild($tr);
    },
  };
}

app().init();
}) (DOM);
