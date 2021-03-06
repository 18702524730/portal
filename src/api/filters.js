var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

function cutString(pStr, pLen) {
  // 原字符串长度
  var _strLen = pStr.length;
  var _tmpCode;
  var _cutString;
  // 默认情况下，返回的字符串是原字符串的一部分
  var _cutFlag = "1";
  var _lenCount = 0;
  var _ret = false;
  if (_strLen <= pLen/2) {
      _cutString = pStr;
      _ret = true;
  }
  if (!_ret) {
      for (var i = 0; i < _strLen ; i++ ) {
          if (isFull(pStr.charAt(i))) {
              _lenCount += 2;
          } else {
              _lenCount += 1;
          }
          if (_lenCount > pLen) {
              _cutString = pStr.substring(0, i);
              _ret = true;
              break;
          } else if (_lenCount == pLen) {
              _cutString = pStr.substring(0, i + 1);
              _ret = true;
              break;
          }
      }
  }
  if (!_ret) {
      _cutString = pStr;
      _ret = true;
  }
  if (_cutString.length == _strLen) {
      _cutFlag = "0";
  }
  return {"cutstring":_cutString, "cutflag":_cutFlag};
}
function isFull (pChar) {
  if ((pChar.charCodeAt(0) > 128)) {
      return true;
  } else {
      return false;
  }
}

