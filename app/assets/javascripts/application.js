// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .


$(document).on("ready", function(){

  var regExp = /\d+/
  var playlistId = parseInt(regExp.exec(window.location.pathname)[0])

  $(".suggest_song").on('click', function (event){
       event.preventDefault();
       $.ajax({
          url:'/playlists/' + $(this).siblings('div').data('playlist-id') + '/suggestedsongs',
          method:'POST',
          data:{
           song_id: $(this).siblings('div').attr('name'),
           name: $(this).siblings('div').html(),
           user_id: $(this).siblings('div').data('user-id')
         }
       }).done(function(data){
       });
  });

  $("body").delegate('.suggest_song1', 'click', function (event){
       event.preventDefault();
       $.ajax({
          url:'/playlists/' + playlistId + '/suggestedsongs',
          method:'POST',
          data:{
           song_id: $(this).parent().attr('song_id'),
           name: $(this).parent().attr('song_name'),
           user_id: 1
         }
       }).done(function(data){
         console.log("DID IT");
       }).fail(function(){
         console.log("failed bish!");
       })
  });

  $("body").delegate('#search-submit','click',function(event) {
    event.preventDefault();
    var searchValue = $('#search').val();
    console.log(searchValue);
    $.ajax({
      url: '/playlists/' + playlistId + '/suggestedsongs/',
      method: 'get',
      data: {q: searchValue},
      dataType: 'json'
    }).done(function(data){
      console.log(data["data"][1]);
      var div = $('<div>').attr('song_id', data["data"][1]['id']).attr('song_name', data["data"][1]['title']);

      var button = $('<button>')
      var button = $(button).attr('class', 'suggest_song1');
      var button = $(button).html('Add');

      $(div).html(data["data"][1]["title"]).append(' - ').append(data["data"][1]["artist"]["name"]).append(button);
      console.log(div);
      $('#search_results').append(div);
      console.log;
    }).fail(function(responseData){
      console.log("damn....")
    })
   })

  $('#make-public').on('click', function(){
    var status = $('#make-public').html().trim();
    console.log('clicked');
    $.ajax({
      url: '/playlists/' + playlistId + '/update_publicity',
      method: 'post'
    }).done(function(){
      if (status ==  "Public"){
        $('#make-public').html('Private');
      }
      else {
        $('#make-public').html('Public');
      }

    })
  });

  $("body").delegate('.upvote','click', function() {
    var playlist_id = $(this).parents('.song-in-queue').data('playlist-id');
    var suggestedsong_id = $(this).parents('.song-in-queue').data('suggested-song-id');
    var replacement = $(this).parents('.contain').children('.heart').children('.netvote');

    $.ajax({
      url:"/playlists/" + $(this).parents('.song-in-queue').data('playlist-id') + "/suggestedsongs/" + $(this).parents('.song-in-queue').data('suggested-song-id') + "/votes",
      method: 'POST',
      data: {
        status: 'up',
      }
    }).done(function(){
      $.ajax({
        url:"/playlists/" + playlist_id + "/suggestedsongs/" + suggestedsong_id,
        method: 'GET',
      }).done(function(data){
        $(replacement).html(data.net_vote);
      });
    });
  });

  $("body").delegate('.downvote','click', function() {
    var playlist_id = $(this).parents('.song-in-queue').data('playlist-id');
    var suggestedsong_id = $(this).parents('.song-in-queue').data('suggested-song-id');
    var replacement = $(this).parents('.contain').children('.heart').children('.netvote')
    $.ajax({
      url:"/playlists/" + $(this).parents('.song-in-queue').data('playlist-id') + "/suggestedsongs/" + $(this).parents('.song-in-queue').data('suggested-song-id') + "/votes",
      method: 'POST',
      data: {
        status: 'down'
      }
    }).done(function(){
      $.ajax({
        url:"/playlists/" + playlist_id + "/suggestedsongs/" + suggestedsong_id,
        method: 'GET',
      }).done(function(data){
        $(replacement).html(data.net_vote);
      })
    });
  });
 });
