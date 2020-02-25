$(document).ready(function(){//JQuery start

//populate div data
$(".tablename").click(function() {
    if($(".left").attr("data-tablename") === ""){ //populate first input
        $(".left").attr("data-tablename", $(this).text()); //populate its data field with this button's name (table name)
        $(".lefttext").text($(this).text()); //then update its name as well
    }
    else if($(".right").attr("data-tablename") === "") { //populate the second input
        $(".right").attr("data-tablename", $(this).text()); //populate its data field with this button's name (table name)
        $(".righttext").text($(this).text()); //then update its name as well
    }
});

//clear input upon x click
$(".x").click(function() {
    $(this).parent().children(".xytext").text(""); //check sibling with the xytext class (p tag)
    $(this).parent().attr("data-tablename", "");
});

$(".graph").click(function() {
    let l = $(".left").children(".lefttext").text();
    let r = $(".right").children(".righttext").text();
    // hardcoded
    let s = "OR";
    if(!l || !r){
        alert("You must select two tables before continuing!");
        return;
    }
    var xhr = new XMLHttpRequest();
    let data = {
        left: l,
        right: r,
        state: s
    };
    var jsonData = JSON.stringify(data);
    console.log(jsonData);
    xhr.open("post", "/", true);
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(jsonData);
    //recieve the data
    xhr.onload = function(){
        let res = JSON.parse(xhr.response);
        console.log(res);
      };
});

function relClick(){
    var xhr = new XMLHttpRequest();
    var newData = data;
    newData['relevant'] = 1;
    var jsonData = JSON.stringify(newData);
    xhr.open("POST","/",true);
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(jsonData);
    console.log("Clicked Relevant");


    xhr = new XMLHttpRequest();
    xhr.open("GET","/newtweet",true); 
    xhr.send();
    xhr.onload = function(){
        var check = JSON.parse(xhr.response);
        data = (check['ndata'][0]);
        newItem(data,check['rc'],check['ic'],check['mc']);
    };
}
});//JQuery end