export default {
  ellipsis: function (pStr, pLen) {
      if (!pStr) {
        return pStr
      }
      var _ret = cutString(pStr, pLen);
      var _cutFlag = _ret.cutflag;
      var _cutStringn = _ret.cutstring;

      if ("1" == _cutFlag) {
          return _cutStringn + "...";
      } else {
          return _cutStringn;
      }
  },
  // 手机号码中间4位变星号,固定电话后4位变星号
  numToStar: function(phone) {
  	if (!phone) {return}
    //return phone = phone.replace(phone.length == 11 ? phone.slice(3, 7) : phone.slice(-4), '****');
  	let isPhone = phone.length == 11;
    return phone.replace(isPhone ? /^(\d{3})\d{4}(\d{4})$/ : /^(\d{3,4})(-\d{3,4})?\d{4}$/, isPhone ? '$1****$2' : '$1$2****');
  },
  getQueryStringByName: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      var context = "";
      if (r != null)
          context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined" ? "" : context;
  },
  formatDate: {
    //日期转yyyy-mm-dd格式
    format: function (date, pattern) {
        pattern = pattern || DEFAULT_PATTERN;
        return pattern.replace(SIGN_REGEXP, function ($0) {
            switch ($0.charAt(0)) {
                case 'y': return padding(date.getFullYear(), $0.length);
                case 'M': return padding(date.getMonth() + 1, $0.length);
                case 'd': return padding(date.getDate(), $0.length);
                case 'w': return date.getDay() + 1;
                case 'h': return padding(date.getHours(), $0.length);
                case 'm': return padding(date.getMinutes(), $0.length);
                case 's': return padding(date.getSeconds(), $0.length);
            }
        });
    },
    parse: function (dateString, pattern) {
        var matchs1 = pattern.match(SIGN_REGEXP);
        var matchs2 = dateString.match(/(\d)+/g);
        if (matchs1.length == matchs2.length) {
            var _date = new Date(1970, 0, 1);
            for (var i = 0; i < matchs1.length; i++) {
                var _int = parseInt(matchs2[i]);
                var sign = matchs1[i];
                switch (sign.charAt(0)) {
                    case 'y': _date.setFullYear(_int); break;
                    case 'M': _date.setMonth(_int - 1); break;
                    case 'd': _date.setDate(_int); break;
                    case 'h': _date.setHours(_int); break;
                    case 'm': _date.setMinutes(_int); break;
                    case 's': _date.setSeconds(_int); break;
                }
            }
            return _date;
        }
        return null;
    },
    //日期转时间戳
    timeStamp:function(date){
        var timestamp = Date.parse(new Date(date));
        timestamp = timestamp / 1000;
        return timestamp
    },
    //日期格式转换
    dateFormat: function (input,type) {
        if(input == null || input=='' || typeof(input) == "undefined"){
            return "--";
        }
        var _date = new Date(input);
        var year = _date.getFullYear();
        var month = _date.getMonth() + 1 > 9 ? _date.getMonth() + 1 : "0" + (_date.getMonth() + 1);
        var day = _date.getDate() > 9 ? _date.getDate() : "0" + _date.getDate();
        var hour = _date.getHours() > 9 ? _date.getHours() : "0" + _date.getHours();
        var minutes = _date.getMinutes() > 9 ? _date.getMinutes() : "0" + _date.getMinutes();
        var seconds = _date.getSeconds() > 9 ? _date.getSeconds() : "0" + _date.getSeconds();
        if(type == "date"){
            return year + "-" + month + "-" + day;
        } else if(type == "time") {
            return hour + ":" + minutes + ":" + seconds;
        } else {
            return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
        }
        return "--";
    },
    Formatdate: function (input,type) {
      if(input == null || input=='' || typeof(input) == "undefined"){
          return "--";
      }
      var _date = new Date(input);
      var year = _date.getFullYear();
      var month = _date.getMonth() + 1 > 9 ? _date.getMonth() + 1 : "0" + (_date.getMonth() + 1);
      var day = _date.getDate() > 9 ? _date.getDate() : "0" + _date.getDate();
      var hour = _date.getHours() > 9 ? _date.getHours() : "0" + _date.getHours();
      var minutes = _date.getMinutes() > 9 ? _date.getMinutes() : "0" + _date.getMinutes();
      var seconds = _date.getSeconds() > 9 ? _date.getSeconds() : "0" + _date.getSeconds();
      if(type == "date"){
          return year + "-" + month + "-" + day;
      } else if(type == "time") {
          return hour + ":" + minutes + ":" + seconds;
      } else {
          return year + "-" + month + "-" + day;
      }
      return "--";
    }
  },
  //订单状态
  orderStatusformat: function (input) {
    var ret = ''
    switch (input+''){
      case '-1':
        ret = "已关闭";
        break;
      case '0':
        ret = "待付款";
        break;
      case '1':
        ret = "已付款";
        break;
      case '2':
        ret = "已完成";
        break;
    }
    return ret;
  },
  //支付状态
  payStatusformat: function (input) {
    var ret = ''
    switch (input+''){
      case '0':
        ret = "待付款";
        break;
      case '1':
        ret = "已付款";
        break;
      case '-1':
        ret = "已关闭";
        break;
    }
    return ret;
  },
  //价格保留两位小数
  priceformat: function (input) {
    var ret = '';
    // input 有可能是数字0
    if (input !== null && input !== undefined) {
      ret = input - 0 +'';
      if(ret === 0){
        ret = 0;
      }else{
        ret = '¥' + (ret-0).toFixed(2);
      }
    }
    return ret;
  },
  //价格转换为万元
  priceUnitFilter(td){
    var ret = td/10000+'';
    if(ret.indexOf('.') !== -1){
      ret = (ret-0).toFixed(2);
      ret = ret.replace(/((\.0{1,2})|0)$/, '');
    }
    return ret;
  },
  refundStateFilter(input){
    var ret = ''
    switch (input+''){
      case '0':
        ret = "待审核";
        break;
      case '1':
        ret = "商家同意";
        break;
      case '2':
        ret = "商家驳回";
        break;
      case '3':
        ret = "退款完成";
        break;
      case '4':
        ret = "先行赔付";
        break;
    }
    return ret;
  },
  refundStatus(input){//最新退款状态
    var ret = ''
    switch (input+''){
      case '0':
        ret = "待受理";
        break;
      case '1':
        ret = "退款中";
        break;
      case '2':
        ret = "退款成功";
        break;
      case '3':
        ret = "退款驳回";
        break;
      case '4':
        ret = "先行垫付完成";
        break;
    }
    return ret;
  },
  notarizationStatusformat(input){
    var ret = ''
    switch (input+''){
      case '0':
        ret = "待存证";
        break;
      case '1':
        ret = "存证中";
        break;
      case '2':
        ret = "存证失败";
        break;
      case '3':
        ret = "存证成功";
        break;
    }
    return ret;
  },
  notarizationUsesformat(input){
    var ret = ''
    switch (input+''){
      case '1':
        ret = "电商维权";
        break;
      case '2':
        ret = "自媒体内容维权";
        break;
      case '3':
        ret = "设计作品未经授权发布";
        break;
      case '4':
        ret = "文字创作存证";
        break;
      case '5':
        ret = "美术作品存证";
        break;
      case '6':
        ret = "音乐作品存证";
        break;
      case '7':
        ret = "影像摄影存证";
        break;
      case '8':
        ret = "其他";
        break;
    }
    return ret;
  },
  fileSizeFilter(v){
    if (!v) {
      return '';
    }
    var ret = v;
    if (v > 1024*1024) {
      ret = (ret/1024/1024).toFixed(1) + 'M';
    }else{
      var t = (ret/1024).toFixed(1);
      ret = (t === '0.0' ? '0.1' : t) + 'KB';
    }
    return ret;
  },
  formatPatent:{
      //专利类型转换
      format: function (input) {
          if(input == null || input=='' || typeof(input) == "undefined"){
              return "";
          }else{
              switch (input){
                  case 1:
                      return "发明专利";
                  case 2:
                      return "实用新型专利";
                  case 3:
                      return "外观设计专利";
              }
          }
      }
  },
  formatIPRClassify:{
      //知产分类转换
      format: function (input) {
          switch (input){
              case 0:
                  return "商标";
              case 1:
                  return "专利";
          }
      }
  },
  formatStatus:{
      //会员状态转换
      format: function (input) {
          switch (input){
              case false:
                  return 0;
              case true:
                  return 1;
          }
      }
  },
  //申请主体类型
  formatApplySbj:{
    format: function (input) {
      switch (input){
        case 1:
          return "大陆个体";
        case 2:
          return "大陆企业";
        case 3:
          return "港澳台及境外个人";
        case 4:
          return "港澳台及境外企业";
        case 5:
          return "大陆个人";
      }
    }
  },
  titleLengthFormat (input) {
    if (input && input.length>46) {
      return input.slice(0,45)+'...';
    }
    return input;
  },
  czChannelFormat: function (input) {
    switch (input){
      case 1:
        return "司法鉴定存证";
      case 2:
        return "区块链存证";
      case 3:
        return "公证存证";
      case 4:
        return "公证存证";
      case 5:
        return "司法鉴定存证";
      case 6:
        return "互联网公证存证";
    }
  },
  notarizationPurposeFilter(v){
    if (v == 4) {
      return '文字创作存证';
    }
    if (v == 5) {
      return '美术作品存证';
    }
    if (v == 6) {
      return '音乐作品存证';
    }
    if (v == 8) {
      return '其它';
    }
    return '';
  },
  serviceState: function (input) {
    if(input == null || input=='' || typeof(input) == "undefined"){
      return "--";
    }else{
      switch (input+''){
        case '1':
          return "待服务";
        case '2':
          return "服务中";
        case '3':
          return "服务完成";
        case '4':
          return "服务关闭";
      }
    }
  },
  //主体信息显示
  mainBodeSbj(input) {
    switch (input){
      case 1:
        return "申请人";
      case 2:
        return "企业";
      case 3:
        return "申请人";
      case 4:
        return "企业";
      case 5:
        return "申请人";
    }
  },
  // 开票信息
  mainBodeNumber(input) {
    switch (input){
      case 1:
        return "申请人身份证号";
      case 2:
        return "企业营业执照号";
      case 3:
        return "申请人护照号";
      case 4:
        return "";
      case 5:
        return "申请人身份证号";
    }
  },
  //申请主体类型
  invoiceTypeFormat(input) {
    switch (input){
      case 1:
        return "增值税普通发票";
      case 2:
        return "增值税专用发票";
    }
  },
  downFileName: function(data){
    var ret = ''
    switch (data+''){
      case '1':
        ret = "申请号回执";
        break;
      case '2':
        ret = "受理通知书";
        break;
      case '3':
        ret = "不予受理通知书";
        break;
      case '4':
        ret = "初审公告书";
        break;
      case '5':
        ret = "部分驳回通知书";
        break;
      case '6':
        ret = "驳回通知书";
        break;
      case '7':
        ret = "注册公告";
        break;
      case '8':
        ret = "部分异议通知书";
        break;
      case '9':
        ret = "异议通知书";
        break;
      case '10':
        ret = "注册证";
        break;
      case '11':
        ret = "未办理驳回复审";
        break;
      case '12':
        ret = "驳回复审通过";
        break;
      case '13':
        ret = "驳回复审不通过";
        break;
      case '14':
        ret = "未办理异议答辩";
        break;
      case '15':
        ret = "异议答辩通过";
        break;
      case '16':
        ret = "异议答辩不通过";
        break;
      case '17':
        ret = "初审公告书";
        break;
      case '18':
        ret = "退款告知函";
        break;
    }
    return ret;
  },
  // 创新保工单状态
  cxbStatus: function(data){
    var ret = ''
    switch (data+''){
      case '1':
        ret = "待材料评审";
        break;
      case '2':
        ret = "评审不通过";
        break;
      case '3':
        ret = "已评审待确认";
        break;
      case '4':
        ret = "已确认待上报";
        break;
      case '5':
        ret = "已上报待审核";
        break;
      case '6':
        ret = "申报中";
        break;
      case '7':
        ret = "审核不通过";
        break;
      case '8':
        ret = "申报结束";
        break;
    }
    return ret;
  },
  // 法律状态
  lawStatus: function(data){
    var ret = ''
    switch (data+''){
      case '1':
        ret = "在营";
        break;
      case '2':
        ret = "吊销";
        break;
      case '3':
        ret = "注销";
        break;
      case '4':
        ret = "迁出";
        break;
      case '5':
        ret = "撤销";
        break;
      case '6':
        ret = "临时";
        break;
      case '8':
        ret = "停业";
        break;
      case '9':
        ret = "其他";
        break;
      case '9_01':
        ret = "撤销";
        break;
      case '9_02':
        ret = "待迁入";
        break;
      case '9_03':
        ret = "经营期限届满";
        break;
      case '9_04':
        ret = "清算中";
        break;
      case '9_05':
        ret = "停业";
        break;
      case '9_06':
        ret = "拟注销";
        break;
      case '9_07':
        ret = "非正常户";
        break;
    }
    return ret;
  },
  storeName:function(info){
    let ret = '';
    if(info){
      if(info.length > 15){
        ret = info.substring(0,15)+'...';
      }else{
        ret = info;
      }
    }else{
      ret = '--'
    }
    return ret;
  }
};
