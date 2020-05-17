angular.module('adminWebpage.addCardModal', ['adminWebpage.addCard']).directive('cardmodal', function () {
  return {
    template:
    '<div class="modal fade">' +
      '<div class="modal-dialog">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h2 class="alone-header" style="text-align: left; font-size: 15px; display: inline-block;">Agregar Tarjeta de Crédito</h2>' +
          '</div>' +
          '<div class="modal-body" ng-controller="AddCardController">' +
            '<form ng-submit="addCard(info)">' +
              '<div class="form-group">' +
                '<label for="sel1">Nombre del Titular: </label>' +
                '<input type="text" class="form-control" placeholder="Nombre" ng-model="info.name" >' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="sel1">Número de Tarjeta: </label>' +
                '<input type="text" class="form-control" placeholder="Numero" ng-model="info.number" >' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="sel1">Mes de Vencimiento: </label>' +
                '<select class="form-control" ng-model="info.exp_month">' +
                  '<option value="01">01</option>' +
                  '<option value="02">02</option>' +
                  '<option value="03">03</option>' +
                  '<option value="04">04</option>' +
                  '<option value="05">05</option>' +
                  '<option value="06">06</option>' +
                  '<option value="07">07</option>' +
                  '<option value="08">08</option>' +
                  '<option value="09">09</option>' +
                  '<option value="10">10</option>' +
                  '<option value="11">11</option>' +
                  '<option value="12">12</option>' +
                '</select>' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="sel1">Año de Vencimiento: </label>' +
                '<select class="form-control" ng-model="info.exp_year">' +
                  '<option value="2017">2017</option>' +
                  '<option value="2018">2018</option>' +
                  '<option value="2019">2019</option>' +
                  '<option value="2020">2020</option>' +
                  '<option value="2021">2021</option>' +
                  '<option value="2022">2022</option>' +
                  '<option value="2023">2023</option>' +
                  '<option value="2024">2024</option>' +
                  '<option value="2025">2025</option>' +
                '</select>' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="sel1">CVV: </label>' +
                '<input type="text" class="form-control" placeholder="CVV (Tres digitos, 4 en AMEX)" ng-model="info.cvc" >' +
              '</div>' +
              '<input type="submit" class="btn btn-submit btn-shadow btn-full" value="Guardar Tarjeta">' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>',
    restrict: 'E',
    transclude: true,
    replace:true,
    scope:true,
    link: function postLink(scope, element, attrs) {
      scope.title = attrs.title;
      scope.$watch(attrs.visible, function(value){
        if(value == true) {
          $(element).modal('show');
        } else {
          $(element).modal('hide');
        }
      });
      $(element).on('shown.bs.modal', function(){
        scope.$apply(function(){
          scope.$parent[attrs.visible] = true;
        });
      });

      $(element).on('hidden.bs.modal', function(){
        scope.$apply(function(){
          scope.$parent[attrs.visible] = false;
        });
      });
    }
  };
})
