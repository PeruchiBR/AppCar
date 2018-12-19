(function(DOM) {
  'use strict';

  var app = (function appController() {
    return {
      init: function init() {
        this.bindEvents();
        this.getCompanyInfo();
        this.getCarsFromApi();
      },

      getTbodyCarsTable() {
        return new DOM('[data-js="table-cars"] tbody').get(0)[0];
      },

      getCarsFromApi: function getCarsFromApi() {
        var $tableCarsTbody = this.getTbodyCarsTable();
        $tableCarsTbody.innerHTML = '';
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:3000/car');
        ajax.send();
        ajax.addEventListener(
          'readystatechange',
          this.handleReadyStateChangeCar
        );
      },

      handleReadyStateChangeCar: function handleReadyStateChangeCar() {
        if (app.isRequestOk(this)) {
          app.populateCarsFromApi(this.responseText);
        }
      },

      isRequestOk: function isRequestOk(ajax) {
        return ajax.readyState === 4 && ajax.status === 200;
      },

      populateCarsFromApi: function populateCarsFromApi(responseText) {
        var cars = JSON.parse(responseText);
        var $tableCarsTbody = app.getTbodyCarsTable();

        cars.forEach(function(car) {
          var $fragment = app.createNewCar(car);
          $tableCarsTbody.appendChild($fragment);
          app.bindEventRemoveCar($fragment);
        });
      },

      getCompanyInfo: function getCompanyInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'company.json', true);
        ajax.send();
        ajax.addEventListener(
          'readystatechange',
          this.handleReadyStateChange,
          false
        );
      },

      handleReadyStateChange: function handleReadyStateChange() {
        if (app.isReady.call(this)) {
          app.populateCompanyInfo.call(this);
        }
      },

      populateCompanyInfo: function populateCompanyInfo() {
        var companyInfo = JSON.parse(this.responseText);
        new DOM('[data-js="company-name"]').get(0)[0].textContent =
          companyInfo.name;
        new DOM('[data-js="company-phone"]').get(0)[0].textContent =
          companyInfo.phone;
      },

      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      },

      bindEvents: function bindEvents() {
        var $formRegister = new DOM('[data-js="form-register"]');

        $formRegister.on('submit', this.handleSubmit);
      },

      handleSubmit: function handleSubmit(e) {
        e.preventDefault();

        var $tableCarsTbody = app.getTbodyCarsTable();

        var car = {
          image: new DOM('[data-js="image"]').get(0)[0].value,
          brandModel: new DOM('[data-js="model"]').get(0)[0].value,
          year: new DOM('[data-js="year"]').get(0)[0].value,
          plate: new DOM('[data-js="plate"]').get(0)[0].value,
          color: new DOM('[data-js="color"]').get(0)[0].value
        };

        app.saveCarApi(car);
      },

      saveCarApi: function saveCarApi(car) {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/car');
        ajax.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );
        ajax.send(
          'image=' +
            car.image +
            '&brandModel=' +
            car.brandModel +
            '&year=' +
            car.year +
            '&plate=' +
            car.plate +
            '&color=' +
            car.color
        );
        ajax.addEventListener(
          'readystatechange',
          this.handleReadyStateChangeSaveCar
        );
      },

      handleReadyStateChangeSaveCar: function handleReadyStateChangeSaveCar() {
        if (app.isRequestOk(this)) {
          app.getCarsFromApi();
        }
      },

      createNewCar: function createNewCar(car) {
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

        $image.src = car.image;
        $tdImage.appendChild($image);

        $button.textContent = 'Remover';
        $button.classList.add('btn');
        $button.setAttribute('data-js', 'btn-remove');
        $tdAction.appendChild($button);

        $tdModel.textContent = car.brandModel;
        $tdYear.textContent = car.year;
        $tdPlate.textContent = car.plate;
        $tdColor.textContent = car.color;

        $tr.appendChild($tdImage);
        $tr.appendChild($tdModel);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdPlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdAction);

        return $fragment.appendChild($tr);
      },

      bindEventRemoveCar: function bindEventRemoveCar($fragment) {
        $fragment
          .querySelector('[data-js="btn-remove"]')
          .addEventListener('click', app.handleRemove);
      },

      handleRemove: function handleRemove(e) {
        var $tableCarsTbody = new DOM('[data-js="table-cars"] tbody').get(0)[0];
        var $tr = this.parentNode.parentNode;

        $tableCarsTbody.removeChild($tr);
      }
    };
  })();

  app.init();
})(DOM);
