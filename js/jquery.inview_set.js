
//main h2が画面内にきたら、スタイルlinestyleを適用する
$('main h2').on('inview', function() {
	$(this).addClass('linestyle');
});

//upスタイルが画面内にきたら、スタイルupstyleを適用する
$('.up').on('inview', function() {
	$(this).addClass('upstyle');
});

//downスタイルが画面内にきたら、スタイルdownstyleを適用する
$('.down').on('inview', function() {
	$(this).addClass('downstyle');
});

//leftスタイルが画面内にきたら、スタイルleftstyleを適用する
$('.left').on('inview', function() {
	$(this).addClass('leftstyle');
});

//rightスタイルが画面内にきたら、スタイルrightstyleを適用する
$('.right').on('inview', function() {
	$(this).addClass('rightstyle');
});

//transform1スタイルが画面内にきたら、スタイルtransform1styleを適用する
$('.transform1').on('inview', function() {
	$(this).addClass('transform1style');
});

//transform2スタイルが画面内にきたら、スタイルtransform2styleを適用する
$('.transform2').on('inview', function() {
	$(this).addClass('transform2style');
});

//transform3スタイルが画面内にきたら、スタイルtransform3styleを適用する
$('.transform3').on('inview', function() {
	$(this).addClass('transform3style');
});

//blurスタイルが画面内にきたら、スタイルblurstyleを適用する
$('.blur').on('inview', function() {
	$(this).addClass('blurstyle');
});

//crackerスタイルが画面内にきたら、クラッカーアニメーションを実行する
$('.cracker').on('inview', function() {
	$('.cracker').append('<span class="crackerstyle"><img src="images/cracker.gif" alt=""><img src="images/cracker.gif" alt=""></span>');
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