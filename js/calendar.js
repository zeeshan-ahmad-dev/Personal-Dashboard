$(document).ready(function () {
    $('#cale').evkJKcalendar({
        canPast:true,
    });

    
  // Toggle button function
  const checkbox = document.getElementById("checkbox");
  checkbox.addEventListener("change", () => {
    $('body').toggleClass("dark");
    if($('body').hasClass('dark')) {
      $('body').css('background','#000000')
      $('html')[0].style.setProperty('--bg-gray','#212121')
      $('.ham svg').attr('color','#fff');
    } else {
      $('body').css('background','#ffffff')
      $('html')[0].style.setProperty('--bg-gray','#F8F9FD')
      $('.ham svg').attr('color','#222');
    }
  });
  
  // ------------Hamburger toggle-------------
    $('.ham').click(function(){
      $('.left').toggleClass('enable');
      if($('.left').hasClass('enable')){
        $('body').css('overflow','hidden');
        $('#overlay').addClass('active');
      }else{
        $('body').css('overflow','auto');
        $('#overlay').removeClass('active');
      }
    });
    
    $('.overlay').on('click',function(e){
      $('.left').removeClass('enable');
      if($('.left').hasClass('enable')){
        $('body').css('overflow','hidden');
        $('#overlay').addClass('active');
      }else{
        $('body').css('overflow','auto');
        $('#overlay').removeClass('active');
      }
    })
  
});