
$(document).ready(function () {

  // --------Getting the data using localStorage----------  

  // For research data
  $('.descrip').text(localStorage.getItem('research-task'));
  $('.day').text(localStorage.getItem('research-date-day'));
  $('.month').text(localStorage.getItem('research-date-month'));
  $('.year').text(localStorage.getItem('research-date-year'));

  // For notes data
  $('.list-container ul').html(localStorage.getItem('all-tasks'));
  $('.list-container ul li').each(function (index, el) {
    $(el).on('click', function () {
      tasksChecks();
    });
  });


  // For bookmarks
  $(".bookmarks ul").html(localStorage.getItem('bookmarks'));


  // ----------------Weather-------------- 
  const apiKey = '3B3TFCGTRVER3D99FENSG37ZH';
  const city = 'karachi';
  $.ajax({
    url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    success: function (result) {
      const time = result.currentConditions.datetime;
      let [hours, mins] = time.split(':').map(Number)

      // Times of day
      if (hours < 12) {
        $('.day-time').text('Morning'); // 12:00 AM to 11:59 AM
      } else if (hours < 18) {
        $('.day-time').text('Afternoon'); // 12:00 PM to 5:59 PM
      } else if (hours < 21) {
        $('.day-time').text('Evening'); // 6:00 PM to 8:59 PM
      } else {
        $('.day-time').text('Night'); // 9:00 PM to 11:59 PM
      }

      if (hours < 12 || (hours === 12 && mins === 0)) {
        $('#am-pm').text('AM');
      } else {
        $('#am-pm').text('PM');
        hours = hours - 12;
      }
      if (mins === 0) {
        mins += '0';
      } else { }
      $('#hours').text(hours);
      $('#min').text(mins);

      //  Temperature
      const temp = result.currentConditions.temp;
      $('.temp').text(temp + '°C')

      // Feel temperature
      const feel = result.currentConditions.feelslike;
      $('.feel span').text(feel + '°C')

      // icons
      const icon = result.currentConditions.icon;
      $('.weather-card img').attr('src', `../animated/${icon}.svg`)

    }
  });

  // ------------Code for research card-----------------
  $('.more').on('click', function () {
    // $('.descrip').empty()
    $('.r-input-container').show();
  });
  $('.r-input-button').on('click', function () {
    const value = $('.research-input').val();

    if (value === '') {
      $('.r-input-container').hide();
    } else {
      $('.descrip').text(value);
      $('.research-input').val("");
      $('.r-input-container').hide();

      // For date in research card
      const currentDate = new Date;
      $('.day').text(currentDate.getUTCDate());
      const month = currentDate.toLocaleString('default', { month: 'short' });
      $('.month').text(month);
      $('.year').text(currentDate.getFullYear());
    }

    localStorage.setItem('research-task', $('.descrip').text());
    localStorage.setItem('research-date-day', $('.day').text());
    localStorage.setItem('research-date-month', $('.month').text());
    localStorage.setItem('research-date-year', $('.year').text());

  });

  // ----------------Notes Card-----------------  
  $('.note-head').tooltip();

  $('.note-head').on('dblclick', function () {
    $('.note-head').tooltip('disable'); // tooltip disabled
    $('.new-note, .notes .line:last-of-type').css('display', 'flex');
  });

  // Function for adding Note
  function addNote() {
    $('.note-head').tooltip('enable'); //tooltip enabled
    const noteVal = $('.entryarea input').val();

    if (noteVal === '') {
    }
    else {
      $('.new-note, .notes .line:last-of-type').css('display', 'none');
      $('.list-container ul').append(`<li>
      <label>${noteVal}
          <input type="checkbox">
          <span class="checkmark"></span>
      </label>
      <button class="del"><img src="../images/delete.svg" alt=""></button>
  </li>`);
      $('.list-container ul li').each(function (index, el) {

        $(el).on('click', function () {
          tasksChecks();
        });
      });
    }
    tasksChecks();

    // Clear input field
    $('.entryarea input').val('')
    $('.new-note, .notes .line:last-of-type').css('display', 'none');

    // Attach delete event to new delete buttons
    $('.notes ul li .del').each(function (i, e) {
      $(e).on('click', function () {
        $(this).closest('li').remove();
        localStorage.setItem('all-tasks', $('.list-container ul').html())
      });
    });
    localStorage.setItem('all-tasks', $('.list-container ul').html())
  };

  $('.new-note button').on('click', addNote);
  $('.entryarea input').on('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNote();
    }
  })
  // Deletion of note
  $('.notes ul li .del').each(function (i, e) {
    $(e).on('click', function () {
      $(this).closest('li').remove();
      localStorage.setItem('all-tasks', $('.list-container ul').html())
    });
  });

  // ----------Logic for the Tasks completed Container-----------
  // Function for the task
  function tasksChecks() {
    let totalTasks = 0;
    let finishTasks = 0;
    $('.list-container ul li').each(function (index, element) {
      totalTasks++;
      const input = $(element).find('input').prop('checked');
      if (input) {
        finishTasks++;
      } else { }
    });
    appendTasks(totalTasks, finishTasks)
  }
  // Function for appending task
  function appendTasks(total, finished) {
    let percentage = Math.trunc(100 * finished / total);

    if (isNaN(percentage)) {
      percentage = 0;
    } else { }

    // Appending circleChart
    $('.progress').html(`<div class="circlechart" data-percentage="${percentage}">Completed</div>`)
    $('.circlechart').circlechart();

    // Entering tasks
    $('#total-tasks').text(total);
    $('#finish-tasks').text(finished);
  }

  // On checking the task or unchecking the task
  $('.list-container ul li').each(function (index, el) {

    $(el).on('click', function () {
      tasksChecks();
    });
  });

  // ------------Bookmarks Container ----------------
  $('.add').on('click', function () {
    $('.new-url, .bookmarks .line:last-of-type').css('display', 'flex')
  });

  function addBookmark() {
    const inputVal = $('.new-url input').val();
    if (inputVal === '') {} else {
      $('.bookmarks ul').append(`<li>
      <a rel="noopener" href="https://${inputVal}.com" target="_blank">
          <img src="https://blind-chocolate-scorpion.faviconkit.com/${inputVal}.com/20" alt="">
          ${inputVal.charAt(0).toUpperCase() + inputVal.slice(1)}</a>
          <button class="del"><img src="../images/delete.svg" alt=""></button>
          </li>`)
    }

    // deletion of bookmark 
    $('.bookmarks ul li .del').each(function (i, e) {
      $(e).on('click', function () {
        $(this).closest('li').remove();
      });
    });
    localStorage.setItem('bookmarks', $('.bookmarks ul').html());
    $('.new-url input').val('');
    $('.new-url, .bookmarks .line:last-of-type').css('display', 'none');
  };
  $('.new-url button').on('click', addBookmark);
  // On pressing enter
  $('.new-url input').on('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBookmark();
    }
  })

  // Deletion of bookmark
  $('.bookmarks ul li .del').each(function (i, e) {
    $(e).on('click', function () {
      $(this).closest('li').remove()
      localStorage.setItem('bookmarks', $('.bookmarks ul').html());
    });
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



  tasksChecks();
  // End of the document
});
