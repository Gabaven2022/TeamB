//タイマー
$(function() {
	var timer = false;
	$(window).resize(function() {
		if(timer !== false){
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
		}, 500);
	});
});


//ハンバーガーメニューをクリックした際の処理
$(function() {
	$('#menubar_hdr').click(function() {
		$(this).toggleClass('ham');

			if($(this).hasClass('ham')) {
				$('#menubar').addClass('db').removeClass('dn');
			} else {
				$('#menubar').addClass('dn').removeClass('db');
			}

	});
});


// 同一ページへのリンクの場合に開閉メニューを閉じる処理
$(function() {
	$('#menubar a[href^="#"]').click(function() {
		$('#menubar').removeClass('db');
		$('#menubar_hdr').removeClass('ham');
	});
});


//pagetop
$(function() {
    var scroll = $('.pagetop');
    var scrollShow = $('.pagetop-show');
        $(scroll).hide();
        $(window).scroll(function() {
            if($(this).scrollTop() >= 300) {
                $(scroll).fadeIn().addClass(scrollShow);
            } else {
                $(scroll).fadeOut().removeClass(scrollShow);
            }
        });
});


//スムーススクロール
$(window).on('load', function() {
	var hash = location.hash;
	if(hash) {
		$('body,html').scrollTop(0);
		setTimeout(function() {
			var target = $(hash);
			var scroll = target.offset().top - 40;
			$('body,html').animate({scrollTop:scroll},500);
		}, 100);
	}
});
$(window).on('load', function() {
    $('a[href^="#"]').click(function() {
        var href = $(this).attr('href');
        var target = href == '#' ? 0 : $(href).offset().top - 40;
            $('body,html').animate({scrollTop:target},500);
            return false;
    });
});


// 汎用開閉処理
$(function() {
	$('.openclose').next().hide();
	$('.openclose').click(function() {
		$(this).next().slideToggle();
		$('.openclose').not(this).next().slideUp();
	});
});


//お気に入り機能

$(".addtofavorite").click(function(){
	var favorite_pages_start = JSON.parse(localStorage.getItem('favorite_pages'));
	var title = $("h1.page-title").text(); // ページのタイトルを取得
	if (!title.length) { // ↑が無い場合は、<head>のタイトルを取得
		title = document.title;
	}
	var favorite_pages = [{
		url: CCM_CID, // CCM_CIDは、concrete5 が各ページに付与しているID
		title: title,
		datetime: $.now()
	}];

	if(favorite_pages_start.length >= 10) { // 最大10個まで
		alert("お気に入りの登録数の上限に達しました。");
		return;
	}
	if (favorite_pages_start) {
		for(i=0;i<10;i++) { 
			if (favorite_pages_start[i] && favorite_pages[0].url !== favorite_pages_start[i].url) {
				favorite_pages.push(favorite_pages_start[i]);
			}
		}
	}
	localStorage.setItem('favorite_pages',JSON.stringify(favorite_pages));
	addFavorite();
});

function addFavorite() {
	$(".favoritedmark").removeClass('fade');
	$(".removefavorite").removeClass('hidden');
	$(".addtofavorite").addClass('hidden');
}

$(".removefavorite").click(function(){
	var favorite_pages_start = JSON.parse(localStorage.getItem('favorite_pages'));
	var favorite_pages = [];
	if (favorite_pages_start) {
		for(i=0;i<10;i++) {
			if (favorite_pages_start[i] && CCM_CID !== favorite_pages_start[i].url) {
				favorite_pages.push(favorite_pages_start[i]);
			}
		}
	}
	localStorage.setItem('favorite_pages',JSON.stringify(favorite_pages));
	removeFavorite();
});

var favorite_pages = JSON.parse(localStorage.getItem('favorite_pages'));
var selected = false;
if (favorite_pages) {
	for(i=0;i<10;i++) {
		if (!selected && favorite_pages[i] && !isNaN(favorite_pages[i]['url'])) {
			if (CCM_CID == favorite_pages[i]['url']){
				selected = true;
			}
		}
	}
}
if(selected) {
	addFavorite();
}

function displayFavorites() {
    var favorite_pages = JSON.parse(localStorage.getItem('favorite_pages')); // ローカルストレージから取得する
    var title = 'title';
    var listclass = 'viewhistory';
    listdata = $("<ul></ul>",{
        class: listclass
    });
    $("#favoritelist").text('');
    if (favorite_pages) {
        $("#favoritelist").append(listdata);
        for(i=0;i<10;i++) { // 最大10個まで
            if (favorite_pages[i] && !isNaN(favorite_pages[i]['url'])) { // 要素があるかどうかの判定。(上のforと合わせてコードを改善できるかもしれない)
                textdata = $("<a></a>",{
                    href: CCM_APPLICATION_URL + '/index.php?cID=' + parseInt(favorite_pages[i]['url']),
                    text: favorite_pages[i][title]
                }); // リンクを作成
                removedata = $("<button></button>",{
                    id: parseInt(favorite_pages[i]['url']),
                    text: "お気に入りから削除する",
                    class: "btn btn-primary removedata"
                }); // お気に入りから削除するボタン
                textlist = $("<li></li>").html(textdata);
                textlist.append(removedata);
                $("#favoritelist").children('ul').append(textlist);
            }
        }
    } else {
        $("#favoritelist").text("お気に入りはありません。");
    }
}

$( document ).ready(function() {
    displayFavorites();
});

$(document).on("click", ".removedata", function () {
    var favorite_pages_start = JSON.parse(localStorage.getItem('favorite_pages'));
    var favorite_pages = [];
    if (favorite_pages_start) {
        for(i=0;i<10;i++) {
            if (favorite_pages_start[i] && $(this).attr("id") !== favorite_pages_start[i].url) {
                favorite_pages.push(favorite_pages_start[i]);
            }
        }
    }
    localStorage.setItem('favorite_pages',JSON.stringify(favorite_pages));
    displayFavorites();
});