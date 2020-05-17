angular.module('adminWebpage.services', []).directive('services', function () {
  return {
    template:
    '<div class="width100" style="padding-top:35px;padding-bottom: 70px;">'+
      '<div class="container">'+
        '<div class="row">'+
          '<div class="col-md-8 col-md-offset-2 text-center">'+
            '<h2>¿Tienes un establecimiento?</h2>'+
            '<p>Conoce nuestros servicios</p>'+
          '</div>'+
        '</div>'+
        '<slick style="margin: 0; margin-top: 20px;" dots=true autoplay-speed="3000" autoplay="true" responsive="breakpoints" slides-to-show="3" settings="slickConfig" slides-to-scroll="3">'+
          '<div class="text-center">'+
            '<strong><p class="margin-text highlight-service">Reservaciones</p></strong>'+
            '<p class="margin-text semi-full-text">Sin importar el numero de mesas o personas registradas, el servicio es ilimitado durante toda la suscripción.</p>'+
          '</div>'+
          '<div class="text-center">'+
            '<strong><p class="margin-text highlight-service">Para Llevar</p></strong>'+
            '<p class="margin-text semi-full-text">El usuario puede seleccionar la hora que pasara por el pedido y solamente esperar tu confirmación.</p>'+
          '</div>'+
          '<div class="text-center">'+
            '<strong><p class="margin-text highlight-service">A Domicilio</p></strong>'+
            '<p class="margin-text semi-full-text">Puedes especificar el pedido mínimo necesario para una orden a domicilio y el precio de entrega.</p>'+
          '</div>'+
          '<div class="text-center">'+
            '<strong><p class="margin-text highlight-service">Promociones</p></strong>'+
            '<p class="margin-text semi-full-text">Las promociones las  pueden ver todos los usuarios y ahí mismo les dice hasta que día esta disponible.</p>'+
          '</div>'+
          '<div class="text-center">'+
            '<strong><p class="margin-text highlight-service">Cupones</p></strong>'+
            '<p class="margin-text semi-full-text">Los cupones los puede adquirir un numero limitado de usuarios según tu indiques.</p>'+
          '</div>'+
          '<div class="text-center">'+
            '<strong><p class="margin-text highlight-service">Pagos seguros en línea</p></strong>'+
            '<p class="margin-text semi-full-text">Tus clientes tendrán la oportunidad de no usar efectivo una vez que hagan un pedido, a través de la plataforma.</p>'+
          '</div>'+
          '<div class="text-center">'+
            '<strong><p class="margin-text highlight-service">Pre-Ordenes</p></strong>'+
            '<p class="margin-text semi-full-text">Tus clientes pueden pagar antes de consumir una vez que tu confirmes una reservación.</p>'+
          '</div>'+
          '<div class="text-center">'+
            '<strong><p class="margin-text highlight-service">Administradores</p></strong>'+
            '<p class="margin-text semi-full-text">Determina quienes podrán confirmar tus reservaciones y pedidos , subir contenido como cupones y promociones o editar la información del lugar.</p>'+
          '</div>'+
          '<div class="text-center">'+
            '<strong><p class="margin-text highlight-service">Análisis de Datos</p></strong>'+
            '<p class="margin-text semi-full-text">Recibe toda la informacion sobre la actividad de tu restaurante por mail a traves de un miembro del equipo.</p>'+
          '</div>'+

        '</slick>'+
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
