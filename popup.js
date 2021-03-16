let flag = true; // true为10转16，false为16转10
let initColor = "#409EFF"; // 示例颜色
let initPlaceholder; // Placeholder

// 页面加载完毕，进行初始化
$(function(){
  init();
});

// 初始化
function init(){
  $("#transformInput").val("");
  if(flag){
    $("#transformInput").attr("placeholder", "格式如下：64,158,255");
    $("#color-area").css("background-color", initColor);
    $("#title").text("十进制转十六进制");
    $("#resultStr").text("#409EFF");
  }else{
    $("#transformInput").attr("placeholder", "格式如下：#409EFF或409EFF");
    $("#color-area").css("background-color", initColor);
    $("#title").text("十六进制转十进制");
    $("#resultStr").text("rgb(64,158,255)");
  }
};

// 切换按钮，切换10转16和16转10
$("#toggle-btn").click(function(){
  flag = !flag;
  init();
});

// input的change事件
$("#transformInput").change(transformationFun);
// 转换按钮
$("#transformationBtn").click(transformationFun);

// 转换函数
function transformationFun(){
  let val = $("#transformInput").val();
  let newColor;
  if(!val){
    return;
  }
  if(flag){
    if(!val || val.split(",").length != 3){
      return;
    }
    newColor = transformForSixteen(val);
  }else{
    if(val[0] == "#"){
      val = val.slice(1);
    }
    if(val.length==3 || val.length==6){
      newColor = transformForTen(val);
    }else{
      return;
    }
  }
  if(newColor){
    $("#resultStr").html(newColor);
    $("#color-area").css("background-color", newColor);
  }
}

// 复制按钮
$("#copyBtn").click(function(){
  var oInput = document.getElementById("copyInput");  //input 的ID
  $("#resultStr").text();
  $("#copyInput").val($("#resultStr").text());
  oInput.select(); // 选择对象  
  document.execCommand("Copy"); // 执行浏览器复制命令
});

// 转16进制
function transformForSixteen(rgbStr){
  rgbStr = rgbStr.replace(/\s+/g,""); // 去除空格
  let result = "#";
  let rgbArr = rgbStr.split(",");
  for(let i=0; i<rgbArr.length; i++){
    let item = parseInt(rgbArr[i]); // 转换为数字类型
    if(item<0 || item>255){
      result = null;
      break;
    }
    if(item > 9 && item < 16){
      let letter = judge(15 - item);
      result = result + `0${letter}`
    }else{
      let remainder = item % 16; // 余数
      let x = remainder < 10 ? remainder : judge(15-remainder);
      let divisor = (item - remainder) / 16; // 除数
      let y = divisor < 10 ? divisor : judge(15-divisor)
      result = result + `${y}${x}`;
    }
  }
  return result;
}

// 转10进制
function transformForTen(rgbStr){
  let result;
  let obj = {
    a: 10, b: 11, c: 12, d: 13, e: 14, f: 15,
    A: 10, B: 11, C: 12, D: 13, E: 14, F: 15,
  };
  let arr = [];
  let str = "";
  if(rgbStr.length == 3){
    for(let i=0; i<rgbStr.length; i++){
      str = str + rgbStr[i] + rgbStr[i];
    }
    rgbStr = str;
  }
  for(let i=0; i<rgbStr.length; i++){
    let item = rgbStr[i];
    let reg = /[0-9]/;
    if(!reg.test(parseInt(item))){
      arr.push(obj[item]);
    }else{
      arr.push(parseInt(item));
    }
  }
  result = `rgb(${arr[0]*16+arr[1]},${arr[2]*16+arr[3]},${arr[4]*16+arr[5]})`;
  return result;
}

// 判断字母和数字之间的对应关系
function judge(num){
  let letter = null;
  switch (num){
    case 5:
      letter = "A";
      break;
    case 4:
      letter = "B";
      break;
    case 3:
      letter = "C";
      break;
    case 2:
      letter = "D";
      break;
    case 1:
      letter = "E";
      break;
    case 0:
      letter = "F";
      break;
  }
  return letter;
}